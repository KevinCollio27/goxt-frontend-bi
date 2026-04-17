"use client";

import { useState } from "react";
import { Mail, ShieldOff, ShieldCheck, Trash2, UserIcon, BriefcaseIcon } from "lucide-react";
import {
  Sheet, SheetContent, SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { type SuperAdmin } from "@/services/super-admin.service";
import { SourceBadge, StatusBadge, TypeBadge } from "./Badges";

const PLACEHOLDER_AVATAR = "https://github.com/shadcn.png";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "Nunca";
  const date    = new Date(dateStr);
  const now     = new Date();
  const diffMs  = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH   = Math.floor(diffMs / 3_600_000);
  const diffD   = Math.floor(diffMs / 86_400_000);
  if (diffMin < 1)  return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffH < 24)   return `Hace ${diffH}h`;
  if (diffD === 1)  return "Ayer";
  if (diffD < 30)   return `Hace ${diffD} días`;
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-muted/50 px-6 py-3 border-y border-dashed">
      <h2 className="flex items-center gap-2.5 font-medium text-sm">
        <Icon className="size-4 text-muted-foreground" />
        {label}
      </h2>
    </div>
  );
}

function InfoField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b border-dashed last:border-b-0">
      <h3 className="mb-1 text-xs text-muted-foreground">{label}</h3>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SuperAdminSheetProps {
  admin: SuperAdmin | null;
  currentUserEmail: string;
  onClose: () => void;
  onToggleStatus: (admin: SuperAdmin) => void;
  onDelete: (admin: SuperAdmin) => void;
  onResendInvite: (admin: SuperAdmin) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SuperAdminSheet({
  admin,
  currentUserEmail,
  onClose,
  onToggleStatus,
  onDelete,
  onResendInvite,
}: SuperAdminSheetProps) {
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmResend, setConfirmResend] = useState(false);

  if (!admin) return null;

  const isSelf    = admin.email === currentUserEmail;
  const isBlocked = admin.status === "blocked";
  const canResend = admin.status === "pending" || !admin.last_access;
  const initials  = getInitials(admin.name);

  return (
    <Sheet open={!!admin} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-140 sm:max-w-140 p-0 gap-0 flex flex-col">

        {/* ── Header estilo Mi Perfil ── */}
        <div className="flex items-center gap-6 p-8 border-b shrink-0">
          <Avatar className="size-20 border shrink-0">
            <AvatarImage alt={admin.name} src={PLACEHOLDER_AVATAR} />
            <AvatarFallback className="font-medium text-xl bg-teal/20 text-teal">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-medium text-lg tracking-tight truncate">{admin.name}</span>
            <span className="text-muted-foreground text-sm truncate">{admin.email}</span>
            <span className={cn(
              "mt-0.5 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold",
              admin.source === "external" ? "bg-gray-100 text-gray-600" : "bg-teal/15 text-teal"
            )}>
              Super Admin
            </span>
          </div>
        </div>

        {/* ── Contenido scrollable ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Sección: Información Personal */}
          <SectionHeader icon={UserIcon} label="Información Personal" />
          <div className="grid grid-cols-1 md:grid-cols-2 *:border-b *:border-dashed *:px-6 *:py-4 *:md:odd:border-r last:*:border-b-0">
            <InfoField label="Nombre completo">{admin.name}</InfoField>
            <InfoField label="Email">{admin.email}</InfoField>
          </div>

          {/* Sección: Accesos */}
          <SectionHeader icon={BriefcaseIcon} label="Accesos" />
          <div className="grid grid-cols-1 md:grid-cols-2 *:border-b *:border-dashed *:px-6 *:py-4 *:md:odd:border-r last:*:border-b-0">
            {admin.source !== "external" && (
              <InfoField label="Producto"><SourceBadge source={admin.source} /></InfoField>
            )}
            <InfoField label="Tipo"><TypeBadge source={admin.source} /></InfoField>
            <InfoField label="Estado"><StatusBadge status={admin.status} /></InfoField>
            <InfoField label="Último acceso">{formatRelative(admin.last_access)}</InfoField>
            <InfoField label="Miembro desde">{formatDate(admin.created_at)}</InfoField>
          </div>

        </div>

        {/* ── Footer con acciones ── */}
        {!isSelf && (
          <SheetFooter className="px-6 py-4 border-t flex-col gap-2 shrink-0">
            {canResend && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setConfirmResend(true)}
              >
                <Mail /> Reenviar invitación
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => isBlocked ? (onToggleStatus(admin), onClose()) : setConfirmBlock(true)}
            >
              {isBlocked ? <ShieldCheck /> : <ShieldOff />}
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-red-50 text-red-500 border-red-100 hover:bg-red-100 hover:text-red-600"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 /> Eliminar
            </Button>
          </SheetFooter>
        )}

      </SheetContent>

      <ConfirmDialog
        open={confirmBlock}
        onOpenChange={setConfirmBlock}
        icon={ShieldOff}
        title={`¿Bloquear a ${admin.name}?`}
        description="El usuario perderá acceso al panel."
        confirmLabel="Bloquear"
        onConfirm={() => { onToggleStatus(admin); onClose(); }}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        icon={Trash2}
        title={`¿Eliminar a ${admin.name}?`}
        description="Esta acción no se puede deshacer."
        confirmLabel= "Eliminar"
        variant="destructive"              // ← única diferencia real
        onConfirm={() => { onDelete(admin); onClose(); }}
      />
      <ConfirmDialog
        open={confirmResend}
        onOpenChange={setConfirmResend}
        icon={Mail}
        title={`¿Reenviar invitación a ${admin.name}?`}
        description="Se le enviará un correo de invitación al usuario."
        confirmLabel="Reenviar"
        onConfirm={() => { onResendInvite(admin); onClose(); }}
      />


    </Sheet>
  );
}

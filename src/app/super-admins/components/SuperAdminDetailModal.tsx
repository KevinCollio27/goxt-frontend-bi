"use client";

import { Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { type SuperAdmin } from "@/services/super-admin.service";
import { SourceBadge, StatusBadge, TypeBadge } from "./Badges";

interface SuperAdminDetailModalProps {
  admin: SuperAdmin | null;
  open: boolean;
  onClose: () => void;
  onToggleStatus: (admin: SuperAdmin) => void;
  onDelete: (admin: SuperAdmin) => void;
  onResendInvite: (admin: SuperAdmin) => void;
  currentUserEmail: string;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <div className="text-right">{children}</div>
  </div>
);

export function SuperAdminDetailModal({
  admin,
  open,
  onClose,
  onToggleStatus,
  onDelete,
  onResendInvite,
  currentUserEmail,
}: SuperAdminDetailModalProps) {
  if (!admin) return null;

  const isSelf     = admin.email === currentUserEmail;
  const isBlocked  = admin.status === "blocked";
  const canResend  = admin.status === "pending" || !admin.last_access;

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <div className="flex items-center gap-3">
        {!isSelf && (
          <Button variant="destructive" onClick={() => { onDelete(admin); onClose(); }}>
            Eliminar
          </Button>
        )}
        {!isSelf && canResend && (
          <Button variant="ghost" onClick={() => { onResendInvite(admin); onClose(); }}>
            Reenviar invitación
          </Button>
        )}
        {!isSelf && (
          <Button
            variant={isBlocked ? "outline" : "midnight"}
            onClick={() => { onToggleStatus(admin); onClose(); }}
          >
            {isBlocked ? "Desbloquear" : "Bloquear"}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={admin.name}
      subtitle={admin.email}
      icon={Users}
      size="md"
      footer={footer}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-ink/10 flex items-center justify-center text-xl font-semibold text-ink">
          {getInitials(admin.name)}
        </div>
      </div>

      {/* Información general */}
      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
        Información general
      </p>
      <div>
        {admin.source !== "external" && (
          <InfoRow label="Producto">
            <SourceBadge source={admin.source} />
          </InfoRow>
        )}
        <InfoRow label="Tipo">
          <TypeBadge source={admin.source} />
        </InfoRow>
        <InfoRow label="Estado">
          <StatusBadge status={admin.status} />
        </InfoRow>
        <InfoRow label="Último acceso">
          <span className="text-sm text-gray-600">{formatRelative(admin.last_access)}</span>
        </InfoRow>
        <InfoRow label="Miembro desde">
          <span className="text-sm text-gray-600">{formatDate(admin.created_at)}</span>
        </InfoRow>
      </div>
    </Modal>
  );
}

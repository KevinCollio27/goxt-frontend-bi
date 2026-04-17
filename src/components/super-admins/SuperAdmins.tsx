"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldOff, ShieldCheck, Trash2, Mail, BadgeCheck, BadgeMinus, BadgeX, Users, UserPlus, ChevronDown, Ellipsis, Eye } from "lucide-react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PageContainer, PageCard } from "@/components/layout/PageContainer";
import { DataTableShadcn } from "@/components/ui/DataTableShadcn";
import { type ColumnDef } from "@tanstack/react-table";
import { superAdminService, type SuperAdmin } from "@/services/super-admin.service";
import { AddInternalAdminModal } from "./AddInternalAdminModal";
import { AddExternalAdminModal } from "./AddExternalAdminModal";
import { SuperAdminSheet } from "./SuperAdminSheet";
import { SourceBadge, StatusBadge, TypeBadge } from "./Badges";
import { useAuthStore } from "@/store/auth.store";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PLACEHOLDER_AVATAR = "https://github.com/shadcn.png";

// --- Helpers ---

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "nunca";
  const date    = new Date(dateStr);
  const now     = new Date();
  const diffMs  = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH   = Math.floor(diffMs / 3_600_000);
  const diffD   = Math.floor(diffMs / 86_400_000);
  if (diffMin < 1)  return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffH < 24)   return `hace ${diffH}h`;
  if (diffD === 1)  return "ayer";
  if (diffD < 30)   return `hace ${diffD} días`;
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });
}

// --- Page ---

export default function SuperAdmins() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [admins, setAdmins]         = useState<SuperAdmin[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [addModalOpen, setAddModalOpen] = useState<"system" | "external" | null>(null);
  const [sheetAdmin, setSheetAdmin] = useState<SuperAdmin | null>(null);

  useEffect(() => {
    if (user && !user.isSuperAdmin) router.replace("/dashboard");
  }, [user, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminService.getAll(1, 100);
      setAdmins(res.data);
      setTotal(res.total);
    } catch {
      // 401 lo maneja el interceptor de axios
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleStatus = async (admin: SuperAdmin) => {
    const next = admin.status === "active" ? "blocked" : "active";
    try {
      await superAdminService.updateStatus(admin.id, next);
      load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? "Error al actualizar estado.");
    }
  };

  const handleResendInvite = async (admin: SuperAdmin) => {
    try {
      await superAdminService.resendInvite(admin.id);
      alert(`Invitación reenviada a ${admin.email}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? "Error al reenviar la invitación.");
    }
  };

  const handleDelete = async (admin: SuperAdmin) => {
    if (!confirm(`¿Eliminar a ${admin.name} como super admin?`)) return;
    try {
      await superAdminService.remove(admin.id);
      load();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message ?? "Error al eliminar.");
    }
  };

  const tanstackColumns: ColumnDef<SuperAdmin, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
          className="accent-teal cursor-pointer"
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="accent-teal cursor-pointer"
          aria-label="Seleccionar fila"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "user",
      accessorFn: (row) => row.name,
      header: "Usuario",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-52">
          <div className="relative shrink-0">
            <Avatar className="size-8">
              <AvatarImage src={PLACEHOLDER_AVATAR} alt={row.original.name} />
              <AvatarFallback className="bg-ink/10 text-ink text-xs font-semibold">
                {getInitials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            {row.original.status === "active"  && <BadgeCheck  className="absolute -right-1 -bottom-1 size-4 rounded-full fill-teal text-white" />}
            {row.original.status === "blocked" && <BadgeX      className="absolute -right-1 -bottom-1 size-4 rounded-full fill-red-500 text-white" />}
            {row.original.status === "pending" && <BadgeMinus  className="absolute -right-1 -bottom-1 size-4 rounded-full fill-amber-400 text-white" />}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">{row.original.name}</p>
            <p className="text-xs text-gray-400 truncate">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "source",
      accessorKey: "source",
      header: "Producto",
      cell: ({ row }) =>
        row.original.source === "external"
          ? <span className="text-gray-300">—</span>
          : <SourceBadge source={row.original.source} />,
    },
    {
      id: "type",
      header: "Tipo",
      cell: ({ row }) => <TypeBadge source={row.original.source} />,
      enableSorting: false,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "last_access",
      accessorKey: "last_access",
      header: "Último acceso",
      cell: ({ row }) => (
        <span className="text-gray-400 text-xs">{formatRelative(row.original.last_access)}</span>
      ),
    },
    {
      id: "role",
      header: "Rol",
      cell: () => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
          Super admin
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-lg text-gray-700 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              <Ellipsis size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem onClick={() => setSheetAdmin(row.original)}>
                <Eye /> Ver perfil
              </DropdownMenuItem>
              {row.original.email !== user?.email && (
                <>
                  <DropdownMenuSeparator />
                  {(row.original.status === "pending" || !row.original.last_access) && (
                    <DropdownMenuItem onClick={() => handleResendInvite(row.original)}>
                      <Mail /> Reenviar invitación
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleToggleStatus(row.original)}>
                    {row.original.status === "active" ? <ShieldOff /> : <ShieldCheck />}
                    {row.original.status === "active" ? "Bloquear" : "Desbloquear"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                    <Trash2 /> Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <PageContainer>
        <PageCard>
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-ink">Listado de Usuarios</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Cargando..."
                  : `${total} super admin${total !== 1 ? "s" : ""} en la plataforma`}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink/90 active:scale-95 transition-all cursor-pointer shrink-0">
                <Plus size={15} />
                Agregar Admin
                <ChevronDown size={13} className="opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={6}>
                <DropdownMenuItem onClick={() => setAddModalOpen("system")}>
                  <Users />
                  Interno
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setAddModalOpen("external")}>
                  <UserPlus />
                  Externo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DataTableShadcn
            columns={tanstackColumns}
            data={admins}
            filterPlaceholder="Buscar usuario..."
            loading={loading}
          />
        </PageCard>
      </PageContainer>

      <AddInternalAdminModal
        open={addModalOpen === "system"}
        onClose={() => setAddModalOpen(null)}
        onSuccess={load}
      />

      <AddExternalAdminModal
        open={addModalOpen === "external"}
        onClose={() => setAddModalOpen(null)}
        onSuccess={load}
      />

      <SuperAdminSheet
        admin={sheetAdmin}
        currentUserEmail={user?.email ?? ""}
        onClose={() => setSheetAdmin(null)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onResendInvite={handleResendInvite}
      />
    </>
  );
}

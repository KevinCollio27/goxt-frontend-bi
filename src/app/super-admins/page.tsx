"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldOff, ShieldCheck, Trash2, Mail, BadgeCheck, BadgeMinus, BadgeX } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { PageContainer, PageCard } from "@/components/layout/PageContainer";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { DataTableShadcn } from "@/components/ui/DataTableShadcn";
import { type ColumnDef } from "@tanstack/react-table";
import { superAdminService, type SuperAdmin } from "@/services/super-admin.service";
import { AddSuperAdminModal } from "./components/AddSuperAdminModal";
import { SuperAdminDetailModal } from "./components/SuperAdminDetailModal";
import { SourceBadge, StatusBadge, TypeBadge } from "./components/Badges";
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

export default function SuperAdminsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [admins, setAdmins]         = useState<SuperAdmin[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperAdmin | null>(null);
  const [tableMode, setTableMode] = useState<"actual" | "shadcn">("actual");
  const filterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (user && !user.isSuperAdmin) router.replace("/dashboard");
  }, [user, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await superAdminService.getAll(1, 100, activeFilter);
      setAdmins(res.data);
      setTotal(res.total);
    } catch {
      // 401 lo maneja el interceptor de axios
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (filterTimeout.current) clearTimeout(filterTimeout.current);
    filterTimeout.current = setTimeout(() => setActiveFilter(value), 400);
  };

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

  const columns: Column<SuperAdmin>[] = [
    {
      key: "user",
      header: "Usuario",
      className: "min-w-[220px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center text-xs font-semibold text-ink shrink-0">
            {getInitials(row.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">{row.name}</p>
            <p className="text-xs text-gray-400 truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "source",
      header: "Producto",
      render: (row) =>
        row.source === "external"
          ? <span className="text-gray-300">—</span>
          : <SourceBadge source={row.source} />,
    },
    {
      key: "type",
      header: "Tipo",
      render: (row) => <TypeBadge source={row.source} />,
    },
    {
      key: "status",
      header: "Estado",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "last_access",
      header: "Último acceso",
      render: (row) => (
        <span className="text-gray-400 text-xs">{formatRelative(row.last_access)}</span>
      ),
    },
    {
      key: "role",
      header: "Rol",
      render: () => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
          Super admin
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-20",
      className: "w-20",
      render: (row) => {
        if (row.email === user?.email) return null;
        return (
          // stopPropagation para que no abra el modal de detalle al hacer clic en acciones
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {(row.status === "pending" || !row.last_access) && (
              <button
                onClick={() => handleResendInvite(row)}
                title="Reenviar invitación"
                className="p-1.5 rounded-lg text-gray-400 hover:text-teal hover:bg-teal/10 transition-colors cursor-pointer"
              >
                <Mail size={14} />
              </button>
            )}
            <button
              onClick={() => handleToggleStatus(row)}
              title={row.status === "active" ? "Bloquear" : "Desbloquear"}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {row.status === "active" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
            </button>
            <button
              onClick={() => handleDelete(row)}
              title="Eliminar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  // --- Columnas TanStack (para modo ShadCN) ---

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
      header: "Acciones",
      cell: ({ row }) => {
        if (row.original.email === user?.email) return null;
        return (
          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {(row.original.status === "pending" || !row.original.last_access) && (
              <button
                onClick={() => handleResendInvite(row.original)}
                title="Reenviar invitación"
                className="p-1.5 rounded-lg text-gray-400 hover:text-teal hover:bg-teal/10 transition-colors cursor-pointer"
              >
                <Mail size={14} />
              </button>
            )}
            <button
              onClick={() => handleToggleStatus(row.original)}
              title={row.original.status === "active" ? "Bloquear" : "Desbloquear"}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {row.original.status === "active" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              title="Eliminar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <AuthLayout>
      <PageContainer>
        <PageCard>
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-base font-semibold text-ink">Usuarios</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {loading
                    ? "Cargando..."
                    : `${total} super admin${total !== 1 ? "s" : ""} en la plataforma`}
                </p>
              </div>
              {/* Toggle Actual / ShadCN */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 text-xs font-medium">
                <button
                  onClick={() => setTableMode("actual")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${tableMode === "actual" ? "bg-white shadow-sm text-ink" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Actual
                </button>
                <button
                  onClick={() => setTableMode("shadcn")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${tableMode === "shadcn" ? "bg-white shadow-sm text-teal" : "text-gray-400 hover:text-gray-600"}`}
                >
                  ShadCN
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                placeholder="Buscar usuario..."
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal placeholder:text-gray-400 w-52"
              />
              <button
                onClick={() => setAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-white text-sm font-medium rounded-lg hover:bg-ink/90 transition-colors cursor-pointer shrink-0"
              >
                <Plus size={15} />
                Agregar Admin
              </button>
            </div>
          </div>

          {tableMode === "actual" ? (
            <DataTable
              columns={columns}
              data={admins}
              loading={loading}
              keyExtractor={(row) => row.id}
              emptyMessage="No hay super admins registrados."
              onRowClick={setSelectedAdmin}
            />
          ) : (
            <DataTableShadcn
              columns={tanstackColumns}
              data={admins}
              filterPlaceholder="Buscar usuario..."
            />
          )}
        </PageCard>
      </PageContainer>

      <AddSuperAdminModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={load}
      />

      <SuperAdminDetailModal
        admin={selectedAdmin}
        open={!!selectedAdmin}
        onClose={() => setSelectedAdmin(null)}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onResendInvite={handleResendInvite}
        currentUserEmail={user?.email ?? ""}
      />
    </AuthLayout>
  );
}

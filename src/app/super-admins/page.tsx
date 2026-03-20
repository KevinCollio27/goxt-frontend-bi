"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { superAdminService, type SuperAdmin } from "@/services/super-admin.service";
import { AddSuperAdminModal } from "./components/AddSuperAdminModal";
import { SuperAdminDetailModal } from "./components/SuperAdminDetailModal";
import { SourceBadge, StatusBadge, TypeBadge } from "./components/Badges";
import { useAuthStore } from "@/store/auth.store";

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
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Error al actualizar estado.");
    }
  };

  const handleDelete = async (admin: SuperAdmin) => {
    if (!confirm(`¿Eliminar a ${admin.name} como super admin?`)) return;
    try {
      await superAdminService.remove(admin.id);
      load();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Error al eliminar.");
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

  return (
    <AuthLayout>
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-base font-semibold text-ink">Usuarios</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Cargando..."
                  : `${total} super admin${total !== 1 ? "s" : ""} en la plataforma`}
              </p>
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

          <DataTable
            columns={columns}
            data={admins}
            loading={loading}
            keyExtractor={(row) => row.id}
            emptyMessage="No hay super admins registrados."
            onRowClick={setSelectedAdmin}
          />
        </div>
      </div>

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
        currentUserEmail={user?.email ?? ""}
      />
    </AuthLayout>
  );
}

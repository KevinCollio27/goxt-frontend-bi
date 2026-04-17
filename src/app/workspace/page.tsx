"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, LogOut, Search } from "lucide-react";
import { useAuthStore, type Workspace } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkspaceEntry = {
  workspace: Workspace;
  source: "crm" | "cargo";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SOURCE_CONFIG = {
  crm:   { label: "GOxT CRM",   dot: "bg-teal",      text: "text-teal",      bg: "bg-teal/10 border-teal/20",         ring: "hover:border-teal/40 hover:ring-teal/10" },
  cargo: { label: "GOxT Cargo", dot: "bg-blue-500",   text: "text-blue-600",  bg: "bg-blue-50 border-blue-100",        ring: "hover:border-blue-200 hover:ring-blue-50" },
};

function WorkspaceRow({ workspace, source, onSelect }: WorkspaceEntry & { onSelect: (ws: Workspace, source: "crm" | "cargo") => void }) {
  const initials = workspace.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const badge = SOURCE_CONFIG[source];

  return (
    <button
      onClick={() => onSelect(workspace, source)}
      className={cn(
        "flex items-center gap-4 w-full bg-gray-50 hover:bg-white border border-gray-100 rounded-xl p-4 transition-all text-left cursor-pointer hover:shadow-sm hover:ring-2",
        badge.ring
      )}
    >
      <div className="shrink-0">
        {workspace.logo ? (
          <div className="size-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={workspace.logo} alt={workspace.name} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="size-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 font-bold text-sm">
            {initials}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{workspace.name}</p>
        <span className={cn("inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium border", badge.bg, badge.text)}>
          <span className={cn("size-1.5 rounded-full", badge.dot)} />
          {badge.label}
        </span>
      </div>

      <ChevronRight size={15} className={cn("shrink-0 transition-colors text-gray-300", source === "crm" ? "group-hover:text-teal" : "group-hover:text-blue-400")} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user, setWorkspace, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (_hasHydrated && !user) router.replace("/login");
  }, [user, _hasHydrated, router]);

  if (!_hasHydrated || !user) return null;

  const firstName = user.name.split(" ")[0];
  const initials  = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Lista unificada CRM + Cargo
  const allWorkspaces: WorkspaceEntry[] = [
    ...(user.crmWorkspaces ?? []).map((ws) => ({ workspace: ws, source: "crm" as const })),
    ...(user.cargoWorkspaces ?? []).map((ws) => ({ workspace: ws, source: "cargo" as const })),
  ];

  const filtered = query.trim().length > 0
    ? allWorkspaces.filter(({ workspace }) =>
        workspace.name.toLowerCase().includes(query.toLowerCase())
      )
    : allWorkspaces;

  const handleSelect = (workspace: Workspace, source: "crm" | "cargo") => {
    setWorkspace(workspace, source);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f0f2f5] flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 shrink-0 flex items-center justify-between">
        <Image src="/images/goxt-negro.png" alt="GOxT" width={80} height={28} className="object-contain" />
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-600 truncate max-w-45">{user.name}</span>
          <Avatar className="size-8">
            <AvatarFallback className="bg-ink text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut /> Cerrar sesión
          </Button>
        </div>
      </header>

      {/* Contenedor adaptable — sin scroll en la página */}
      <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-full overflow-hidden">

          {/* Logo + saludo */}
          <div className="shrink-0 text-center px-6 pt-7 pb-5">
            <div className="flex justify-center mb-4">
              <Image src="/images/Logo BI.png" alt="GOxT BI" width={180} height={58} className="object-contain" priority />
            </div>
            <h1 className="text-xl font-bold text-ink">Hola, {firstName} 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Selecciona el workspace que quieres analizar</p>
          </div>

          <div className="shrink-0 mx-5 border-t border-gray-100" />

          {/* Subheader + búsqueda */}
          <div className="shrink-0 px-5 pt-4 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Tus espacios de trabajo</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {allWorkspaces.length} {allWorkspaces.length === 1 ? "workspace" : "workspaces"} disponibles
                </p>
              </div>
            </div>
            {allWorkspaces.length > 4 && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar workspace..."
                  className="pl-8"
                />
              </div>
            )}
          </div>

          {/* Lista — único elemento que scrollea */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-2">
            {filtered.length > 0 ? (
              filtered.map(({ workspace, source }) => (
                <WorkspaceRow
                  key={`${source}-${workspace.id}`}
                  workspace={workspace}
                  source={source}
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <p className="text-center py-8 text-sm text-gray-400">
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-gray-50 px-5 py-3 text-center">
            <p className="text-[11px] text-gray-300">
              <span className="font-medium text-gray-400">GOXT</span> · Business Intelligence
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

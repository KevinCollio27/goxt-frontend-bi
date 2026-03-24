"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ChevronRight, FlaskConical, LayoutDashboard, LayoutGrid, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const platformItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const adminItems = [
  { label: "Usuarios", href: "/super-admins", icon: Users },
  { label: "Mockups", href: "/mockups", icon: FlaskConical },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, selectedWorkspace, setWorkspace, clearWorkspace } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isPlatformMode = isSuperAdmin && !selectedWorkspace;

  const allWorkspaces = [
    ...(user?.crmWorkspaces.map((ws) => ({ workspace: ws, source: "crm" as const })) ?? []),
    ...(user?.cargoWorkspaces.map((ws) => ({ workspace: ws, source: "cargo" as const })) ?? []),
  ];

  const handleSelectWorkspace = (ws: { workspace: typeof allWorkspaces[0]["workspace"]; source: "crm" | "cargo" }) => {
    setWorkspace(ws.workspace, ws.source);
    setDropdownOpen(false);
    router.push("/dashboard");
  };

  const handlePlatformMode = () => {
    clearWorkspace();
    setDropdownOpen(false);
    router.push("/dashboard");
  };

  const NavItem = ({ label, href, icon: Icon }: { label: string; href: string; icon: typeof LayoutDashboard }) => {
    const active = pathname === href;
    return (
      <li>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
            active ? "bg-teal/20 text-white" : "text-ash hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon size={16} className={active ? "text-teal" : "text-ash/70"} />
          {label}
          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal" />}
        </Link>
      </li>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col bg-ink z-40">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center h-18 shrink-0">
        <Image
          src="/images/Logo BI.png"
          alt="GOxT Business Intelligence"
          width={150}
          height={44}
          className="object-contain brightness-0 invert"
          priority
        />
      </div>

      {/* Selector de modo — super admins */}
      {isSuperAdmin && (
        <div className="px-3 py-3 border-b border-white/10 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors group cursor-pointer"
          >
            {isPlatformMode ? (
              <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                <LayoutGrid size={16} className="text-teal" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0">
                {selectedWorkspace?.workspace.logo ? (
                  <Image
                    src={selectedWorkspace.workspace.logo}
                    alt={selectedWorkspace.workspace.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-ink">
                    {selectedWorkspace?.workspace.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] text-ash/50 leading-none mb-0.5">Vista actual</p>
              <p className="text-xs font-semibold text-white truncate">
                {isPlatformMode ? "Modo Plataforma" : selectedWorkspace?.workspace.name}
              </p>
            </div>
            <ChevronRight size={14} className="text-ash/40 group-hover:text-white/60 transition-colors shrink-0" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-[#1e2530] rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
              {/* Modo Plataforma */}
              <button
                onClick={handlePlatformMode}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left",
                  isPlatformMode && "bg-teal/10"
                )}
              >
                <div className="w-7 h-7 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                  <LayoutGrid size={13} className="text-teal" />
                </div>
                <p className="flex-1 text-xs font-semibold text-white">Modo Plataforma</p>
                {isPlatformMode && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
              </button>

              {/* Workspaces */}
              {allWorkspaces.length > 0 && (
                <>
                  <div className="mx-3 border-t border-white/5" />
                  <div className="px-3 py-1.5">
                    <p className="text-[9px] font-semibold text-ash/40 uppercase tracking-widest">Workspaces</p>
                  </div>
                  {allWorkspaces.map(({ workspace, source }) => {
                    const isActive = selectedWorkspace?.workspace.id === workspace.id && selectedWorkspace?.source === source;
                    return (
                      <button
                        key={`${source}-${workspace.id}`}
                        onClick={() => handleSelectWorkspace({ workspace, source })}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left",
                          isActive && "bg-white/5"
                        )}
                      >
                        <div className="w-7 h-7 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0">
                          {workspace.logo ? (
                            <Image src={workspace.logo} alt={workspace.name} width={28} height={28} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-ink">{workspace.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{workspace.name}</p>
                          <p className="text-[10px] text-ash/40">{source === "crm" ? "CRM" : "Cargo"}</p>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Workspace actual — usuarios normales */}
      {!isSuperAdmin && selectedWorkspace && (
        <div className="px-3 py-3 border-b border-white/10">
          <button
            onClick={() => router.push("/workspace")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center shrink-0">
              {selectedWorkspace.workspace.logo ? (
                <Image
                  src={selectedWorkspace.workspace.logo}
                  alt={selectedWorkspace.workspace.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-ink">
                  {selectedWorkspace.workspace.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] text-ash/50 leading-none mb-0.5">Workspace actual</p>
              <p className="text-xs font-semibold text-white truncate">{selectedWorkspace.workspace.name}</p>
            </div>
            <ChevronRight size={14} className="text-ash/40 group-hover:text-white/60 transition-colors shrink-0" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-[0.15em] text-ash/60 uppercase">
            Plataforma
          </p>
          <ul className="space-y-0.5">
            {platformItems.map((item) => <NavItem key={item.href} {...item} />)}
          </ul>
        </div>

        {/* Administración — solo super admins en modo plataforma */}
        {isPlatformMode && (
          <div>
            <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-[0.15em] text-ash/60 uppercase">
              Administración
            </p>
            <ul className="space-y-0.5">
              {adminItems.map((item) => <NavItem key={item.href} {...item} />)}
            </ul>
          </div>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-teal/30 flex items-center justify-center text-xs font-semibold text-teal shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-ash/60 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-ash/40 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ChevronRight, LayoutDashboard, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const platformItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const adminItems = [
  { label: "Usuarios", href: "/super-admins", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, selectedWorkspace } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

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
      <div className="px-5 py-5 border-b border-white/10">
        <Image
          src="/images/goxt-negro.png"
          alt="GOxT"
          width={80}
          height={28}
          className="object-contain brightness-0 invert"
        />
        <span className="mt-1 block text-[10px] font-semibold tracking-[0.2em] text-teal-muted uppercase">
          Business Intelligence
        </span>
      </div>

      {/* Workspace actual */}
      {selectedWorkspace && (
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
        {/* PLATAFORMA */}
        <div>
          <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-[0.15em] text-ash/60 uppercase">
            Plataforma
          </p>
          <ul className="space-y-0.5">
            {platformItems.map((item) => <NavItem key={item.href} {...item} />)}
          </ul>
        </div>

        {/* ADMINISTRACIÓN — solo super admins */}
        {user?.isSuperAdmin && (
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

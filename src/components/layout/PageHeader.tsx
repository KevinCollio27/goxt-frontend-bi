"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, type LucideIcon } from "lucide-react";

const pageConfig: Record<string, { title: string; subtitle: string; icon: LucideIcon }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Vista global de la plataforma",
    icon: LayoutDashboard,
  },
  "/super-admins": {
    title: "Usuarios",
    subtitle: "Gestión de super admins",
    icon: Users,
  },
};

const getPageConfig = (pathname: string) => {
  return pageConfig[pathname] ?? { title: "GOxT BI", subtitle: "Business Intelligence", icon: LayoutDashboard };
};

export default function PageHeader() {
  const pathname = usePathname();
  const { title, subtitle, icon: Icon } = getPageConfig(pathname);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-9 h-9 bg-ink rounded-xl shadow-lg border border-white/10 shrink-0">
        <Icon className="h-4 w-4 text-ash" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-ink leading-tight">{title}</h1>
        <p className="text-xs text-teal-muted">{subtitle}</p>
      </div>
    </div>
  );
}

import React from "react";
import { Users, UserPlus, Briefcase, Truck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const SOURCE_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  crm:       { label: "CRM",         className: "bg-blue-500/10 text-blue-600 border-blue-500/20",     icon: Briefcase },
  cargo:     { label: "Cargo",       className: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Truck },
  crm_cargo: { label: "CRM + Cargo", className: "bg-teal/10 text-teal border-teal/20",                 icon: Layers },
  external:  { label: "Externo",     className: "bg-gray-500/10 text-gray-500 border-gray-500/20",     icon: UserPlus },
};

export const STATUS_CONFIG: Record<string, { label: string; dotClass: string; className: string }> = {
  active:  { label: "Activo",    dotClass: "bg-emerald-500", className: "bg-emerald-500/10 text-emerald-600" },
  blocked: { label: "Bloqueado", dotClass: "bg-red-400",     className: "bg-red-500/10 text-red-500" },
  pending: { label: "Pendiente", dotClass: "bg-amber-400",   className: "bg-amber-500/10 text-amber-600" },
};

export function SourceBadge({ source }: { source: string }) {
  const cfg = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.external;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", cfg.className)}>
      <Icon className="size-3" /> {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", cfg.className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dotClass)} />
      {cfg.label}
    </span>
  );
}

export function TypeBadge({ source }: { source: string }) {
  return source === "external" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
      <UserPlus className="size-3" /> Externo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
      <Users className="size-3" /> Interno
    </span>
  );
}

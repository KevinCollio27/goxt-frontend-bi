import { cn } from "@/lib/utils";

export const SOURCE_CONFIG: Record<string, { label: string; className: string }> = {
  crm:       { label: "CRM",         className: "bg-blue-50 text-blue-600 border-blue-100" },
  cargo:     { label: "Cargo",       className: "bg-purple-50 text-purple-600 border-purple-100" },
  crm_cargo: { label: "CRM + Cargo", className: "bg-teal/10 text-teal border-teal/20" },
  external:  { label: "Externo",     className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export const STATUS_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  active:  { label: "Activo",    dotClass: "bg-emerald-400", textClass: "text-emerald-600" },
  blocked: { label: "Bloqueado", dotClass: "bg-red-400",     textClass: "text-red-500" },
  pending: { label: "Pendiente", dotClass: "bg-amber-400",   textClass: "text-amber-600" },
};

export function SourceBadge({ source }: { source: string }) {
  const cfg = SOURCE_CONFIG[source] ?? SOURCE_CONFIG.external;
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", cfg.className)}>
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dotClass)} />
      <span className={cfg.textClass}>{cfg.label}</span>
    </span>
  );
}

export function TypeBadge({ source }: { source: string }) {
  return source === "external" ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
      Externo
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
      Interno
    </span>
  );
}

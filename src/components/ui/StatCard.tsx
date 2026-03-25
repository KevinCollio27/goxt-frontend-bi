"use client";

import { cn } from "@/lib/utils";
import { semanticColors, type SemanticVariant } from "@/lib/colors";

// ─── Badge ────────────────────────────────────────────────────────────────────

export type { SemanticVariant as BadgeVariant };

interface StatBadge {
  label: string;
  variant?: SemanticVariant;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  /** Texto secundario debajo del valor (plain text) */
  subtitle?: string;
  /** Pill coloreado debajo del valor */
  badge?: StatBadge;
  /** Tooltip explicativo que aparece al hover en el ⓘ del título */
  tooltip?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, badge, tooltip, className }: StatCardProps) {
  const variant = badge?.variant ?? "neutral";
  const colors = semanticColors[variant];

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 px-5 py-4 flex flex-col gap-1", className)}>
      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
        {title}
        {tooltip && (
          <span
            title={tooltip}
            className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors cursor-default text-[8px] font-bold text-blue-500 leading-none shrink-0"
          >
            i
          </span>
        )}
      </p>
      <p className="text-3xl font-semibold text-gray-900 leading-none mt-1">{value}</p>

      {badge && (
        <span className={cn(
          "mt-1 self-start px-2 py-0.5 rounded-md text-xs font-medium",
          colors.bg, colors.text
        )}>
          {badge.label}
        </span>
      )}

      {subtitle && !badge && (
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

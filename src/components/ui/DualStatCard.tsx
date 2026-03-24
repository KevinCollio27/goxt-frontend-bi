import { cn } from "@/lib/utils";
import { semanticColors, type SemanticVariant } from "@/lib/colors";

export interface DualStatItem {
  label: string;
  value: number;
  badge?: { label: string; variant?: SemanticVariant };
}

export interface DualStatBarItem {
  label: string;
  value: number;
  color?: string;
}

interface DualStatCardProps {
  title: string;
  stats: [DualStatItem, DualStatItem];
  /** Barras comparativas debajo de los stats */
  bars?: DualStatBarItem[];
  footnote?: string;
  className?: string;
}

export function DualStatCard({ title, stats, bars, footnote, className }: DualStatCardProps) {
  const barMax = bars ? Math.max(...bars.map((b) => b.value), 1) : 1;

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-4", className)}>

      {/* Título */}
      <p className="text-sm font-medium text-gray-700">{title}</p>

      {/* Dos stats */}
      <div className="flex gap-8">
        {stats.map((stat) => {
          const colors = stat.badge ? semanticColors[stat.badge.variant ?? "neutral"] : null;
          return (
            <div key={stat.label} className="space-y-0.5">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-3xl font-semibold text-gray-900 leading-none">{stat.value}</p>
              {stat.badge && colors && (
                <span className={cn("inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium", colors.bg, colors.text)}>
                  {stat.badge.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Barras comparativas */}
      {bars && bars.length > 0 && (
        <div className="space-y-2 pt-1">
          {bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-16 shrink-0">{bar.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(bar.value / barMax) * 100}%`,
                    background: bar.color ?? "#468189",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 w-8 text-right shrink-0">{bar.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footnote */}
      {footnote && (
        <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">{footnote}</p>
      )}
    </div>
  );
}

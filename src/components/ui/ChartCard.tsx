import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Padding interno del área del gráfico (default: pt-4) */
  chartPadding?: string;
  /** Si true, el card usa flex-col y el área del gráfico crece para llenar el espacio disponible */
  fillHeight?: boolean;
}

export function ChartCard({
  title,
  subtitle,
  children,
  footer,
  className,
  chartPadding = "pt-4",
  fillHeight = false,
}: ChartCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 px-5 py-4",
      fillHeight && "flex flex-col",
      className
    )}>
      {/* Header */}
      <div className={cn("mb-1", fillHeight && "shrink-0")}>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Chart area */}
      <div className={cn(chartPadding, fillHeight && "flex-1 min-h-0")}>{children}</div>

      {/* Footer */}
      {footer && (
        <div className={cn("mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400", fillHeight && "shrink-0")}>
          {footer}
        </div>
      )}
    </div>
  );
}

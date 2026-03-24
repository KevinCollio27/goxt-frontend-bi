import { cn } from "@/lib/utils";

export interface PipelineBarItem {
  label: string;
  value: number;
  /** hex color para la barra */
  color: string;
  /** color del texto del badge (default blanco) */
  textColor?: string;
}

export interface PipelineBarFooterItem {
  label: string;
  value: string | number;
}

interface PipelineBarProps {
  items: PipelineBarItem[];
  footer?: PipelineBarFooterItem[];
  className?: string;
}

export function PipelineBar({ items, footer, className }: PipelineBarProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Barras */}
      {items.map((item) => {
        const pct = Math.max((item.value / max) * 100, 4); // mínimo 4% para que el badge se vea

        return (
          <div key={item.label} className="flex items-center gap-3">
            {/* Label */}
            <span className="text-sm text-gray-600 w-20 shrink-0">{item.label}</span>

            {/* Barra con badge adentro */}
            <div className="flex-1 bg-gray-100 rounded-md h-7 overflow-hidden">
              <div
                className="h-full rounded-md flex items-center px-2.5 transition-all duration-500"
                style={{ width: `${pct}%`, background: item.color }}
              >
                <span
                  className="text-xs font-semibold leading-none whitespace-nowrap"
                  style={{ color: item.textColor ?? "#fff" }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      {footer && footer.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-1">
          {footer.map((f) => (
            <div key={f.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{f.label}</span>
              <span className="font-medium text-gray-700">{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

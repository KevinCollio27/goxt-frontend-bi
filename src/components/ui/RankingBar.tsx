import { cn } from "@/lib/utils";

export interface RankingBarItem {
  label: string;
  value: number;
  color?: string;
}

interface RankingBarProps {
  items: RankingBarItem[];
  className?: string;
}

export function RankingBar({ items, className }: RankingBarProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={cn("space-y-1.5", className)}>
      {items.map((item) => {
        const color = item.color ?? "#9CA3AF";
        const pct = (item.value / max) * 100;

        return (
          <div key={item.label} className="flex items-center gap-2 text-[11px]">
            {/* Label — ancho fijo, alineado a la derecha */}
            <span
              className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap shrink-0"
              style={{ width: 100, textAlign: "right" }}
            >
              {item.label}
            </span>

            {/* Barra */}
            <div className="flex-1 bg-gray-100 rounded overflow-hidden" style={{ height: 7 }}>
              <div
                className="h-full rounded transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>

            {/* Valor */}
            <span className="w-7 text-right text-gray-500 shrink-0 font-medium">
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

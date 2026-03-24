"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/colors";

export interface HeatmapRow {
  label: string;
  /** Array de valores numéricos — uno por columna */
  values: number[];
}

interface HeatmapProps {
  rows: HeatmapRow[];
  /** Etiquetas de las columnas */
  columnLabels: string[];
  /** Color base en formato hex (default: brand.teal) */
  color?: string;
  className?: string;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function Heatmap({ rows, columnLabels, color = brand.teal, className }: HeatmapProps) {
  const { r, g, b } = hexToRgb(color);
  const allValues = rows.flatMap((row) => row.values);
  const max = Math.max(...allValues, 1);

  const cellBg = (value: number) => {
    if (value === 0) return "#F9FAFB";
    const alpha = (0.1 + (value / max) * 0.9).toFixed(2);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const cols = columnLabels.length;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div
        className="grid gap-0.5 text-[9px]"
        style={{ gridTemplateColumns: `36px repeat(${cols}, minmax(0, 1fr))` }}
      >
        {/* Header row */}
        <div />
        {columnLabels.map((lbl) => (
          <div key={lbl} className="text-center text-gray-400 pb-1">{lbl}</div>
        ))}

        {/* Data rows */}
        {rows.map((row) => (
          <Fragment key={row.label}>
            <div className="text-gray-400 flex items-center justify-end pr-1.5">
              {row.label}
            </div>
            {row.values.map((val, ci) => (
              <div
                key={ci}
                className="h-4.5 rounded-xs cursor-default"
                style={{ background: cellBg(val) }}
                title={`${row.label} · ${columnLabels[ci]}: ${val}`}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

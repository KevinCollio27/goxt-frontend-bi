"use client";
import type { LegendPayload } from "recharts";


import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { seriesColor } from "@/lib/colors";

export interface BarSeries {
  key: string;
  label: string;
  color?: string;
  /** Texto que aparece al hacer hover en la etiqueta de la leyenda */
  tooltip?: string;
}

interface BarChartProps {
  data: Record<string, unknown>[];
  series: BarSeries[];
  xKey: string;
  height?: number;
  /** "grouped" (default) | "stacked" */
  mode?: "grouped" | "stacked";
}

export function BarChart({ data, series, xKey, height = 260, mode = "grouped" }: BarChartProps) {
  const seriesMap = Object.fromEntries(series.map(s => [s.label, s]));

  const customLegend = ({ payload }: { payload?: readonly LegendPayload[] }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-2">
      {(payload ?? []).map((entry: LegendPayload) => {
        const s = seriesMap[entry.value ?? ""];
        return (
          <span
            key={entry.value}
            className="flex items-center gap-1 text-[11px] text-gray-500 cursor-default"
            title={s?.tooltip}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: entry.color }} />
            {entry.value}
            {s?.tooltip && (
              <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-100 text-[8px] font-bold text-blue-500 leading-none">
                i
              </span>
            )}
          </span>
        );
      })}
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} barGap={3} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#F3F4F6" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
          cursor={{ fill: "#F9FAFB" }}
        />
        {series.length > 1 && (
          <Legend content={customLegend} />
        )}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color ?? seriesColor(i)}
            radius={[3, 3, 0, 0]}
            stackId={mode === "stacked" ? "stack" : undefined}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
}

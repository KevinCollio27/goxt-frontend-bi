"use client";

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
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
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

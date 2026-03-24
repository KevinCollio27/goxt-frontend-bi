"use client";

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { seriesColor } from "@/lib/colors";

export interface AreaSeries {
  key: string;
  label: string;
  color?: string;
  /** "gradient" (default) | "solid" | "none" */
  fill?: "gradient" | "solid" | "none";
}

interface AreaChartProps {
  data: Record<string, unknown>[];
  series: AreaSeries[];
  xKey: string;
  height?: number;
}

export function AreaChart({ data, series, xKey, height = 260 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? seriesColor(i);
            return (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
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
          cursor={{ stroke: "#E5E7EB" }}
        />
        {series.length > 1 && (
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
        )}
        {series.map((s, i) => {
          const color = s.color ?? seriesColor(i);
          const fillMode = s.fill ?? "gradient";
          return (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stroke={color}
              strokeWidth={2}
              fill={fillMode === "none" ? "transparent" : fillMode === "solid" ? color : `url(#grad-${s.key})`}
              fillOpacity={fillMode === "solid" ? 0.2 : 1}
              dot={{ r: 3, fill: color }}
              type="monotone"
            />
          );
        })}
      </ReAreaChart>
    </ResponsiveContainer>
  );
}

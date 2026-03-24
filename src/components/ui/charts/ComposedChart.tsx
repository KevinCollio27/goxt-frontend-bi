"use client";

import {
  ComposedChart as ReComposedChart,
  Bar,
  Line,
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

export interface LineSeries {
  key: string;
  label: string;
  color?: string;
  /** Si true usa el eje Y derecho */
  rightAxis?: boolean;
}

interface ComposedChartProps {
  data: Record<string, unknown>[];
  bars: BarSeries[];
  lines: LineSeries[];
  xKey: string;
  height?: number;
}

export function ComposedChart({ data, bars, lines, xKey, height = 260 }: ComposedChartProps) {
  const hasRightAxis = lines.some((l) => l.rightAxis);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReComposedChart data={data} barGap={3} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#F3F4F6" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        {hasRightAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
        )}
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
          cursor={{ fill: "#F9FAFB" }}
        />
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        {bars.map((b, i) => (
          <Bar
            key={b.key}
            yAxisId="left"
            dataKey={b.key}
            name={b.label}
            fill={b.color ?? seriesColor(i)}
            radius={[3, 3, 0, 0]}
          />
        ))}
        {lines.map((l, i) => (
          <Line
            key={l.key}
            yAxisId={l.rightAxis ? "right" : "left"}
            dataKey={l.key}
            name={l.label}
            stroke={l.color ?? seriesColor(bars.length + i)}
            strokeWidth={2}
            dot={{ r: 3, fill: l.color ?? seriesColor(bars.length + i) }}
            type="monotone"
          />
        ))}
      </ReComposedChart>
    </ResponsiveContainer>
  );
}

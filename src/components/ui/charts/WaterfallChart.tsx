"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { brand } from "@/lib/colors";

export interface WaterfallItem {
  label: string;
  /** Incremento del período (nuevos usuarios, nuevas opps, etc.) */
  value: number;
}

interface WaterfallChartProps {
  data: WaterfallItem[];
  height?: number;
  color?: string;
  /** Etiqueta del eje Y */
  yLabel?: string;
  /** Si true, el último bar es el total acumulado (resaltado) */
  showTotal?: boolean;
}

export function WaterfallChart({
  data,
  height = 280,
  color = brand.teal,
  yLabel,
  showTotal = true,
}: WaterfallChartProps) {
  // Calcula la base acumulada para cada bar
  let cumulative = 0;
  const chartData = data.map((item, i) => {
    const isLast = showTotal && i === data.length - 1;
    const base  = isLast ? 0 : cumulative;
    const total = isLast ? cumulative + item.value : cumulative + item.value;
    cumulative  = isLast ? cumulative : cumulative + item.value;
    return {
      label:   item.label,
      base,
      value:   item.value,
      total,
      isLast,
    };
  });

  const maxVal = Math.max(...chartData.map((d) => d.base + d.value));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#F3F4F6" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, Math.ceil(maxVal * 1.1)]}
          tick={{ fontSize: 11, fill: "#9CA3AF" }}
          axisLine={false}
          tickLine={false}
          width={28}
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 10, fill: "#9CA3AF" } }
              : undefined
          }
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
          cursor={{ fill: "#F9FAFB" }}
          formatter={(value, name) =>
            name === "base" ? null : [value ?? "", "Nuevos"]
          }
        />

        {/* Base invisible */}
        <Bar dataKey="base" stackId="wf" fill="transparent" />

        {/* Incremento visible */}
        <Bar dataKey="value" stackId="wf" radius={[2, 2, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.isLast ? "#3B4B8C" : color}
              fillOpacity={entry.isLast ? 1 : 0.75}
            />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            style={{ fontSize: 10, fill: "#6B7280" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

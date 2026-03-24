"use client";

import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { seriesColor, semanticColors, type SemanticVariant } from "@/lib/colors";

export interface PieSegment {
  label: string;
  value: number;
  color?: string;
  variant?: SemanticVariant;
}

interface PieChartProps {
  segments: PieSegment[];
  height?: number;
  showLegend?: boolean;
}

export function PieChart({ segments, height = 200, showLegend = true }: PieChartProps) {
  const data   = segments.map((s) => ({ name: s.label, value: s.value }));
  const colors = segments.map((s, i) =>
    s.color ?? (s.variant ? semanticColors[s.variant].bar : seriesColor(i))
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy={showLegend ? "45%" : "50%"}
          outerRadius="70%"
          dataKey="value"
          strokeWidth={2}
          stroke="#fff"
        >
          {colors.map((color, i) => <Cell key={i} fill={color} />)}
        </Pie>
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
          formatter={(value) => [value ?? "", ""]}
        />
        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
            formatter={(value) => <span style={{ color: "#6B7280" }}>{value}</span>}
          />
        )}
      </RePieChart>
    </ResponsiveContainer>
  );
}

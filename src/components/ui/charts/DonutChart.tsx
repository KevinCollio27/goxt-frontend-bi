"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { seriesColor, semanticColors, type SemanticVariant } from "@/lib/colors";

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
  /** Si se pasa, usa el color semántico correspondiente */
  variant?: SemanticVariant;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** Valor a mostrar en el centro (ej. "91%") */
  centerValue?: string;
  /** Subtexto del centro */
  centerLabel?: string;
  height?: number;
  /** Mostrar leyenda abajo */
  showLegend?: boolean;
}

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
  height = 200,
  showLegend = true,
}: DonutChartProps) {
  const data = segments.map((s) => ({ name: s.label, value: s.value }));
  const colors = segments.map((s, i) =>
    s.color ?? (s.variant ? semanticColors[s.variant].bar : seriesColor(i))
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy={showLegend ? "45%" : "50%"}
          innerRadius="62%"
          outerRadius="80%"
          dataKey="value"
          strokeWidth={0}
          paddingAngle={segments.length > 1 ? 2 : 0}
        >
          {colors.map((color, i) => (
            <Cell key={i} fill={color} />
          ))}
        </Pie>

        {centerValue && (
          <text
            x="50%"
            y={showLegend ? "42%" : "48%"}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan x="50%" dy="0" fontSize={22} fontWeight={600} fill="#111827">
              {centerValue}
            </tspan>
            {centerLabel && (
              <tspan x="50%" dy={18} fontSize={11} fill="#9CA3AF">
                {centerLabel}
              </tspan>
            )}
          </text>
        )}

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
      </PieChart>
    </ResponsiveContainer>
  );
}

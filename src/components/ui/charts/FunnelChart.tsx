"use client";

import {
  FunnelChart as ReFunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { seriesColor, semanticColors, type SemanticVariant } from "@/lib/colors";

export interface FunnelStep {
  label: string;
  value: number;
  color?: string;
  variant?: SemanticVariant;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  height?: number;
  /** Mostrar % de conversión entre pasos */
  showConversion?: boolean;
}

export function FunnelChart({ steps, height = 280, showConversion = true }: FunnelChartProps) {
  const data = steps.map((s, i) => ({
    name:  s.label,
    value: s.value,
    fill:  s.color ?? (s.variant ? semanticColors[s.variant].bar : seriesColor(i)),
    conversion:
      i === 0
        ? null
        : `${Math.round((s.value / steps[i - 1].value) * 100)}%`,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReFunnelChart>
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
          formatter={(value, _, props) => [
            showConversion && props.payload.conversion
              ? `${value ?? ""}  (${props.payload.conversion} del paso anterior)`
              : value ?? "",
            props.payload.name,
          ]}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList
            position="center"
            dataKey="name"
            style={{ fontSize: 11, fontWeight: 500, fill: "#fff" }}
          />
          <LabelList
            position="right"
            dataKey="value"
            style={{ fontSize: 11, fill: "#6B7280" }}
          />
        </Funnel>
      </ReFunnelChart>
    </ResponsiveContainer>
  );
}

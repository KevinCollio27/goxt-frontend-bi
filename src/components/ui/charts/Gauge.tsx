"use client";

import { brand } from "@/lib/colors";

interface GaugeProps {
  /** Valor 0–100 */
  value: number;
  label?: string;
  size?: number;
  /** hex color del arco activo (default: brand.teal) */
  color?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function Gauge({ value, label, size = 180, color = brand.teal }: GaugeProps) {
  const cx = size / 2;
  const cy = size * 0.58;
  const r  = size * 0.38;
  const stroke = size * 0.09;

  // Semicírculo: de 180° a 360° (media vuelta)
  const startDeg = 180;
  const endDeg   = 360;
  const valueDeg = startDeg + (Math.min(Math.max(value, 0), 100) / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Track */}
        <path
          d={arc(cx, cy, r, startDeg, endDeg)}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Valor */}
        <path
          d={arc(cx, cy, r, startDeg, valueDeg)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>

      <div className="text-center -mt-3">
        <p className="text-3xl font-semibold text-gray-900 leading-none">{value}</p>
        {label && <p className="text-xs text-gray-400 mt-1">{label}</p>}
      </div>
    </div>
  );
}

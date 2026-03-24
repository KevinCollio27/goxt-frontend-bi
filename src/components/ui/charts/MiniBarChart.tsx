"use client";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export interface MiniBarItem {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: MiniBarItem[];
  /** Color oscuro (barras más recientes). Default: teal */
  color?: string;
  /** Altura del área de barras en px (default: 52) */
  barAreaHeight?: number;
  /** Mostrar valor encima de cada barra */
  showValues?: boolean;
  /** Texto de anotación bajo las etiquetas (ej. "Pico: 13 usuarios sem. del 9 mar") */
  peakLabel?: string;
  /** Si true, las etiquetas de fecha son inicio/medio/fin. Si false, todas. Default: true */
  sparseLabels?: boolean;
}

export function MiniBarChart({
  data,
  color = "#1D9E75",
  barAreaHeight = 52,
  showValues = true,
  peakLabel,
  sparseLabels = true,
}: MiniBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const { r, g, b } = hexToRgb(color);
  const n = data.length;

  const barColor = (i: number) => {
    const alpha = 0.28 + (i / Math.max(n - 1, 1)) * 0.72; // 0.28 → 1.0
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  };

  const showLabel = (i: number) => {
    if (!sparseLabels) return true;
    return i === 0 || i === Math.floor(n / 2) || i === n - 1;
  };

  return (
    <div className="w-full">
      {/* Área de barras */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 3,
          height: barAreaHeight,
        }}
      >
        {data.map((item, i) => {
          const heightPct = Math.max((item.value / max) * 100, item.value > 0 ? 2 : 0);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              {/* Valor encima */}
              {showValues && (
                <span
                  style={{
                    fontSize: 9,
                    lineHeight: 1,
                    color: "#9CA3AF",
                    marginBottom: 2,
                    visibility: item.value > 0 ? "visible" : "hidden",
                  }}
                >
                  {item.value}
                </span>
              )}
              {/* Barra */}
              <div
                style={{
                  width: "100%",
                  height: `${heightPct}%`,
                  borderRadius: "2px 2px 0 0",
                  background: barColor(i),
                  minHeight: item.value > 0 ? 2 : 0,
                  transition: "height 0.2s ease",
                }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
          );
        })}
      </div>

      {/* Etiquetas de fecha: inicio / medio / fin */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {data.map((item, i) =>
          showLabel(i) ? (
            <span key={i} style={{ fontSize: 10, color: "#9CA3AF" }}>
              {item.label}
            </span>
          ) : (
            <span key={i} />
          )
        )}
      </div>

      {/* Anotación de pico */}
      {peakLabel && (
        <p style={{ marginTop: 5, fontSize: 11, color: "#9CA3AF" }}>{peakLabel}</p>
      )}
    </div>
  );
}

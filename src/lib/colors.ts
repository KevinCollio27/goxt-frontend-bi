/**
 * GOxT BI — Color tokens centralizados
 *
 * Todos los componentes (StatCard, Callout, charts, badges) deben importar
 * desde aquí. Nunca hardcodear colores directamente en los componentes.
 */

// ─── Semánticos ───────────────────────────────────────────────────────────────
// Usados en: StatCard badges, Callout, alertas, urgencias

export const semanticColors = {
  positive: {
    bg:     "bg-green-50",
    text:   "text-green-800",
    border: "border-green-400",
    hex:    "#166534",   // texto
    hexBg:  "#F0FDF4",  // fondo
    bar:    "#22C55E",  // para barras/líneas
  },
  negative: {
    bg:     "bg-red-50",
    text:   "text-red-800",
    border: "border-red-400",
    hex:    "#991B1B",
    hexBg:  "#FEF2F2",
    bar:    "#EF4444",
  },
  neutral: {
    bg:     "bg-gray-100",
    text:   "text-gray-600",
    border: "border-gray-300",
    hex:    "#4B5563",
    hexBg:  "#F9FAFB",
    bar:    "#9CA3AF",
  },
  info: {
    bg:     "bg-blue-50",
    text:   "text-blue-800",
    border: "border-blue-400",
    hex:    "#1E40AF",
    hexBg:  "#EFF6FF",
    bar:    "#3B82F6",
  },
  warning: {
    bg:     "bg-amber-50",
    text:   "text-amber-800",
    border: "border-amber-400",
    hex:    "#92400E",
    hexBg:  "#FFFBEB",
    bar:    "#F59E0B",
  },
} as const;

export type SemanticVariant = keyof typeof semanticColors;

// ─── Series de gráficos ───────────────────────────────────────────────────────
// Usados en: BarChart, LineChart, AreaChart, ranking dots
// Orden de uso: series[0] para la primera serie, series[1] para la segunda, etc.

export const chartSeries = [
  { name: "primary",   hex: "#3B82F6", label: "Azul"       },  // Actividades, serie principal
  { name: "secondary", hex: "#F59E0B", label: "Ámbar"      },  // Notas, serie secundaria
  { name: "teal",      hex: "#468189", label: "Teal"        },  // Total combinado, CRM interno
  { name: "purple",    hex: "#8B5CF6", label: "Violeta"     },  // Serie extra
  { name: "neutral",   hex: "#9CA3AF", label: "Gris"        },  // Eliminado, sin datos
] as const;

/** Devuelve el hex de una serie por índice (cicla si hay más series que colores) */
export function seriesColor(index: number): string {
  return chartSeries[index % chartSeries.length].hex;
}

// ─── Brand ────────────────────────────────────────────────────────────────────
// Los colores base del proyecto (definidos en globals.css)

export const brand = {
  ink:       "#031926",
  teal:      "#468189",
  tealMuted: "#77ACA2",
  ash:       "#9DBEBB",
  vanilla:   "#F4E9CD",
} as const;

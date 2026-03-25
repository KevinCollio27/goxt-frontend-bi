"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { PipelineBar, type PipelineBarItem } from "@/components/ui/PipelineBar";
import { BarChart, type BarSeries } from "@/components/ui/charts/BarChart";
import { RankingBar, type RankingBarItem } from "@/components/ui/RankingBar";
import { Callout } from "@/components/ui/Callout";
import { brand } from "@/lib/colors";

// ─── Estado del pipeline ──────────────────────────────────────────────────────

const PIPELINE_ESTADO: PipelineBarItem[] = [
  { label: "En curso",   value: 56, color: "#378ADD" },
  { label: "Eliminadas", value: 15, color: "#9CA3AF", textColor: "#4B5563" },
  { label: "Ganadas",    value: 8,  color: "#1D9E75" },
  { label: "Perdidas",   value: 4,  color: "#E24B4A", textColor: "#fff" },
];

// ─── Tendencia mensual ────────────────────────────────────────────────────────

const TENDENCIA_MENSUAL = [
  { mes: "Oct",  opps: 3  },
  { mes: "Nov",  opps: 5  },
  { mes: "Dic",  opps: 5  },
  { mes: "Ene",  opps: 29 },
  { mes: "Feb",  opps: 13 },
  { mes: "Mar",  opps: 36 },
];

const TENDENCIA_SERIES: BarSeries[] = [
  { key: "opps", label: "Oportunidades nuevas", color: "#378ADD" },
];

// ─── Pipeline por workspace ───────────────────────────────────────────────────

const OPPS_POR_WS: RankingBarItem[] = [
  { label: "GOXT",            value: 17, color: "#378ADD" },
  { label: "Power Skills",    value: 11, color: "#378ADD" },
  { label: "CamiónGO",       value: 10, color: "#60A5FA" },
  { label: "Southway",        value: 9,  color: "#60A5FA" },
  { label: "EV 2.0",          value: 2,  color: "#93C5FD" },
  { label: "Desde La Raíz",   value: 2,  color: "#93C5FD" },
  { label: "Espacio Violeta",  value: 2,  color: "#93C5FD" },
  { label: "NODO OMCPL",      value: 1,  color: "#BFDBFE" },
  { label: "Marine Connect",  value: 1,  color: "#BFDBFE" },
];

interface WsPipelineRow {
  nombre:      string;
  test:        boolean;
  oppsActivas: number;
  ganadas:     number;
  perdidas:    number;
  cotizaciones: number;
}

const WS_PIPELINE: WsPipelineRow[] = [
  { nombre: "GOXT",                   test: false, oppsActivas: 17, ganadas: 3, perdidas: 1, cotizaciones: 4  },
  { nombre: "Power Skills by GOxT",   test: false, oppsActivas: 11, ganadas: 2, perdidas: 0, cotizaciones: 0  },
  { nombre: "CamiónGO",              test: false, oppsActivas: 10, ganadas: 2, perdidas: 2, cotizaciones: 3  },
  { nombre: "Southway",               test: false, oppsActivas: 9,  ganadas: 1, perdidas: 1, cotizaciones: 18 },
  { nombre: "Espacio Violeta 2.0",    test: false, oppsActivas: 2,  ganadas: 0, perdidas: 0, cotizaciones: 1  },
  { nombre: "Desde La Raíz",          test: false, oppsActivas: 2,  ganadas: 0, perdidas: 0, cotizaciones: 0  },
  { nombre: "Espacio Violeta",        test: false, oppsActivas: 2,  ganadas: 0, perdidas: 0, cotizaciones: 1  },
  { nombre: "Guett",                  test: false, oppsActivas: 1,  ganadas: 0, perdidas: 0, cotizaciones: 2  },
  { nombre: "NODO OMCPL",             test: false, oppsActivas: 1,  ganadas: 0, perdidas: 0, cotizaciones: 0  },
  { nombre: "Agencia Marine Connect", test: false, oppsActivas: 1,  ganadas: 0, perdidas: 0, cotizaciones: 1  },
];

// ─── Cotizaciones ─────────────────────────────────────────────────────────────

const COTS_POR_WS: RankingBarItem[] = [
  { label: "Southway",          value: 18, color: brand.teal     },
  { label: "GOXT",              value: 4,  color: brand.teal     },
  { label: "CamiónGO",         value: 3,  color: brand.tealMuted },
  { label: "Guett",             value: 2,  color: brand.tealMuted },
  { label: "EV 2.0",            value: 1,  color: brand.ash      },
  { label: "Espacio Violeta",   value: 1,  color: brand.ash      },
  { label: "Marine Connect",    value: 1,  color: brand.ash      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

function winRateColor(ganadas: number, perdidas: number): string {
  if (ganadas + perdidas === 0) return "text-gray-300";
  const rate = ganadas / (ganadas + perdidas);
  if (rate >= 0.5) return "text-green-600";
  if (rate >= 0.25) return "text-amber-600";
  return "text-red-600";
}

function winRateLabel(ganadas: number, perdidas: number): string {
  if (ganadas + perdidas === 0) return "—";
  return `${Math.round((ganadas / (ganadas + perdidas)) * 100)}%`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmPipeline() {
  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── MÉTRICAS GENERALES ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Oportunidades en curso"  value={56}      subtitle="56 de 83 históricas" />
        <StatCard title="Win rate"                value="12.5%"   badge={{ label: "meta >25%", variant: "negative" }} />
        <StatCard title="Cotizaciones históricas" value={62}      badge={{ label: "15 últimos 30d", variant: "positive" }} />
        <StatCard title="Oportunidades estancadas" value={8}      badge={{ label: "+30 días sin actividad", variant: "warning" }} />
      </div>

      {/* ── ESTADO + TENDENCIA ── */}
      <SectionLabel>Estado y tendencia</SectionLabel>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Estado del pipeline">
          <PipelineBar
            items={PIPELINE_ESTADO}
            footer={[
              { label: "Win rate (ganadas / ganadas+perdidas)", value: "12.5%" },
              { label: "Churn de oportunidades (eliminadas / total)", value: "18.1%" },
              { label: "Total histórico",                        value: "83 oportunidades" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Oportunidades nuevas por mes" chartPadding="pt-3">
          <BarChart
            data={TENDENCIA_MENSUAL}
            series={TENDENCIA_SERIES}
            xKey="mes"
            height={200}
          />
        </ChartCard>

      </div>

      {/* ── PIPELINE POR WORKSPACE ── */}
      <SectionLabel>Pipeline por workspace</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="WS más activo"      value="GOXT"  subtitle="17 opps · 3 ganadas" />
        <StatCard title="WS sin oportunidades" value={12}  badge={{ label: "de 22 totales", variant: "negative" }} />
        <StatCard title="Promedio opps / WS" value={5.6}   subtitle="solo WS con actividad" />
        <StatCard title="Personas + Orgs"    value={188}   subtitle="105 personas · 83 org." />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Oportunidades activas por workspace" chartPadding="pt-3">
          <RankingBar items={OPPS_POR_WS} />
        </ChartCard>

        {/* Tabla desglose por workspace */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Desglose comercial por workspace</p>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">En curso</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ganadas</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Perdidas</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Win rate</th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cots.</th>
                </tr>
              </thead>
              <tbody>
                {WS_PIPELINE.map((ws) => (
                  <tr key={ws.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <p className="text-[13px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                        {ws.oppsActivas}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {ws.ganadas > 0 ? (
                        <span className="text-[12px] font-medium text-green-600">{ws.ganadas}</span>
                      ) : (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {ws.perdidas > 0 ? (
                        <span className="text-[12px] font-medium text-red-500">{ws.perdidas}</span>
                      ) : (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className={`px-4 py-2.5 text-center text-[12px] font-semibold ${winRateColor(ws.ganadas, ws.perdidas)}`}>
                      {winRateLabel(ws.ganadas, ws.perdidas)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {ws.cotizaciones > 0 ? (
                        <span className="text-[12px] font-medium text-gray-600">{ws.cotizaciones}</span>
                      ) : (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── COTIZACIONES ── */}
      <SectionLabel>Cotizaciones</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total históricas"        value={62}  subtitle="desde el inicio" />
        <StatCard title="Últimos 30 días"         value={15}  badge={{ label: "24% del total", variant: "positive" }} />
        <StatCard title="Ratio cots / opp"        value="0.75" subtitle="por oportunidad activa" />
        <StatCard title="WS más cotizador"        value="Southway" subtitle="18 cotizaciones" />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Cotizaciones por workspace (reales)" chartPadding="pt-3">
          <RankingBar items={COTS_POR_WS} />
          <p className="text-[11px] text-gray-400 mt-3">
            32 cotizaciones adicionales en workspaces de testeo (Southway Testeos · Experiencia GOxT)
          </p>
        </ChartCard>

        {/* Stats cotizaciones */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">Contexto de cotizaciones</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] font-medium text-gray-800">Southway domina el volumen</p>
                <p className="text-[12px] text-gray-500 mt-0.5">18 de las 30 cotizaciones reales (60%) vienen de Southway. Es el workspace con uso más maduro del módulo de ventas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] font-medium text-gray-800">7 workspaces sin ninguna cotización</p>
                <p className="text-[12px] text-gray-500 mt-0.5">GOXT, Power Skills y NODO OMCPL tienen oportunidades activas pero no están enviando cotizaciones — posible fricción en el flujo de ventas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] font-medium text-gray-800">32 cotizaciones en entornos de testeo</p>
                <p className="text-[12px] text-gray-500 mt-0.5">Southway Testeos (26) y Experiencia GOxT (6) representan el 52% del total histórico. Son datos de prueba — el número real de cotizaciones de clientes es 30.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── CALLOUTS ── */}
      <div className="grid grid-cols-2 gap-4">

        <Callout variant="negative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Alerta comercial</span>
          <strong>Win rate del 12.5% — la mitad de la meta</strong> — Se espera un win rate superior al 25%. Con 8 ganadas y 4 perdidas sobre 68 oportunidades cerradas, hay margen de mejora. CamiónGO tiene el peor ratio individual: 2 ganadas y 2 perdidas (50% de cierre, pero bajo volumen absoluto).
        </Callout>

        <Callout variant="warning">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Oportunidades estancadas</span>
          <strong>8 oportunidades sin actividad en más de 30 días</strong> — Distribuidas principalmente en CamiónGO (55 días sin actividad en el workspace) y GOXT. Sin seguimiento activo, estas oportunidades tienen alta probabilidad de cerrarse como perdidas o eliminadas.
        </Callout>

      </div>

    </div>
  );
}

"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { StatCard }    from "@/components/ui/StatCard";
import { ChartCard }   from "@/components/ui/ChartCard";
import { PipelineBar, type PipelineBarItem } from "@/components/ui/PipelineBar";
import { BarChart, type BarSeries }          from "@/components/ui/charts/BarChart";
import { RankingBar, type RankingBarItem }   from "@/components/ui/RankingBar";
import { Callout }     from "@/components/ui/Callout";
import { ErrorState }  from "@/components/ui/ErrorState";
import { brand }       from "@/lib/colors";
import { AnalyticsService, type CrmPipelineData, type WsPipelineEntry } from "@/services/analytics.service";

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
      <div className="h-7 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-gray-50 flex gap-4">
          <div className="h-3 bg-gray-100 rounded flex-1" />
          <div className="h-3 bg-gray-100 rounded w-8" />
          <div className="h-3 bg-gray-100 rounded w-8" />
          <div className="h-3 bg-gray-100 rounded w-8" />
          <div className="h-3 bg-gray-100 rounded w-12" />
          <div className="h-3 bg-gray-100 rounded w-8" />
        </div>
      ))}
    </div>
  );
}

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
  if (rate >= 0.5)  return "text-green-600";
  if (rate >= 0.25) return "text-amber-600";
  return "text-red-600";
}

function winRateLabel(ganadas: number, perdidas: number): string {
  if (ganadas + perdidas === 0) return "—";
  return `${Math.round((ganadas / (ganadas + perdidas)) * 100)}%`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmPipeline() {
  const [data,    setData]    = useState<CrmPipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(() => {
    setError(false);
    setData(null);
    setLoading(true);
    AnalyticsService.getCrmPipeline()
      .then(setData)
      .catch(() => {
        setError(true);
        toast.error("No se pudo cargar los datos del pipeline");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const pipelineEstado = useMemo<PipelineBarItem[]>(() => {
    if (!data) return [];
    const { enCurso, eliminadas, ganadas, perdidas } = data.breakdown;
    return [
      { label: "En curso",   value: enCurso,   color: "#378ADD" },
      { label: "Eliminadas", value: eliminadas, color: "#9CA3AF", textColor: "#4B5563" },
      { label: "Ganadas",    value: ganadas,    color: "#1D9E75" },
      { label: "Perdidas",   value: perdidas,   color: "#E24B4A", textColor: "#fff" },
    ];
  }, [data]);

  const pipelineFooter = useMemo(() => {
    if (!data) return [];
    const { ganadas, perdidas, eliminadas, total } = data.breakdown;
    const winRate  = ganadas + perdidas > 0 ? (ganadas / (ganadas + perdidas)) * 100 : null;
    const churn    = total > 0 ? (eliminadas / total) * 100 : null;
    return [
      { label: "Win rate (ganadas / ganadas+perdidas)",       value: winRate  !== null ? `${winRate.toFixed(1)}%`  : "—" },
      { label: "Churn de oportunidades (eliminadas / total)", value: churn    !== null ? `${churn.toFixed(1)}%`    : "—" },
      { label: "Total histórico",                             value: `${total} oportunidades` },
    ];
  }, [data]);

  const tendenciaSeries = useMemo<BarSeries[]>(() => [
    { key: "value", label: "Oportunidades nuevas", color: "#378ADD" },
  ], []);

  const oppsPerWs = useMemo<RankingBarItem[]>(() => {
    if (!data) return [];
    return data.wsPipeline
      .filter(ws => ws.oppsActivas > 0)
      .map((ws, i) => ({
        label: ws.nombre,
        value: ws.oppsActivas,
        color: i < 2 ? "#378ADD" : i < 4 ? "#60A5FA" : "#93C5FD",
      }));
  }, [data]);

  const cotsPorWs = useMemo<RankingBarItem[]>(() => {
    if (!data) return [];
    return [...data.wsPipeline]
      .filter(ws => ws.cotizaciones > 0)
      .sort((a, b) => b.cotizaciones - a.cotizaciones)
      .map((ws, i) => ({
        label: ws.nombre,
        value: ws.cotizaciones,
        color: i === 0 ? brand.teal : i < 3 ? brand.tealMuted : brand.ash,
      }));
  }, [data]);

  const wsStats = useMemo(() => {
    if (!data) return null;
    const wsWithOpps   = data.wsPipeline.filter(ws => ws.oppsActivas > 0);
    const wsWithoutOpp = data.wsPipeline.filter(ws => ws.oppsActivas === 0).length;
    const topWs        = wsWithOpps[0] ?? null;
    const avgOpps      = wsWithOpps.length > 0
      ? Math.round((wsWithOpps.reduce((s, ws) => s + ws.oppsActivas, 0) / wsWithOpps.length) * 10) / 10
      : 0;
    return { topWs, wsWithoutOpp, avgOpps };
  }, [data]);

  const globalWinRate = useMemo(() => {
    if (!data) return null;
    const { ganadas, perdidas } = data.breakdown;
    if (ganadas + perdidas === 0) return null;
    return Math.round((ganadas / (ganadas + perdidas)) * 1000) / 10;
  }, [data]);

  const cotsRatioPct = useMemo(() => {
    if (!data || data.breakdown.enCurso === 0) return null;
    return Math.round((data.quotationStats.total / data.breakdown.enCurso) * 100) / 100;
  }, [data]);

  const topCotizador = useMemo(() => {
    if (!data) return null;
    return [...data.wsPipeline].sort((a, b) => b.cotizaciones - a.cotizaciones)[0] ?? null;
  }, [data]);

  // ── Callout logic ────────────────────────────────────────────────────────────

  const alertaComercial = useMemo(() => {
    if (!data) return null;
    const { ganadas, perdidas, enCurso } = data.breakdown;
    const wr = globalWinRate;
    const meta = 25;
    if (wr === null) return null;
    const wrStr = `${wr}%`;
    const closed = ganadas + perdidas;
    return {
      good:  wr >= meta,
      text:  `Win rate del ${wrStr} — ${wr >= meta ? "por encima de la meta" : "por debajo de la meta del 25%"}. `
           + `Con ${ganadas} ganadas y ${perdidas} perdidas sobre ${closed} oportunidades cerradas. `
           + `${enCurso} oportunidades en curso actualmente.`,
    };
  }, [data, globalWinRate]);

  const alertaEstancadas = useMemo(() => {
    if (!data) return null;
    const { staleOpps, wsPipeline } = data;
    const wsMasEstancado = wsPipeline.reduce<WsPipelineEntry | null>((best, ws) => {
      if (ws.oppsActivas === 0) return best;
      return !best || ws.oppsActivas > best.oppsActivas ? ws : best;
    }, null);
    return { staleOpps, topWs: wsMasEstancado?.nombre ?? null };
  }, [data]);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (error) return <ErrorState onRetry={load} />;

  if (loading) {
    return (
      <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">
        <SectionLabel>Métricas generales</SectionLabel>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <SectionLabel>Estado y tendencia</SectionLabel>
        <div className="grid grid-cols-2 gap-4">{[...Array(2)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <SectionLabel>Pipeline por workspace</SectionLabel>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="grid grid-cols-2 gap-4"><StatCardSkeleton /><TableSkeleton /></div>
        <SectionLabel>Cotizaciones</SectionLabel>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="grid grid-cols-2 gap-4"><StatCardSkeleton /><StatCardSkeleton /></div>
      </div>
    );
  }

  if (!data) return null;

  const { breakdown, staleOpps, monthlyTrend, wsPipeline, quotationStats, contacts } = data;

  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── MÉTRICAS GENERALES ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Oportunidades en curso"
          value={breakdown.enCurso}
          subtitle={`${breakdown.enCurso} de ${breakdown.total} históricas`}
        />
        <StatCard
          title="Win rate"
          value={globalWinRate !== null ? `${globalWinRate}%` : "—"}
          badge={{ label: "meta >25%", variant: globalWinRate !== null && globalWinRate >= 25 ? "positive" : "negative" }}
        />
        <StatCard
          title="Cotizaciones históricas"
          value={quotationStats.total}
          badge={{ label: `${quotationStats.new30d} últimos 30d`, variant: "positive" }}
        />
        <StatCard
          title="Oportunidades estancadas"
          value={staleOpps}
          badge={{ label: "+30 días sin actividad", variant: staleOpps > 0 ? "warning" : "positive" }}
        />
      </div>

      {/* ── ESTADO + TENDENCIA ── */}
      <SectionLabel>Estado y tendencia</SectionLabel>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Estado del pipeline">
          <PipelineBar items={pipelineEstado} footer={pipelineFooter} />
        </ChartCard>

        <ChartCard title="Oportunidades nuevas por mes" chartPadding="pt-3">
          <BarChart
            data={monthlyTrend as unknown as Record<string, unknown>[]}
            series={tendenciaSeries}
            xKey="label"
            height={200}
          />
        </ChartCard>

      </div>

      {/* ── PIPELINE POR WORKSPACE ── */}
      <SectionLabel>Pipeline por workspace</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="WS más activo"
          value={wsStats?.topWs?.nombre ?? "—"}
          subtitle={wsStats?.topWs ? `${wsStats.topWs.oppsActivas} opps · ${wsStats.topWs.ganadas} ganadas` : undefined}
        />
        <StatCard
          title="WS sin oportunidades"
          value={wsStats?.wsWithoutOpp ?? 0}
          badge={{ label: `de ${wsPipeline.length} totales`, variant: "negative" }}
        />
        <StatCard
          title="Promedio opps / WS"
          value={wsStats?.avgOpps ?? 0}
          subtitle="solo WS con actividad"
        />
        <StatCard
          title="Personas + Orgs"
          value={contacts.personsTotal + contacts.orgsTotal}
          subtitle={`${contacts.personsTotal} personas · ${contacts.orgsTotal} org.`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Oportunidades activas por workspace" chartPadding="pt-3">
          <RankingBar items={oppsPerWs} />
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
                {wsPipeline.map((ws) => (
                  <tr key={ws.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <p className="text-[13px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {ws.oppsActivas > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                          {ws.oppsActivas}
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
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
        <StatCard title="Total históricas"        value={quotationStats.total}  subtitle="desde el inicio" />
        <StatCard
          title="Últimos 30 días"
          value={quotationStats.new30d}
          badge={{ label: `${quotationStats.total > 0 ? Math.round((quotationStats.new30d / quotationStats.total) * 100) : 0}% del total`, variant: "positive" }}
        />
        <StatCard
          title="Ratio cots / opp"
          value={cotsRatioPct ?? "—"}
          subtitle="por oportunidad activa"
        />
        <StatCard
          title="WS más cotizador"
          value={topCotizador?.nombre ?? "—"}
          subtitle={topCotizador ? `${topCotizador.cotizaciones} cotizaciones` : undefined}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Cotizaciones por workspace" chartPadding="pt-3">
          <RankingBar items={cotsPorWs} />
        </ChartCard>

        {/* Contexto de cotizaciones */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">Contexto de cotizaciones</p>

          <div className="space-y-3">
            {topCotizador && (
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-1.5" />
                <div>
                  <p className="text-[13px] font-medium text-gray-800">{topCotizador.nombre} lidera en cotizaciones</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {topCotizador.cotizaciones} de {quotationStats.total} cotizaciones totales
                    {quotationStats.total > 0 ? ` (${Math.round((topCotizador.cotizaciones / quotationStats.total) * 100)}%)` : ""}.
                    {" "}Es el workspace con mayor uso del módulo de ventas.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] font-medium text-gray-800">
                  {wsPipeline.filter(ws => ws.oppsActivas > 0 && ws.cotizaciones === 0).length} workspace
                  {wsPipeline.filter(ws => ws.oppsActivas > 0 && ws.cotizaciones === 0).length !== 1 ? "s" : ""} con opps pero sin cotizaciones
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Tienen oportunidades activas pero no están enviando cotizaciones — posible fricción en el flujo de ventas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-[13px] font-medium text-gray-800">
                  {wsPipeline.filter(ws => ws.cotizaciones === 0).length} workspace
                  {wsPipeline.filter(ws => ws.cotizaciones === 0).length !== 1 ? "s" : ""} sin ninguna cotización
                </p>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Incluye workspaces sin oportunidades. {quotationStats.new30d > 0 ? `${quotationStats.new30d} cotizaciones creadas en los últimos 30 días.` : "Sin cotizaciones nuevas en los últimos 30 días."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── CALLOUTS ── */}
      <div className="grid grid-cols-2 gap-4">

        {alertaComercial && (
          <Callout variant={alertaComercial.good ? "positive" : "negative"}>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${alertaComercial.good ? "text-green-500" : "text-red-400"}`}>
              {alertaComercial.good ? "Rendimiento comercial" : "Alerta comercial"}
            </span>
            <strong>Win rate del {globalWinRate}% — {alertaComercial.good ? "por encima de la meta" : "por debajo de la meta del 25%"}</strong>
            {" "}{alertaComercial.text}
          </Callout>
        )}

        {alertaEstancadas && (
          <Callout variant={alertaEstancadas.staleOpps > 0 ? "warning" : "positive"}>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${alertaEstancadas.staleOpps > 0 ? "text-amber-500" : "text-green-500"}`}>
              Oportunidades estancadas
            </span>
            {alertaEstancadas.staleOpps > 0 ? (
              <>
                <strong>{alertaEstancadas.staleOpps} oportunidad{alertaEstancadas.staleOpps !== 1 ? "es" : ""} sin actividad en más de 30 días</strong>
                {" "}— Sin seguimiento activo, estas oportunidades tienen alta probabilidad de cerrarse como perdidas o eliminadas.
                {alertaEstancadas.topWs ? ` Revisa especialmente ${alertaEstancadas.topWs}.` : ""}
              </>
            ) : (
              <strong>Sin oportunidades estancadas — todas tienen actividad reciente.</strong>
            )}
          </Callout>
        )}

      </div>

    </div>
  );
}


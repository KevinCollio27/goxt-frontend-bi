"use client";

import { useEffect, useState, useMemo, Fragment, useCallback } from "react";
import { toast } from "sonner";
import { StatCard }    from "@/components/ui/StatCard";
import { ChartCard }   from "@/components/ui/ChartCard";
import { RankingBar, type RankingBarItem } from "@/components/ui/RankingBar";
import { BarChart, type BarSeries }        from "@/components/ui/charts/BarChart";
import { Callout }     from "@/components/ui/Callout";
import { ErrorState }  from "@/components/ui/ErrorState";
import { semanticColors } from "@/lib/colors";
import {
  AnalyticsService,
  type CrmFeaturesData,
  type WsFeatureRow,
} from "@/services/analytics.service";

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

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-gray-50 flex gap-4">
          <div className="h-3 bg-gray-100 rounded flex-1" />
          <div className="h-3 bg-gray-100 rounded w-8" />
          <div className="h-3 bg-gray-100 rounded w-8" />
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FEATURES = [
  { key: "hasOpps",  label: "Opps"    },
  { key: "hasNotas", label: "Notas"   },
  { key: "hasActs",  label: "Acts"    },
  { key: "hasCots",  label: "Cots"    },
  { key: "hasEmail", label: "Email"   },
  { key: "hasAiExt", label: "AI ext"  },
  { key: "hasAiInt", label: "AI int"  },
  { key: "hasForms", label: "Forms"   },
  { key: "hasInvit", label: "Invit"   },
] as const;

type FeatureKey = typeof FEATURES[number]["key"];

function scoreClass(s: number): string {
  if (s >= 6) return "bg-green-50 text-green-700";
  if (s >= 3) return "bg-blue-50 text-blue-700";
  if (s >= 1) return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-400";
}

function parseDevice(ua: string | null): string {
  if (!ua) return "—";
  const isPhone = /iphone|android.*mobile|mobile/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const device = isPhone ? "iPhone" : isTablet ? "iPad" : /windows/i.test(ua) ? "Windows" : /mac/i.test(ua) ? "Mac" : "Desktop";
  const browser = /edg\//i.test(ua) ? "Edge" : /chrome/i.test(ua) ? "Chrome" : /firefox/i.test(ua) ? "Firefox" : /safari/i.test(ua) ? "Safari" : "Browser";
  return `${device} · ${browser}`;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

function SepRow({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr className="bg-gray-50/80">
      <td colSpan={colSpan} className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-y border-gray-100">
        {label}
      </td>
    </tr>
  );
}

const GRUPO_LABELS: Record<WsFeatureRow["grupo"], string> = {
  alta:  "Alta adopción — 6 o más features",
  media: "Adopción media — 3 a 5 features",
  baja:  "Adopción baja — 1 a 2 features",
  cero:  "Sin uso real",
};

const AI_SERIES: BarSeries[] = [
  { key: "ext", label: "Widget externo",    color: "#378ADD" },
  { key: "int", label: "Asistente interno", color: "#1D9E75" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmFeatures() {
  const [data,    setData]    = useState<CrmFeaturesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(() => {
    setError(false);
    setData(null);
    setLoading(true);
    AnalyticsService.getCrmFeatures()
      .then(setData)
      .catch(() => {
        setError(true);
        toast.error("No se pudo cargar los datos de features");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived: adopción ────────────────────────────────────────────────────────

  const featureRanking = useMemo<RankingBarItem[]>(() => {
    if (!data) return [];
    const total = data.wsFeatures.length;
    if (total === 0) return [];
    return FEATURES.map(f => {
      const count = data.wsFeatures.filter(ws => ws[f.key as FeatureKey]).length;
      const pct   = Math.round((count / total) * 100);
      const color = pct >= 60 ? semanticColors.positive.bar : pct >= 30 ? semanticColors.info.bar : semanticColors.warning.bar;
      return { label: `${f.label} — ${pct}% (${count} WS)`, value: pct, color };
    }).sort((a, b) => b.value - a.value);
  }, [data]);

  const featureGrupos = useMemo(() => {
    if (!data) return [];
    return (["alta", "media", "baja", "cero"] as const)
      .map(g => ({ label: GRUPO_LABELS[g], rows: data.wsFeatures.filter(ws => ws.grupo === g) }))
      .filter(g => g.rows.length > 0);
  }, [data]);

  const adoptionStats = useMemo(() => {
    if (!data || data.wsFeatures.length === 0) return null;
    const total = data.wsFeatures.length;
    const avg = data.wsFeatures.reduce((s, ws) => s + ws.score, 0) / total;
    const counts = FEATURES.map(f => ({
      label: f.label as string,
      count: data.wsFeatures.filter(ws => ws[f.key as FeatureKey]).length,
    }));
    const topFeature = counts.reduce((b, c) => c.count > b.count ? c : b, { label: "", count: 0 });
    const lowFeature = counts.reduce((b, c) => c.count < b.count ? c : b, { label: counts[0].label, count: total + 1 });
    const topPct = Math.round((topFeature.count / total) * 100);
    const lowPct = Math.round((lowFeature.count / total) * 100);
    return { total, avg: Math.round(avg * 10) / 10, topFeature, topPct, lowFeature, lowPct };
  }, [data]);

  // ── Derived: AI ─────────────────────────────────────────────────────────────

  const aiStats = useMemo(() => {
    if (!data) return null;
    const totalConvos   = data.aiPerWs.reduce((s, ws) => s + ws.extConvos + ws.intConvos, 0);
    const totalMessages = data.aiPerWs.reduce((s, ws) => s + ws.extMessages + ws.intMessages, 0);
    const extMessages   = data.aiPerWs.reduce((s, ws) => s + ws.extMessages, 0);
    const extPct        = totalMessages > 0 ? Math.round((extMessages / totalMessages) * 100) : 0;
    const avgMsgs       = totalConvos > 0 ? Math.round((totalMessages / totalConvos) * 10) / 10 : 0;
    return { totalConvos, totalMessages, extMessages, extPct, avgMsgs, wsCount: data.aiPerWs.length };
  }, [data]);

  const aiBarData = useMemo(() => {
    if (!data) return [];
    return data.aiPerWs.map(ws => ({
      ws:  ws.nombre.length > 10 ? ws.nombre.slice(0, 10) + "…" : ws.nombre,
      ext: ws.extMessages,
      int: ws.intMessages,
    }));
  }, [data]);

  const aiMaxMessages = useMemo(() => {
    if (!data || data.aiPerWs.length === 0) return 1;
    return Math.max(...data.aiPerWs.map(ws => ws.extMessages + ws.intMessages));
  }, [data]);

  // ── Derived: email ───────────────────────────────────────────────────────────

  const emailStats = useMemo(() => {
    if (!data) return null;
    const campaigns  = data.emailCampaigns;
    const total      = campaigns.length;
    const enviados   = campaigns.reduce((s, c) => s + c.enviados, 0);
    const wsCount    = new Set(campaigns.map(c => c.workspace)).size;
    const hasTracking = campaigns.some(c => c.entregados > 0 || c.abiertos > 0 || c.clicks > 0);
    return { total, enviados, wsCount, hasTracking };
  }, [data]);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (error) return <ErrorState onRetry={load} />;

  if (loading) {
    return (
      <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">
        <SectionLabel>Adopción por feature</SectionLabel>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="grid grid-cols-2 gap-4"><StatCardSkeleton /><TableSkeleton rows={8} /></div>
        <SectionLabel>AI Widget</SectionLabel>
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <div className="grid grid-cols-2 gap-4"><StatCardSkeleton /><TableSkeleton /></div>
        <SectionLabel>Email</SectionLabel>
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}</div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  if (!data) return null;

  const { wsFeatures, aiPerWs, aiLeads, emailCampaigns } = data;

  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── ADOPCIÓN POR FEATURE ── */}
      <SectionLabel>Adopción por feature</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Features disponibles"  value={FEATURES.length}   subtitle="módulos en el producto" />
        <StatCard
          title="Adopción promedio"
          value={adoptionStats?.avg ?? "—"}
          subtitle={`features / workspace (${adoptionStats?.total ?? 0} WS)`}
        />
        <StatCard
          title="Feature más usada"
          value={adoptionStats?.topFeature.label ?? "—"}
          badge={{ label: `${adoptionStats?.topPct ?? 0}% · ${adoptionStats?.topFeature.count ?? 0} WS`, variant: "positive" }}
        />
        <StatCard
          title="Feature menos usada"
          value={`${adoptionStats?.lowPct ?? 0}%`}
          badge={{ label: `${adoptionStats?.lowFeature.label ?? "—"} · ${adoptionStats?.lowFeature.count ?? 0} WS`, variant: "warning" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title={`% adopción por feature (${adoptionStats?.total ?? 0} WS)`} chartPadding="pt-3">
          <RankingBar items={featureRanking} />
        </ChartCard>

        {/* Mapa de adopción */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Mapa de adopción por workspace</p>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full" style={{ minWidth: 560 }}>
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-30">WS</th>
                  {FEATURES.map(f => (
                    <th key={f.key} className="px-1.5 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-9 whitespace-nowrap">{f.label}</th>
                  ))}
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody>
                {featureGrupos.map(g => (
                  <Fragment key={g.label}>
                    <SepRow label={g.label} colSpan={FEATURES.length + 2} />
                    {g.rows.map(ws => (
                      <tr key={ws.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-3 py-2">
                          <p className="text-[12px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                        </td>
                        {FEATURES.map(f => (
                          <td key={f.key} className="px-1.5 py-2 text-center">
                            {ws[f.key as FeatureKey]
                              ? <span className="text-green-600 text-[13px] font-bold">✓</span>
                              : <span className="text-gray-200 text-[12px]">·</span>
                            }
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${scoreClass(ws.score)}`}>
                            {ws.score}/{FEATURES.length}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── AI WIDGET ── */}
      <SectionLabel>AI Widget</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Conversaciones AI"
          value={aiStats?.totalConvos ?? 0}
          subtitle={`en ${aiStats?.wsCount ?? 0} workspaces`}
        />
        <StatCard
          title="Mensajes AI"
          value={aiStats?.totalMessages ?? 0}
          subtitle={`~${aiStats?.avgMsgs ?? 0} msgs / convo`}
        />
        <StatCard
          title="Widget externo"
          value={aiStats ? aiStats.totalConvos - data.aiPerWs.reduce((s, ws) => s + ws.intConvos, 0) : 0}
          badge={{ label: `${aiStats?.extPct ?? 0}% del total`, variant: "positive" }}
        />
        <StatCard
          title="Asistente interno CRM"
          value={data.aiPerWs.reduce((s, ws) => s + ws.intConvos, 0)}
          badge={{ label: `${100 - (aiStats?.extPct ?? 0)}% del total`, variant: "neutral" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Mensajes por workspace — externo vs interno" chartPadding="pt-3">
          <BarChart
            data={aiBarData as unknown as Record<string, unknown>[]}
            series={AI_SERIES}
            xKey="ws"
            height={200}
            mode="stacked"
          />
        </ChartCard>

        {/* AI ranking table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Ranking por workspace</p>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-3 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Msgs</th>
                  <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Msg/conv</th>
                  <th className="px-3 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-20">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {aiPerWs.map((ws, idx) => {
                  const total     = ws.extMessages + ws.intMessages;
                  const convos    = ws.extConvos + ws.intConvos;
                  const msgsConvo = convos > 0 ? Math.round((total / convos) * 10) / 10 : 0;
                  const engPct    = Math.round((total / aiMaxMessages) * 100);
                  const engColor  = engPct >= 80 ? "#1D9E75" : engPct >= 40 ? "#378ADD" : engPct >= 15 ? "#F59E0B" : "#9CA3AF";
                  return (
                    <tr key={ws.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-3 py-2.5 text-center text-[12px] text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-[12px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{ws.lastConvoAt ?? "—"}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-0.5 items-center">
                          {ws.extConvos > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium whitespace-nowrap">ext ×{ws.extConvos}</span>
                          )}
                          {ws.intConvos > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-medium whitespace-nowrap">int ×{ws.intConvos}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center text-[13px] font-medium text-gray-700">{total}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${msgsConvo >= 5 ? "bg-green-50 text-green-700" : msgsConvo >= 3 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                          {msgsConvo.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${engPct}%`, backgroundColor: engColor }} />
                          </div>
                          <span className="text-[10px] text-gray-400 w-6 text-right shrink-0">{total}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Leads */}
      {aiLeads.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {aiLeads.map(lead => (
            <div key={lead.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{lead.email}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{lead.fechaIso} · {parseDevice(lead.userAgent)}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${lead.isUser ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>
                  {lead.isUser ? "ya es usuario" : "lead externo"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{lead.workspace}</span>
                {lead.source && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">{lead.source}</span>
                )}
                {lead.messages > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">{lead.messages} msgs</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMAIL ── */}
      <SectionLabel>Email</SectionLabel>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total campañas"
          value={emailStats?.total ?? 0}
          subtitle={`${emailStats?.wsCount ?? 0} workspaces distintos`}
        />
        <StatCard
          title="Emails enviados"
          value={emailStats?.enviados ?? 0}
          subtitle="con status enviado"
        />
        <StatCard
          title="Tracking"
          value={emailStats?.hasTracking ? "Activo" : "Sin datos"}
          badge={{ label: emailStats?.hasTracking ? "delivered · abiertos · clicks" : "delivered · abiertos · clicks = 0", variant: emailStats?.hasTracking ? "positive" : "negative" }}
        />
      </div>

      {!emailStats?.hasTracking && (
        <Callout variant="negative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Bug de tracking</span>
          <strong>Los webhooks de SendGrid no están configurados</strong> — Las {emailStats?.total ?? 0} campañas tienen <code className="text-[11px] bg-red-50 px-1 rounded">delivered_count</code>, <code className="text-[11px] bg-red-50 px-1 rounded">opened_count</code> y <code className="text-[11px] bg-red-50 px-1 rounded">clicked_count</code> en 0. Los emails se están enviando correctamente ({emailStats?.enviados ?? 0} enviados) pero el sistema no recibe los eventos de entrega y apertura de SendGrid.
        </Callout>
      )}

      {/* Campaigns table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Todas las campañas</p>
        </div>
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Campaña</th>
              <th className="px-4 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Enviados</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Entregados</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Abiertos</th>
              <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {emailCampaigns.map(c => (
              <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-4 py-2.5">
                  <span className="text-[13px] font-medium text-gray-800">{c.nombre}</span>
                  {c.status === 'draft' && (
                    <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">borrador</span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{c.workspace}</span>
                </td>
                <td className="px-4 py-2.5 text-center text-[12px] text-gray-500">{c.fechaIso}</td>
                <td className="px-4 py-2.5 text-center text-[13px] font-medium text-gray-700">{c.enviados}</td>
                <td className="px-4 py-2.5 text-center text-[12px]">
                  {c.entregados > 0 ? <span className="font-medium text-gray-700">{c.entregados}</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-2.5 text-center text-[12px]">
                  {c.abiertos > 0 ? <span className="font-medium text-green-600">{c.abiertos}</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-2.5 text-center text-[12px]">
                  {c.clicks > 0 ? <span className="font-medium text-blue-600">{c.clicks}</span> : <span className="text-gray-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── CALLOUTS ── */}
      <div className="grid grid-cols-2 gap-4">
        <Callout variant="positive">
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 block mb-0.5">Tracción positiva</span>
          <strong>Invitaciones y AI widget tienen la mejor tracción.</strong>{" "}
          {adoptionStats && `Adopción promedio de ${adoptionStats.avg} features por workspace. `}
          {aiStats && `El AI widget acumula ${aiStats.totalMessages} mensajes en ${aiStats.wsCount} workspaces — el widget externo concentra el ${aiStats.extPct}% del total.`}
        </Callout>

        <Callout variant="warning">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Oportunidad de onboarding</span>
          <strong>Email y Forms tienen la adopción más baja.</strong>{" "}
          Son features que requieren setup inicial — candidatos ideales para una campaña de onboarding guiado o tutoriales in-app.
          {adoptionStats && ` ${wsFeatures.filter(ws => ws.hasOpps && !ws.hasEmail).length} workspaces con oportunidades activas no están usando Email.`}
        </Callout>
      </div>

    </div>
  );
}

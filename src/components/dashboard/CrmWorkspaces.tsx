"use client";

import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { WaterfallChart } from "@/components/ui/charts/WaterfallChart";
import { BarChart, type BarSeries } from "@/components/ui/charts/BarChart";
import { ErrorState } from "@/components/ui/ErrorState";
import { brand } from "@/lib/colors";
import {
  AnalyticsService,
  type CrmWorkspacesData,
  type WsEntry,
  type WsInvitation,
} from "@/services/analytics.service";

// ─── Types ────────────────────────────────────────────────────────────────────

type HealthCat    = "saludable" | "en riesgo" | "crítico" | "sin uso";
type ViralLoop    = "creciendo" | "activo" | "inactivo" | "frío" | "sin uso" | "bloqueado" | "parcial";
type InactivoCat  = "enfriado" | "nunca";
type InactivoRiesgo = "crítico" | "en riesgo" | "nuevo";
type EstadoWs     = "activo" | "inactivo" | "nunca";

interface HealthItem extends WsEntry {
  score:     number;
  healthCat: HealthCat;
}

interface InactivoItem extends HealthItem {
  inactivoCat:    InactivoCat;
  inactivoRiesgo: InactivoRiesgo;
}

interface InvItem extends WsInvitation {
  pendientes: number;
  tasa:       number;
  viralLoop:  ViralLoop;
}

// ─── Derived computation helpers ─────────────────────────────────────────────

function computeHealthScore(e: WsEntry): number {
  // Actividad (max 40) — recency of last system_log entry
  const actScore =
    e.diasActividad === null ? 0
    : e.diasActividad <= 7   ? 40
    : e.diasActividad <= 14  ? 30
    : e.diasActividad <= 30  ? 20
    : e.diasActividad <= 60  ? 10
    : 5;
  // Contenido (max 35): opps (15) + notas (10) + actividades (10)
  const oppsScore  = Math.min(e.opps * 1.5, 15);
  const notasScore = Math.min(e.notas * 0.5, 10);
  const actsScore  = Math.min(e.actividades * 0.5, 10);
  // Usuarios (max 25)
  const usersScore = Math.min(e.usuarios * 2.5, 25);
  return Math.round(actScore + oppsScore + notasScore + actsScore + usersScore);
}

function getHealthCat(score: number, diasActividad: number | null): HealthCat {
  if (score >= 60) return "saludable";
  if (score >= 20) return "en riesgo";
  if (diasActividad !== null) return "crítico";
  return "sin uso";
}

function getEstado(diasActividad: number | null): EstadoWs {
  if (diasActividad === null) return "nunca";
  return diasActividad <= 30 ? "activo" : "inactivo";
}

function getViralLoop(inv: WsInvitation, diasActividad: number | null): ViralLoop {
  const pendientes = Math.max(0, inv.enviadas - inv.aceptadas);
  const tasa = inv.enviadas > 0 ? (inv.aceptadas / inv.enviadas) * 100 : 0;
  if (inv.enviadas === 0) return diasActividad === null ? "sin uso" : "inactivo";
  if (pendientes > inv.enviadas * 0.5 && inv.enviadas >= 5) return "creciendo";
  if (diasActividad === null) return "sin uso";
  if (diasActividad <= 7  && tasa >= 60) return "activo";
  if (diasActividad <= 30 && tasa >= 50) return "activo";
  if (tasa < 25) return "bloqueado";
  if (diasActividad > 60) return "frío";
  if (diasActividad > 30) return "inactivo";
  return "parcial";
}

function getInactivoRiesgo(diasActividad: number | null, creadoStr: string): InactivoRiesgo {
  if (diasActividad !== null) return diasActividad > 60 ? "crítico" : "en riesgo";
  const MONTHS: Record<string, number> = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
  };
  const [mon, year] = creadoStr.split(" ");
  const created = new Date(Date.UTC(parseInt(year), MONTHS[mon] ?? 0));
  const daysSince = (Date.now() - created.getTime()) / 86_400_000;
  if (daysSince < 7)  return "nuevo";
  if (daysSince < 30) return "en riesgo";
  return "crítico";
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 60) return "#1D9E75";
  if (score >= 40) return "#378ADD";
  if (score >= 20) return "#F59E0B";
  return "#E24B4A";
}

function healthCatClass(cat: HealthCat): string {
  switch (cat) {
    case "saludable": return "bg-green-50 text-green-700";
    case "en riesgo": return "bg-amber-50 text-amber-700";
    case "crítico":   return "bg-red-50 text-red-700";
    case "sin uso":   return "bg-red-50 text-red-700";
  }
}

function tasaBadgeClass(tasa: number): string {
  if (tasa >= 80) return "bg-green-50 text-green-700";
  if (tasa >= 50) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

function viralLoopClass(vl: ViralLoop): string {
  switch (vl) {
    case "creciendo": return "bg-blue-50 text-blue-700";
    case "activo":    return "bg-green-50 text-green-700";
    case "inactivo":  return "bg-amber-50 text-amber-700";
    case "frío":      return "bg-amber-50 text-amber-700";
    case "sin uso":   return "bg-red-50 text-red-700";
    case "bloqueado": return "bg-red-50 text-red-700";
    case "parcial":   return "bg-amber-50 text-amber-700";
  }
}

function riesgoBadgeClass(r: InactivoRiesgo): string {
  switch (r) {
    case "crítico":   return "bg-red-50 text-red-700";
    case "en riesgo": return "bg-amber-50 text-amber-700";
    case "nuevo":     return "bg-blue-50 text-blue-700";
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 animate-pulse space-y-2.5">
      <div className="h-3 w-28 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse bg-gray-100 rounded" />
      ))}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INV_SERIES: BarSeries[] = [
  { key: "aceptadas",  label: "Aceptadas",  color: "#1D9E75" },
  { key: "pendientes", label: "Pendientes", color: "#FCA5A5" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmWorkspaces() {
  const [data,  setData]  = useState<CrmWorkspacesData | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setData(null);
    AnalyticsService.getCrmWorkspaces()
      .then(setData)
      .catch(() => {
        setError(true);
        toast.error("No se pudo cargar los datos de workspaces");
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Cascada con total al final ────────────────────────────────────────────
  const cascadaWithTotal = useMemo(() => {
    if (!data) return [];
    const total = data.cascada.reduce((s, c) => s + c.value, 0);
    return [...data.cascada, { label: "Total", value: total }];
  }, [data]);

  // ── Health items (directorio + score, ordenado por score desc) ────────────
  const healthItems = useMemo((): HealthItem[] => {
    if (!data) return [];
    return data.directorio
      .map(e => {
        const score = computeHealthScore(e);
        return { ...e, score, healthCat: getHealthCat(score, e.diasActividad) };
      })
      .sort((a, b) => b.score - a.score);
  }, [data]);

  const healthMax = useMemo(
    () => (healthItems.length ? Math.max(...healthItems.map(h => h.score), 1) : 1),
    [healthItems],
  );

  const healthStats = useMemo(() => ({
    saludables: healthItems.filter(h => h.healthCat === "saludable").length,
    enRiesgo:   healthItems.filter(h => h.healthCat === "en riesgo").length,
    criticos:   healthItems.filter(h => h.healthCat === "crítico" || h.healthCat === "sin uso").length,
    avgScore:   healthItems.length > 0
      ? Math.round(healthItems.reduce((s, h) => s + h.score, 0) / healthItems.length)
      : 0,
  }), [healthItems]);

  const healthGrupos = useMemo(() => [
    { label: "Saludables — score ≥ 60",        rows: healthItems.filter(h => h.score >= 60) },
    { label: "En riesgo — score 20–59",         rows: healthItems.filter(h => h.score >= 20 && h.score < 60) },
    { label: "Críticos / sin uso — score < 20", rows: healthItems.filter(h => h.score < 20) },
  ], [healthItems]);

  // ── Invitation items ───────────────────────────────────────────────────────
  const invItems = useMemo((): InvItem[] => {
    if (!data) return [];
    const wsMap = new Map(data.directorio.map(e => [e.id, e]));
    return data.invitations
      .filter(inv => inv.enviadas > 0)
      .map(inv => {
        const ws         = wsMap.get(inv.id);
        const pendientes = Math.max(0, inv.enviadas - inv.aceptadas);
        const tasa       = Math.round((inv.aceptadas / inv.enviadas) * 100);
        const viralLoop  = getViralLoop(inv, ws?.diasActividad ?? null);
        return { ...inv, pendientes, tasa, viralLoop };
      })
      .sort((a, b) => b.enviadas - a.enviadas);
  }, [data]);

  const invStats = useMemo(() => {
    if (!data) return null;
    const totalEnviadas   = data.invitations.reduce((s, i) => s + i.enviadas, 0);
    const totalAceptadas  = data.invitations.reduce((s, i) => s + i.aceptadas, 0);
    const totalPendientes = Math.max(0, totalEnviadas - totalAceptadas);
    const tasaGlobal      = totalEnviadas > 0 ? Math.round((totalAceptadas / totalEnviadas) * 100) : 0;
    const sinInvitar      = data.invitations.filter(i => i.enviadas === 0).length;
    return { totalEnviadas, totalAceptadas, totalPendientes, tasaGlobal, sinInvitar };
  }, [data]);

  const invBarData = useMemo(
    () => invItems.slice(0, 13).map(i => ({
      ws:         i.workspace.length > 14 ? i.workspace.substring(0, 12) + "…" : i.workspace,
      aceptadas:  i.aceptadas,
      pendientes: i.pendientes,
    })),
    [invItems],
  );

  // ── General stats ──────────────────────────────────────────────────────────
  const generalStats = useMemo(() => {
    if (!data || !invStats) return null;
    return {
      total:      data.directorio.length,
      active:     data.directorio.filter(e => getEstado(e.diasActividad) === "activo").length,
      avgScore:   healthStats.avgScore,
      pendInv:    invStats.totalPendientes,
      tasaGlobal: invStats.tasaGlobal,
    };
  }, [data, healthStats, invStats]);

  // ── Inactivo items ─────────────────────────────────────────────────────────
  const inactivoItems = useMemo((): InactivoItem[] => {
    if (!data) return [];
    return healthItems
      .filter(h => getEstado(h.diasActividad) !== "activo")
      .map(h => ({
        ...h,
        inactivoCat:    (h.diasActividad !== null ? "enfriado" : "nunca") as InactivoCat,
        inactivoRiesgo: getInactivoRiesgo(h.diasActividad, h.creado),
      }))
      .sort((a, b) => {
        if (a.inactivoCat !== b.inactivoCat) return a.inactivoCat === "enfriado" ? -1 : 1;
        return (b.diasActividad ?? 9999) - (a.diasActividad ?? 9999);
      });
  }, [healthItems, data]);

  const inactivoGrupos = useMemo(() => [
    { label: "Con actividad previa — se enfriaron", rows: inactivoItems.filter(i => i.inactivoCat === "enfriado") },
    { label: "Nunca usados — creados pero vacíos",  rows: inactivoItems.filter(i => i.inactivoCat === "nunca")    },
  ], [inactivoItems]);

  const inactivoMax = useMemo(
    () => Math.max(...inactivoItems.map(i => i.diasActividad ?? 0), 1),
    [inactivoItems],
  );

  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── MÉTRICAS GENERALES ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!generalStats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total workspaces"
              value={generalStats.total}
              subtitle="desde el inicio"
            />
            <StatCard
              title="Activos (30d)"
              value={generalStats.active}
              badge={{ label: `${Math.round((generalStats.active / generalStats.total) * 100)}% del total`, variant: "positive" }}
            />
            <StatCard
              title="Score promedio de salud"
              value={generalStats.avgScore}
              subtitle="sobre 100 posibles"
            />
            <StatCard
              title="Invitaciones pendientes"
              value={generalStats.pendInv}
              badge={{ label: `tasa global ${generalStats.tasaGlobal}%`, variant: generalStats.tasaGlobal >= 50 ? "positive" : "warning" }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 h-77.5">

        <ChartCard title="Crecimiento acumulado de workspaces" fillHeight>
          {data ? (
            <WaterfallChart
              data={cascadaWithTotal}
              height={220}
              color={brand.tealMuted}
              showTotal
              yLabel="Workspaces"
            />
          ) : (
            <div className="h-56 animate-pulse bg-gray-100 rounded" />
          )}
        </ChartCard>

        {/* Directorio */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Directorio de workspaces</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {!data ? (
              <TableSkeleton />
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Dueño</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Users</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Creado</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actividad</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.directorio.map((ws) => {
                    const estado = getEstado(ws.diasActividad);
                    return (
                      <tr key={ws.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-2.5">
                          <p className="text-[13px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[12px] text-gray-500">{ws.dueno ?? "—"}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                            {ws.usuarios}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[12px] text-gray-400 whitespace-nowrap">{ws.creado}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          {ws.diasActividad === null ? (
                            <span className="text-[12px] text-gray-300">—</span>
                          ) : (
                            <span className={`text-[12px] whitespace-nowrap font-medium ${
                              ws.diasActividad <= 7  ? "text-green-600" :
                              ws.diasActividad <= 30 ? "text-amber-600" :
                              "text-red-600"
                            }`}>
                              hace {ws.diasActividad}d
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            estado === "activo"   ? "bg-green-50 text-green-700" :
                            estado === "inactivo" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                            {estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* ── HEALTH SCORE ── */}
      <SectionLabel>Health Score</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!data ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Saludables"         value={healthStats.saludables} badge={{ label: "score ≥ 60",  variant: "positive" }} />
            <StatCard title="En riesgo"           value={healthStats.enRiesgo}   badge={{ label: "score 20–59", variant: "warning"  }} />
            <StatCard title="Críticos / sin uso"  value={healthStats.criticos}   badge={{ label: "score < 20",  variant: "negative" }} />
            <StatCard title="Score promedio"      value={healthStats.avgScore}   subtitle="sobre 100 · todos los workspaces" />
          </>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Ranking por health score</p>
          <p className="text-xs text-gray-400 mt-0.5">Actividad (40 pts) · Contenido (35 pts) · Usuarios (25 pts)</p>
        </div>
        {!data ? (
          <TableSkeleton />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2.5 w-8 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuarios</th>
                <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Opps · Notas · Acts</th>
                <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Última actividad</th>
                <th className="px-4 py-2.5 w-28 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {healthGrupos.map((grupo, gi) => (
                <Fragment key={gi}>
                  {grupo.rows.length > 0 && <SepRow label={grupo.label} colSpan={7} />}
                  {grupo.rows.map((r, i) => {
                    const pct      = Math.round((r.score / healthMax) * 100);
                    const color    = scoreColor(r.score);
                    const diasStr  = r.diasActividad === null ? "—" : `hace ${r.diasActividad}d`;
                    const diasColor =
                      r.diasActividad === null ? "text-gray-300"
                      : r.diasActividad <= 7   ? "text-green-600"
                      : r.diasActividad <= 30  ? "text-amber-600"
                      : "text-red-600";
                    return (
                      <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-center text-[12px] text-gray-400 font-medium">
                          {gi * 100 + i + 1}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-[13px] font-medium text-gray-800 leading-none">{r.nombre}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                            {r.usuarios}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{r.opps} opps
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />{r.notas} notas
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />{r.actividades} acts
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap ${diasColor}`}>
                          {diasStr}
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-[15px] font-semibold leading-none" style={{ color }}>{r.score}</p>
                          <div className="mt-1 h-1 rounded bg-gray-100 overflow-hidden w-20">
                            <div className="h-full rounded" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${healthCatClass(r.healthCat)}`}>
                            {r.healthCat}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── INVITACIONES ── */}
      <SectionLabel>Invitaciones</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!invStats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total enviadas"
              value={invStats.totalEnviadas}
              subtitle={`desde ${data!.directorio.length - invStats.sinInvitar} workspaces`}
            />
            <StatCard
              title="Aceptadas"
              value={invStats.totalAceptadas}
              badge={{ label: `tasa global ${invStats.tasaGlobal}%`, variant: invStats.tasaGlobal >= 50 ? "positive" : "warning" }}
            />
            <StatCard
              title="Pendientes"
              value={invStats.totalPendientes}
              badge={{ label: "sin respuesta aún", variant: "warning" }}
            />
            <StatCard
              title="Sin invitar"
              value={invStats.sinInvitar}
              badge={{ label: `de ${data!.directorio.length} workspaces`, variant: invStats.sinInvitar > 0 ? "negative" : "positive" }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Aceptadas vs. pendientes por workspace" chartPadding="pt-3">
          {data ? (
            <BarChart
              data={invBarData}
              series={INV_SERIES}
              xKey="ws"
              height={240}
              mode="stacked"
            />
          ) : (
            <div className="h-60 animate-pulse bg-gray-100 rounded" />
          )}
        </ChartCard>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Ranking por workspace</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {!data ? (
              <TableSkeleton />
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    <th className="px-3 py-2.5 w-7 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Env.</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Acept. / Pend.</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tasa</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Loop</th>
                  </tr>
                </thead>
                <tbody>
                  {invItems.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-3 py-2.5 text-center text-[12px] text-gray-400 font-medium">{idx + 1}</td>
                      <td className="px-3 py-2.5">
                        <p className="text-[12px] font-medium text-gray-800 leading-none">{row.workspace}</p>
                      </td>
                      <td className="px-3 py-2.5 text-[13px] font-medium text-gray-700">{row.enviadas}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex h-1.5 rounded overflow-hidden w-20 mb-1">
                          <div style={{ width: `${(row.aceptadas / row.enviadas) * 100}%`, background: "#1D9E75" }} />
                          <div style={{ width: `${(row.pendientes / row.enviadas) * 100}%`, background: "#FCA5A5" }} />
                        </div>
                        <p className="text-[11px] text-gray-400">{row.aceptadas} ✓ · {row.pendientes} pend.</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${tasaBadgeClass(row.tasa)}`}>
                          {row.tasa}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${viralLoopClass(row.viralLoop)}`}>
                          {row.viralLoop}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* ── WORKSPACES INACTIVOS ── */}
      <SectionLabel>Workspaces inactivos</SectionLabel>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Workspaces sin actividad — ordenados por urgencia</p>
        </div>
        {!data ? (
          <TableSkeleton rows={5} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuarios</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Última actividad</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Opps / Notas</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Días inactivo</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {inactivoGrupos.map((grupo, gi) => (
                <Fragment key={gi}>
                  {grupo.rows.length > 0 && <SepRow label={grupo.label} colSpan={6} />}
                  {grupo.rows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5">
                        <p className="text-[13px] font-medium text-gray-800">{r.nombre}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                          {r.usuarios} usuario{r.usuarios !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[12px] text-gray-500 whitespace-nowrap">
                        {r.lastActivity ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                            {r.opps} opps
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                            {r.notas} notas
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        {r.diasActividad === null ? (
                          <span className="text-[12px] text-gray-300">nunca</span>
                        ) : (
                          <div>
                            <p className="text-[13px] font-medium text-gray-700">{r.diasActividad} días</p>
                            <div className="mt-0.5 h-1 rounded bg-gray-100 overflow-hidden w-20">
                              <div
                                className="h-full rounded bg-red-400"
                                style={{ width: `${(r.diasActividad / inactivoMax) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${riesgoBadgeClass(r.inactivoRiesgo)}`}>
                          {r.inactivoRiesgo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

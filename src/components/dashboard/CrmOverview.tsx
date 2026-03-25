"use client";

import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { MiniBarChart, type MiniBarItem } from "@/components/ui/charts/MiniBarChart";
import { RankingBar, type RankingBarItem } from "@/components/ui/RankingBar";
import { PipelineBar, type PipelineBarItem } from "@/components/ui/PipelineBar";
import { Callout } from "@/components/ui/Callout";
import { brand } from "@/lib/colors";
import {
  AnalyticsService,
  type CrmOverviewData,
  type RankingItem,
} from "@/services/analytics.service";

// ─── Mapeo de etiquetas legibles ─────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  createActivity:    "Actividad creada",
  create:            "Registro creado",
  invited:           "Invitación enviada",
  completeActivity:  "Actividad completada",
  createNote:        "Nota creada",
  update:            "Actualización",
  resendInvitation:  "Invitación reenviada",
  delete:            "Eliminación",
  updateActivity:    "Actividad actualizada",
  admin:             "Acción administrativa",
};

const ENTITY_LABELS: Record<string, string> = {
  opportunity:          "Oportunidad",
  userWorkspace:        "Usuario",
  opportunity_activity: "Actividad de oportunidad",
  organization:         "Organización",
  person:               "Persona / Contacto",
  workspace:            "Workspace",
  quotation:            "Cotización",
};

function translateLabel(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}

// ─── Color palettes ───────────────────────────────────────────────────────────

const TEAL   = ["#468189","#468189","#77ACA2","#77ACA2","#9DBEBB","#9DBEBB","#9DBEBB","#9DBEBB"];
const PURPLE = ["#534AB7","#534AB7","#7F77DD","#7F77DD","#AFA9EC","#AFA9EC","#CECBF6","#CECBF6"];
const BLUE   = ["#378ADD","#378ADD","#85B7EB","#85B7EB","#B5D4F4","#B5D4F4","#B5D4F4"];

function toRanking(items: RankingItem[], palette: string[]): RankingBarItem[] {
  return items.map((item, i) => ({
    label: item.label,
    value: item.value,
    color: palette[i] ?? palette[palette.length - 1],
  }));
}

function toActionRanking(items: RankingItem[]): RankingBarItem[] {
  return items.map((item, i) => ({
    label: translateLabel(ACTION_LABELS, item.label),
    value: item.value,
    color: item.label === "delete" ? "#F09595" : (BLUE[i] ?? BLUE[BLUE.length - 1]),
  }));
}

function toEntityRanking(items: RankingItem[]): RankingBarItem[] {
  return items.map((item, i) => ({
    label: translateLabel(ENTITY_LABELS, item.label),
    value: item.value,
    color: TEAL[i] ?? TEAL[TEAL.length - 1],
  }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function peakLabel(data: MiniBarItem[], unit: string): string {
  if (!data.length) return "";
  const max = data.reduce((a, b) => (b.value > a.value ? b : a));
  return `Pico: ${max.value} ${unit} en ${max.label}`;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 animate-pulse space-y-2.5">
      <div className="h-3 w-28 bg-gray-200 rounded" />
      <div className="h-7 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  );
}

function ChartSkeleton({ h = 28 }: { h?: number }) {
  return <div className={`h-${h} animate-pulse bg-gray-100 rounded`} />;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmOverview() {
  const [overview, setOverview] = useState<CrmOverviewData | null>(null);

  useEffect(() => {
    AnalyticsService.getCrmOverview()
      .then(setOverview)
      .catch(console.error);
  }, []);

  // Derived
  const u  = overview?.userStats;
  const ws = overview?.workspaceStats;
  const p  = overview?.pipelineStats;
  const cs = overview?.contactStats;

  const activationBadgeLabel = u?.activationDelta != null
    ? `${u.activationDelta > 0 ? "+" : ""}${u.activationDelta}% vs mes anterior`
    : undefined;
  const activationBadgeVariant = u?.activationDelta != null
    ? (u.activationDelta >= 0 ? "positive" as const : "negative" as const)
    : "neutral" as const;

  const pipelineItems: PipelineBarItem[] = p ? [
    { label: "Abiertas", value: p.openCount,  color: "#378ADD" },
    { label: "Ganadas",  value: p.wonCount,   color: "#1D9E75" },
    { label: "Perdidas", value: p.lostCount,  color: "#F09595", textColor: "#501313" },
  ] : [];

  const contactBars: RankingBarItem[] = cs ? [
    { label: "Personas",      value: cs.personsTotal,      color: brand.teal },
    { label: "Orgs",          value: cs.orgsTotal,         color: brand.teal },
    { label: "Oportunidades", value: cs.opportunitiesOpen, color: brand.teal },
    { label: "Actividades",   value: cs.activities30d,     color: brand.teal },
  ] : [];

  const personsPct = cs && cs.personsTotal > 0
    ? Math.round((cs.persons30d / cs.personsTotal) * 100)
    : 0;

  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── USUARIOS ── */}
      <SectionLabel>Usuarios</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!u ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total de Usuarios"
              value={u.total}
              subtitle={`${u.active} activos · ${u.inactive} inactivos`}
            />
            <StatCard
              title="Nuevos (30d)"
              value={u.new30d}
              badge={{ label: `+${u.newThisWeek} esta semana`, variant: "positive" }}
            />
            <StatCard
              title="Tasa de Activación"
              value={`${u.activationPct}%`}
              badge={activationBadgeLabel
                ? { label: activationBadgeLabel, variant: activationBadgeVariant }
                : undefined}
            />
            <StatCard
              title="Con actividad (30d)"
              value={u.active30d}
              subtitle={`${u.activeUsersPct}% del total`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Nuevos usuarios — últimas 11 semanas" chartPadding="pt-3">
          {overview?.weeklyNewUsers ? (
            <MiniBarChart
              data={overview.weeklyNewUsers}
              color={brand.teal}
              barAreaHeight={56}
              peakLabel={peakLabel(overview.weeklyNewUsers, "usuarios")}
            />
          ) : <ChartSkeleton h={14} />}
        </ChartCard>
        <ChartCard title="Actividad semanal (acciones en system_log)" chartPadding="pt-3">
          {overview?.weeklyActivity ? (
            <MiniBarChart
              data={overview.weeklyActivity}
              color="#185FA5"
              barAreaHeight={56}
              peakLabel={peakLabel(overview.weeklyActivity, "acciones")}
            />
          ) : <ChartSkeleton h={14} />}
        </ChartCard>
      </div>

      {/* ── WORKSPACES ── */}
      <SectionLabel>Workspaces</SectionLabel>

      <div className="grid grid-cols-5 gap-4">
        {!ws ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total workspaces"
              value={ws.total}
              subtitle="activos e inactivos"
              tooltip="Workspaces existentes en la plataforma, sin contar los que fueron eliminados"
            />
            <StatCard
              title="Activos"
              value={ws.active}
              badge={{ label: `${Math.round((ws.active / ws.total) * 100)}% del total`, variant: "positive" }}
              tooltip="Workspaces habilitados, con acceso completo para sus usuarios"
            />
            <StatCard
              title="Inactivos"
              value={ws.inactive}
              badge={{ label: "desactivados", variant: "neutral" }}
              tooltip="Workspaces desactivados manualmente — sus datos se conservan pero no están accesibles"
            />
            <StatCard
              title="Eliminados"
              value={ws.deleted}
              badge={{ label: "eliminados", variant: "negative" }}
              tooltip="Workspaces que fueron eliminados y ya no aparecen en la plataforma"
            />
            <StatCard
              title="Con actividad (30d)"
              value={ws.active30d}
              subtitle={`${ws.activeWsPct}% de activos`}
              tooltip="Workspaces donde al menos un usuario realizó alguna acción en los últimos 30 días"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Workspaces más activos (30d)">
          {overview?.mostActiveWs ? (
            <RankingBar items={toRanking(overview.mostActiveWs, TEAL)} />
          ) : <ChartSkeleton />}
        </ChartCard>
        <ChartCard title="Usuarios por workspace (top 8)">
          {overview?.usersPerWs ? (
            <RankingBar items={toRanking(overview.usersPerWs, PURPLE)} />
          ) : <ChartSkeleton />}
        </ChartCard>
      </div>

      {/* ── PIPELINE Y VENTAS ── */}
      <SectionLabel>Pipeline y ventas</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!p ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Oportunidades abiertas"
              value={p.openCount}
              badge={{ label: `↑ ${p.new30d} creadas (30d)`, variant: "positive" }}
            />
            <StatCard
              title="Tasa de cierre"
              value={p.closeRate != null ? `${p.closeRate}%` : "N/A"}
              subtitle={`${p.wonCount} ganadas · ${p.lostCount} perdidas`}
            />
            <StatCard
              title="Cotizaciones (30d)"
              value={overview!.quotationStats.new30d}
              subtitle={`${overview!.quotationStats.total} totales históricas`}
            />
            <StatCard
              title="Leads widget IA (30d)"
              value={overview!.aiLeadStats.new30d}
              subtitle={`${overview!.aiLeadStats.total} totales históricas`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Estado del pipeline">
          {p ? (
            <PipelineBar
              items={pipelineItems}
              footer={[
                { label: "Total históricas", value: `${p.totalHistoric} oportunidades` },
                { label: "Nuevas este mes",  value: p.new30d },
              ]}
            />
          ) : <ChartSkeleton />}
        </ChartCard>

        <ChartCard title="Contactos y organizaciones">
          {cs ? (
            <>
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Personas</p>
                  <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">{cs.personsTotal}</p>
                  <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+{cs.persons30d} este mes</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Organizaciones</p>
                  <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">{cs.orgsTotal}</p>
                  <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+{cs.orgs30d} este mes</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Oportunidades</p>
                  <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">{cs.opportunitiesOpen}</p>
                  <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+{cs.opportunities30d} este mes</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Actividades</p>
                  <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">{cs.activities30d}</p>
                  <p className="text-xs mt-1 text-gray-400">act. oport. (30d)</p>
                </div>
              </div>
              <RankingBar items={contactBars} />
              <p className="text-[11px] text-gray-400 mt-3">
                {personsPct}% de personas nuevas en los últimos 30 días
              </p>
            </>
          ) : <ChartSkeleton />}
        </ChartCard>
      </div>

      {/* ── ACTIVIDAD DEL SISTEMA ── */}
      <SectionLabel>Actividad del sistema</SectionLabel>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Acciones más frecuentes (30d)">
          {overview?.frequentActions ? (
            <RankingBar items={toActionRanking(overview.frequentActions)} />
          ) : <ChartSkeleton />}
        </ChartCard>
        <ChartCard title="Entidades más usadas (30d)">
          {overview?.topEntities ? (
            <RankingBar items={toEntityRanking(overview.topEntities)} />
          ) : <ChartSkeleton />}
        </ChartCard>
      </div>

      {/* ── ALERTAS DE SALUD ── */}
      <SectionLabel>Alertas de salud</SectionLabel>

      {!overview ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-xl" />)}</div>
          <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-xl" />)}</div>
        </div>
      ) : (() => {
        const h  = overview.health;
        const ua = overview.userStats;
        const pp = overview.pipelineStats;
        const cc = overview.contactStats;

        // Pico de actividad semanal
        const peakWeek   = overview.weeklyActivity.reduce((a, b) => b.value > a.value ? b : a, { label: "-", value: 0 });
        const peakUsers  = overview.weeklyNewUsers.reduce((a, b)  => b.value > a.value ? b : a, { label: "-", value: 0 });

        const positiveCount = (peakWeek.value > 0 ? 1 : 0)
          + (cc.persons30d > 0 || cc.orgs30d > 0 ? 1 : 0)
          + (h.newWorkspacesThisWeek.length > 0 ? 1 : 0);

        // Alertas negativas
        const alerts: React.ReactNode[] = [];

        if (h.inactiveWorkspaces.length > 0) {
          const names = h.inactiveWorkspaces.join(", ");
          alerts.push(
            <Callout key="inactive-ws" variant="negative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
              <strong>{h.inactiveWorkspaces.length} workspace{h.inactiveWorkspaces.length > 1 ? "s" : ""} sin actividad en los últimos 30 días</strong> — {names}. Considerar contacto de reactivación.
            </Callout>
          );
        }

        if (h.usersWithoutWorkspace > 0) {
          alerts.push(
            <Callout key="no-ws" variant="negative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
              <strong>{h.usersWithoutWorkspace} usuario{h.usersWithoutWorkspace > 1 ? "s" : ""} sin workspace asignado</strong> — Se registraron pero nunca fueron invitados a un workspace. Posible fricción en el onboarding.
            </Callout>
          );
        }

        if (ua.activationDelta !== null && ua.activationDelta < 0) {
          alerts.push(
            <Callout key="activation" variant="warning">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
              <strong>Tasa de activación cayó {Math.abs(ua.activationDelta)}% vs mes anterior</strong> — Actualmente en {ua.activationPct}%. De los {ua.new30d} nuevos usuarios del último mes, {ua.new30d - Math.round(ua.new30d * (ua.activationPct / 100))} aún no han iniciado sesión.
            </Callout>
          );
        }

        if (pp.closeRate !== null && pp.closeRate < 50) {
          alerts.push(
            <Callout key="pipeline" variant="warning">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
              <strong>Tasa de cierre del pipeline en {pp.closeRate}%</strong> — {pp.lostCount} oportunidades perdidas. Ratio ganadas/perdidas {pp.wonCount}:{pp.lostCount}.
            </Callout>
          );
        }

        if (h.staleOpportunities > 0) {
          const active = pp.openCount - h.staleOpportunities;
          alerts.push(
            <Callout key="stale-opps" variant="negative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
              <strong>{h.staleOpportunities} oportunidades abiertas sin actividad en 15 días</strong> — Solo {active} de {pp.openCount} tienen seguimiento reciente. El pipeline está mayormente estancado.
            </Callout>
          );
        }

        if (h.overdueOpportunities > 0) {
          alerts.push(
            <Callout key="overdue" variant="negative">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
              <strong>{h.overdueOpportunities} oportunidades con fecha de cierre vencida</strong> — Revisar si las fechas están desactualizadas o si el pipeline necesita una limpieza.
            </Callout>
          );
        }

        if (h.staleDraftQuotations > 0) {
          alerts.push(
            <Callout key="stale-quotes" variant="warning">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
              <strong>{h.staleDraftQuotations} cotización{h.staleDraftQuotations > 1 ? "es" : ""} en borrador sin respuesta hace más de 7 días</strong> — Seguimiento pendiente con el cliente.
            </Callout>
          );
        }

        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Requieren atención</p>
                {alerts.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full leading-none">{alerts.length}</span>
                )}
              </div>
              <div className="space-y-2 max-h-67 overflow-y-auto pr-0.5">
                {alerts.length > 0 ? alerts : (
                  <Callout variant="positive">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal block mb-0.5">Todo bien</span>
                    No se detectaron alertas críticas en este período.
                  </Callout>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
                <p className="text-[11px] font-semibold text-teal uppercase tracking-wider">Puntos fuertes</p>
                {positiveCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-teal/10 text-teal px-1.5 py-0.5 rounded-full leading-none">{positiveCount}</span>
                )}
              </div>

              <div className="space-y-2 max-h-67 overflow-y-auto pr-0.5">
                {peakWeek.value > 0 && (
                  <Callout variant="info">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-0.5">Positivo</span>
                    <strong>Pico de actividad en {peakWeek.label}</strong> — {peakWeek.value} acciones registradas{peakUsers.value > 0 ? ` y ${peakUsers.value} nuevos usuarios en esa semana` : ""}. Revisar si coincide con una campaña o evento.
                  </Callout>
                )}

                {(cc.persons30d > 0 || cc.orgs30d > 0) && (
                  <Callout variant="positive">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal block mb-0.5">Muy positivo</span>
                    <strong>Crecimiento sostenido de contactos</strong> — +{cc.persons30d} personas y +{cc.orgs30d} organizaciones este mes. El pipeline tiene {cc.opportunities30d} oportunidades nuevas.
                  </Callout>
                )}

                {h.newWorkspacesThisWeek.length > 0 && (
                  <Callout variant="positive">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal block mb-0.5">Muy positivo</span>
                    <strong>{h.newWorkspacesThisWeek.length} workspace{h.newWorkspacesThisWeek.length > 1 ? "s" : ""} nuevo{h.newWorkspacesThisWeek.length > 1 ? "s" : ""} esta semana</strong> — {h.newWorkspacesThisWeek.join(", ")}. Mejor semana de crecimiento del período.
                  </Callout>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

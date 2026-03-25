"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { WaterfallChart } from "@/components/ui/charts/WaterfallChart";
import { BarChart, type BarSeries } from "@/components/ui/charts/BarChart";
import { RankingBar } from "@/components/ui/RankingBar";
import { Callout } from "@/components/ui/Callout";
import { UserActivityTable, type UserActivityRow } from "@/components/dashboard/UserActivityTable";
import { brand } from "@/lib/colors";
import { AnalyticsService, type CrmUsersData, type FantasmaUser } from "@/services/analytics.service";

// ─── Datos — Tabla ────────────────────────────────────────────────────────────

const USUARIOS: UserActivityRow[] = [
  {
    id: 1,
    nombre: "Kevin Collio",
    email: "kevin.collio@goxt.io",
    workspaces: [
      { name: "CamiónGO Testeos",    role: "dueño"    },
      { name: "Experiencia GOxT",    role: "dueño"    },
      { name: "NuevoWorkspaceTesteo", role: "dueño"   },
      { name: "Southway Testeos",    role: "dueño"    },
      { name: "CamiónGO",            role: "invitado" },
      { name: "GOXT",                role: "invitado" },
      { name: "NODO OMCPL",          role: "invitado" },
      { name: "Power Skills by GOxT", role: "invitado" },
      { name: "Southway",            role: "invitado" },
    ],
    registro: "2025-12-19",
    primeraAccion: { nombre: "Reunión Programada", fecha: "2025-12-19", tipo: "actividad", workspace: "CamiónGO Testeos" },
    timeToValue: { valor: "51 min", tipo: "rapido" },
    actividadTotal: { actividades: 53, oportunidades: 52, notas: 145 },
    ultimaActividad: {
      hace: "2D",
      ultimaNota:        { fecha: "2026-03-22", workspace: "GOXT" },
      ultimaOportunidad: { fecha: "2026-03-20", workspace: "CamiónGO" },
      ultimaActividad:   { fecha: "2026-03-18", workspace: "GOXT" },
    },
  },
  {
    id: 2,
    nombre: "Angel S",
    email: "angel.silva@goxt.io",
    workspaces: [
      { name: "GOXT",             role: "invitado" },
      { name: "Southway",         role: "invitado" },
      { name: "Southway Testeos", role: "invitado" },
    ],
    registro: "2025-12-19",
    primeraAccion: { nombre: "Oportunidad GOxT", fecha: "2025-12-19", tipo: "oportunidad", workspace: "GOXT" },
    timeToValue: { valor: "ws previo", tipo: "previo" },
    actividadTotal: { actividades: 15, oportunidades: 29, notas: 143 },
    ultimaActividad: {
      hace: "4D",
      ultimaNota:        { fecha: "2026-03-19", workspace: "GOXT" },
      ultimaOportunidad: { fecha: "2026-03-18", workspace: "Southway" },
      ultimaActividad:   { fecha: "2026-03-12", workspace: "GOXT" },
    },
  },
  {
    id: 3,
    nombre: "KevinCollio27",
    email: "kevincollio27@gmail.com",
    workspaces: [
      { name: "Experiencia GOxT", role: "invitado" },
    ],
    registro: "2025-12-22",
    primeraAccion: { nombre: "Videollamada", fecha: "2026-01-05", tipo: "actividad", workspace: "Experiencia GOxT" },
    timeToValue: { valor: "14.0 días", tipo: "lento" },
    actividadTotal: { actividades: 1, oportunidades: 1, notas: 0 },
    ultimaActividad: {
      hace: "48D",
      ultimaNota:        null,
      ultimaOportunidad: { fecha: "2026-02-05", workspace: "Experiencia GOxT" },
      ultimaActividad:   { fecha: "2026-01-05", workspace: "Experiencia GOxT" },
    },
  },
  {
    id: 4,
    nombre: "Rodrigo Valdés Badilla",
    email: "rodrigovaldes@goxt.io",
    workspaces: [
      { name: "NODO OMCPL", role: "dueño"    },
      { name: "CamiónGO",   role: "invitado" },
    ],
    registro: "2025-12-22",
    primeraAccion: { nombre: "Empresa Logística Sur", fecha: "2025-12-22", tipo: "oportunidad", workspace: "NODO OMCPL" },
    timeToValue: { valor: "3 hrs", tipo: "rapido" },
    actividadTotal: { actividades: 22, oportunidades: 41, notas: 88 },
    ultimaActividad: {
      hace: "1D",
      ultimaNota:        { fecha: "2026-03-23", workspace: "NODO OMCPL" },
      ultimaOportunidad: { fecha: "2026-03-21", workspace: "CamiónGO" },
      ultimaActividad:   { fecha: "2026-03-22", workspace: "NODO OMCPL" },
    },
  },
  {
    id: 5,
    nombre: "katherine paredes",
    email: "katherineparedes25@gmail.com",
    workspaces: [],
    registro: "2025-12-24",
    primeraAccion: null,
    timeToValue: null,
    actividadTotal: { actividades: 0, oportunidades: 0, notas: 0 },
    ultimaActividad: null,
  },
  {
    id: 6,
    nombre: "Katherine Paredes",
    email: "katherine.paredes@southconnect.cl",
    workspaces: [
      { name: "Southway", role: "invitado" },
    ],
    registro: "2025-12-24",
    primeraAccion: { nombre: "Contacto inicial", fecha: "2026-01-03", tipo: "nota", workspace: "Southway" },
    timeToValue: { valor: "10.0 días", tipo: "lento" },
    actividadTotal: { actividades: 4, oportunidades: 6, notas: 12 },
    ultimaActividad: {
      hace: "15D",
      ultimaNota:        { fecha: "2026-03-09", workspace: "Southway" },
      ultimaOportunidad: { fecha: "2026-03-05", workspace: "Southway" },
      ultimaActividad:   { fecha: "2026-03-09", workspace: "Southway" },
    },
  },
  {
    id: 7,
    nombre: "Rodrigo V.",
    email: "rodrigovaldes@camiongo.com",
    workspaces: [
      { name: "CamiónGO", role: "admin" },
    ],
    registro: "2026-01-02",
    primeraAccion: { nombre: "Flota Camiones Norte", fecha: "2026-01-02", tipo: "oportunidad", workspace: "CamiónGO" },
    timeToValue: { valor: "2 hrs", tipo: "rapido" },
    actividadTotal: { actividades: 18, oportunidades: 34, notas: 67 },
    ultimaActividad: {
      hace: "3D",
      ultimaNota:        { fecha: "2026-03-21", workspace: "CamiónGO" },
      ultimaOportunidad: { fecha: "2026-03-20", workspace: "CamiónGO" },
      ultimaActividad:   { fecha: "2026-03-19", workspace: "CamiónGO" },
    },
  },
  {
    id: 8,
    nombre: "Desde la Raíz",
    email: "talleresdesdelaraiz@gmail.com",
    workspaces: [
      { name: "Desde La Raíz", role: "dueño" },
    ],
    registro: "2026-01-02",
    primeraAccion: { nombre: "Taller Mayo 2026", fecha: "2026-01-04", tipo: "oportunidad", workspace: "Desde La Raíz" },
    timeToValue: { valor: "2.0 días", tipo: "lento" },
    actividadTotal: { actividades: 7, oportunidades: 14, notas: 19 },
    ultimaActividad: {
      hace: "9D",
      ultimaNota:        { fecha: "2026-03-15", workspace: "Desde La Raíz" },
      ultimaOportunidad: { fecha: "2026-03-12", workspace: "Desde La Raíz" },
      ultimaActividad:   { fecha: "2026-03-14", workspace: "Desde La Raíz" },
    },
  },
  {
    id: 9,
    nombre: "David Serrano",
    email: "desarrollo@camiongo.com",
    workspaces: [
      { name: "CamiónGO",   role: "admin"    },
      { name: "NODO OMCPL", role: "invitado" },
    ],
    registro: "2026-01-05",
    primeraAccion: { nombre: "Cotización Logística", fecha: "2026-01-05", tipo: "cotización", workspace: "CamiónGO" },
    timeToValue: { valor: "45 min", tipo: "rapido" },
    actividadTotal: { actividades: 31, oportunidades: 28, notas: 74 },
    ultimaActividad: {
      hace: "6D",
      ultimaNota:        { fecha: "2026-03-18", workspace: "CamiónGO" },
      ultimaOportunidad: { fecha: "2026-03-16", workspace: "NODO OMCPL" },
      ultimaActividad:   { fecha: "2026-03-17", workspace: "CamiónGO" },
    },
  },
  {
    id: 10,
    nombre: "Valentina Ríos",
    email: "v.rios@goxt.cl",
    workspaces: [
      { name: "GOXT",    role: "invitado" },
      { name: "Southway", role: "invitado" },
    ],
    registro: "2026-01-12",
    primeraAccion: { nombre: "Reunión de ventas", fecha: "2026-01-12", tipo: "actividad", workspace: "GOXT" },
    timeToValue: { valor: "1 hr", tipo: "rapido" },
    actividadTotal: { actividades: 28, oportunidades: 19, notas: 55 },
    ultimaActividad: {
      hace: "5D",
      ultimaNota:        { fecha: "2026-03-19", workspace: "GOXT" },
      ultimaOportunidad: { fecha: "2026-03-15", workspace: "Southway" },
      ultimaActividad:   { fecha: "2026-03-18", workspace: "GOXT" },
    },
  },
  {
    id: 11,
    nombre: "Sofía Morales",
    email: "smorales@southway.com",
    workspaces: [
      { name: "Southway", role: "admin" },
    ],
    registro: "2026-01-19",
    primeraAccion: { nombre: "Nuevo cliente Southway", fecha: "2026-01-20", tipo: "oportunidad", workspace: "Southway" },
    timeToValue: { valor: "1.0 días", tipo: "rapido" },
    actividadTotal: { actividades: 12, oportunidades: 23, notas: 41 },
    ultimaActividad: {
      hace: "8D",
      ultimaNota:        { fecha: "2026-03-16", workspace: "Southway" },
      ultimaOportunidad: { fecha: "2026-03-14", workspace: "Southway" },
      ultimaActividad:   { fecha: "2026-03-15", workspace: "Southway" },
    },
  },
  {
    id: 12,
    nombre: "Andrés Molina",
    email: "amolina@goxt.cl",
    workspaces: [
      { name: "GOXT",     role: "admin"    },
      { name: "CamiónGO", role: "invitado" },
    ],
    registro: "2026-03-01",
    primeraAccion: { nombre: "Demo plataforma", fecha: "2026-03-01", tipo: "actividad", workspace: "GOXT" },
    timeToValue: { valor: "30 min", tipo: "rapido" },
    actividadTotal: { actividades: 8, oportunidades: 5, notas: 11 },
    ultimaActividad: {
      hace: "2D",
      ultimaNota:        { fecha: "2026-03-22", workspace: "GOXT" },
      ultimaOportunidad: { fecha: "2026-03-20", workspace: "CamiónGO" },
      ultimaActividad:   { fecha: "2026-03-22", workspace: "GOXT" },
    },
  },
  {
    id: 13,
    nombre: "Tomás Herrera",
    email: "therrera@outlook.com",
    workspaces: [],
    registro: "2026-03-15",
    primeraAccion: null,
    timeToValue: null,
    actividadTotal: { actividades: 0, oportunidades: 0, notas: 0 },
    ultimaActividad: null,
  },
];

// ─── Datos — Ranking ──────────────────────────────────────────────────────────

const RANKING_SERIES: BarSeries[] = [
  { key: "actividades",   label: "Actividades",   color: "#3B82F6", tooltip: "Crear, editar, completar o eliminar actividades en oportunidades (reuniones, llamadas, tareas)" },
  { key: "oportunidades", label: "Oportunidades", color: "#10B981", tooltip: "Crear, actualizar, cambiar etapa, ganar, perder o eliminar oportunidades en el pipeline" },
  { key: "notas",         label: "Notas",         color: "#F59E0B", tooltip: "Notas creadas en cualquier entidad: oportunidades, contactos, organizaciones o actividades" },
  { key: "cotizaciones",  label: "Cotizaciones",  color: "#A78BFA", tooltip: "Crear, editar, enviar o eliminar cotizaciones" },
  { key: "otros",         label: "Otros",         color: "#E5E7EB", tooltip: "Acciones en contactos, organizaciones, documentos, configuración de workspace y otras entidades del sistema" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

// ─── Helpers — Usuarios fantasma ──────────────────────────────────────────────

type UrgenciaTipo = FantasmaUser["urgencia"];

const URGENCIA_BADGE: Record<UrgenciaTipo, string> = {
  "crítico":   "bg-red-50 text-red-700",
  "en riesgo": "bg-amber-50 text-amber-700",
  "observar":  "bg-gray-100 text-gray-600",
  "nuevo":     "bg-blue-50 text-blue-700",
};

const URGENCIA_BAR: Record<UrgenciaTipo, string> = {
  "crítico":   "#E24B4A",
  "en riesgo": "#F59E0B",
  "observar":  "#9CA3AF",
  "nuevo":     "#3B82F6",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROL_BADGE: Record<string, string> = {
  dueño:    "bg-orange-50 text-orange-700",
  admin:    "bg-blue-50 text-blue-700",
  invitado: "bg-teal/10 text-teal",
};

const ROL_LABEL: Record<string, string> = {
  dueño:    "Dueño",
  admin:    "Admin",
  invitado: "Invitado",
};

function getRolPrincipal(workspaces: Array<{ role: string }>): string | null {
  if (workspaces.some((w) => w.role === "dueño"))    return "dueño";
  if (workspaces.some((w) => w.role === "admin"))    return "admin";
  if (workspaces.some((w) => w.role === "invitado")) return "invitado";
  return null;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 animate-pulse space-y-2.5">
      <div className="h-3 w-28 bg-gray-200 rounded" />
      <div className="h-7 w-20 bg-gray-200 rounded" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmUsuarios() {
  const [data, setData] = useState<CrmUsersData | null>(null);

  useEffect(() => {
    AnalyticsService.getCrmUsers()
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── KPIs ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!data ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (() => {
          const u = data.userStats;
          const activationBadgeLabel = u.activationDelta != null
            ? `${u.activationDelta > 0 ? "+" : ""}${u.activationDelta}% vs mes anterior`
            : undefined;
          const activationBadgeVariant = u.activationDelta != null
            ? (u.activationDelta >= 0 ? "positive" as const : "negative" as const)
            : "neutral" as const;
          return (
            <>
              <StatCard title="Total registrados" value={u.total} subtitle="desde el inicio" />
              <StatCard
                title="Activos (30d)"
                value={u.active30d}
                badge={{ label: `+${u.newThisWeek} esta semana`, variant: "positive" }}
              />
              <StatCard
                title="Tasa de activación"
                value={`${u.activationPct}%`}
                badge={activationBadgeLabel
                  ? { label: activationBadgeLabel, variant: activationBadgeVariant }
                  : undefined}
              />
              <StatCard
                title="Sin workspace"
                value={data.usersWithoutWorkspace}
                badge={{ label: "fricción en onboarding", variant: "negative" }}
              />
            </>
          );
        })()}
      </div>

      {/* ── Grid: Cascada + Directorio ── */}
      <div className="grid grid-cols-2 gap-4 h-77.5">

        <ChartCard title="Crecimiento acumulado de usuarios" fillHeight>
          {data?.cascada ? (
            <WaterfallChart
              data={[...data.cascada, { label: "Total", value: data.userStats.total }]}
              height={220}
              color={brand.teal}
              showTotal={true}
              yLabel="Usuarios"
            />
          ) : (
            <div className="h-52 animate-pulse bg-gray-100 rounded" />
          )}
        </ChartCard>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Directorio de usuarios</p>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Registrado</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace(s)</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(data?.directorio ?? []).map((u) => {
                  const rol = getRolPrincipal(u.workspaces);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-2.5">
                        <p className="text-[13px] font-medium text-gray-800 leading-none">{u.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{u.email}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[12px] text-gray-600 whitespace-nowrap">{u.createdAt}</span>
                      </td>
                      <td className="px-4 py-2.5 max-w-40">
                        <span className={`text-[12px] truncate block ${u.workspaces.length > 0 ? "text-gray-600" : "text-gray-300"}`}>
                          {u.workspaces.length > 0 ? u.workspaces.map((w) => w.name).join(" · ") : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {rol ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${ROL_BADGE[rol]}`}>
                            {ROL_LABEL[rol]}
                          </span>
                        ) : (
                          <span className="text-[12px] text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Ranking de actividad ── */}
      <SectionLabel>Ranking de actividad</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!data ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (() => {
          const rs = data.rankingStats;
          const powerPct = data.userStats.total > 0 ? Math.round(rs.powerUsers / data.userStats.total * 100) : 0;
          const powerUserNames = data.ranking
            .filter(r => r.total >= 100)
            .map(r => r.name.split(" ")[0])
            .join(", ");
          return (
            <>
              <StatCard
                title="Power users (100+ acciones)"
                value={rs.powerUsers}
                subtitle={`${powerPct}% del total de usuarios`}
                tooltip={powerUserNames ? `Usuarios con ≥100 acciones en workspaces reales: ${powerUserNames}` : undefined}
              />
              <StatCard title="Acciones totales"             value={rs.totalActions.toLocaleString("es-CL")} subtitle="entre todos los usuarios" />
              <StatCard title="Top 3 concentran"             value={`${rs.top3Pct}%`} subtitle="de toda la actividad" />
              <StatCard title="Con 0 acciones"               value={rs.zeroActionUsers} badge={{ label: "nunca usaron el sistema", variant: "negative" }} />
            </>
          );
        })()}
      </div>

      {(() => {
        const rankingChartData = (data?.ranking ?? []).map(r => {
          const parts = r.name.split(" ");
          const otros = Math.max(0, r.total - r.actividades - r.oportunidades - r.notas - r.cotizaciones);
          return {
            nombre:        parts[0] + (parts[1] ? " " + parts[1][0] + "." : ""),
            actividades:   r.actividades,
            oportunidades: r.oportunidades,
            notas:         r.notas,
            cotizaciones:  r.cotizaciones,
            otros,
          };
        });
        const rankingMax = Math.max(...(data?.ranking ?? []).map(r => r.total), 1);

        return (
          <div className="grid grid-cols-2 gap-4 h-100">
            <ChartCard title="Distribución visual de acciones (top 9)" fillHeight>
              {data ? (
                <BarChart data={rankingChartData} series={RANKING_SERIES} xKey="nombre" height={300} mode="stacked" />
              ) : (
                <div className="h-72 animate-pulse bg-gray-100 rounded" />
              )}
            </ChartCard>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
                <p className="text-sm font-medium text-gray-700">Ranking completo</p>
              </div>
              <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-8">#</th>
                      <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                      <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Desglose</th>
                      <th className="px-4 py-2.5 text-left   text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(data?.ranking ?? []).map((r, i) => (
                      <tr key={r.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-2.5 text-center">
                          {i < 3
                            ? <span className="text-base">{MEDALS[i]}</span>
                            : <span className="text-[12px] font-medium text-gray-400">{i + 1}</span>
                          }
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-[13px] font-medium text-gray-800 leading-none">{r.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{r.email}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <span className="text-[11px] text-gray-500 whitespace-nowrap flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500   inline-block" />{r.actividades} acts</span>
                            <span className="text-[11px] text-gray-500 whitespace-nowrap flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />{r.oportunidades} opps</span>
                            <span className="text-[11px] text-gray-500 whitespace-nowrap flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400  inline-block" />{r.notas} notas</span>
                            <span className="text-[11px] text-gray-500 whitespace-nowrap flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-400  inline-block" />{r.cotizaciones} cots</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-[17px] font-semibold text-gray-800 leading-none">{r.total}</p>
                          <div className="mt-1 h-1 bg-gray-100 rounded overflow-hidden w-20">
                            <div className="h-full rounded" style={{ width: `${Math.round(r.total / rankingMax * 100)}%`, background: "linear-gradient(to right, #1D9E75, #468189)" }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Actividad por usuario ── */}
      <SectionLabel>Actividad por usuario</SectionLabel>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <UserActivityTable data={USUARIOS} pageSize={8} />
      </div>

      {/* ── Time to Value ── */}
      <SectionLabel>Time to value</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        {!data ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (() => {
          const tv = data.ttvStats;
          return (
            <>
              <StatCard title="Mismo día (< 24h)"  value={tv.sameDay}       badge={{ label: "adopción inmediata", variant: "positive" }} />
              <StatCard title="Entre 1 y 7 días"   value={tv.oneToSeven}    badge={{ label: "adopción media",     variant: "neutral"  }} />
              <StatCard title="Más de 7 días"      value={tv.moreThanSeven} badge={{ label: "adopción lenta",     variant: "negative" }} />
              <StatCard title="Sin actividad aún"  value={tv.neverActed}    badge={{ label: "nunca activaron",    variant: "negative" }} />
            </>
          );
        })()}
      </div>

      <ChartCard title="Distribución de adopción por velocidad" subtitle="Usuarios agrupados por tiempo hasta primera acción">
        {data ? (
          <RankingBar items={[
            { label: "Mismo día (< 24h)", value: data.ttvStats.sameDay,       color: "#1D9E75" },
            { label: "1 a 7 días",        value: data.ttvStats.oneToSeven,    color: "#F59E0B" },
            { label: "Más de 7 días",     value: data.ttvStats.moreThanSeven, color: "#EF4444" },
            { label: "Sin actividad aún", value: data.ttvStats.neverActed,    color: "#9CA3AF" },
          ]} />
        ) : (
          <div className="h-20 animate-pulse bg-gray-100 rounded" />
        )}
      </ChartCard>

      {/* ── Usuarios fantasma ── */}
      <SectionLabel>Usuarios fantasma</SectionLabel>

      <div className="grid grid-cols-3 gap-4">
        {!data ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (() => {
          const fs = data.fantasmaStats;
          return (
            <>
              <StatCard title="Usuarios fantasma"    value={fs.total}         subtitle={`de ${data.userStats.active} usuarios activos`} />
              <StatCard title="Críticos (+30 días)"  value={fs.criticos}      badge={{ label: "sin actividad crítica",         variant: "negative" }} />
              <StatCard title="Con workspace propio" value={fs.withWorkspace} badge={{ label: "crearon ws, nunca lo usaron",   variant: "warning"  }} />
            </>
          );
        })()}
      </div>

      {(() => {
        const fantasmas = data?.fantasmas ?? [];
        const urgenciaMax = Math.max(...fantasmas.map(f => f.daysSinceAction), 1);
        return (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Registro</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Días sin actividad</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Urgencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fantasmas.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-gray-800 leading-none">{f.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{f.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      {f.primaryWorkspace ? (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${f.primaryRole === "dueño" ? "bg-orange-50 text-orange-700" : "bg-teal/10 text-teal"}`}>
                          {f.primaryRole === "dueño" ? "👑" : "◎"} {f.primaryWorkspace}
                        </span>
                      ) : (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">sin workspace</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] text-gray-600 whitespace-nowrap">{f.registro}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold mb-1 ${URGENCIA_BADGE[f.urgencia]}`}>
                        {f.daysSinceAction} {f.daysSinceAction === 1 ? "día" : "días"}
                      </span>
                      <div className="w-32 h-1 bg-gray-100 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${Math.round(f.daysSinceAction / urgenciaMax * 100)}%`, background: URGENCIA_BAR[f.urgencia] }} />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${URGENCIA_BADGE[f.urgencia]}`}>
                        {f.urgencia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* ── Alertas de usuarios ── */}
      <SectionLabel>Alertas de usuarios</SectionLabel>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Requieren atención</p>
          </div>
          <Callout variant="negative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crítico</span>
            <strong>Eduardo Araya (earaya@copec.cl)</strong> lleva 30 días sin actividad y es dueño del workspace <strong>Copec S.A.</strong> — creó la cuenta, creó el workspace, y nunca hizo nada. Caso más urgente para re-engagement.
          </Callout>
          <Callout variant="negative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crítico</span>
            <strong>2 usuarios sin workspace llevan más de 75 días sin actividad</strong> — katherine paredes (89d) y Gabriel Orellana (75d) nunca fueron asignados a un workspace. Probable abandono definitivo.
          </Callout>
          <Callout variant="warning">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
            <strong>7 usuarios fantasma representan el 17% del total activo</strong> — 3 de ellos tienen workspace propio que nunca usaron. Revisar proceso de onboarding y flujo de invitación.
          </Callout>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
            <p className="text-[11px] font-semibold text-teal uppercase tracking-wider">Puntos fuertes</p>
          </div>
          <Callout variant="positive">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal block mb-0.5">Muy positivo</span>
            <strong>9 usuarios activaron el mismo día del registro</strong> — Time to value inmediato en el 28% de los usuarios activos. Kevin Collio (51 min), Rodrigo V. (5 min) y Luis Sandoval (4 min) lideran el ranking de activación.
          </Callout>
          <Callout variant="info">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-0.5">Positivo</span>
            <strong>Kevin Collio y Angel S concentran 542 acciones entre los dos</strong> — 35% de toda la actividad del sistema. Ambos son usuarios de alta frecuencia con actividad diaria consistente.
          </Callout>
        </div>
      </div>

    </div>
  );
}

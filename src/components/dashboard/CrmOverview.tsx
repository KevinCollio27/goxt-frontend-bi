"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { MiniBarChart, type MiniBarItem } from "@/components/ui/charts/MiniBarChart";
import { RankingBar, type RankingBarItem } from "@/components/ui/RankingBar";
import { PipelineBar, type PipelineBarItem } from "@/components/ui/PipelineBar";
import { Callout } from "@/components/ui/Callout";
import { brand } from "@/lib/colors";

// ─── Usuarios — datos ─────────────────────────────────────────────────────────

const WEEKLY_NEW_USERS: MiniBarItem[] = [
  { label: "S1",  value: 5 },
  { label: "S2",  value: 8 },
  { label: "S3",  value: 3 },
  { label: "S4",  value: 6 },
  { label: "S5",  value: 9 },
  { label: "S6",  value: 4 },
  { label: "S7",  value: 11 },
  { label: "S8",  value: 7 },
  { label: "S9",  value: 6 },
  { label: "S10", value: 10 },
  { label: "S11", value: 8 },
];

const WEEKLY_ACTIVITY: MiniBarItem[] = [
  { label: "S1",  value: 312 },
  { label: "S2",  value: 478 },
  { label: "S3",  value: 295 },
  { label: "S4",  value: 541 },
  { label: "S5",  value: 603 },
  { label: "S6",  value: 421 },
  { label: "S7",  value: 689 },
  { label: "S8",  value: 512 },
  { label: "S9",  value: 447 },
  { label: "S10", value: 718 },
  { label: "S11", value: 634 },
];

// ─── Workspaces — datos ───────────────────────────────────────────────────────

const MOST_ACTIVE: RankingBarItem[] = [
  { label: "GOXT",              value: 215, color: "#468189" },
  { label: "NODO OMCPL",        value: 91,  color: "#468189" },
  { label: "Southway",          value: 74,  color: "#77ACA2" },
  { label: "Espacio Violeta 2", value: 39,  color: "#77ACA2" },
  { label: "Experiencia GOxT",  value: 33,  color: "#9DBEBB" },
  { label: "Power Skills",      value: 12,  color: "#9DBEBB" },
  { label: "Guett",             value: 12,  color: "#9DBEBB" },
  { label: "Espacio Violeta",   value: 11,  color: "#9DBEBB" },
];

const USERS_PER_WS: RankingBarItem[] = [
  { label: "NODO OMCPL",        value: 12, color: "#534AB7" },
  { label: "CamiónGO",          value: 6,  color: "#534AB7" },
  { label: "Southway",          value: 6,  color: "#7F77DD" },
  { label: "GOXT",              value: 6,  color: "#7F77DD" },
  { label: "Power Skills",      value: 4,  color: "#AFA9EC" },
  { label: "Espacio Violeta 2", value: 4,  color: "#AFA9EC" },
  { label: "Desde La Raíz",     value: 3,  color: "#CECBF6" },
  { label: "Marine Connect",    value: 3,  color: "#CECBF6" },
];

// ─── Pipeline — datos ────────────────────────────────────────────────────────

const PIPELINE_ITEMS: PipelineBarItem[] = [
  { label: "Abiertas", value: 56, color: "#378ADD" },
  { label: "Ganadas",  value: 8,  color: "#1D9E75" },
  { label: "Perdidas", value: 4,  color: "#F09595", textColor: "#501313" },
];

const CONTACTS_BARS: RankingBarItem[] = [
  { label: "Personas",       value: 105, color: brand.teal },
  { label: "Orgs",           value: 83,  color: brand.teal },
  { label: "Oportunidades",  value: 56,  color: brand.teal },
  { label: "Actividades",    value: 78,  color: brand.teal },
];

// ─── Actividad — datos ───────────────────────────────────────────────────────

const ACCIONES_FRECUENTES: RankingBarItem[] = [
  { label: "Crear",          value: 86, color: "#378ADD" },
  { label: "Actividad",      value: 84, color: "#378ADD" },
  { label: "Invitados",      value: 78, color: "#85B7EB" },
  { label: "Completar act.", value: 50, color: "#85B7EB" },
  { label: "Notas",          value: 42, color: "#B5D4F4" },
  { label: "Eliminar",       value: 42, color: "#F09595" },
  { label: "Actualizar",     value: 26, color: "#B5D4F4" },
];

const ENTIDADES_USADAS: RankingBarItem[] = [
  { label: "Oportunidades", value: 154, color: brand.teal },
  { label: "Usuarios WS",   value: 121, color: brand.teal },
  { label: "Act. oport.",   value: 78,  color: "#77ACA2" },
  { label: "Organizaciones",value: 62,  color: "#77ACA2" },
  { label: "Personas",      value: 61,  color: "#9DBEBB" },
  { label: "Workspace",     value: 18,  color: "#9DBEBB" },
  { label: "Cotizaciones",  value: 14,  color: "#9DBEBB" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmOverview() {
  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── USUARIOS ── */}
      <SectionLabel>Usuarios</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total de Usuarios" value={248} subtitle="198 activos · 50 inactivos" />
        <StatCard title="Nuevos (30d)" value={34} badge={{ label: "+8 esta semana", variant: "positive" }} />
        <StatCard title="Tasa de Activación" value="79.8%" badge={{ label: "-2.1% vs mes anterior", variant: "negative" }} />
        <StatCard title="Con actividad (30d)" value={112} subtitle="45.2% del total" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Nuevos usuarios — últimas 11 semanas" chartPadding="pt-3">
          <MiniBarChart data={WEEKLY_NEW_USERS} color={brand.teal} barAreaHeight={56} peakLabel="Pico: 11 usuarios en S7" />
        </ChartCard>
        <ChartCard title="Actividad semanal (acciones en system_log)" chartPadding="pt-3">
          <MiniBarChart data={WEEKLY_ACTIVITY} color="#185FA5" barAreaHeight={56} peakLabel="Pico: 718 acciones en S10" />
        </ChartCard>
      </div>

      {/* ── WORKSPACES ── */}
      <SectionLabel>Workspaces</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total workspaces" value={22} subtitle="desde inicio" />
        <StatCard title="Activos" value={19} badge={{ label: "86% del total", variant: "positive" }} />
        <StatCard title="Inactivos" value={3} badge={{ label: "sin actividad", variant: "negative" }} />
        <StatCard title="Con actividad (30d)" value={8} subtitle="42% de activos" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Workspaces más activos (30d)">
          <RankingBar items={MOST_ACTIVE} />
        </ChartCard>
        <ChartCard title="Usuarios por workspace (top 8)">
          <RankingBar items={USERS_PER_WS} />
        </ChartCard>
      </div>

      {/* ── PIPELINE Y VENTAS ── */}
      <SectionLabel>Pipeline y ventas</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Oportunidades abiertas" value={56} badge={{ label: "↑ 29 creadas (30d)", variant: "positive" }} />
        <StatCard title="Tasa de cierre" value="66.7%" subtitle="8 ganadas · 4 perdidas" />
        <StatCard title="Cotizaciones (30d)" value={15} subtitle="62 totales históricas" />
        <StatCard title="Leads widget IA (30d)" value={2} subtitle="4 totales históricas" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Estado del pipeline">
          <PipelineBar
            items={PIPELINE_ITEMS}
            footer={[
              { label: "Total históricas", value: "61 oportunidades" },
              { label: "Nuevas este mes",  value: 29 },
            ]}
          />
        </ChartCard>

        <ChartCard title="Contactos y organizaciones">
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-xs text-gray-400">Personas</p>
              <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">105</p>
              <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+40 este mes</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Organizaciones</p>
              <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">83</p>
              <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+23 este mes</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Oportunidades</p>
              <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">56</p>
              <p className="text-xs mt-1" style={{ color: "#1D9E75" }}>+29 este mes</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Actividades</p>
              <p className="text-2xl font-semibold text-gray-800 leading-none mt-0.5">78</p>
              <p className="text-xs mt-1 text-gray-400">act. oport. (30d)</p>
            </div>
          </div>
          <RankingBar items={CONTACTS_BARS} />
          <p className="text-[11px] text-gray-400 mt-3">38% de personas nuevas en los últimos 30 días</p>
        </ChartCard>
      </div>

      {/* ── ACTIVIDAD DEL SISTEMA ── */}
      <SectionLabel>Actividad del sistema</SectionLabel>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Acciones más frecuentes (30d)">
          <RankingBar items={ACCIONES_FRECUENTES} />
        </ChartCard>
        <ChartCard title="Entidades más usadas (30d)">
          <RankingBar items={ENTIDADES_USADAS} />
        </ChartCard>
      </div>

      {/* ── ALERTAS DE SALUD ── */}
      <SectionLabel>Alertas de salud</SectionLabel>

      <div className="grid grid-cols-2 gap-4">

        {/* Columna izquierda — Requieren atención */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">Requieren atención</p>
          </div>

          <Callout variant="negative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
            <strong>3 workspaces sin actividad en los últimos 30 días</strong> — Power Skills, Espacio Violeta y Guett no han registrado acciones. Considerar contacto de reactivación.
          </Callout>

          <Callout variant="negative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
            <strong>5 usuarios sin workspace asignado</strong> — Se registraron pero nunca fueron invitados a un workspace. Posible fricción en el onboarding.
          </Callout>

          <Callout variant="warning">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
            <strong>Tasa de activación cayó 2.1% vs mes anterior</strong> — Actualmente en 79.8%. De los 34 nuevos usuarios del último mes, 7 aún no han iniciado sesión.
          </Callout>

          <Callout variant="warning">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
            <strong>Tasa de cierre del pipeline en 66.7%</strong> — 4 oportunidades perdidas este mes. Ratio ganadas/perdidas 2:1, dentro del rango pero con tendencia a la baja.
          </Callout>
        </div>

        {/* Columna derecha — Puntos fuertes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal shrink-0" />
            <p className="text-[11px] font-semibold text-teal uppercase tracking-wider">Puntos fuertes</p>
          </div>

          <Callout variant="info">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-0.5">Positivo</span>
            <strong>Pico de actividad detectado semana del 9 mar</strong> — 718 acciones en system_log y 13 nuevos usuarios en una sola semana. Revisar si coincide con una campaña o evento.
          </Callout>

          <Callout variant="positive">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal block mb-0.5">Muy positivo</span>
            <strong>Crecimiento sostenido de contactos</strong> — +40 personas y +23 organizaciones este mes. El pipeline tiene 29 oportunidades nuevas, el mejor registro de los últimos 3 meses.
          </Callout>
        </div>

      </div>

    </div>
  );
}

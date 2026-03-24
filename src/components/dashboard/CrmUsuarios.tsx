"use client";

import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { WaterfallChart, type WaterfallItem } from "@/components/ui/charts/WaterfallChart";
import { UserActivityTable, type UserActivityRow } from "@/components/dashboard/UserActivityTable";
import { brand } from "@/lib/colors";

// ─── Datos — Cascada ──────────────────────────────────────────────────────────

const CASCADA_REGISTROS: WaterfallItem[] = [
  { label: "6 oct",  value: 2  },
  { label: "20 oct", value: 3  },
  { label: "3 nov",  value: 4  },
  { label: "17 nov", value: 5  },
  { label: "1 dic",  value: 4  },
  { label: "15 dic", value: 6  },
  { label: "22 dic", value: 9  },
  { label: "5 ene",  value: 7  },
  { label: "19 ene", value: 11 },
  { label: "2 feb",  value: 8  },
  { label: "16 feb", value: 12 },
  { label: "1 mar",  value: 15 },
  { label: "15 mar", value: 9  },
  { label: "Total",  value: 95 },
];

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

function getRolPrincipal(workspaces: UserActivityRow["workspaces"]): string | null {
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

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmUsuarios() {
  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── KPIs ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total registrados" value={248} subtitle="desde el inicio" />
        <StatCard title="Activos (30d)" value={112} badge={{ label: "+8 esta semana", variant: "positive" }} />
        <StatCard title="Tasa de activación" value="79.8%" badge={{ label: "-2.1% vs mes anterior", variant: "negative" }} />
        <StatCard title="Sin workspace" value={5} badge={{ label: "fricción en onboarding", variant: "negative" }} />
      </div>

      {/* ── Grid: Cascada + Directorio ── */}
      <div className="grid grid-cols-2 gap-4 h-77.5">

        <ChartCard title="Crecimiento acumulado de usuarios" fillHeight>
          <WaterfallChart
            data={CASCADA_REGISTROS}
            height={220}
            color={brand.teal}
            showTotal={true}
            yLabel="Usuarios"
          />
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
                {USUARIOS.map((u) => {
                  const rol = getRolPrincipal(u.workspaces);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-2.5">
                        <p className="text-[13px] font-medium text-gray-800 leading-none">{u.nombre}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{u.email}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[12px] text-gray-600 whitespace-nowrap">{u.registro}</span>
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

      {/* ── User Activity v3 ── */}
      <SectionLabel>Actividad por usuario</SectionLabel>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <UserActivityTable data={USUARIOS} pageSize={8} />
      </div>

    </div>
  );
}

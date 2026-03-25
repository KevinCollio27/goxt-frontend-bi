"use client";

import { Fragment } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { WaterfallChart, type WaterfallItem } from "@/components/ui/charts/WaterfallChart";
import { BarChart, type BarSeries } from "@/components/ui/charts/BarChart";
import { Callout } from "@/components/ui/Callout";
import { brand } from "@/lib/colors";

// ─── Cascada de workspaces ────────────────────────────────────────────────────

const CASCADA_WS: WaterfallItem[] = [
  { label: "1 oct",  value: 2 },
  { label: "15 oct", value: 1 },
  { label: "1 nov",  value: 2 },
  { label: "15 nov", value: 1 },
  { label: "1 dic",  value: 3 },
  { label: "15 dic", value: 2 },
  { label: "1 ene",  value: 3 },
  { label: "15 ene", value: 2 },
  { label: "1 feb",  value: 2 },
  { label: "15 feb", value: 2 },
  { label: "1 mar",  value: 1 },
  { label: "15 mar", value: 1 },
  { label: "Total",  value: 22 },
];

// ─── Directorio ───────────────────────────────────────────────────────────────

type WsEstado = "activo" | "inactivo" | "nunca";

interface WsRow {
  nombre:        string;
  test:          boolean;
  dueno:         string;
  usuarios:      number;
  creado:        string;
  diasActividad: number | null;
  estado:        WsEstado;
}

const DIRECTORIO: WsRow[] = [
  { nombre: "GOXT",                    test: false, dueno: "Kevin C.",     usuarios: 6,  creado: "oct 2025", diasActividad: 4,    estado: "activo"   },
  { nombre: "NODO OMCPL",              test: false, dueno: "Rodrigo V.",   usuarios: 12, creado: "nov 2025", diasActividad: 6,    estado: "activo"   },
  { nombre: "Southway",                test: false, dueno: "Rodrigo V.",   usuarios: 6,  creado: "nov 2025", diasActividad: 5,    estado: "activo"   },
  { nombre: "Power Skills by GOxT",    test: false, dueno: "Rodrigo V.",   usuarios: 3,  creado: "dic 2025", diasActividad: 3,    estado: "activo"   },
  { nombre: "Espacio Violeta 2.0",     test: false, dueno: "Alejandro R.", usuarios: 4,  creado: "dic 2025", diasActividad: 4,    estado: "activo"   },
  { nombre: "Desde La Raíz",           test: false, dueno: "Diego S.",     usuarios: 3,  creado: "dic 2025", diasActividad: 5,    estado: "activo"   },
  { nombre: "Espacio Violeta",         test: false, dueno: "Alejandro R.", usuarios: 2,  creado: "ene 2026", diasActividad: 7,    estado: "activo"   },
  { nombre: "Guett",                   test: false, dueno: "Marco G.",     usuarios: 2,  creado: "ene 2026", diasActividad: 10,   estado: "activo"   },
  { nombre: "CamiónGO",               test: false, dueno: "Rodrigo V.",   usuarios: 5,  creado: "oct 2025", diasActividad: 55,   estado: "inactivo" },
  { nombre: "Agencia Marine Connect",  test: false, dueno: "Felipe L.",    usuarios: 3,  creado: "dic 2025", diasActividad: 38,   estado: "inactivo" },
  { nombre: "ANASTASIA",               test: false, dueno: "Ermilo V.",    usuarios: 3,  creado: "mar 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "Copec S.A.",              test: false, dueno: "Eduardo A.",   usuarios: 2,  creado: "feb 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "Dinamika",                test: false, dueno: "—",            usuarios: 1,  creado: "mar 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "RM",                      test: false, dueno: "Rodrigo M.",   usuarios: 1,  creado: "mar 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "Ramírez & Figueroa SpA.", test: false, dueno: "Luis R.",      usuarios: 1,  creado: "feb 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "Experiencia GOxT",        test: true,  dueno: "Kevin C.",     usuarios: 2,  creado: "oct 2025", diasActividad: 10,   estado: "activo"   },
  { nombre: "Southway Testeos",        test: true,  dueno: "Kevin C.",     usuarios: 2,  creado: "dic 2025", diasActividad: 69,   estado: "inactivo" },
  { nombre: "CamiónGO Testeos",       test: true,  dueno: "Kevin C.",     usuarios: 1,  creado: "oct 2025", diasActividad: null, estado: "nunca"    },
  { nombre: "NuevoWorkspaceTesteo",    test: true,  dueno: "Kevin C.",     usuarios: 1,  creado: "dic 2025", diasActividad: null, estado: "nunca"    },
  { nombre: "CamiónGO Argentina",     test: true,  dueno: "Kevin C.",     usuarios: 1,  creado: "ene 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "GOXT México",             test: true,  dueno: "Kevin C.",     usuarios: 1,  creado: "ene 2026", diasActividad: null, estado: "nunca"    },
  { nombre: "Marketfood",              test: true,  dueno: "Kevin C.",     usuarios: 1,  creado: "feb 2026", diasActividad: null, estado: "nunca"    },
];

// ─── Health Score ─────────────────────────────────────────────────────────────

type HealthCat = "saludable" | "estable" | "en riesgo" | "crítico" | "sin uso";

interface HealthRow {
  nombre:        string;
  test:          boolean;
  usuarios:      number;
  opps:          number;
  notas:         number;
  acts:          number;
  diasActividad: number | null;
  score:         number;
  cat:           HealthCat;
}

const HEALTH_MAX = 88;

const HEALTH: HealthRow[] = [
  // ── Saludables ──────────────────────────────────────────────────────────────
  { nombre: "GOXT",                    test: false, usuarios: 6,  opps: 17, notas: 131, acts: 131, diasActividad: 4,    score: 88, cat: "saludable" },
  { nombre: "NODO OMCPL",              test: false, usuarios: 12, opps: 1,  notas: 0,   acts: 0,   diasActividad: 6,    score: 65, cat: "saludable" },
  // ── En riesgo ───────────────────────────────────────────────────────────────
  { nombre: "Southway",                test: false, usuarios: 6,  opps: 9,  notas: 12,  acts: 6,   diasActividad: 5,    score: 58, cat: "en riesgo" },
  { nombre: "Espacio Violeta 2.0",     test: false, usuarios: 4,  opps: 2,  notas: 2,   acts: 1,   diasActividad: 4,    score: 49, cat: "en riesgo" },
  { nombre: "Power Skills by GOxT",    test: false, usuarios: 3,  opps: 11, notas: 1,   acts: 1,   diasActividad: 3,    score: 48, cat: "en riesgo" },
  { nombre: "Desde La Raíz",           test: false, usuarios: 3,  opps: 2,  notas: 0,   acts: 1,   diasActividad: 5,    score: 46, cat: "en riesgo" },
  { nombre: "Guett",                   test: false, usuarios: 2,  opps: 2,  notas: 0,   acts: 1,   diasActividad: 10,   score: 30, cat: "en riesgo" },
  { nombre: "Espacio Violeta",         test: false, usuarios: 2,  opps: 2,  notas: 0,   acts: 0,   diasActividad: 7,    score: 29, cat: "en riesgo" },
  { nombre: "Experiencia GOxT",        test: true,  usuarios: 2,  opps: 1,  notas: 0,   acts: 0,   diasActividad: 10,   score: 29, cat: "en riesgo" },
  { nombre: "CamiónGO",               test: false, usuarios: 5,  opps: 10, notas: 1,   acts: 2,   diasActividad: 55,   score: 22, cat: "en riesgo" },
  // ── Críticos / sin uso ───────────────────────────────────────────────────────
  { nombre: "Agencia Marine Connect",  test: false, usuarios: 3,  opps: 1,  notas: 0,   acts: 0,   diasActividad: 38,   score: 16, cat: "crítico"   },
  { nombre: "ANASTASIA",               test: false, usuarios: 3,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 6,  cat: "sin uso"   },
  { nombre: "Southway Testeos",        test: true,  usuarios: 2,  opps: 3,  notas: 0,   acts: 0,   diasActividad: 69,   score: 6,  cat: "crítico"   },
  { nombre: "Copec S.A.",              test: false, usuarios: 2,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 4,  cat: "sin uso"   },
  { nombre: "Dinamika",                test: false, usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "RM",                      test: false, usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "Ramírez & Figueroa",      test: false, usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  // ── Testeos vacíos ───────────────────────────────────────────────────────────
  { nombre: "GOXT México",             test: true,  usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "Marketfood",              test: true,  usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "CamiónGO Argentina",     test: true,  usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "CamiónGO Testeos",       test: true,  usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
  { nombre: "NuevoWorkspaceTesteo",    test: true,  usuarios: 1,  opps: 0,  notas: 0,   acts: 0,   diasActividad: null, score: 2,  cat: "sin uso"   },
];

const HEALTH_GRUPOS = [
  { label: "Saludables — score ≥ 60",       rows: HEALTH.filter((r) => r.score >= 60) },
  { label: "En riesgo — score 20–59",        rows: HEALTH.filter((r) => r.score >= 20 && r.score < 60) },
  { label: "Críticos / sin uso — score < 20", rows: HEALTH.filter((r) => r.score < 20 && (!r.test || r.opps > 0)) },
  { label: "Testeos vacíos — ignorar",       rows: HEALTH.filter((r) => r.score < 20 && r.test && r.opps === 0) },
];

// ─── Invitaciones ─────────────────────────────────────────────────────────────

const INV_BAR_DATA = [
  { ws: "NODO OMCPL",    aceptadas: 15, pendientes: 43 },
  { ws: "Exp. GOxT",     aceptadas: 8,  pendientes: 2  },
  { ws: "GOXT",          aceptadas: 5,  pendientes: 3  },
  { ws: "CamiónGO",     aceptadas: 5,  pendientes: 3  },
  { ws: "Southway",      aceptadas: 4,  pendientes: 1  },
  { ws: "EV 2.0",        aceptadas: 3,  pendientes: 0  },
  { ws: "Power Skills",  aceptadas: 3,  pendientes: 0  },
  { ws: "Marine Conn.",  aceptadas: 2,  pendientes: 0  },
  { ws: "Desde La Raíz", aceptadas: 2,  pendientes: 0  },
  { ws: "ANASTASIA",     aceptadas: 2,  pendientes: 0  },
  { ws: "Guett",         aceptadas: 1,  pendientes: 1  },
  { ws: "R&F SpA.",      aceptadas: 0,  pendientes: 2  },
  { ws: "Copec",         aceptadas: 1,  pendientes: 0  },
];

const INV_SERIES: BarSeries[] = [
  { key: "aceptadas",  label: "Aceptadas",  color: "#1D9E75" },
  { key: "pendientes", label: "Pendientes", color: "#FCA5A5" },
];

type ViralLoop = "creciendo" | "activo" | "inactivo" | "frío" | "sin uso" | "bloqueado" | "parcial" | "testeo" | "fantasma";

interface InvRow {
  pos:       number;
  workspace: string;
  test:      boolean;
  enviadas:  number;
  aceptadas: number;
  pendientes: number;
  tasa:      number;
  ultimaInv: string;
  viralLoop: ViralLoop;
}

const INV_ROWS: InvRow[] = [
  { pos: 1,  workspace: "NODO OMCPL",              test: false, enviadas: 58, aceptadas: 15, pendientes: 43, tasa: 26,  ultimaInv: "18 mar 2026", viralLoop: "creciendo" },
  { pos: 2,  workspace: "Experiencia GOxT",        test: true,  enviadas: 10, aceptadas: 8,  pendientes: 2,  tasa: 80,  ultimaInv: "18 mar 2026", viralLoop: "testeo"    },
  { pos: 3,  workspace: "GOXT",                    test: false, enviadas: 8,  aceptadas: 5,  pendientes: 3,  tasa: 63,  ultimaInv: "13 mar 2026", viralLoop: "activo"    },
  { pos: 4,  workspace: "CamiónGO",               test: false, enviadas: 8,  aceptadas: 5,  pendientes: 3,  tasa: 63,  ultimaInv: "11 mar 2026", viralLoop: "inactivo"  },
  { pos: 5,  workspace: "Southway",                test: false, enviadas: 5,  aceptadas: 4,  pendientes: 1,  tasa: 80,  ultimaInv: "17 feb 2026", viralLoop: "activo"    },
  { pos: 6,  workspace: "Espacio Violeta 2.0",     test: false, enviadas: 3,  aceptadas: 3,  pendientes: 0,  tasa: 100, ultimaInv: "18 mar 2026", viralLoop: "activo"    },
  { pos: 7,  workspace: "Power Skills by GOxT",    test: false, enviadas: 3,  aceptadas: 3,  pendientes: 0,  tasa: 100, ultimaInv: "19 mar 2026", viralLoop: "activo"    },
  { pos: 8,  workspace: "Agencia Marine Connect",  test: false, enviadas: 2,  aceptadas: 2,  pendientes: 0,  tasa: 100, ultimaInv: "09 feb 2026", viralLoop: "frío"      },
  { pos: 9,  workspace: "Desde La Raíz",           test: false, enviadas: 2,  aceptadas: 2,  pendientes: 0,  tasa: 100, ultimaInv: "18 mar 2026", viralLoop: "activo"    },
  { pos: 10, workspace: "ANASTASIA",               test: false, enviadas: 2,  aceptadas: 2,  pendientes: 0,  tasa: 100, ultimaInv: "17 mar 2026", viralLoop: "sin uso"   },
  { pos: 11, workspace: "Copec S.A.",              test: false, enviadas: 1,  aceptadas: 1,  pendientes: 0,  tasa: 100, ultimaInv: "02 mar 2026", viralLoop: "fantasma"  },
  { pos: 12, workspace: "Ramírez & Figueroa SpA.", test: false, enviadas: 2,  aceptadas: 0,  pendientes: 2,  tasa: 0,   ultimaInv: "13 feb 2026", viralLoop: "bloqueado" },
  { pos: 13, workspace: "Guett",                   test: false, enviadas: 2,  aceptadas: 1,  pendientes: 1,  tasa: 50,  ultimaInv: "13 mar 2026", viralLoop: "parcial"   },
];

// ─── Workspaces inactivos ─────────────────────────────────────────────────────

type InactivoCat   = "enfriado" | "nunca" | "testeo";
type InactivoRiesgo = "crítico" | "en riesgo" | "nuevo" | "testeo";

interface InactivoRow {
  nombre:          string;
  tipo:            "real" | "testeo";
  usuarios:        number;
  ultimaActividad: string | null;
  opps:            number;
  notas:           number;
  diasInactivo:    number | null;
  cat:             InactivoCat;
  riesgo:          InactivoRiesgo;
}

const INACTIVO_MAX_DIAS = 69;

const INACTIVOS: InactivoRow[] = [
  // ── Con actividad previa — se enfriaron ─────────────────────────────────────
  { nombre: "CamiónGO",              tipo: "real",   usuarios: 5, ultimaActividad: "27 ene 2026", opps: 10, notas: 1, diasInactivo: 54,   cat: "enfriado", riesgo: "crítico"   },
  { nombre: "Agencia Marine Connect", tipo: "real",   usuarios: 3, ultimaActividad: "12 feb 2026", opps: 1,  notas: 0, diasInactivo: 38,   cat: "enfriado", riesgo: "crítico"   },
  { nombre: "Southway Testeos",       tipo: "testeo", usuarios: 2, ultimaActividad: "12 ene 2026", opps: 3,  notas: 0, diasInactivo: 69,   cat: "enfriado", riesgo: "testeo"    },
  // ── Nunca usados ─────────────────────────────────────────────────────────────
  { nombre: "Copec S.A.",             tipo: "real",   usuarios: 2, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "nunca", riesgo: "crítico"   },
  { nombre: "ANASTASIA",              tipo: "real",   usuarios: 3, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "nunca", riesgo: "crítico"   },
  { nombre: "Dinamika",               tipo: "real",   usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: 1,    cat: "nunca", riesgo: "nuevo"     },
  { nombre: "RM",                     tipo: "real",   usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "nunca", riesgo: "en riesgo" },
  { nombre: "Ramírez & Figueroa SpA.",tipo: "real",   usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "nunca", riesgo: "en riesgo" },
  // ── Testeos — ignorar ─────────────────────────────────────────────────────────
  { nombre: "GOXT México",            tipo: "testeo", usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "testeo", riesgo: "testeo" },
  { nombre: "Marketfood",             tipo: "testeo", usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "testeo", riesgo: "testeo" },
  { nombre: "CamiónGO Testeos",      tipo: "testeo", usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "testeo", riesgo: "testeo" },
  { nombre: "CamiónGO Argentina",    tipo: "testeo", usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "testeo", riesgo: "testeo" },
  { nombre: "NuevoWorkspaceTesteo",   tipo: "testeo", usuarios: 1, ultimaActividad: null, opps: 0, notas: 0, diasInactivo: null, cat: "testeo", riesgo: "testeo" },
];

const INACTIVO_GRUPOS = [
  { label: "Con actividad previa — se enfriaron",   rows: INACTIVOS.filter((r) => r.cat === "enfriado") },
  { label: "Nunca usados — creados pero vacíos",    rows: INACTIVOS.filter((r) => r.cat === "nunca")    },
  { label: "Workspaces de testeo — ignorar",        rows: INACTIVOS.filter((r) => r.cat === "testeo")   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 60) return "#1D9E75";
  if (score >= 40) return "#378ADD";
  if (score >= 20) return "#F59E0B";
  return "#E24B4A";
}

function healthCatClass(cat: HealthCat): string {
  switch (cat) {
    case "saludable": return "bg-green-50 text-green-700";
    case "estable":   return "bg-blue-50 text-blue-700";
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
    case "testeo":    return "bg-gray-100 text-gray-500";
    case "fantasma":  return "bg-red-50 text-red-700";
  }
}

function riesgoBadgeClass(riesgo: InactivoRiesgo): string {
  switch (riesgo) {
    case "crítico":   return "bg-red-50 text-red-700";
    case "en riesgo": return "bg-amber-50 text-amber-700";
    case "nuevo":     return "bg-blue-50 text-blue-700";
    case "testeo":    return "bg-gray-100 text-gray-500";
  }
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pt-1">
      {children}
    </p>
  );
}

// Separador de grupo para tablas
function SepRow({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr className="bg-gray-50/80">
      <td
        colSpan={colSpan}
        className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-y border-gray-100"
      >
        {label}
      </td>
    </tr>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CrmWorkspaces() {
  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── MÉTRICAS GENERALES ── */}
      <SectionLabel>Métricas generales</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total workspaces"         value={22}   subtitle="desde el inicio" />
        <StatCard title="Activos (30d)"             value={9}    badge={{ label: "41% del total",      variant: "positive" }} />
        <StatCard title="Score promedio de salud"   value={23}   subtitle="sobre 100 posibles" />
        <StatCard title="Invitaciones pendientes"   value={57}   badge={{ label: "tasa global 49%",    variant: "warning"  }} />
      </div>

      <div className="grid grid-cols-2 gap-4 h-77.5">

        <ChartCard title="Crecimiento acumulado de workspaces" fillHeight>
          <WaterfallChart
            data={CASCADA_WS}
            height={220}
            color={brand.tealMuted}
            showTotal
            yLabel="Workspaces"
          />
        </ChartCard>

        {/* Directorio */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Directorio de workspaces</p>
          </div>
          <div className="overflow-y-auto flex-1">
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
                {DIRECTORIO.map((ws) => (
                  <tr key={ws.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-medium text-gray-800 leading-none">{ws.nombre}</p>
                        {ws.test && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">test</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px] text-gray-500">{ws.dueno}</span>
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
                        ws.estado === "activo"   ? "bg-green-50 text-green-700" :
                        ws.estado === "inactivo" ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {ws.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── HEALTH SCORE ── */}
      <SectionLabel>Health Score</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Saludables"          value={2}  badge={{ label: "score ≥ 60",     variant: "positive" }} />
        <StatCard title="En riesgo"           value={8}  badge={{ label: "score 20–59",    variant: "warning"  }} />
        <StatCard title="Críticos / sin uso"  value={12} badge={{ label: "score < 20",     variant: "negative" }} />
        <StatCard title="Score promedio"      value={23} subtitle="sobre 100 · todos los workspaces" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Ranking por health score</p>
          <p className="text-xs text-gray-400 mt-0.5">Actividad (40 pts) · Contenido (35 pts) · Usuarios (25 pts)</p>
        </div>
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
            {HEALTH_GRUPOS.map((grupo, gi) => (
              <Fragment key={gi}>
                <SepRow label={grupo.label} colSpan={7} />
                {grupo.rows.map((r, i) => {
                  const pct  = Math.round((r.score / HEALTH_MAX) * 100);
                  const color = scoreColor(r.score);
                  const diasStr =
                    r.diasActividad === null ? "—" :
                    r.diasActividad <= 7     ? `hace ${r.diasActividad}d` :
                    r.diasActividad <= 30    ? `hace ${r.diasActividad}d` :
                    `hace ${r.diasActividad}d`;
                  const diasColor =
                    r.diasActividad === null ? "text-gray-300" :
                    r.diasActividad <= 7     ? "text-green-600" :
                    r.diasActividad <= 30    ? "text-amber-600" :
                    "text-red-600";

                  return (
                    <tr key={r.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-center text-[12px] text-gray-400 font-medium">
                        {gi * 100 + i + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13px] font-medium text-gray-800 leading-none">{r.nombre}</p>
                          {r.test && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">test</span>
                          )}
                        </div>
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
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />{r.acts} acts
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
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${healthCatClass(r.cat)}`}>
                          {r.cat}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── INVITACIONES ── */}
      <SectionLabel>Invitaciones</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total enviadas"   value={112} subtitle="desde 17 workspaces" />
        <StatCard title="Aceptadas"        value={55}  badge={{ label: "tasa global 49%",    variant: "positive" }} />
        <StatCard title="Pendientes"       value={57}  badge={{ label: "sin respuesta aún",  variant: "warning"  }} />
        <StatCard title="Sin invitar"      value={5}   badge={{ label: "de 22 workspaces",   variant: "negative" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Aceptadas vs. pendientes por workspace" chartPadding="pt-3">
          <BarChart
            data={INV_BAR_DATA}
            series={INV_SERIES}
            xKey="ws"
            height={240}
            mode="stacked"
          />
        </ChartCard>

        {/* Tabla ranking invitaciones */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Ranking por workspace</p>
          </div>
          <div className="overflow-y-auto flex-1">
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
                {INV_ROWS.map((row) => (
                  <tr key={row.pos} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 text-center text-[12px] text-gray-400 font-medium">{row.pos}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-medium text-gray-800 leading-none">{row.workspace}</p>
                        {row.test && (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">test</span>
                        )}
                      </div>
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
          </div>
        </div>

      </div>

      {/* ── WORKSPACES INACTIVOS ── */}
      <SectionLabel>Workspaces inactivos</SectionLabel>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Workspaces sin actividad — ordenados por urgencia</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Workspace</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuarios</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Última actividad</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Opps / Notas</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Días inactivo</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {INACTIVO_GRUPOS.map((grupo, gi) => (
              <Fragment key={gi}>
                <SepRow label={grupo.label} colSpan={7} />
                {grupo.rows.map((r) => (
                  <tr key={r.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <p className="text-[13px] font-medium text-gray-800">{r.nombre}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        r.tipo === "real" ? "bg-teal/10 text-teal" : "bg-amber-50 text-amber-700"
                      }`}>
                        {r.tipo === "real" ? "cliente real" : "testeo"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                        {r.usuarios} usuario{r.usuarios !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-gray-500 whitespace-nowrap">
                      {r.ultimaActividad ?? <span className="text-gray-300">—</span>}
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
                      {r.diasInactivo === null ? (
                        <span className="text-[12px] text-gray-300">nunca</span>
                      ) : (
                        <div>
                          <p className="text-[13px] font-medium text-gray-700">{r.diasInactivo} días</p>
                          <div className="mt-0.5 h-1 rounded bg-gray-100 overflow-hidden w-20">
                            <div
                              className="h-full rounded"
                              style={{
                                width: `${(r.diasInactivo / INACTIVO_MAX_DIAS) * 100}%`,
                                background: r.riesgo === "testeo" ? "#9CA3AF" : "#E24B4A",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${riesgoBadgeClass(r.riesgo)}`}>
                        {r.riesgo}
                      </span>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Callouts de insight */}
      <div className="grid grid-cols-2 gap-4">
        <Callout variant="negative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Crisis</span>
          <strong>4 workspaces reales críticos</strong> — CamiónGO (54 días sin actividad, 5 usuarios), Agencia Marine Connect (38 días), Copec S.A. y ANASTASIA (nunca usaron nada). Juntos suman <strong>13 usuarios reales que no están usando el sistema</strong>.
        </Callout>
        <Callout variant="warning">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Alerta</span>
          <strong>NODO OMCPL tiene 43 invitaciones pendientes</strong> — La tasa de aceptación es solo del 26%, pero el volumen es enorme comparado con el resto. Las 43 pendientes son una oportunidad directa de reactivación si se hace seguimiento.
        </Callout>
      </div>

    </div>
  );
}

"use client";

import { Fragment } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { RankingBar, type RankingBarItem } from "@/components/ui/RankingBar";
import { BarChart, type BarSeries } from "@/components/ui/charts/BarChart";
import { Callout } from "@/components/ui/Callout";
import { semanticColors } from "@/lib/colors";

// ─── Feature adoption matrix ──────────────────────────────────────────────────

interface WsFeatureRow {
  nombre: string;
  test:   boolean;
  opps:   boolean;
  notas:  boolean;
  acts:   boolean;
  cots:   boolean;
  email:  boolean;
  aiExt:  boolean;
  aiInt:  boolean;
  forms:  boolean;
  invit:  boolean;
  score:  number;
  grupo:  "alta" | "media" | "baja" | "cero" | "testeo";
}

const _RAW: Omit<WsFeatureRow, "score" | "grupo">[] = [
  { nombre: "GOXT",                    test: false, opps: true,  notas: true,  acts: true,  cots: true,  email: true,  aiExt: true,  aiInt: true,  forms: false, invit: true  },
  { nombre: "Southway",                test: false, opps: true,  notas: true,  acts: true,  cots: true,  email: true,  aiExt: false, aiInt: true,  forms: false, invit: true  },
  { nombre: "Power Skills",            test: false, opps: true,  notas: true,  acts: true,  cots: false, email: false, aiExt: false, aiInt: false, forms: true,  invit: true  },
  { nombre: "CamiónGO",               test: false, opps: true,  notas: true,  acts: true,  cots: true,  email: false, aiExt: false, aiInt: true,  forms: false, invit: true  },
  { nombre: "NODO OMCPL",             test: false, opps: true,  notas: false, acts: false, cots: false, email: false, aiExt: true,  aiInt: false, forms: true,  invit: true  },
  { nombre: "Espacio Violeta 2.0",    test: false, opps: true,  notas: true,  acts: true,  cots: true,  email: true,  aiExt: true,  aiInt: false, forms: true,  invit: true  },
  { nombre: "Desde La Raíz",          test: false, opps: true,  notas: false, acts: true,  cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "Espacio Violeta",        test: false, opps: true,  notas: false, acts: false, cots: true,  email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "Guett",                  test: false, opps: true,  notas: false, acts: true,  cots: true,  email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "Agencia Marine Connect", test: false, opps: true,  notas: false, acts: false, cots: true,  email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "ANASTASIA",              test: false, opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: true,  forms: false, invit: true  },
  { nombre: "Copec S.A.",             test: false, opps: false, notas: false, acts: false, cots: false, email: false, aiExt: true,  aiInt: true,  forms: false, invit: true  },
  { nombre: "RM",                     test: false, opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: false },
  { nombre: "Ramírez & Figueroa",     test: false, opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "Dinamika",               test: false, opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: false },
  { nombre: "Experiencia GOxT",       test: true,  opps: true,  notas: false, acts: true,  cots: true,  email: true,  aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "Southway Testeos",       test: true,  opps: true,  notas: false, acts: false, cots: true,  email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "CamiónGO Testeos",      test: true,  opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
  { nombre: "GOXT México",            test: true,  opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: false },
  { nombre: "Marketfood",             test: true,  opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: false },
  { nombre: "CamiónGO Argentina",    test: true,  opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: false },
  { nombre: "NuevoWsTesteo",          test: true,  opps: false, notas: false, acts: false, cots: false, email: false, aiExt: false, aiInt: false, forms: false, invit: true  },
];

const WS_FEATURES: WsFeatureRow[] = _RAW.map((r) => {
  const score = [r.opps, r.notas, r.acts, r.cots, r.email, r.aiExt, r.aiInt, r.forms, r.invit]
    .filter(Boolean).length;
  const grupo: WsFeatureRow["grupo"] = r.test
    ? "testeo"
    : score >= 6 ? "alta"
    : score >= 3 ? "media"
    : score >= 1 ? "baja"
    : "cero";
  return { ...r, score, grupo };
});

const FEATURE_GRUPOS = [
  { label: "Alta adopción — 6 o más features",  rows: WS_FEATURES.filter((r) => r.grupo === "alta")   },
  { label: "Adopción media — 3 a 5 features",   rows: WS_FEATURES.filter((r) => r.grupo === "media")  },
  { label: "Adopción baja — 1 a 2 features",    rows: WS_FEATURES.filter((r) => r.grupo === "baja")   },
  { label: "Sin uso real",                       rows: WS_FEATURES.filter((r) => r.grupo === "cero")   },
  { label: "Workspaces de testeo",               rows: WS_FEATURES.filter((r) => r.grupo === "testeo") },
];

const FEATURE_RANKING: RankingBarItem[] = [
  { label: "Invitaciones — 87% (13 WS)",  value: 87, color: semanticColors.positive.bar },
  { label: "Oportunidades — 67% (10 WS)", value: 67, color: semanticColors.positive.bar },
  { label: "Actividades — 47% (7 WS)",    value: 47, color: semanticColors.info.bar     },
  { label: "Cotizaciones — 47% (7 WS)",   value: 47, color: semanticColors.info.bar     },
  { label: "Notas — 33% (5 WS)",          value: 33, color: semanticColors.info.bar     },
  { label: "AI interno — 33% (5 WS)",     value: 33, color: semanticColors.info.bar     },
  { label: "AI externo — 27% (4 WS)",     value: 27, color: semanticColors.warning.bar  },
  { label: "Email — 20% (3 WS)",          value: 20, color: semanticColors.warning.bar  },
  { label: "Forms — 20% (3 WS)",          value: 20, color: semanticColors.warning.bar  },
];

// ─── AI Widget ────────────────────────────────────────────────────────────────

const AI_BAR_DATA = [
  { ws: "GOXT",        ext: 120, int: 2 },
  { ws: "NODO OMCPL",  ext: 50,  int: 0 },
  { ws: "Copec S.A.",  ext: 12,  int: 4 },
  { ws: "Southway",    ext: 0,   int: 6 },
  { ws: "CamiónGO",   ext: 0,   int: 2 },
  { ws: "ANASTASIA",   ext: 0,   int: 2 },
  { ws: "EV 2.0",      ext: 2,   int: 0 },
];

const AI_SERIES: BarSeries[] = [
  { key: "ext", label: "Widget externo",    color: "#378ADD" },
  { key: "int", label: "Asistente interno", color: "#1D9E75" },
];

interface AiRankRow {
  pos:       number;
  nombre:    string;
  extConvos: number;
  intConvos: number;
  mensajes:  number;
  msgsConvo: number;
  ultima:    string;
  engPct:    number;
  engColor:  string;
}

const AI_RANKING: AiRankRow[] = [
  { pos: 1, nombre: "GOXT",                extConvos: 19, intConvos: 1, mensajes: 122, msgsConvo: 6.1, ultima: "20 mar 2026", engPct: 100, engColor: "#1D9E75" },
  { pos: 2, nombre: "NODO OMCPL",          extConvos: 7,  intConvos: 0, mensajes: 50,  msgsConvo: 7.1, ultima: "13 mar 2026", engPct: 41,  engColor: "#378ADD" },
  { pos: 3, nombre: "Copec S.A.",          extConvos: 2,  intConvos: 1, mensajes: 16,  msgsConvo: 5.3, ultima: "03 mar 2026", engPct: 13,  engColor: "#F59E0B" },
  { pos: 4, nombre: "Southway",            extConvos: 0,  intConvos: 1, mensajes: 6,   msgsConvo: 6.0, ultima: "11 mar 2026", engPct: 5,   engColor: "#9CA3AF" },
  { pos: 5, nombre: "CamiónGO",           extConvos: 0,  intConvos: 1, mensajes: 2,   msgsConvo: 2.0, ultima: "13 feb 2026", engPct: 2,   engColor: "#9CA3AF" },
  { pos: 6, nombre: "ANASTASIA",           extConvos: 0,  intConvos: 1, mensajes: 2,   msgsConvo: 2.0, ultima: "19 mar 2026", engPct: 2,   engColor: "#9CA3AF" },
  { pos: 7, nombre: "Espacio Violeta 2.0", extConvos: 1,  intConvos: 0, mensajes: 2,   msgsConvo: 2.0, ultima: "18 mar 2026", engPct: 2,   engColor: "#9CA3AF" },
];

// ─── AI Leads ─────────────────────────────────────────────────────────────────

interface LeadRow {
  email:       string;
  workspace:   string;
  fecha:       string;
  mensajes:    number;
  fuente:      string;
  dispositivo: string;
  nota:        string;
  tipo:        "externo" | "usuario" | "test";
}

const LEADS: LeadRow[] = [
  { email: "jregonat@puertoquequen.com",  workspace: "NODO OMCPL", fecha: "11 mar 2026", mensajes: 2, fuente: "nodo.goxt.io", dispositivo: "iPhone · Safari",  tipo: "externo", nota: "Visitante real de NODO OMCPL — llegó desde nodo.goxt.io y dejó su email. Dominio puertoquequen.com sugiere empresa logística/portuaria. El lead más valioso de los 4." },
  { email: "solgatica@gmail.com",         workspace: "GOXT",       fecha: "11 mar 2026", mensajes: 2, fuente: "goxt.io",      dispositivo: "iPhone · Safari",  tipo: "usuario", nota: "María Soledad Gatica — ya es usuaria del CRM. Visitó goxt.io desde el iPhone, posiblemente explorando el sitio antes de entrar al CRM." },
  { email: "benjamin.gonza.pa@gmail.com", workspace: "GOXT",       fecha: "12 feb 2026", mensajes: 8, fuente: "goxt.io",      dispositivo: "Windows · Chrome", tipo: "usuario", nota: "Benjamin Gonzalez — ya es usuario (Power User #5). Conversación más larga: 8 mensajes. Probablemente estaba probando el widget como parte de su trabajo en GOXT." },
  { email: "rodrigovaldesb@gmail.com",    workspace: "GOXT",       fecha: "12 feb 2026", mensajes: 0, fuente: "api (test)",   dispositivo: "Windows · Chrome", tipo: "test",    nota: "Test técnico interno de Rodrigo Valdés — verificó que el sistema de captura de leads funciona. Sin mensajes en la conversación." },
];

// ─── Email campaigns ──────────────────────────────────────────────────────────

interface CampaignRow {
  nombre:    string;
  test:      boolean;
  workspace: string;
  fecha:     string;
  enviados:  number;
}

const CAMPAIGN_GRUPOS: { label: string; rows: CampaignRow[] }[] = [
  {
    label: "Campañas recientes — marzo 2026",
    rows: [
      { nombre: "Seguimiento Usuarios Inactivos", test: false, workspace: "GOXT",               fecha: "16 mar", enviados: 21 },
      { nombre: "Seguimiento TODOGARAGE",         test: false, workspace: "GOXT",               fecha: "17 mar", enviados: 3  },
      { nombre: "PROXIMO EVENTO DE OTOÑO",        test: false, workspace: "Espacio Violeta 2.0", fecha: "18 mar", enviados: 1  },
      { nombre: "Seguimiento Usuarios",           test: false, workspace: "GOXT",               fecha: "16 mar", enviados: 1  },
    ],
  },
  {
    label: "Campañas anteriores — enero/febrero 2026",
    rows: [
      { nombre: "Boletín GOXT CRM",           test: false, workspace: "GOXT",          fecha: "13 feb", enviados: 16 },
      { nombre: "OFERTA",                      test: false, workspace: "Southway",       fecha: "02 feb", enviados: 2  },
      { nombre: "Boletín GOXT CRM - Validar", test: true,  workspace: "GOXT",          fecha: "05 feb", enviados: 3  },
      { nombre: "Boletin",                     test: true,  workspace: "GOXT",          fecha: "13 feb", enviados: 2  },
      { nombre: "Boletín GOXT CRM",           test: true,  workspace: "GOXT",          fecha: "05 feb", enviados: 1  },
      { nombre: "asdasd",                      test: true,  workspace: "GOXT",          fecha: "13 feb", enviados: 1  },
      { nombre: "Pruebas 2026",                test: true,  workspace: "Southway",       fecha: "02 feb", enviados: 1  },
      { nombre: "Testeo",                      test: true,  workspace: "Exp. GOxT",     fecha: "28 ene", enviados: 1  },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreClass(s: number): string {
  if (s >= 6) return "bg-green-50 text-green-700";
  if (s >= 3) return "bg-blue-50 text-blue-700";
  if (s >= 1) return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-400";
}

function leadTypeClass(tipo: LeadRow["tipo"]): string {
  if (tipo === "externo") return "bg-green-50 text-green-700";
  if (tipo === "usuario") return "bg-purple-50 text-purple-700";
  return "bg-amber-50 text-amber-600";
}

function leadTypeLabel(tipo: LeadRow["tipo"]): string {
  if (tipo === "externo") return "lead externo";
  if (tipo === "usuario") return "ya es usuario";
  return "test interno";
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
      <td
        colSpan={colSpan}
        className="px-4 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-y border-gray-100"
      >
        {label}
      </td>
    </tr>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CrmFeatures() {
  return (
    <div className="space-y-4 overflow-y-auto h-full px-5 pt-4 pb-5">

      {/* ── ADOPCIÓN POR FEATURE ── */}
      <SectionLabel>Adopción por feature</SectionLabel>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Features disponibles"  value={9}     subtitle="módulos en el producto" />
        <StatCard title="Adopción promedio"      value="3.8"   subtitle="features / workspace real" />
        <StatCard title="Feature más usada"      value="Invit" badge={{ label: "87% · 13 de 15 WS", variant: "positive" }} />
        <StatCard title="Feature menos usada"    value="20%"   badge={{ label: "Email · Forms · 3 WS", variant: "warning" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="% adopción por feature (15 WS reales)" chartPadding="pt-3">
          <RankingBar items={FEATURE_RANKING} />
        </ChartCard>

        {/* Adoption matrix */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
            <p className="text-sm font-medium text-gray-700">Mapa de adopción por workspace</p>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full" style={{ minWidth: 560 }}>
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[120px]">WS</th>
                  {["Opps","Notas","Acts","Cots","Email","AI ext","AI int","Forms","Invit"].map((f) => (
                    <th key={f} className="px-1.5 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-9 whitespace-nowrap">{f}</th>
                  ))}
                  <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_GRUPOS.map((g) => (
                  <Fragment key={g.label}>
                    <SepRow label={g.label} colSpan={11} />
                    {g.rows.map((r) => (
                      <tr key={r.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-3 py-2">
                          <p className="text-[12px] font-medium text-gray-800 leading-none">{r.nombre}</p>
                          {r.test && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">test</span>
                          )}
                        </td>
                        {[r.opps, r.notas, r.acts, r.cots, r.email, r.aiExt, r.aiInt, r.forms, r.invit].map((v, i) => (
                          <td key={i} className="px-1.5 py-2 text-center">
                            {v
                              ? <span className="text-green-600 text-[13px] font-bold">✓</span>
                              : <span className="text-gray-200 text-[12px]">·</span>
                            }
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${scoreClass(r.score)}`}>
                            {r.score}/9
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
        <StatCard title="Conversaciones AI"     value={34}  subtitle="en 7 workspaces" />
        <StatCard title="Mensajes AI"           value={200} subtitle="~5.9 msgs / convo" />
        <StatCard title="Widget externo"        value={29}  badge={{ label: "85% del total", variant: "positive" }} />
        <StatCard title="Asistente interno CRM" value={5}   badge={{ label: "15% del total", variant: "neutral" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <ChartCard title="Mensajes por workspace — externo vs interno" chartPadding="pt-3">
          <BarChart
            data={AI_BAR_DATA}
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
                  <th className="px-3 py-2.5 text-left   text-[10px] font-semibold text-gray-400 uppercase tracking-wider min-w-[80px]">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {AI_RANKING.map((r) => (
                  <tr key={r.nombre} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 text-center text-[12px] text-gray-400">{r.pos}</td>
                    <td className="px-3 py-2.5">
                      <p className="text-[12px] font-medium text-gray-800 leading-none">{r.nombre}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{r.ultima}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col gap-0.5 items-center">
                        {r.extConvos > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium whitespace-nowrap">ext ×{r.extConvos}</span>
                        )}
                        {r.intConvos > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-medium whitespace-nowrap">int ×{r.intConvos}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center text-[13px] font-medium text-gray-700">{r.mensajes}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.msgsConvo >= 5 ? "bg-green-50 text-green-700" : r.msgsConvo >= 3 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.msgsConvo.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${r.engPct}%`, backgroundColor: r.engColor }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 w-6 text-right shrink-0">{r.mensajes}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Leads */}
      <div className="grid grid-cols-2 gap-4">
        {LEADS.map((lead) => (
          <div key={lead.email} className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[13px] font-medium text-gray-900">{lead.email}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{lead.fecha} · {lead.dispositivo}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${leadTypeClass(lead.tipo)}`}>
                {leadTypeLabel(lead.tipo)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{lead.workspace}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-500">{lead.fuente}</span>
              {lead.mensajes > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">{lead.mensajes} msgs</span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{lead.nota}</p>
          </div>
        ))}
      </div>

      {/* ── EMAIL ── */}
      <SectionLabel>Email</SectionLabel>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total campañas"   value={13}        subtitle="4 workspaces distintos" />
        <StatCard title="Emails enviados"  value={55}        subtitle="todas con status enviado" />
        <StatCard title="Tracking"         value="Sin datos" badge={{ label: "delivered · abiertos · clicks = 0", variant: "negative" }} />
      </div>

      <Callout variant="negative">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block mb-0.5">Bug de tracking</span>
        <strong>Los webhooks de SendGrid no están configurados</strong> — Las 13 campañas tienen <code className="text-[11px] bg-red-50 px-1 rounded">delivered_count</code>, <code className="text-[11px] bg-red-50 px-1 rounded">opened_count</code> y <code className="text-[11px] bg-red-50 px-1 rounded">clicked_count</code> en 0. Los emails se están enviando correctamente (55 enviados con status &#34;sent&#34;) pero el sistema no recibe los eventos de entrega y apertura de SendGrid. Sin este fix no podemos saber si las campañas están funcionando.
      </Callout>

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
            {CAMPAIGN_GRUPOS.map((g) => (
              <Fragment key={g.label}>
                <SepRow label={g.label} colSpan={7} />
                {g.rows.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5">
                      <span className="text-[13px] font-medium text-gray-800">{c.nombre}</span>
                      {c.test && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">test</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{c.workspace}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-[12px] text-gray-500">{c.fecha}</td>
                    <td className="px-4 py-2.5 text-center text-[13px] font-medium text-gray-700">{c.enviados}</td>
                    <td className="px-4 py-2.5 text-center text-[12px] text-gray-300">—</td>
                    <td className="px-4 py-2.5 text-center text-[12px] text-gray-300">—</td>
                    <td className="px-4 py-2.5 text-center text-[12px] text-gray-300">—</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── CALLOUTS DE PRODUCTO ── */}
      <div className="grid grid-cols-2 gap-4">

        <Callout variant="positive">
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 block mb-0.5">Tracción positiva</span>
          <strong>Invitaciones y AI widget tienen la mejor tracción.</strong> Invitaciones alcanza el 87% de adopción entre WS reales y sigue creciendo. El AI widget externo funciona como canal de captación — GOXT y NODO OMCPL concentran 172 de 200 mensajes, y el lead de Puerto Quequén (NODO OMCPL) demuestra que el bot puede generar leads de calidad.
        </Callout>

        <Callout variant="warning">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">Oportunidad de onboarding</span>
          <strong>Email y Forms tienen la adopción más baja — 20% (3 WS cada uno).</strong> 10 workspaces con oportunidades activas no están usando Email, y 12 no usan Forms. Son features que requieren setup inicial — candidatos ideales para una campaña de onboarding guiado o tutoriales in-app para aumentar activación.
        </Callout>

      </div>

    </div>
  );
}

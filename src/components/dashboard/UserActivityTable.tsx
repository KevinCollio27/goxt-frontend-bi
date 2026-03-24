"use client";

import { DataTable, type Column } from "@/components/ui/DataTable";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type WsRole = "dueño" | "admin" | "invitado";
type TtvTipo = "rapido" | "lento" | "previo";
type AccionTipo = "actividad" | "oportunidad" | "nota" | "cotización";

interface WorkspaceBadge {
  name: string;
  role: WsRole;
}

interface PrimeraAccion {
  nombre: string;
  fecha: string;
  tipo: AccionTipo;
  workspace: string;
}

interface UltimaEntry {
  fecha: string;
  workspace: string;
}

interface UltimaActividad {
  hace: string; // "2D", "4D", "12D"
  ultimaNota: UltimaEntry | null;
  ultimaOportunidad: UltimaEntry | null;
  ultimaActividad: UltimaEntry | null;
}

export interface UserActivityRow {
  id: number;
  nombre: string;
  email: string;
  workspaces: WorkspaceBadge[];
  registro: string;
  primeraAccion: PrimeraAccion | null;
  timeToValue: { valor: string; tipo: TtvTipo } | null;
  actividadTotal: { actividades: number; oportunidades: number; notas: number };
  ultimaActividad: UltimaActividad | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPO_EMOJI: Record<AccionTipo, string> = {
  actividad:   "📅",
  oportunidad: "💼",
  nota:        "📝",
  cotización:  "📄",
};

const TTV_STYLE: Record<TtvTipo, string> = {
  rapido: "bg-green-100 text-green-700",
  lento:  "bg-red-100   text-red-600",
  previo: "bg-gray-100  text-gray-500",
};

function activityScore(row: UserActivityRow) {
  const { actividades, oportunidades, notas } = row.actividadTotal;
  return actividades + oportunidades + notas;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ROLE_ORDER: Record<WsRole, number> = { dueño: 0, admin: 1, invitado: 2 };

function WsBadge({ ws }: { ws: WorkspaceBadge }) {
  const isDueno = ws.role === "dueño";
  return (
    <span
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap
        ${isDueno ? "bg-orange-50 text-orange-700" : "bg-teal/10 text-teal"}`}
    >
      {isDueno ? "👑" : "◎"} {ws.name}
    </span>
  );
}

function WsBadges({ workspaces }: { workspaces: WorkspaceBadge[] }) {
  if (workspaces.length === 0)
    return <span className="text-[12px] text-gray-300">—</span>;

  const sorted  = [...workspaces].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);
  const visible = sorted.slice(0, 2);
  const hidden  = sorted.slice(2);

  return (
    <div className="flex items-center flex-wrap gap-1">
      {visible.map((ws) => <WsBadge key={ws.name} ws={ws} />)}

      {hidden.length > 0 && (
        <div className="relative group/ws">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 cursor-default whitespace-nowrap select-none">
            +{hidden.length} más
          </span>
          <div className="absolute left-0 top-full mt-1 z-50 invisible group-hover/ws:visible bg-white border border-gray-200 rounded-lg shadow-md p-2 flex flex-col gap-1 min-w-max">
            {hidden.map((ws) => <WsBadge key={ws.name} ws={ws} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityTotalCell({ row, maxScore }: { row: UserActivityRow; maxScore: number }) {
  const { actividades, oportunidades, notas } = row.actividadTotal;
  const score = activityScore(row);
  const pct   = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <div className="min-w-27.5">
      <div className="flex items-center gap-2 text-[11px] text-gray-600 mb-1.5">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400  shrink-0 inline-block" />{actividades}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 inline-block" />{oportunidades}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 inline-block" />{notas}
        </span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded overflow-hidden">
        <div
          className="h-full rounded"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(to right, #77ACA2, #468189)",
          }}
        />
      </div>
    </div>
  );
}

function ExpandedRow({ row }: { row: UserActivityRow }) {
  return (
    <div className="grid grid-cols-4 gap-6 py-1 text-[12px]">

      {/* REGISTRO */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" /> Registro
        </p>
        <p className="text-gray-600 mb-1.5">
          {row.nombre} se registró el {row.registro}
        </p>
        <p className="text-[11px] text-gray-400 mb-1">Workspaces:</p>
        <WsBadges workspaces={row.workspaces} />
      </div>

      {/* PRIMERA ACCIÓN */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Primera acción
        </p>
        {row.primeraAccion ? (
          <>
            <p className="text-gray-700 font-medium">
              {TIPO_EMOJI[row.primeraAccion.tipo]} {row.primeraAccion.nombre}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {row.primeraAccion.fecha} · {row.primeraAccion.tipo}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              en <span className="text-gray-600">{row.primeraAccion.workspace}</span>
            </p>
          </>
        ) : (
          <p className="text-[11px] text-gray-300">Sin actividad registrada</p>
        )}
      </div>

      {/* ACTIVIDAD ACUMULADA */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> Actividad acumulada
        </p>
        <div className="flex flex-col gap-1 text-[11px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400  inline-block" />
            {row.actividadTotal.actividades} actividades
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            {row.actividadTotal.oportunidades} oportunidades
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {row.actividadTotal.notas} notas
          </span>
        </div>
      </div>

      {/* ÚLTIMA ACTIVIDAD */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Última actividad
        </p>
        {row.ultimaActividad ? (
          <>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 mb-1.5">
              HACE {row.ultimaActividad.hace}
            </span>
            <div className="flex flex-col gap-0.5 text-[11px] text-gray-500">
              {row.ultimaActividad.ultimaNota && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 inline-block" />
                  última nota: {row.ultimaActividad.ultimaNota.fecha}
                  <span className="text-gray-400">· {row.ultimaActividad.ultimaNota.workspace}</span>
                </span>
              )}
              {row.ultimaActividad.ultimaOportunidad && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 inline-block" />
                  última oportunidad: {row.ultimaActividad.ultimaOportunidad.fecha}
                  <span className="text-gray-400">· {row.ultimaActividad.ultimaOportunidad.workspace}</span>
                </span>
              )}
              {row.ultimaActividad.ultimaActividad && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 inline-block" />
                  última actividad: {row.ultimaActividad.ultimaActividad.fecha}
                  <span className="text-gray-400">· {row.ultimaActividad.ultimaActividad.workspace}</span>
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-[11px] text-gray-300">Sin actividad registrada</p>
        )}
      </div>

    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  data: UserActivityRow[];
  pageSize?: number;
}

export function UserActivityTable({ data, pageSize = 8 }: Props) {
  const maxScore = Math.max(...data.map(activityScore), 1);

  const columns: Column<UserActivityRow>[] = [
    {
      key: "usuario",
      header: "Usuario",
      render: (row) => (
        <div className="min-w-35">
          <p className="text-[13px] font-medium text-gray-800 leading-none">{row.nombre}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{row.email}</p>
        </div>
      ),
    },
    {
      key: "workspaces",
      header: "Workspaces",
      className: "align-top py-3",
      render: (row) => <WsBadges workspaces={row.workspaces} />,
    },
    {
      key: "registro",
      header: "Registro",
      render: (row) => (
        <span className="text-[12px] text-gray-600 whitespace-nowrap">{row.registro}</span>
      ),
    },
    {
      key: "primeraAccion",
      header: "Primera acción",
      render: (row) =>
        row.primeraAccion ? (
          <div className="min-w-35">
            <p className="text-[12px] font-medium text-gray-700 leading-none">
              {row.primeraAccion.nombre}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {row.primeraAccion.fecha} · {row.primeraAccion.tipo}
            </p>
          </div>
        ) : (
          <span className="text-[12px] text-gray-300">—</span>
        ),
    },
    {
      key: "ttv",
      header: (
        <span className="inline-flex items-center gap-1">
          Activación
          <span
            title="Tiempo desde el registro hasta la primera acción en el sistema"
            className="text-blue-300 hover:text-blue-400 transition-colors cursor-default text-[13px]"
          >
            ⓘ
          </span>
        </span>
      ),
      render: (row) =>
        row.timeToValue ? (
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${TTV_STYLE[row.timeToValue.tipo]}`}
          >
            {row.timeToValue.valor}
          </span>
        ) : (
          <span className="text-gray-300 text-[12px]">—</span>
        ),
    },
    {
      key: "actividad",
      header: "Actividad total",
      render: (row) => <ActivityTotalCell row={row} maxScore={maxScore} />,
    },
  ];

  return (
    <DataTable<UserActivityRow>
      columns={columns}
      data={data}
      keyExtractor={(r) => r.id}
      pageSize={pageSize}
      renderExpanded={(row) => <ExpandedRow row={row} />}
    />
  );
}

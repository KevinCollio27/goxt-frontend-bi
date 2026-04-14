"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useFiltersStore,
  DATE_PRESET_LABELS,
  type DatePreset,
} from "@/store/filters.store";
import { AnalyticsService, type WsListItem } from "@/services/analytics.service";

// ─── DateDropdown ─────────────────────────────────────────────────────────────

function DateDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { datePreset, setDatePreset } = useFiltersStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = datePreset !== "all";

  return (
    <div className="space-y-1" ref={ref}>
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        Fecha
      </label>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm border transition-all",
            isActive
              ? "bg-teal/10 border-teal text-teal font-medium"
              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
          )}
        >
          <span className="truncate">{DATE_PRESET_LABELS[datePreset]}</span>
          <ChevronDown size={14} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
            {(Object.entries(DATE_PRESET_LABELS) as [DatePreset, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setDatePreset(key); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                  datePreset === key ? "text-teal font-medium" : "text-gray-700"
                )}
              >
                {label}
                {datePreset === key && <Check size={13} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WorkspaceDropdown ────────────────────────────────────────────────────────

function WorkspaceDropdown({ wsList }: { wsList: WsListItem[] }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { workspaceIds, setWorkspaceIds } = useFiltersStore();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = wsList.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setWorkspaceIds(
      workspaceIds.includes(id)
        ? workspaceIds.filter((x) => x !== id)
        : [...workspaceIds, id]
    );
  };

  const isActive = workspaceIds.length > 0;
  const label = isActive
    ? workspaceIds.length === 1
      ? wsList.find((w) => w.id === workspaceIds[0])?.name ?? "1 workspace"
      : `${workspaceIds.length} workspaces`
    : "Todos";

  return (
    <div className="space-y-1" ref={ref}>
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        Workspace
      </label>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm border transition-all",
            isActive
              ? "bg-teal/10 border-teal text-teal font-medium"
              : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDown size={14} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                autoFocus
                type="text"
                placeholder="Buscar workspace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2.5 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              />
            </div>

            <div className="max-h-52 overflow-y-auto py-1">
              {/* Opción "Todos" */}
              <button
                onClick={() => { setWorkspaceIds([]); setOpen(false); }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                  !isActive ? "text-teal font-medium" : "text-gray-700"
                )}
              >
                Todos los workspaces
                {!isActive && <Check size={13} />}
              </button>

              {filtered.map((ws) => {
                const selected = workspaceIds.includes(ws.id);
                return (
                  <button
                    key={ws.id}
                    onClick={() => toggle(ws.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors",
                      selected ? "text-teal font-medium" : "text-gray-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all",
                        selected ? "bg-teal border-teal" : "border-gray-300"
                      )}
                    >
                      {selected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <p className="px-3 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

export function FilterBar() {
  const [open, setOpen]         = useState(false);
  const [wsList, setWsList]     = useState<WsListItem[]>([]);
  const [wsLoaded, setWsLoaded] = useState(false);

  const { datePreset, workspaceIds, reset } = useFiltersStore();

  const activeCount = [
    datePreset !== "all" ? 1 : 0,
    workspaceIds.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Cargar workspaces la primera vez que se abre el panel
  useEffect(() => {
    if (open && !wsLoaded) {
      AnalyticsService.getWorkspaceList()
        .then((list) => { setWsList(list); setWsLoaded(true); })
        .catch(() => setWsLoaded(true)); // silencioso — dropdown quedará vacío
    }
  }, [open, wsLoaded]);

  return (
    <div className="relative">
      {/* ── Botón ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer",
          open || activeCount > 0
            ? "bg-teal/10 border-teal/40 text-teal"
            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        )}
      >
        <SlidersHorizontal size={14} />
        Filtros
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="absolute top-full right-0 mt-2 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg w-[480px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Filtros
              </h4>
              {activeCount > 0 && (
                <button
                  onClick={() => { reset(); }}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={12} />
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DateDropdown />
              <WorkspaceDropdown wsList={wsList} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { Check, Users } from "lucide-react";

import { Modal }  from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input }  from "@/components/ui/input";
import { superAdminService, type SuperAdminSearchResult } from "@/services/super-admin.service";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<string, string> = {
  crm:       "CRM",
  cargo:     "Cargo",
  crm_cargo: "CRM + Cargo",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface AddInternalAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AddInternalAdminModal({ open, onClose, onSuccess }: AddInternalAdminModalProps) {
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState<SuperAdminSearchResult[]>([]);
  const [selected,  setSelected]  = useState<SuperAdminSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setQuery(""); setResults([]); setSelected(null);
    setSearching(false); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleQuery = (value: string) => {
    setQuery(value);
    setSelected(null);
    setError("");
    if (debounce.current) clearTimeout(debounce.current);
    if (value.trim().length < 2) { setResults([]); setSearching(false); return; }
    setSearching(true);
    debounce.current = setTimeout(async () => {
      try {
        setResults(await superAdminService.search(value.trim()));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleConfirm = async () => {
    if (!selected) { setError("Seleccioná un usuario de la lista."); return; }
    setLoading(true);
    try {
      await superAdminService.createFromSystem({
        name:          selected.name,
        email:         selected.email,
        source:        selected.source,
        crm_user_id:   selected.crm_user_id,
        cargo_user_id: selected.cargo_user_id,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Ocurrió un error al crear el admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar Admin Interno"
      subtitle="Busca un usuario existente de CRM o Cargo"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !selected}>
            {loading ? "Guardando..." : "Confirmar"}
          </Button>
        </>
      }
    >
      <div className="space-y-3">

        {/* Buscador */}
        <Label>Buscar usuario</Label>
        <Input
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          placeholder="Ingresa un nombre o email..."
        />

        {/* Resultados */}
        {searching && (
          <p className="text-xs text-center text-gray-400 py-3">Buscando...</p>
        )}

        {!searching && results.length > 0 && (
          <ul className="space-y-1 max-h-52 overflow-y-auto">
            {results.map((r) => (
              <li key={r.email}>
                <button
                  type="button"
                  onClick={() => setSelected(selected?.email === r.email ? null : r)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer",
                    selected?.email === r.email
                      ? "bg-teal/10 border border-teal/30"
                      : "hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center text-xs font-semibold text-ink shrink-0">
                    {getInitials(r.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {r.email} — {SOURCE_LABELS[r.source] ?? r.source}
                    </p>
                  </div>
                  {selected?.email === r.email && (
                    <span className="w-5 h-5 rounded-full bg-teal flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!searching && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-xs text-center text-gray-400 py-3">
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

      </div>
    </Modal>
  );
}

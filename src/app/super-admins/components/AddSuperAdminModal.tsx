"use client";

import { useState, useRef } from "react";
import { Check, Users } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  superAdminService,
  type SuperAdminSearchResult,
} from "@/services/super-admin.service";
import { cn } from "@/lib/utils";

interface AddSuperAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "system" | "external";

const SOURCE_LABELS: Record<string, string> = {
  crm:       "CRM",
  cargo:     "Cargo",
  crm_cargo: "CRM + Cargo",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AddSuperAdminModal({ open, onClose, onSuccess }: AddSuperAdminModalProps) {
  const [tab, setTab]           = useState<Tab>("system");
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<SuperAdminSearchResult[]>([]);
  const [selected, setSelected] = useState<SuperAdminSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = () => {
    setTab("system");
    setQuery("");
    setResults([]);
    setSelected(null);
    setName("");
    setEmail("");
    setError("");
    setSearching(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelected(null);
    setError("");
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await superAdminService.search(value.trim());
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleConfirm = async () => {
    setError("");
    if (tab === "system" && !selected) {
      setError("Selecciona un usuario de la lista.");
      return;
    }
    if (tab === "external" && (!name.trim() || !email.trim())) {
      setError("Nombre y email son requeridos.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "system") {
        await superAdminService.createFromSystem({
          name:          selected!.name,
          email:         selected!.email,
          source:        selected!.source,
          crm_user_id:   selected!.crm_user_id,
          cargo_user_id: selected!.cargo_user_id,
        });
      } else {
        await superAdminService.createExternal({ name: name.trim(), email: email.trim() });
      }
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; extraMessage?: string } } };
      setError(
        e?.response?.data?.message ??
        e?.response?.data?.extraMessage ??
        "Ocurrió un error al crear el super admin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar super admin"
      subtitle="Otorga acceso de administrador al panel BI"
      icon={Users}
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button variant="midnight" onClick={handleConfirm} disabled={loading}>
            {loading ? "Guardando..." : "Confirmar"}
          </Button>
        </>
      }
    >
      {/* Tabs */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
        {(["system", "external"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={cn(
              "flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer",
              tab === t
                ? "bg-ink text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "system" ? "Ya está en el sistema" : "Usuario externo"}
          </button>
        ))}
      </div>

      {tab === "system" ? (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
            <strong className="block text-gray-700 mb-0.5">Usuario con cuenta en CRM o Cargo</strong>
            Búscalo por nombre o email. Al promoverlo, podrá acceder al panel de BI con su cuenta existente.
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal placeholder:text-gray-400"
          />

          {searching && (
            <p className="text-xs text-center text-gray-400 py-3">Buscando...</p>
          )}

          {!searching && results.length > 0 && (
            <ul className="space-y-1 max-h-52 overflow-y-auto">
              {results.map((r) => (
                <li key={r.email}>
                  <button
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
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
            <strong className="block text-gray-700 mb-0.5">Usuario sin cuenta en CRM ni Cargo</strong>
            Se creará acceso exclusivo a GOxT BI. No tendrá acceso a CRM ni Cargo, solo al panel de administración.
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Nombre completo"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal placeholder:text-gray-400"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="Email corporativo"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal placeholder:text-gray-400"
          />

          <p className="text-xs text-gray-400 leading-relaxed">
            Se enviará un email de invitación para que el usuario configure su acceso.
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </Modal>
  );
}

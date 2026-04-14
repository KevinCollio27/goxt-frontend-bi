"use client";

import { useState } from "react";
import { X, ExternalLink, Trash2 } from "lucide-react";
import { IntegrationsService } from "@/services/integrations.service";
import type { IntegrationSource } from "@/services/integrations.service";

interface Props {
  workspaceId: number;
  source:      IntegrationSource;
  currentUrl?: string;
  onSuccess:   () => void;
  onClose:     () => void;
}

export default function LookerConnectModal({ workspaceId, source, currentUrl, onSuccess, onClose }: Props) {
  const isEditing = !!currentUrl;
  const [url, setUrl]           = useState(currentUrl ?? "");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleSubmit = async () => {
    const validationError = IntegrationsService.validate("looker_studio", url);
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    try {
      await IntegrationsService.upsert(workspaceId, source, "looker_studio", url.trim());
      onSuccess();
    } catch {
      setError("No se pudo guardar la integración. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await IntegrationsService.remove(workspaceId, source, "looker_studio");
      onSuccess();
    } catch {
      setError("No se pudo desconectar. Intenta de nuevo.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {isEditing ? "Editar Looker Studio" : "Conectar Looker Studio"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditing ? "Actualizá la URL de tu reporte" : "Pega la URL de embed de tu reporte"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              URL del reporte
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              placeholder="https://lookerstudio.google.com/embed/reporting/..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-all placeholder:text-gray-300"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
            {!error && (
              <p className="mt-1.5 text-xs text-gray-400">
                Debe ser una URL de embed:{" "}
                <span className="font-mono text-[11px]">lookerstudio.google.com/embed/reporting/...</span>
              </p>
            )}
          </div>

          {/* Cómo obtener el URL */}
          <div className="flex items-center gap-1.5 text-xs text-teal cursor-pointer hover:underline w-fit">
            <ExternalLink size={12} />
            <span>¿Cómo obtener la URL de embed?</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6">
          {/* Desconectar — solo en modo editar */}
          {isEditing ? (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={13} />
              {removing ? "Desconectando..." : "Desconectar"}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-ink text-white rounded-lg hover:bg-ink/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Conectar"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  icon:         ReactNode;
  title:        string;
  description:  string;
  connected:    boolean;
  comingSoon?:  boolean;
  onConnect:    () => void;
  onEdit:       () => void;
}

export default function IntegrationCard({ icon, title, description, connected, comingSoon, onConnect, onEdit }: Props) {
  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-shadow",
      comingSoon ? "opacity-60" : "hover:shadow-md"
    )}>

      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
          {icon}
        </div>
        {comingSoon && (
          <span className="text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
            Próximamente
          </span>
        )}
        {!comingSoon && connected && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Conectado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed text-justify">{description}</p>
      </div>

      {/* Actions */}
      {comingSoon ? (
        <button
          disabled
          className="w-full py-2.5 text-sm font-medium border border-gray-200 text-gray-300 rounded-xl cursor-not-allowed"
        >
          Conectar
        </button>
      ) : connected ? (
        <button
          onClick={onEdit}
          className="w-full py-2.5 text-sm font-medium border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Editar
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="w-full py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer bg-ink text-white hover:bg-ink/90"
        >
          Conectar
        </button>
      )}
    </div>
  );
}

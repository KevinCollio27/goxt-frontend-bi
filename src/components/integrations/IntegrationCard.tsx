"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  icon:        ReactNode;
  title:       string;
  description: string;
  connected:   boolean;
  comingSoon?: boolean;
  onConnect:   () => void;
  onEdit:      () => void;
}

export default function IntegrationCard({
  icon, title, description, connected, comingSoon, onConnect, onEdit,
}: IntegrationCardProps) {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between gap-4 rounded-md bg-background p-6 shadow-sm",
    )}>

      {/* Icon + badge */}
      <div className="flex items-start justify-between">
        <div className="size-8 shrink-0 flex items-center justify-center">
          {icon}
        </div>
        {comingSoon && (
          <span className="text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
            Próximamente
          </span>
        )}
        {!comingSoon && connected && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Conectado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{description}</p>
      </div>

      {/* Action */}
      {comingSoon ? (
        <button disabled className="w-full py-2 text-sm font-medium border border-gray-200 text-gray-300 rounded-lg cursor-not-allowed">
          Conectar
        </button>
      ) : connected ? (
        <button onClick={onEdit} className="w-full py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          Editar
        </button>
      ) : (
        <button onClick={onConnect} className="w-full py-2 text-sm font-medium rounded-lg bg-ink text-white hover:bg-ink/90 active:scale-95 transition-all cursor-pointer">
          Conectar
        </button>
      )}
    </div>
  );
}

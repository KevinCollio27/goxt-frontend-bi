"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MetabaseService } from "@/services/metabase.service";

const METABASE_URL = "https://metabase-production-ca9e.up.railway.app";

interface Props {
  dashboardId?: number;
  workspaceName?: string;
}

export default function MetabaseDashboard({ dashboardId = 3, workspaceName }: Props) {
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Obtener el embed token del backend
  useEffect(() => {
    MetabaseService.getEmbedToken(dashboardId, workspaceName)
      .then((token) => setEmbedToken(token))
      .catch((err) => {
        console.error("[Metabase] error al obtener token:", err?.response?.status);
        setError(true);
      });
  }, [dashboardId, workspaceName]);

  // 2. Inyectar el elemento cuando ambos estén listos
  useEffect(() => {
    if (!embedToken || !scriptLoaded || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    (window as unknown as Record<string, unknown>).metabaseConfig = {
      theme: { preset: "light" },
      isGuest: true,
      instanceUrl: METABASE_URL,
    };

    const el = document.createElement("metabase-dashboard");
    el.setAttribute("token", embedToken);
    el.setAttribute("with-title", "false");
    el.setAttribute("with-downloads", "true");
    el.style.width = "100%";
    el.style.height = "100%";
    containerRef.current.appendChild(el);
  }, [embedToken, scriptLoaded]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        No se pudo cargar el dashboard de Metabase.
      </div>
    );
  }

  if (!embedToken || !scriptLoaded) {
    return (
      <>
        <Script
          src={`${METABASE_URL}/app/embed.js`}
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Script
        src={`${METABASE_URL}/app/embed.js`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import { useAuthStore }        from "@/store/auth.store";
import { PageContainer, PageCard } from "@/components/layout/PageContainer";
import IntegrationCard         from "./IntegrationCard";
import LookerConnectModal      from "./LookerConnectModal";
import { IntegrationsService } from "@/services/integrations.service";
import type { WorkspaceIntegration, IntegrationSource } from "@/services/integrations.service";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IntegrationLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={32}
      height={32}
      className="size-8 object-contain pointer-events-none select-none"
    />
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Integrations() {
  const { user, selectedWorkspace, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [integrations, setIntegrations] = useState<WorkspaceIntegration[]>([]);
  const [modalOpen, setModalOpen]       = useState(false);
  const [loading, setLoading]           = useState(true);

  const workspaceId = selectedWorkspace?.workspace.id;
  const source      = selectedWorkspace?.source as IntegrationSource | undefined;

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user)              { router.replace("/login");     return; }
    if (!selectedWorkspace) { router.replace("/workspace"); return; }
  }, [user, selectedWorkspace, _hasHydrated, router]);

  useEffect(() => {
    if (!workspaceId || !source) return;
    IntegrationsService.getByWorkspace(workspaceId, source)
      .then(setIntegrations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [workspaceId, source]);

  const lookerIntegration = integrations.find((i) => i.type === "looker_studio");

  const handleSuccess = async () => {
    setModalOpen(false);
    if (!workspaceId || !source) return;
    const updated = await IntegrationsService.getByWorkspace(workspaceId, source);
    setIntegrations(updated);
  };

  if (!_hasHydrated || !user || !selectedWorkspace) return null;

  return (
    <>
      <PageContainer>
        <PageCard>

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-ink">Integraciones</h2>
            <p className="text-xs text-gray-400 mt-0.5">Conectá tus herramientas externas a la plataforma.</p>
          </div>

          {/* Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid gap-1 overflow-hidden rounded-md bg-secondary p-1 sm:grid-cols-2">
                <IntegrationCard
                  icon={<IntegrationLogo src="/logos/looker-studio.svg" alt="Looker Studio" />}
                  title="Looker Studio"
                  description="Integra tu cuenta de Looker Studio con la plataforma. Recomendado para dashboards propios donde realizás el seguimiento de tu operación."
                  connected={!!lookerIntegration}
                  onConnect={() => setModalOpen(true)}
                  onEdit={()    => setModalOpen(true)}
                />
                <IntegrationCard
                  icon={<IntegrationLogo src="/logos/google-analytics.svg" alt="Google Analytics 4" />}
                  title="Google Analytics 4"
                  description="Conectá tu propiedad de GA4 para visualizar métricas de tráfico, usuarios activos, leads y eventos directamente desde el dashboard."
                  connected={false}
                  comingSoon
                  onConnect={() => {}}
                  onEdit={() => {}}
                />
              </div>
            )}
          </div>

        </PageCard>
      </PageContainer>

      {modalOpen && workspaceId && source && (
        <LookerConnectModal
          workspaceId={workspaceId}
          source={source}
          currentUrl={lookerIntegration?.config.url}
          onSuccess={handleSuccess}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

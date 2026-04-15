"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import { useAuthStore }        from "@/store/auth.store";
import AuthLayout              from "@/components/AuthLayout";
import { PageContainer }      from "@/components/layout/PageContainer";
import IntegrationCard         from "@/components/integrations/IntegrationCard";
import LookerConnectModal      from "@/components/integrations/LookerConnectModal";
import { IntegrationsService } from "@/services/integrations.service";
import type { WorkspaceIntegration, IntegrationSource } from "@/services/integrations.service";

function LookerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <circle cx="12" cy="12" r="10" fill="#4285F4" opacity="0.15" />
      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" fill="#4285F4" />
      <path d="M12 6v2M12 16v2M6 12H4M20 12h-2" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GA4Icon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <circle cx="12" cy="12" r="10" fill="#E37400" opacity="0.12" />
      <path d="M7 17V10" stroke="#E37400" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17V7"  stroke="#E37400" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 17v-4" stroke="#E37400" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function IntegrationsPage() {
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
    <AuthLayout>
      <PageContainer>

        {/* Grid de cards */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <IntegrationCard
              icon={<LookerIcon />}
              title="Looker Studio"
              description="Integra tu cuenta de Looker Studio con la plataforma. Recomendado para dashboards propios donde realizás el seguimiento de tu operación."
              connected={!!lookerIntegration}
              onConnect={() => setModalOpen(true)}
              onEdit={()    => setModalOpen(true)}
            />
            <IntegrationCard
              icon={<GA4Icon />}
              title="Google Analytics 4"
              description="Conectá tu propiedad de GA4 para visualizar métricas de tráfico, usuarios activos, leads y eventos directamente desde el dashboard."
              connected={false}
              comingSoon
              onConnect={() => {}}
              onEdit={() => {}}
            />
          </div>
        )}
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
    </AuthLayout>
  );
}

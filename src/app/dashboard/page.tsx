"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import AuthLayout from "@/components/AuthLayout";
import MetabaseDashboard from "@/components/MetabaseDashboard";
import { cn } from "@/lib/utils";
import { CrmOverview } from "@/components/dashboard/CrmOverview";
import { CrmUsuarios } from "@/components/dashboard/CrmUsuarios";
import { CrmWorkspaces } from "@/components/dashboard/CrmWorkspaces";
import { CrmPipeline } from "@/components/dashboard/CrmPipeline";
import { CrmFeatures } from "@/components/dashboard/CrmFeatures";
import { FilterBar }         from "@/components/dashboard/FilterBar";
import LookerDashboard       from "@/components/dashboard/LookerDashboard";
import { IntegrationsService } from "@/services/integrations.service";
import type { IntegrationSource } from "@/services/integrations.service";

const SUPER_ADMIN_DASHBOARD_ID = 3;
const WORKSPACE_DASHBOARD_ID = 2;

type Tab = "crm" | "personalizado" | "visitas";
type CrmTab = "overview" | "usuarios" | "workspaces" | "pipeline" | "features";

const TABS: { id: Tab; label: string }[] = [
  { id: "crm",           label: "CRM" },
  { id: "personalizado", label: "Personalizado" },
  { id: "visitas",       label: "Visitas" },
];

const CRM_TABS: { id: CrmTab; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "usuarios",    label: "Usuarios" },
  { id: "workspaces",  label: "Workspaces" },
  { id: "pipeline",    label: "Pipeline" },
  { id: "features",    label: "Features" },
];


export default function DashboardPage() {
  const { user, selectedWorkspace, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState<Tab>("crm");
  const [crmTab,    setCrmTab]      = useState<CrmTab>("overview");
  const [lookerUrl, setLookerUrl]   = useState<string | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) { router.replace("/login"); return; }
    if (!user.isSuperAdmin && !selectedWorkspace) router.replace("/workspace");
  }, [user, selectedWorkspace, _hasHydrated, router]);

  // Cargar integración Looker del workspace (solo usuarios normales)
  useEffect(() => {
    if (!selectedWorkspace || !user || user.isSuperAdmin) return;
    IntegrationsService
      .getByWorkspace(selectedWorkspace.workspace.id, selectedWorkspace.source as IntegrationSource)
      .then((integrations) => {
        const looker = integrations.find((i) => i.type === "looker_studio");
        setLookerUrl(looker?.config.url ?? null);
      })
      .catch(() => setLookerUrl(null));
  }, [selectedWorkspace, user]);

  if (!_hasHydrated || !user) return null;
  if (!user.isSuperAdmin && !selectedWorkspace) return null;

  const isWorkspaceMode    = !!selectedWorkspace;
  const isSuperPlatformMode = user.isSuperAdmin && !isWorkspaceMode;

  // Vista cliente / workspace
  if (!isSuperPlatformMode) {
    type WsTab = "dashboard" | "visitas";
    const wsTabs: { id: WsTab; label: string }[] = [
      { id: "dashboard", label: "Dashboard" },
      ...(lookerUrl ? [{ id: "visitas" as WsTab, label: "Visitas" }] : []),
    ];

    return (
      <AuthLayout>
        <div className="p-6 flex flex-col h-[calc(100vh-57px)] gap-3 overflow-hidden">
          {/* Tabs — solo si hay Looker */}
          {lookerUrl && (
            <div className="flex items-center gap-2">
              {wsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer",
                    (activeTab === tab.id || (tab.id === "dashboard" && activeTab === "crm"))
                      ? "bg-ink text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
            {activeTab === "visitas" && lookerUrl
              ? <LookerDashboard url={lookerUrl} />
              : (
                <MetabaseDashboard
                  dashboardId={WORKSPACE_DASHBOARD_ID}
                  workspaceName={selectedWorkspace?.workspace.name}
                />
              )
            }
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Vista super admin — con tabs
  return (
    <AuthLayout>
      <div className="p-6 flex flex-col h-[calc(100vh-57px)] gap-3 overflow-hidden">

        {/* ── Tabs principales ── */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all cursor-pointer",
                activeTab === tab.id
                  ? "bg-ink text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Contenido ── */}
        <div className="flex-1 overflow-hidden flex flex-col gap-3 min-h-0">

          {activeTab === "crm" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-0">

              {/* Sub-tabs CRM */}
              <div className="flex items-center gap-1 border-b border-gray-200 px-4 shrink-0">
                {CRM_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCrmTab(tab.id)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap",
                      crmTab === tab.id
                        ? "border-teal text-teal"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="ml-auto pb-1">
                  <FilterBar />
                </div>
              </div>

              {/* Contenido del sub-tab */}
              <div className="flex-1 overflow-hidden min-h-0">
                {crmTab === "overview"   && <CrmOverview />}
                {crmTab === "usuarios"   && <CrmUsuarios />}
                {crmTab === "workspaces" && <CrmWorkspaces />}
                {crmTab === "pipeline"   && <CrmPipeline />}
                {crmTab === "features"   && <CrmFeatures />}
              </div>

            </div>
          )}

          {activeTab === "personalizado" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
              <MetabaseDashboard dashboardId={SUPER_ADMIN_DASHBOARD_ID} />
            </div>
          )}

          {activeTab === "visitas" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
              <LookerDashboard />
            </div>
          )}

        </div>
      </div>
    </AuthLayout>
  );
}

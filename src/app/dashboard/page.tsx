"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import AuthLayout from "@/components/AuthLayout";
import MetabaseDashboard from "@/components/MetabaseDashboard";
import { cn } from "@/lib/utils";
import { CrmOverview } from "@/components/dashboard/CrmOverview";
import { CrmUsuarios } from "@/components/dashboard/CrmUsuarios";

const SUPER_ADMIN_DASHBOARD_ID = 3;
const WORKSPACE_DASHBOARD_ID = 2;

type Tab = "crm" | "personalizado";
type CrmTab = "overview" | "usuarios" | "workspaces" | "pipeline" | "features";

const TABS: { id: Tab; label: string }[] = [
  { id: "crm",          label: "CRM" },
  { id: "personalizado", label: "Personalizado" },
];

const CRM_TABS: { id: CrmTab; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "usuarios",    label: "Usuarios" },
  { id: "workspaces",  label: "Workspaces" },
  { id: "pipeline",    label: "Pipeline" },
  { id: "features",    label: "Features" },
];

function CrmPlaceholder({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center text-sm text-gray-400 px-5">
      {label} — en construcción
    </div>
  );
}

export default function DashboardPage() {
  const { user, selectedWorkspace, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState<Tab>("crm");
  const [crmTab,    setCrmTab]      = useState<CrmTab>("overview");

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) { router.replace("/login"); return; }
    if (!user.isSuperAdmin && !selectedWorkspace) router.replace("/workspace");
  }, [user, selectedWorkspace, _hasHydrated, router]);

  if (!_hasHydrated || !user) return null;
  if (!user.isSuperAdmin && !selectedWorkspace) return null;

  const isWorkspaceMode    = !!selectedWorkspace;
  const isSuperPlatformMode = user.isSuperAdmin && !isWorkspaceMode;

  // Vista cliente / workspace — sin tabs
  if (!isSuperPlatformMode) {
    return (
      <AuthLayout>
        <div className="p-6 h-[calc(100vh-57px)]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-hidden">
            <MetabaseDashboard
              dashboardId={WORKSPACE_DASHBOARD_ID}
              workspaceName={selectedWorkspace?.workspace.name}
            />
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
              </div>

              {/* Contenido del sub-tab */}
              <div className="flex-1 overflow-hidden min-h-0">
                {crmTab === "overview"   && <CrmOverview />}
                {crmTab === "usuarios"   && <CrmUsuarios />}
                {crmTab === "workspaces" && <CrmPlaceholder label="Workspaces" />}
                {crmTab === "pipeline"   && <CrmPlaceholder label="Pipeline" />}
                {crmTab === "features"   && <CrmPlaceholder label="Features" />}
              </div>

            </div>
          )}

          {activeTab === "personalizado" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden">
              <MetabaseDashboard dashboardId={SUPER_ADMIN_DASHBOARD_ID} />
            </div>
          )}

        </div>
      </div>
    </AuthLayout>
  );
}

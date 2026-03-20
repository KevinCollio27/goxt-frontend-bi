"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import AuthLayout from "@/components/AuthLayout";
import MetabaseDashboard from "@/components/MetabaseDashboard";

const SUPER_ADMIN_DASHBOARD_ID = 3;
const WORKSPACE_DASHBOARD_ID = 121;

export default function DashboardPage() {
  const { user, selectedWorkspace, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) { router.replace("/login"); return; }
    // Usuario normal sin workspace seleccionado → forzar selección
    if (!user.isSuperAdmin && !selectedWorkspace) router.replace("/workspace");
  }, [user, selectedWorkspace, _hasHydrated, router]);

  if (!_hasHydrated || !user) return null;
  if (!user.isSuperAdmin && !selectedWorkspace) return null;

  const dashboardId = user.isSuperAdmin ? SUPER_ADMIN_DASHBOARD_ID : WORKSPACE_DASHBOARD_ID;
  const workspaceName = user.isSuperAdmin ? undefined : selectedWorkspace?.workspace.name;

  return (
    <AuthLayout>
      <div className="p-6 h-[calc(100vh-57px)]">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-hidden">
          <MetabaseDashboard dashboardId={dashboardId} workspaceName={workspaceName} />
        </div>
      </div>
    </AuthLayout>
  );
}

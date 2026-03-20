"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useAuthStore, Workspace } from "@/store/auth.store";

export default function WorkspacePage() {
  const { user, setWorkspace, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"crm" | "cargo">("crm");

  useEffect(() => {
    if (_hasHydrated && !user) router.replace("/login");
  }, [user, _hasHydrated, router]);

  useEffect(() => {
    if (user && !user.hasCRM && user.hasCargo) setActiveTab("cargo");
  }, [user]);

  if (!_hasHydrated || !user) return null;

  const hasCRM = user.hasCRM && user.crmWorkspaces.length > 0;
  const hasCargo = user.hasCargo && user.cargoWorkspaces.length > 0;
  const showTabs = hasCRM && hasCargo;
  const totalWorkspaces =
    (hasCRM ? user.crmWorkspaces.length : 0) +
    (hasCargo ? user.cargoWorkspaces.length : 0);

  const activeWorkspaces =
    activeTab === "crm"
      ? hasCRM ? user.crmWorkspaces : []
      : hasCargo ? user.cargoWorkspaces : [];

  const firstName = user.name.split(" ")[0];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSelect = (workspace: Workspace, source: "crm" | "cargo") => {
    setWorkspace(workspace, source);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f0f2f5] flex flex-col">

      {/* Navbar separado */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 shrink-0 flex items-center justify-between">
          <Image
            src="/images/goxt-negro.png"
            alt="GOxT"
            width={80}
            height={28}
            className="object-contain"
          />
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600 truncate max-w-45">
              {user.name}
            </span>
            <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
      </header>

      {/* Contenedor card */}
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Logo + saludo */}
        <div className="text-center px-6 pt-7 pb-5">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/Logo BI.png"
              alt="GOxT BI"
              width={180}
              height={58}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-ink">
            Hola, {firstName} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Selecciona el workspace que quieres analizar
          </p>
        </div>

        {/* Separador */}
        <div className="mx-5 border-t border-gray-100" />

        {/* Subheader de workspaces */}
        <div className="px-5 pt-4 pb-1 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Tus espacios de trabajo</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Tienes acceso a {totalWorkspaces}{" "}
              {totalWorkspaces === 1 ? "workspace" : "workspaces"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div className="flex gap-1 px-5 pt-3">
            {(["crm", "cargo"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-teal/10 text-teal"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === "crm" ? "CRM" : "Cargo"}
              </button>
            ))}
          </div>
        )}

        {/* Label sección (sin tabs) */}
        {!showTabs && (hasCRM || hasCargo) && (
          <div className="px-5 pt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {hasCRM ? "CRM" : "Cargo"}
            </p>
          </div>
        )}

        {/* Lista workspaces */}
        <div className="px-4 pt-2 pb-4 space-y-2">
          {activeWorkspaces.map((ws) => (
            <WorkspaceCard
              key={`${activeTab}-${ws.id}`}
              workspace={ws}
              source={activeTab}
              onSelect={handleSelect}
            />
          ))}

          {!hasCRM && !hasCargo && (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tienes workspaces activos en esta plataforma.
            </div>
          )}
        </div>

        {/* Footer del card */}
        <div className="border-t border-gray-50 px-5 py-3 text-center">
          <p className="text-[11px] text-gray-300">
            <span className="font-medium text-gray-400">GOXT</span> · Business Intelligence
          </p>
        </div>

      </div>
      </div>
    </div>
  );
}

function WorkspaceCard({
  workspace,
  source,
  onSelect,
}: {
  workspace: Workspace;
  source: "crm" | "cargo";
  onSelect: (ws: Workspace, source: "crm" | "cargo") => void;
}) {
  const initials = workspace.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isCRM = source === "crm";
  const badge = isCRM
    ? { label: "GOxT CRM", dot: "bg-teal", text: "text-teal", bg: "bg-teal/10 border-teal/20" }
    : { label: "GOxT Cargo", dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50 border-blue-100" };

  return (
    <button
      onClick={() => onSelect(workspace, source)}
      className={`flex items-center gap-4 w-full bg-gray-50 hover:bg-white border border-gray-100 rounded-xl p-4 transition-all group text-left cursor-pointer hover:shadow-sm ${
        isCRM
          ? "hover:border-teal/40 hover:ring-2 hover:ring-teal/10"
          : "hover:border-blue-200 hover:ring-2 hover:ring-blue-50"
      }`}
    >
      <div className="shrink-0">
        {workspace.logo ? (
          <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={workspace.logo} alt={workspace.name} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 font-bold text-sm">
            {initials}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{workspace.name}</p>
        <span className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.bg} ${badge.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
          {badge.label}
        </span>
      </div>

      <ChevronRight
        size={15}
        className={`shrink-0 transition-colors text-gray-300 ${
          isCRM ? "group-hover:text-teal" : "group-hover:text-blue-400"
        }`}
      />
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { PanelLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (_hasHydrated && !user) router.replace("/login");
  }, [user, _hasHydrated, router]);

  if (!_hasHydrated) return null;
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {sidebarOpen && <Sidebar />}

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${sidebarOpen ? "ml-60" : "ml-0"}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title={sidebarOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
          >
            <PanelLeft size={18} />
          </button>

          <PageHeader />
        </header>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}

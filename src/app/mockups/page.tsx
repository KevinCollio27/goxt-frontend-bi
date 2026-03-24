"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Search, Maximize2, Minimize2, ArrowLeft, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockupItem {
  file: string;
  label: string;
  category: string;
}

export default function MockupsPage() {
  const { user, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [items, setItems] = useState<MockupItem[]>([]);
  const [selected, setSelected] = useState<MockupItem | null>(null);
  const [search, setSearch] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) { router.replace("/login"); return; }
    if (!user.isSuperAdmin) { router.replace("/dashboard"); return; }
  }, [user, _hasHydrated, router]);

  useEffect(() => {
    fetch("/api/mockups")
      .then((r) => r.json())
      .then((data: MockupItem[]) => {
        setItems(data);
        if (data.length > 0) setSelected(data[0]);
      });
  }, []);

  if (!_hasHydrated || !user || !user.isSuperAdmin) return null;

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, MockupItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">

      {/* Sidebar — oculto en fullscreen */}
      {!fullscreen && (
        <aside className="w-64 flex flex-col bg-ink shrink-0">

          {/* Header */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-1 rounded text-ash/50 hover:text-white transition-colors cursor-pointer"
                title="Volver al dashboard"
              >
                <ArrowLeft size={14} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal/20 flex items-center justify-center">
                  <FlaskConical size={13} className="text-teal" />
                </div>
                <span className="text-sm font-semibold text-white">Mockup Viewer</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash/40" />
              <input
                type="text"
                placeholder="Buscar mockup..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white placeholder-ash/40 focus:outline-none focus:border-teal/40 transition-colors"
              />
            </div>
          </div>

          {/* Lista */}
          <nav className="flex-1 overflow-y-auto py-2">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category} className="mb-2">
                <p className="px-4 py-1.5 text-[9px] font-semibold tracking-widest text-ash/40 uppercase">
                  {category}
                </p>
                {categoryItems.map((item) => (
                  <button
                    key={item.file}
                    onClick={() => setSelected(item)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer",
                      selected?.file === item.file
                        ? "bg-teal/15 text-white font-medium border-r-2 border-teal"
                        : "text-ash hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="px-4 py-6 text-xs text-ash/40 text-center">Sin resultados</p>
            )}
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-[10px] text-ash/30 text-center">{items.length} mockups · solo super admin</p>
          </div>
        </aside>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-11 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            {fullscreen && (
              <button
                onClick={() => setFullscreen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors cursor-pointer mr-1"
              >
                <ArrowLeft size={15} />
              </button>
            )}
            <span className="text-sm font-medium text-gray-700 truncate">
              {selected?.label ?? "Selecciona un mockup"}
            </span>
            {selected && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">
                {selected.file}
              </span>
            )}
          </div>

          <button
            onClick={() => setFullscreen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </header>

        {/* Iframe */}
        <div className="flex-1 overflow-hidden">
          {selected ? (
            <iframe
              key={selected.file}
              src={`/api/mockups/serve?file=${encodeURIComponent(selected.file)}`}
              className="w-full h-full border-0"
              title={selected.label}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Selecciona un mockup del panel izquierdo
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

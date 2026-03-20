import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Workspace {
  id: number;
  name: string;
  logo: string | null;
}

export interface User {
  email: string;
  name: string;
  hasCRM: boolean;
  hasCargo: boolean;
  isSuperAdmin: boolean;
  crmWorkspaces: Workspace[];
  cargoWorkspaces: Workspace[];
}

interface AuthStore {
  token: string | null;
  user: User | null;
  selectedWorkspace: { workspace: Workspace; source: "crm" | "cargo" } | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setWorkspace: (workspace: Workspace, source: "crm" | "cargo") => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

// Wrapper que no revienta si localStorage está lleno o restringido
const safeStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch (err) {
      console.warn("[AuthStore] localStorage write failed:", err);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {}
  },
}));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      selectedWorkspace: null,
      _hasHydrated: false,
      setAuth: (token, user) => set({ token, user }),
      setWorkspace: (workspace, source) => set({ selectedWorkspace: { workspace, source } }),
      logout: () => set({ token: null, user: null, selectedWorkspace: null }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "goxt-bi-auth",
      storage: safeStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        selectedWorkspace: state.selectedWorkspace,
        // _hasHydrated excluido: siempre arranca en false y se activa solo tras leer localStorage
      }),
    }
  )
);

import api from "@/lib/api";

export interface SuperAdmin {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked" | "pending";
  source: "crm" | "cargo" | "crm_cargo" | "external";
  crm_user_id: number | null;
  cargo_user_id: number | null;
  last_access: string | null;
  created_at: string;
}

export interface SuperAdminSearchResult {
  name: string;
  email: string;
  source: "crm" | "cargo" | "crm_cargo";
  crm_user_id: number | null;
  cargo_user_id: number | null;
}

export interface PaginatedSuperAdmins {
  data: SuperAdmin[];
  total: number;
  page: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

// wrapResult spreads el payload con success:true al mismo nivel
// findAll  → { success, data: SuperAdmin[], total, page, totalPages, nextPage, prevPage }
// search   → { success, results: SearchResult[] }
// create*  → { success, data: SuperAdmin, message }
// remove   → { success, message }

export const superAdminService = {
  async getAll(page = 1, take = 100, filter = ""): Promise<PaginatedSuperAdmins> {
    const params = new URLSearchParams({ page: String(page), take: String(take) });
    if (filter) params.set("filter", filter);
    const { data } = await api.get(`/api/super-admins?${params}`);
    return {
      data:       data.data,
      total:      data.total,
      page:       data.page,
      totalPages: data.totalPages,
      nextPage:   data.nextPage,
      prevPage:   data.prevPage,
    };
  },

  async search(q: string): Promise<SuperAdminSearchResult[]> {
    const { data } = await api.get(`/api/super-admins/search?q=${encodeURIComponent(q)}`);
    return data.results;
  },

  async createFromSystem(payload: {
    name: string;
    email: string;
    source: "crm" | "cargo" | "crm_cargo";
    crm_user_id?: number | null;
    cargo_user_id?: number | null;
  }): Promise<SuperAdmin> {
    const { data } = await api.post("/api/super-admins/from-system", payload);
    return data.data;
  },

  async createExternal(payload: { name: string; email: string }): Promise<SuperAdmin> {
    const { data } = await api.post("/api/super-admins/external", payload);
    return data.data;
  },

  async updateStatus(id: number, status: "active" | "blocked"): Promise<SuperAdmin> {
    const { data } = await api.patch(`/api/super-admins/${id}/status`, { status });
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/super-admins/${id}`);
  },
};

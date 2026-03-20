import api from "./axios.service";

export const MetabaseService = {
  async getEmbedToken(dashboardId: number, workspaceName?: string): Promise<string> {
    const params = new URLSearchParams({ dashboard: String(dashboardId) });
    if (workspaceName) params.append("workspace_name", workspaceName);
    const res = await api.get(`/api/metabase/token?${params}`);
    return res.data.token;
  },
};

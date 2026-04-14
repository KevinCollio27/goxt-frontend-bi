import api from "./axios.service";

export type IntegrationSource = "crm" | "cargo";
export type IntegrationType   = "looker_studio";

export interface WorkspaceIntegration {
  id:           number;
  workspace_id: number;
  source:       IntegrationSource;
  type:         IntegrationType;
  config:       { url: string };
  created_at:   string;
  updated_at:   string;
}

const LOOKER_EMBED_PREFIX = "https://lookerstudio.google.com/embed/reporting/";

export const IntegrationsService = {

  validate(type: IntegrationType, url: string): string | null {
    if (type === "looker_studio") {
      if (!url.trim()) return "La URL es requerida.";
      if (!url.startsWith(LOOKER_EMBED_PREFIX))
        return `La URL debe comenzar con "${LOOKER_EMBED_PREFIX}"`;
    }
    return null;
  },

  async getByWorkspace(workspaceId: number, source: IntegrationSource): Promise<WorkspaceIntegration[]> {
    const params = new URLSearchParams({ workspace_id: String(workspaceId), source });
    const res = await api.get(`/api/integrations?${params}`);
    return res.data.data;
  },

  async upsert(workspaceId: number, source: IntegrationSource, type: IntegrationType, url: string): Promise<WorkspaceIntegration> {
    const res = await api.post("/api/integrations", {
      workspace_id: workspaceId,
      source,
      type,
      config: { url },
    });
    return res.data.data;
  },

  async remove(workspaceId: number, source: IntegrationSource, type: IntegrationType): Promise<void> {
    const params = new URLSearchParams({ workspace_id: String(workspaceId), source });
    await api.delete(`/api/integrations/${type}?${params}`);
  },
};

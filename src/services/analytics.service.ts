import api from '@/lib/api';

export interface UserStats {
  total:           number;
  active:          number;
  inactive:        number;
  new30d:          number;
  newThisWeek:     number;
  activationPct:   number;
  activationDelta: number | null;
  active30d:       number;
  activeUsersPct:  number;
}

export interface WeeklyPoint  { label: string; value: number; }
export interface RankingItem  { label: string; value: number; }

export interface WorkspaceStats {
  total:       number;
  active:      number;
  inactive:    number;
  deleted:     number;
  active30d:   number;
  activeWsPct: number;
}

export interface PipelineStats {
  openCount:     number;
  wonCount:      number;
  lostCount:     number;
  totalHistoric: number;
  new30d:        number;
  closeRate:     number | null;
}

export interface ContactStats {
  personsTotal:      number;
  persons30d:        number;
  orgsTotal:         number;
  orgs30d:           number;
  opportunitiesOpen: number;
  opportunities30d:  number;
  activities30d:     number;
}

export interface QuotationStats { new30d: number; total: number; }
export interface AiLeadStats    { new30d: number; total: number; }

export interface HealthData {
  inactiveWorkspaces:    string[];
  usersWithoutWorkspace: number;
  staleOpportunities:    number;
  overdueOpportunities:  number;
  staleDraftQuotations:  number;
  newWorkspacesThisWeek: string[];
}

export interface WaterfallPoint { label: string; value: number; }

export interface DirectoryUser {
  id:         number;
  name:       string;
  email:      string;
  createdAt:  string;
  isActive:   boolean;
  workspaces: Array<{ name: string; role: "dueño" | "admin" | "invitado" }>;
}

export interface RankingUser {
  id: number; name: string; email: string;
  actividades: number; oportunidades: number; notas: number; cotizaciones: number;
  total: number;
}

export interface RankingStats {
  powerUsers:      number;
  totalActions:    number;
  top3Pct:         number;
  zeroActionUsers: number;
}

export interface TtvStats {
  sameDay:       number;
  oneToSeven:    number;
  moreThanSeven: number;
  neverActed:    number;
}

export interface FantasmaUser {
  id:               number;
  name:             string;
  email:            string;
  registro:         string;
  primaryWorkspace: string | null;
  primaryRole:      'dueño' | 'admin' | 'invitado' | null;
  daysSinceAction:  number;
  urgencia:         'crítico' | 'en riesgo' | 'observar' | 'nuevo';
}

export interface FantasmaStats {
  total:         number;
  criticos:      number;
  withWorkspace: number;
}

export interface UserActivityDetail {
  id:             number;
  firstEntity:    string | null;
  firstAction:    string | null;
  firstActionAt:  string | null;
  firstWorkspace: string | null;
  minutesToFirst: number | null;
  actividades:    number;
  oportunidades:  number;
  notas:          number;
  daysSinceLast:  number | null;
  lastNoteAt:     string | null;
  lastNoteWs:     string | null;
  lastOppAt:      string | null;
  lastOppWs:      string | null;
  lastActAt:      string | null;
  lastActWs:      string | null;
}

export interface CrmUsersData {
  userStats:             UserStats;
  usersWithoutWorkspace: number;
  cascada:               WaterfallPoint[];
  directorio:            DirectoryUser[];
  rankingStats:          RankingStats;
  ranking:               RankingUser[];
  ttvStats:              TtvStats;
  fantasmaStats:         FantasmaStats;
  fantasmas:             FantasmaUser[];
  activityDetail:        UserActivityDetail[];
}

export interface CrmOverviewData {
  userStats:       UserStats;
  weeklyNewUsers:  WeeklyPoint[];
  weeklyActivity:  WeeklyPoint[];
  workspaceStats:  WorkspaceStats;
  mostActiveWs:    RankingItem[];
  usersPerWs:      RankingItem[];
  pipelineStats:   PipelineStats;
  contactStats:    ContactStats;
  quotationStats:  QuotationStats;
  aiLeadStats:     AiLeadStats;
  frequentActions: RankingItem[];
  topEntities:     RankingItem[];
  health:          HealthData;
}

export const AnalyticsService = {
  getCrmOverview: (): Promise<CrmOverviewData> =>
    api.get('/api/analytics/crm/overview').then((r) => r.data.data),
  getCrmUsers: (): Promise<CrmUsersData> =>
    api.get('/api/analytics/crm/users').then((r) => r.data.data),
};

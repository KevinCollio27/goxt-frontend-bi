import { create } from 'zustand';

// ─── Presets de fecha ─────────────────────────────────────────────────────────

export type DatePreset =
  | 'all'
  | 'today'
  | 'yesterday'
  | '7d'
  | '30d'
  | 'this_month'
  | 'last_month'
  | '3m'
  | '12m';

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  all:        'Desde el inicio',
  today:      'Hoy',
  yesterday:  'Ayer',
  '7d':       '7 días anteriores',
  '30d':      '30 días anteriores',
  this_month: 'Este mes',
  last_month: 'Mes anterior',
  '3m':       '3 meses anteriores',
  '12m':      '12 meses anteriores',
};

function presetToDates(preset: DatePreset): { dateFrom: string | null; dateTo: string | null } {
  if (preset === 'all') return { dateFrom: null, dateTo: null };

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'today':
      return { dateFrom: today.toISOString(), dateTo: null };

    case 'yesterday': {
      const from = new Date(today);
      from.setDate(today.getDate() - 1);
      return { dateFrom: from.toISOString(), dateTo: today.toISOString() };
    }

    case '7d': {
      const from = new Date(today);
      from.setDate(today.getDate() - 7);
      return { dateFrom: from.toISOString(), dateTo: null };
    }

    case '30d': {
      const from = new Date(today);
      from.setDate(today.getDate() - 30);
      return { dateFrom: from.toISOString(), dateTo: null };
    }

    case 'this_month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { dateFrom: from.toISOString(), dateTo: null };
    }

    case 'last_month': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to   = new Date(now.getFullYear(), now.getMonth(), 1);
      return { dateFrom: from.toISOString(), dateTo: to.toISOString() };
    }

    case '3m': {
      const from = new Date(today);
      from.setMonth(today.getMonth() - 3);
      return { dateFrom: from.toISOString(), dateTo: null };
    }

    case '12m': {
      const from = new Date(today);
      from.setFullYear(today.getFullYear() - 1);
      return { dateFrom: from.toISOString(), dateTo: null };
    }
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface FiltersState {
  datePreset:   DatePreset;
  dateFrom:     string | null;
  dateTo:       string | null;
  workspaceIds: number[];

  setDatePreset:   (preset: DatePreset) => void;
  setWorkspaceIds: (ids: number[]) => void;
  reset:           () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  datePreset:   'all',
  dateFrom:     null,
  dateTo:       null,
  workspaceIds: [],

  setDatePreset: (preset) => {
    const dates = presetToDates(preset);
    set({ datePreset: preset, ...dates });
  },

  setWorkspaceIds: (ids) => set({ workspaceIds: ids }),

  reset: () => set({ datePreset: 'all', dateFrom: null, dateTo: null, workspaceIds: [] }),
}));

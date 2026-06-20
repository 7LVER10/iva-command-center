import { create } from 'zustand';
import { IvaState, ProjectStatus, Agent, Project } from './types';
import { agents as defaultAgents } from './constants';
import { EnrichedProject, ExportFormat } from './vnext-types';
import { runAgentStack } from './agent-engine';
import { generateExport, downloadExport, copyToClipboard } from './export-engine';
import { getHistory, addHistoryEntry } from './history-engine';

const STORAGE_KEY = 'iva-state';

function loadPersistedState(): Partial<IvaState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      locale: parsed.locale,
      theme: parsed.theme,
    };
  } catch {
    return {};
  }
}

function persistState(state: IvaState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      locale: state.locale,
      theme: state.theme,
    }));
  } catch {}
}

const initialAgents: Agent[] = defaultAgents.map((a) => ({
  ...a,
  status: 'online' as const,
  metrics: {
    [a.metricsKey[0]]: Math.floor(Math.random() * 9000) + 1000,
    [a.metricsKey[1]]: Math.floor(Math.random() * 95) + 5,
    [a.metricsKey[2]]: Math.floor(Math.random() * 30) + 70,
  },
}));

export const useIvaStore = create<IvaState>((set, get) => ({
  locale: loadPersistedState().locale || 'ru',
  theme: loadPersistedState().theme || 'gold',
  navSection: 'search',
  sidebarCollapsed: false,
  searchQuery: '',
  countryFilter: 'all',
  nicheFilter: 'all',
  groupFilter: 'all',
  statusFilter: 'all',
  analysisStatus: 'idle',
  analysisResult: null,
  projects: [],
  projectsLoading: false,
  selectedProject: null,
  showCreateModal: false,
  showConfirmDialog: false,
  confirmDialogData: null,
  toasts: [],
  agents: initialAgents,
  showConfigDrawer: false,
  showRelevanceModal: false,
  showMarginModal: false,
  selectedFilter: 'all',
  enrichedProjects: [],
  analysisHistory: [],
  competitorMode: false,
  selectedExportFormat: 'brief' as ExportFormat,
  showHistory: false,

  setLocale: (locale) => {
    set({ locale });
    setTimeout(() => persistState(get()), 0);
  },
  setTheme: (theme) => {
    set({ theme });
    setTimeout(() => persistState(get()), 0);
  },
  setNavSection: (section) => set({ navSection: section }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCountryFilter: (country) => set({ countryFilter: country }),
  setNicheFilter: (niche) => set({ nicheFilter: niche }),
  setGroupFilter: (group) => set({ groupFilter: group }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowConfigDrawer: (show) => set({ showConfigDrawer: show }),
  setShowRelevanceModal: (show) => set({ showRelevanceModal: show }),
  setShowMarginModal: (show) => set({ showMarginModal: show }),
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setCompetitorMode: (mode) => set({ competitorMode: mode }),
  setSelectedExportFormat: (format) => set({ selectedExportFormat: format }),
  setShowHistory: (show) => set({ showHistory: show }),

  showConfirmDialogFn: (data) => set({ showConfirmDialog: true, confirmDialogData: data }),
  hideConfirmDialog: () => set({ showConfirmDialog: false, confirmDialogData: null }),

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 3000);
  },

  updateAgentStatus: (agentId, status) => {
    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === agentId ? { ...a, status } : a
      ),
    }));
  },

  loadProjects: async () => {
    set({ projectsLoading: true });
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      set({ projects: data, projectsLoading: false });
    } catch {
      set({ projectsLoading: false });
    }
  },

  runAnalysis: async () => {
    const { searchQuery, countryFilter, nicheFilter, groupFilter, statusFilter, locale } = get();
    set({ analysisStatus: 'loading', analysisResult: null });
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          country: countryFilter,
          niche: nicheFilter,
          group: groupFilter,
          status: statusFilter,
        }),
      });
      const data = await res.json();

      const enriched: EnrichedProject[] = data.items.map((project: Project) => {
        const agentResult = runAgentStack(project, locale);
        return {
          ...project,
          ...agentResult,
        };
      });

      set({ analysisStatus: 'success', analysisResult: data, enrichedProjects: enriched });

      await addHistoryEntry({
        geo: countryFilter,
        niche: nicheFilter,
        query: searchQuery,
        result_count: data.items.length,
        avg_opportunity: enriched.length > 0 ? Math.round(enriched.reduce((a, e) => a + (e.scores?.opportunity?.value || 0), 0) / enriched.length) : 0,
        avg_risk: enriched.length > 0 ? Math.round(enriched.reduce((a, e) => a + (e.scores?.risk?.value || 0), 0) / enriched.length) : 0,
        avg_margin: enriched.length > 0 ? Math.round(enriched.reduce((a, e) => a + (e.scores?.margin?.value || 0), 0) / enriched.length) : 0,
        top_project_id: enriched[0]?.id || 0,
      });

      const history = await getHistory();
      set({ analysisHistory: history });
    } catch {
      set({ analysisStatus: 'error' });
    }
  },

  resetAnalysis: () => set({ analysisStatus: 'idle', analysisResult: null, enrichedProjects: [] }),

  updateProjectStatus: async (id: number, status: ProjectStatus) => {
    await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    get().loadProjects();
    get().addToast({ type: 'success', message: 'Status updated' });
  },

  deleteProject: async (id: number) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    get().loadProjects();
    get().addToast({ type: 'success', message: 'Project deleted' });
  },

  createProject: async (data) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        get().loadProjects();
        get().addToast({ type: 'success', message: 'Project created' });
        return true;
      }
      get().addToast({ type: 'error', message: 'Failed to create project' });
      return false;
    } catch {
      get().addToast({ type: 'error', message: 'Failed to create project' });
      return false;
    }
  },

  updateProject: async (id: number, data) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      get().loadProjects();
      get().addToast({ type: 'success', message: 'Project updated' });
    } catch {
      get().addToast({ type: 'error', message: 'Failed to update project' });
    }
  },

  exportProject: (project) => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    get().addToast({ type: 'success', message: 'Project exported' });
  },

  exportEnriched: (project, format) => {
    const { locale } = get();
    const payload = generateExport(project, format, locale);
    downloadExport(payload, project.name.replace(/\s+/g, '-').toLowerCase());
    get().addToast({ type: 'success', message: `Exported as ${format}` });
  },

  copyExport: async (project, format) => {
    const { locale } = get();
    const payload = generateExport(project, format, locale);
    await copyToClipboard(payload.content);
    get().addToast({ type: 'success', message: 'Copied to clipboard' });
  },

  loadHistory: async () => {
    const history = await getHistory();
    set({ analysisHistory: history });
  },
}));

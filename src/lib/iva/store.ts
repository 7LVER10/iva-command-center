import { create } from 'zustand';
import { IvaState, ProjectStatus, Project } from './types';

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
      sidebarCollapsed: parsed.sidebarCollapsed,
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
      sidebarCollapsed: state.sidebarCollapsed,
    }));
  } catch {}
}

export const useIvaStore = create<IvaState>((set, get) => ({
  locale: loadPersistedState().locale || 'en',
  theme: loadPersistedState().theme || 'gold',
  navSection: 'search',
  sidebarCollapsed: loadPersistedState().sidebarCollapsed ?? false,
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

  setLocale: (locale) => {
    set({ locale });
    setTimeout(() => persistState(get()), 0);
  },
  setTheme: (theme) => {
    set({ theme });
    setTimeout(() => persistState(get()), 0);
  },
  setNavSection: (section) => set({ navSection: section }),
  toggleSidebar: () => {
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }));
    setTimeout(() => persistState(get()), 0);
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCountryFilter: (country) => set({ countryFilter: country }),
  setNicheFilter: (niche) => set({ nicheFilter: niche }),
  setGroupFilter: (group) => set({ groupFilter: group }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  setSelectedProject: (project) => set({ selectedProject: project }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),

  showConfirmDialogFn: (data) => set({ showConfirmDialog: true, confirmDialogData: data }),
  hideConfirmDialog: () => set({ showConfirmDialog: false, confirmDialogData: null }),

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 3000);
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
    const { searchQuery, countryFilter, nicheFilter, groupFilter, statusFilter } = get();
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
      set({ analysisStatus: 'success', analysisResult: data });
    } catch {
      set({ analysisStatus: 'error' });
    }
  },

  resetAnalysis: () => set({ analysisStatus: 'idle', analysisResult: null }),

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

  exportProject: (project: Project) => {
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
}));

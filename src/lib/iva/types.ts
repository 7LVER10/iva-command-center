import { EnrichedProject, AnalysisHistoryEntry, ExportFormat } from './vnext-types';

export type Locale = 'en' | 'ru' | 'de' | 'tr';
export type Theme = 'gold' | 'ocean' | 'forest';
export type Priority = 'high' | 'medium' | 'low';
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'archived';
export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
export type NavSection = 'search' | 'projects' | 'analytics' | 'reports' | 'settings' | 'agents';

export interface Project {
  id: number;
  name: string;
  country: string;
  niche: string;
  grp: string;
  relevance: number;
  priority: Priority;
  status: ProjectStatus;
  summary_en: string;
  summary_ru: string;
  summary_de: string;
  summary_tr: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisMetrics {
  total: number;
  avgRelevance: number;
  highPriorityCount: number;
}

export interface AnalysisResult {
  items: Project[];
  metrics: AnalysisMetrics;
}

export interface AnalysisLog {
  id: number;
  query: string;
  country_filter: string;
  niche_filter: string;
  group_filter: string;
  result_count: number;
  avg_relevance: number;
  high_priority_count: number;
  created_at: string;
}

export interface Toast {
  id?: number;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  onConfirm: () => void;
}

export interface Agent {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  metricsKey: string[];
  status?: 'online' | 'offline' | 'processing';
  metrics?: Record<string, number>;
}

export interface IvaState {
  locale: Locale;
  theme: Theme;
  navSection: NavSection;
  sidebarCollapsed: boolean;
  searchQuery: string;
  countryFilter: string;
  nicheFilter: string;
  groupFilter: string;
  statusFilter: string;
  analysisStatus: AnalysisStatus;
  analysisResult: AnalysisResult | null;
  projects: Project[];
  projectsLoading: boolean;
  selectedProject: Project | null;
  showCreateModal: boolean;
  showConfirmDialog: boolean;
  confirmDialogData: ConfirmDialogData | null;
  toasts: Toast[];
  agents: Agent[];
  showConfigDrawer: boolean;
  showRelevanceModal: boolean;
  showMarginModal: boolean;
  selectedFilter: string;
  enrichedProjects: EnrichedProject[];
  analysisHistory: AnalysisHistoryEntry[];
  competitorMode: boolean;
  selectedExportFormat: ExportFormat;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  setNavSection: (section: NavSection) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setCountryFilter: (country: string) => void;
  setNicheFilter: (niche: string) => void;
  setGroupFilter: (group: string) => void;
  setStatusFilter: (status: string) => void;
  setSelectedProject: (project: Project | null) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowConfigDrawer: (show: boolean) => void;
  setShowRelevanceModal: (show: boolean) => void;
  setShowMarginModal: (show: boolean) => void;
  setSelectedFilter: (filter: string) => void;
  setCompetitorMode: (mode: boolean) => void;
  setSelectedExportFormat: (format: ExportFormat) => void;
  showConfirmDialogFn: (data: ConfirmDialogData) => void;
  hideConfirmDialog: () => void;
  addToast: (toast: Toast) => void;
  runAnalysis: () => Promise<void>;
  resetAnalysis: () => void;
  loadProjects: () => Promise<void>;
  updateProjectStatus: (id: number, status: ProjectStatus) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  createProject: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateProject: (id: number, data: Partial<Project>) => Promise<void>;
  exportProject: (project: Project) => void;
  exportEnriched: (project: EnrichedProject, format: ExportFormat) => void;
  copyExport: (project: EnrichedProject, format: ExportFormat) => Promise<void>;
  loadHistory: () => void;
  updateAgentStatus: (agentId: string, status: 'online' | 'offline' | 'processing') => void;
}

'use client';

import { useEffect, useMemo } from 'react';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import IvaHeader from './iva-header';
import IvaStatsRow from './iva-stats-row';
import IvaProjectCard from './iva-project-card';
import IvaConfigDrawer from './iva-config-drawer';
import IvaRelevanceModal from './iva-relevance-modal';
import IvaMarginModal from './iva-margin-modal';
import IvaHistoryPanel from './iva-history-panel';
import ConfirmDialog from './confirm-dialog';
import ToastContainer from './toast';
import { Search, Clock } from 'lucide-react';

export default function IvaMainView() {
  const {
    locale, theme, projects, projectsLoading, loadProjects,
    searchQuery, setSearchQuery, selectedFilter, setSelectedFilter,
    enrichedProjects, analysisHistory, loadHistory,
    showHistory, setShowHistory,
  } = useIvaStore();

  useEffect(() => {
    loadProjects();
    loadHistory();
  }, [loadProjects, loadHistory]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.niche.toLowerCase().includes(q)
      );
    }
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(p => p.status === selectedFilter);
    }
    return filtered;
  }, [projects, searchQuery, selectedFilter]);

  const enrichedMap = useMemo(() => {
    const map = new Map(enrichedProjects.map(e => [e.id, e]));
    return map;
  }, [enrichedProjects]);

  const filterCounts = useMemo(() => ({
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    archived: projects.filter(p => p.status === 'archived').length,
  }), [projects]);

  const filters = [
    { key: 'all', label: t(locale, 'filterAll'), count: filterCounts.all },
    { key: 'active', label: t(locale, 'filterNew'), count: filterCounts.active },
    { key: 'completed', label: t(locale, 'filterApproved'), count: filterCounts.completed },
    { key: 'pending', label: t(locale, 'filterDeferred'), count: filterCounts.pending },
    { key: 'archived', label: t(locale, 'filterRejected'), count: filterCounts.archived },
  ];

  return (
    <div className="iva-main-layout" data-theme={theme} suppressHydrationWarning>
      <IvaHeader />
      <main className="iva-main-content">
        <IvaStatsRow />

        {/* Search + Filters + History Toggle */}
        <div className="iva-filters-bar">
          <div className="iva-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={t(locale, 'searchProjects')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="iva-filter-tabs">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`iva-filter-tab ${selectedFilter === f.key ? 'active' : ''}`}
                onClick={() => setSelectedFilter(f.key)}
              >
                {f.label} {f.count}
              </button>
            ))}
          </div>
          {analysisHistory.length > 0 && (
            <button
              className={`iva-history-toggle ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory(!showHistory)}
            >
              <Clock size={14} /> {t(locale, 'history')} ({analysisHistory.length})
            </button>
          )}
        </div>

        {/* History Panel */}
        {showHistory && <IvaHistoryPanel />}

        {/* Project Cards Grid */}
        {projectsLoading ? (
          <div className="iva-loading">
            <div className="iva-loading-spinner" />
            <span>{t(locale, 'loadingProjects')}</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="iva-empty">
            <span>{t(locale, 'noResults')}</span>
          </div>
        ) : (
          <div className="iva-cards-grid">
            {filteredProjects.map((project) => (
              <IvaProjectCard
                key={project.id}
                project={project}
                enriched={enrichedMap.get(project.id)}
              />
            ))}
          </div>
        )}
      </main>

      <IvaConfigDrawer />
      <IvaRelevanceModal />
      <IvaMarginModal />
      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
}

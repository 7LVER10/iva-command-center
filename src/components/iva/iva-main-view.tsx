'use client';

import { useEffect, useMemo } from 'react';
import { useIvaStore } from '@/lib/iva/store';
import IvaHeader from './iva-header';
import IvaStatsRow from './iva-stats-row';
import IvaProjectCard from './iva-project-card';
import IvaConfigDrawer from './iva-config-drawer';
import IvaRelevanceModal from './iva-relevance-modal';
import IvaMarginModal from './iva-margin-modal';
import ConfirmDialog from './confirm-dialog';
import ToastContainer from './toast';
import { Search } from 'lucide-react';

export default function IvaMainView() {
  const {
    projects, projectsLoading, loadProjects,
    searchQuery, setSearchQuery, selectedFilter, setSelectedFilter,
  } = useIvaStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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

  const filterCounts = useMemo(() => ({
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    archived: projects.filter(p => p.status === 'archived').length,
  }), [projects]);

  const filters = [
    { key: 'all', label: 'Все', count: filterCounts.all },
    { key: 'active', label: 'Новые', count: filterCounts.active },
    { key: 'completed', label: 'Одобрены', count: filterCounts.completed },
    { key: 'pending', label: 'Отложены', count: filterCounts.pending },
    { key: 'archived', label: 'Отклонены', count: filterCounts.archived },
  ];

  return (
    <div className="iva-main-layout">
      <IvaHeader />

      <main className="iva-main-content">
        <IvaStatsRow />

        {/* Search + Filters */}
        <div className="iva-filters-bar">
          <div className="iva-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Поиск проектов..."
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
        </div>

        {/* Project Cards Grid */}
        {projectsLoading ? (
          <div className="iva-loading">
            <div className="iva-loading-spinner" />
            <span>Загрузка проектов...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="iva-empty">
            <span>Нет проектов по заданным критериям</span>
          </div>
        ) : (
          <div className="iva-cards-grid">
            {filteredProjects.map((project) => (
              <IvaProjectCard key={project.id} project={project} />
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

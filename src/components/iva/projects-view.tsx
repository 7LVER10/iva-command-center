'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Project, ProjectStatus } from '@/lib/iva/types';
import { useEffect, useState } from 'react';
import { RefreshCw, Search, Globe, Layers, Flame, Trash2, Plus } from 'lucide-react';

export default function ProjectsView() {
  const { locale, projects, projectsLoading, loadProjects, deleteProject, updateProjectStatus, setShowCreateModal, showConfirmDialogFn, setSelectedProject } = useIvaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.niche.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const field = sortField as keyof Project;
    const aVal = a[field];
    const bVal = b[field];
    const aComp = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
    const bComp = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
    if (aComp < bComp) return sortDir === 'asc' ? -1 : 1;
    if (aComp > bComp) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / perPage);
  const paginatedProjects = sortedProjects.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getSummary = (p: Project) => {
    const key = `summary_${locale}` as keyof Project;
    return (p[key] as string) || p.summary_en;
  };

  const getStatusText = (status: ProjectStatus) => {
    return t(locale, `status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const handleDelete = (project: Project) => {
    showConfirmDialogFn({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.name}"?`,
      onConfirm: () => deleteProject(project.id),
    });
  };

  return (
    <div className="projects-view">
      <div className="projects-header">
        <h2 className="section-title">{t(locale, 'navProjects')}</h2>
        <button className="start-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          <span>New</span>
        </button>
        <button className="refresh-btn" onClick={() => loadProjects()} disabled={projectsLoading}>
          <RefreshCw size={16} className={projectsLoading ? 'spin' : ''} />
        </button>
      </div>

      <div className="projects-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder={t(locale, 'searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="control-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">{t(locale, 'allStatuses')}</option>
          {(['active', 'pending', 'completed', 'archived'] as ProjectStatus[]).map((s) => (
            <option key={s} value={s}>{getStatusText(s)}</option>
          ))}
        </select>
      </div>

      {projectsLoading ? (
        <div className="loading-state">
          <RefreshCw size={32} className="spin" />
          <p>{t(locale, 'loading')}</p>
        </div>
      ) : paginatedProjects.length === 0 ? (
        <div className="empty-state">
          <p>{t(locale, 'noResults')}</p>
        </div>
      ) : (
        <>
          <div className="projects-table-wrapper">
            <table className="projects-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">ID {sortField === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('name')} className="sortable">{t(locale, 'navProjects')} {sortField === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('country')} className="sortable">{t(locale, 'allCountries')} {sortField === 'country' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('niche')} className="sortable">{t(locale, 'allNiches')} {sortField === 'niche' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                  <th>{t(locale, 'allGroups')}</th>
                  <th onClick={() => handleSort('relevance')} className="sortable">{t(locale, 'metricsRelevance')} {sortField === 'relevance' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</th>
                  <th>{t(locale, 'statusLabel')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="id-cell">{project.id}</td>
                    <td className="name-cell">
                      <strong className="clickable" onClick={() => setSelectedProject(project)}>{project.name}</strong>
                      <span className="summary-preview">{getSummary(project).substring(0, 80)}...</span>
                    </td>
                    <td><Globe size={14} /> {project.country}</td>
                    <td><Layers size={14} /> {project.niche}</td>
                    <td><Flame size={14} /> {project.grp}</td>
                    <td>
                      <div className="relevance-inline">
                        <div className="relevance-track-small">
                          <div className="relevance-fill" style={{ width: `${Math.round(project.relevance * 100)}%` }} />
                        </div>
                        <span>{Math.round(project.relevance * 100)}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-selector-inline">
                        {(['active', 'pending', 'completed', 'archived'] as ProjectStatus[]).map((s) => (
                          <button
                            key={s}
                            className={`status-dot ${project.status === s ? s : ''}`}
                            onClick={() => updateProjectStatus(project.id, s)}
                            title={getStatusText(s)}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(project)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}

      <div className="projects-footer">
        <span>{filteredProjects.length} / {projects.length} {t(locale, 'navProjects').toLowerCase()}</span>
      </div>
    </div>
  );
}

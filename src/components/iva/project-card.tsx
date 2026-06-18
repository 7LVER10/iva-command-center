'use client';

import { Project, ProjectStatus } from '@/lib/iva/types';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Globe, Layers, Flame, ExternalLink, Download, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { locale, updateProjectStatus, deleteProject, setSelectedProject, exportProject, showConfirmDialogFn } = useIvaStore();

  const priorityColor = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  }[project.priority];

  const statusColor = {
    active: 'status-active',
    pending: 'status-pending',
    completed: 'status-completed',
    archived: 'status-archived',
  }[project.status];

  const relevancePercent = Math.round(project.relevance * 100);

  const getStatusText = (status: ProjectStatus) => {
    return t(locale, `status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const getSummary = () => {
    const key = `summary_${locale}` as keyof Project;
    return (project[key] as string) || project.summary_en;
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProjectStatus(project.id, newStatus);
  };

  const handleDelete = () => {
    showConfirmDialogFn({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      onConfirm: () => deleteProject(project.id),
    });
  };

  return (
    <div className="project-card">
      <div className="card-header">
        <h3 className="card-title">{project.name}</h3>
        <div className="card-badges">
          <span className={`priority-badge ${priorityColor}`}>
            {t(locale, `priority${project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}`)}
          </span>
          <span className={`status-badge ${statusColor}`}>
            {getStatusText(project.status)}
          </span>
        </div>
      </div>

      <div className="card-meta">
        <span className="meta-item"><Globe size={14} /> {project.country}</span>
        <span className="meta-item"><Layers size={14} /> {project.niche}</span>
        <span className="meta-item"><Flame size={14} /> {project.grp}</span>
      </div>

      <p className="card-summary">{getSummary()}</p>

      <div className="relevance-bar">
        <div className="relevance-track">
          <div
            className="relevance-fill"
            style={{ width: `${relevancePercent}%` }}
          />
        </div>
        <span className="relevance-value">{relevancePercent}%</span>
      </div>

      <div className="status-selector">
        <span className="status-label">{t(locale, 'statusLabel')}:</span>
        {(['active', 'pending', 'completed', 'archived'] as ProjectStatus[]).map((s) => (
          <button
            key={s}
            className={`status-option ${project.status === s ? 'active' : ''}`}
            onClick={() => handleStatusChange(s)}
          >
            {getStatusText(s)}
          </button>
        ))}
      </div>

      <div className="card-actions">
        <button className="action-btn" onClick={() => setSelectedProject(project)}>
          <ExternalLink size={14} />
          {t(locale, 'nextAction')}
        </button>
        <button className="action-btn" onClick={() => exportProject(project)}>
          <Download size={14} />
          {t(locale, 'exportAction')}
        </button>
        <button className="action-btn action-btn-danger" onClick={handleDelete}>
          <Trash2 size={14} />
          {t(locale, 'deleteAction')}
        </button>
      </div>
    </div>
  );
}

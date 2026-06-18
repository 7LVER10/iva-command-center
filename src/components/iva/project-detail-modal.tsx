'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Globe, Layers, Flame, Download, Calendar, Hash } from 'lucide-react';
import { ProjectStatus, Priority } from '@/lib/iva/types';

export default function ProjectDetailModal() {
  const { locale, selectedProject, setSelectedProject, exportProject } = useIvaStore();

  if (!selectedProject) return null;

  const p = selectedProject;
  const relevancePercent = Math.round(p.relevance * 100);

  const getSummary = () => {
    const key = `summary_${locale}` as 'summary_en' | 'summary_ru' | 'summary_de' | 'summary_tr';
    return p[key] || p.summary_en;
  };

  const priorityColors: Record<Priority, string> = {
    high: '#ef4444',
    medium: '#eab308',
    low: '#22c55e',
  };

  const statusColors: Record<ProjectStatus, string> = {
    active: '#3b82f6',
    pending: '#eab308',
    completed: '#22c55e',
    archived: '#6b7280',
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
      <div className="modal-content project-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{p.name}</h2>
          <button className="modal-close" onClick={() => setSelectedProject(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-badges">
            <span className="priority-badge" style={{ background: `${priorityColors[p.priority]}20`, color: priorityColors[p.priority] }}>
              {t(locale, `priority${p.priority.charAt(0).toUpperCase() + p.priority.slice(1)}`)}
            </span>
            <span className="status-badge" style={{ background: `${statusColors[p.status]}20`, color: statusColors[p.status] }}>
              {t(locale, `status${p.status.charAt(0).toUpperCase() + p.status.slice(1)}`)}
            </span>
          </div>

          <div className="detail-meta">
            <div className="detail-meta-item">
              <Globe size={16} />
              <span>{p.country}</span>
            </div>
            <div className="detail-meta-item">
              <Layers size={16} />
              <span>{p.niche}</span>
            </div>
            <div className="detail-meta-item">
              <Flame size={16} />
              <span>Group {p.grp}</span>
            </div>
            <div className="detail-meta-item">
              <Hash size={16} />
              <span>ID: {p.id}</span>
            </div>
            <div className="detail-meta-item">
              <Calendar size={16} />
              <span>Created: {new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Relevance</h3>
            <div className="relevance-bar" style={{ marginTop: '0.5rem' }}>
              <div className="relevance-track" style={{ height: '8px' }}>
                <div className="relevance-fill" style={{ width: `${relevancePercent}%` }} />
              </div>
              <span className="relevance-value" style={{ fontSize: '1.1rem' }}>{relevancePercent}%</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Summary</h3>
            <p className="detail-summary">{getSummary() || 'No summary available.'}</p>
          </div>

          <div className="detail-section">
            <h3>All Summaries</h3>
            <div className="detail-summaries">
              {(['en', 'ru', 'de', 'tr'] as const).map((lang) => {
                const key = `summary_${lang}` as 'summary_en' | 'summary_ru' | 'summary_de' | 'summary_tr';
                return (
                  <div key={lang} className="summary-lang">
                    <span className="lang-label">{lang.toUpperCase()}</span>
                    <span className="lang-text">{p[key] || '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="confirm-cancel" onClick={() => setSelectedProject(null)}>
            Close
          </button>
          <button className="start-btn" onClick={() => exportProject(p)}>
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}

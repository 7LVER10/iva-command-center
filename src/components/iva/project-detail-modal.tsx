'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Globe, Layers, Flame, Download, Calendar, Hash, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
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
    high: '#C83030',
    medium: '#C07020',
    low: '#30A840',
  };

  const statusColors: Record<ProjectStatus, string> = {
    active: '#3A6A9A',
    pending: '#C07020',
    completed: '#30A840',
    archived: '#6b7280',
  };

  const riskScore = Math.round((1 - p.relevance) * 100);
  const marginScore = Math.round(p.relevance * 85 + (p.id % 15));

  return (
    <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
      <div className="modal-content project-detail" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'rgba(200, 160, 48, 0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)',
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{p.name}</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                IVA-{String(p.id).padStart(3, '0')}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={() => setSelectedProject(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-badges">
            <span className="priority-badge" style={{ background: `${priorityColors[p.priority]}20`, color: priorityColors[p.priority], borderColor: `${priorityColors[p.priority]}40` }}>
              {t(locale, `priority${p.priority.charAt(0).toUpperCase() + p.priority.slice(1)}`)}
            </span>
            <span className="status-badge" style={{ background: `${statusColors[p.status]}20`, color: statusColors[p.status], borderColor: `${statusColors[p.status]}40` }}>
              {t(locale, `status${p.status.charAt(0).toUpperCase() + p.status.slice(1)}`)}
            </span>
          </div>

          <div className="detail-meta">
            <div className="detail-meta-item">
              <Globe size={16} /> {p.country}
            </div>
            <div className="detail-meta-item">
              <Layers size={16} /> {p.niche}
            </div>
            <div className="detail-meta-item">
              <Flame size={16} /> Group {p.grp}
            </div>
            <div className="detail-meta-item">
              <Hash size={16} /> ID: {p.id}
            </div>
            <div className="detail-meta-item">
              <Calendar size={16} /> {new Date(p.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Score Bars */}
          <div className="detail-section">
            <h3>Scores</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <TrendingUp size={12} style={{ marginRight: 4 }} />
                    {t(locale, 'relevance')}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-primary)' }}>{relevancePercent}%</span>
                </div>
                <div className="relevance-track" style={{ height: 6 }}>
                  <div className="relevance-fill" style={{ width: `${relevancePercent}%`, background: 'var(--progress-relevance)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <AlertTriangle size={12} style={{ marginRight: 4 }} />
                    Risk
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-danger)' }}>{riskScore}%</span>
                </div>
                <div className="relevance-track" style={{ height: 6 }}>
                  <div className="relevance-fill" style={{ width: `${riskScore}%`, background: 'var(--progress-risk)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <TrendingUp size={12} style={{ marginRight: 4 }} />
                    Margin
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-success)' }}>{marginScore}%</span>
                </div>
                <div className="relevance-track" style={{ height: 6 }}>
                  <div className="relevance-fill" style={{ width: `${marginScore}%`, background: 'var(--progress-margin)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>{t(locale, 'summary')}</h3>
            <p className="detail-summary">{getSummary() || 'No summary available.'}</p>
          </div>

          <div className="detail-section">
            <h3>{t(locale, 'allSummaries')}</h3>
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

          {/* Metric Strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)', gap: 'var(--space-4)',
            borderTop: '1px solid var(--border-subtle)', marginTop: 'var(--space-2)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                {relevancePercent}%
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {t(locale, 'relevance')}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                {riskScore}%
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Risk
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {marginScore}%
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Margin
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="confirm-cancel" onClick={() => setSelectedProject(null)}>
            {t(locale, 'close')}
          </button>
          <button className="start-btn" onClick={() => exportProject(p)}>
            <Download size={16} />
            {t(locale, 'exportJson')}
          </button>
        </div>
      </div>
    </div>
  );
}

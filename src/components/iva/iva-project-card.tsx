'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/iva/types';
import { useIvaStore } from '@/lib/iva/store';
import {
  Building2, Tag, DollarSign, Calendar, ChevronDown, ChevronUp,
  CheckCircle, PauseCircle, XCircle, Sparkles
} from 'lucide-react';

interface IvaProjectCardProps {
  project: Project;
}

export default function IvaProjectCard({ project }: IvaProjectCardProps) {
  const { locale, updateProjectStatus, showConfirmDialogFn } = useIvaStore();
  const [expanded, setExpanded] = useState(false);

  const p = project;
  const relevancePercent = Math.round(p.relevance * 100);
  const riskScore = Math.round((1 - p.relevance) * 100);
  const marginScore = Math.round(p.relevance * 85 + (p.id % 15));

  const getSummary = () => {
    const key = `summary_${locale}` as 'summary_en' | 'summary_ru' | 'summary_de' | 'summary_tr';
    return p[key] || p.summary_en;
  };

  const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
    active: { label: 'НОВЫЙ', color: '#C8A040', bg: 'rgba(200,160,48,0.2)' },
    pending: { label: 'ОТЛОЖЕН', color: '#C07020', bg: 'rgba(192,112,32,0.2)' },
    completed: { label: 'ОДОБРЕН', color: '#30A840', bg: 'rgba(48,168,64,0.2)' },
    archived: { label: 'ОТКЛОНЕН', color: '#C83030', bg: 'rgba(200,48,48,0.2)' },
  };

  const status = statusConfig[p.status];

  const handleApprove = () => {
    showConfirmDialogFn({
      title: 'Одобрить проект',
      message: `Вы уверены, что хотите одобрить "${p.name}"?`,
      onConfirm: () => updateProjectStatus(p.id, 'completed'),
    });
  };

  const handleDefer = () => {
    showConfirmDialogFn({
      title: 'Отложить проект',
      message: `Вы уверены, что хотите отложить "${p.name}"?`,
      onConfirm: () => updateProjectStatus(p.id, 'pending'),
    });
  };

  const handleReject = () => {
    showConfirmDialogFn({
      title: 'Отклонить проект',
      message: `Вы уверены, что хотите отклонить "${p.name}"?`,
      onConfirm: () => updateProjectStatus(p.id, 'archived'),
    });
  };

  return (
    <div className="iva-project-card">
      {/* Card Header */}
      <div className="iva-card-header">
        <div className="iva-card-id">
          <span className="iva-card-id-icon">◈</span>
          <span className="iva-card-id-text">IVA-{String(p.id).padStart(3, '0')}</span>
        </div>
        <span className="iva-card-status-badge" style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}40` }}>
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="iva-card-title">{p.name}</h3>

      {/* Meta Row */}
      <div className="iva-card-meta">
        <span className="iva-meta-item">
          <Building2 size={13} />
          {p.niche}
        </span>
        <span className="iva-meta-item">
          <Tag size={13} />
          {p.grp}
        </span>
        <span className="iva-meta-item iva-meta-budget">
          <DollarSign size={13} />
          {(p.relevance * 1200).toFixed(0)} млн руб.
        </span>
        <span className="iva-meta-item">
          <Calendar size={13} />
          Q{Math.ceil((p.id % 4) + 1)} 2027
        </span>
      </div>

      {/* Score Bars */}
      <div className="iva-scores">
        <div className="iva-score-row">
          <span className="iva-score-label">Релевантность</span>
          <span className="iva-score-value" style={{ color: 'var(--gold-primary)' }}>{relevancePercent}</span>
        </div>
        <div className="iva-score-bar">
          <div className="iva-score-fill" style={{ width: `${relevancePercent}%`, background: 'var(--progress-relevance)' }} />
        </div>

        <div className="iva-score-row">
          <span className="iva-score-label">Риск</span>
          <span className="iva-score-value" style={{ color: 'var(--color-danger)' }}>{riskScore}</span>
        </div>
        <div className="iva-score-bar">
          <div className="iva-score-fill" style={{ width: `${riskScore}%`, background: 'var(--progress-risk)' }} />
        </div>

        <div className="iva-score-row">
          <span className="iva-score-label">Маржинальность</span>
          <span className="iva-score-value" style={{ color: 'var(--color-success)' }}>{marginScore}</span>
        </div>
        <div className="iva-score-bar">
          <div className="iva-score-fill" style={{ width: `${marginScore}%`, background: 'var(--progress-margin)' }} />
        </div>
      </div>

      {/* AI Analysis Expandable */}
      <div className="iva-ai-section">
        <button className="iva-ai-toggle" onClick={() => setExpanded(!expanded)}>
          <Sparkles size={14} />
          <span>AI-анализ</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded && (
          <div className="iva-ai-content">
            <p>{getSummary()}</p>
            <div className="iva-ai-tags">
              <span className="iva-ai-tag">{p.country}</span>
              <span className="iva-ai-tag">{p.niche}</span>
              <span className="iva-ai-tag">{p.grp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="iva-card-actions">
        <button className="iva-btn-approve" onClick={handleApprove}>
          <CheckCircle size={14} />
          Одобрить
        </button>
        <button className="iva-btn-defer" onClick={handleDefer}>
          <PauseCircle size={14} />
          Отложить
        </button>
        <button className="iva-btn-reject" onClick={handleReject}>
          <XCircle size={14} />
          Отклонить
        </button>
      </div>
    </div>
  );
}

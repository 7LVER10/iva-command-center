'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/iva/types';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import {
  Building2, Tag, DollarSign, Calendar, ChevronDown, ChevronUp,
  CheckCircle, PauseCircle, XCircle, Sparkles, MapPin, User
} from 'lucide-react';

interface IvaProjectCardProps {
  project: Project;
}

const companies = [
  'ООО «Донстрой Инвест»', 'АО «ЛенСпецСМУ»', 'ООО «Альфа-Строй»',
  'ПАО «Газпром»', 'ООО «Роснано»', 'АО «Ростех»',
  'ООО «СтройГрупп»', 'АО «ТехноПром»', 'ООО «ИнвестПроект»',
  'АО «ЕвроСтрой»', 'ООО «НовоДевелопмент»', 'АО «ПромСвязьСтрой»',
  'ООО «ЭнергоСтрой»', 'АО «МеталлКонструкция»', 'ООО «СтеклоПром»',
];

const clients = [
  'Департамент строительства', 'Министерство инфраструктуры',
  'Корпорация развития', 'Инвестфонд «Восток»', 'Группа компаний «Альфа»',
  'Холдинг «Евразия»', 'Фонд прямых инвестиций', 'Частный инвестор',
  'Государственная корпорация', 'Международный партнёр',
];

const deadlines = ['Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027', 'H1 2028', 'H2 2028'];

export default function IvaProjectCard({ project }: IvaProjectCardProps) {
  const { locale, updateProjectStatus, showConfirmDialogFn } = useIvaStore();
  const [expanded, setExpanded] = useState(false);

  const p = project;
  const relevancePercent = Math.round(p.relevance * 100);
  const riskScore = Math.round((1 - p.relevance) * 100);
  const marginScore = Math.round(p.relevance * 85 + (p.id % 15));

  const company = companies[p.id % companies.length];
  const client = clients[p.id % clients.length];
  const deadline = deadlines[p.id % deadlines.length];
  const budget = (p.relevance * 1200).toFixed(0);

  const getSummary = () => {
    const key = `summary_${locale}` as 'summary_en' | 'summary_ru' | 'summary_de' | 'summary_tr';
    return p[key] || p.summary_en;
  };

  const statusConfig: Record<ProjectStatus, { labelKey: string; color: string; bg: string }> = {
    active: { labelKey: 'statusNew', color: '#C8A040', bg: 'rgba(200,160,48,0.2)' },
    pending: { labelKey: 'statusDeferredCard', color: '#C07020', bg: 'rgba(192,112,32,0.2)' },
    completed: { labelKey: 'statusApprovedCard', color: '#30A840', bg: 'rgba(48,168,64,0.2)' },
    archived: { labelKey: 'statusRejectedCard', color: '#C83030', bg: 'rgba(200,48,48,0.2)' },
  };

  const status = statusConfig[p.status];

  const handleApprove = () => {
    showConfirmDialogFn({
      title: t(locale, 'confirmApproveTitle'),
      message: t(locale, 'confirmApproveMsg').replace('{name}', p.name),
      onConfirm: () => updateProjectStatus(p.id, 'completed'),
    });
  };

  const handleDefer = () => {
    showConfirmDialogFn({
      title: t(locale, 'confirmDeferTitle'),
      message: t(locale, 'confirmDeferMsg').replace('{name}', p.name),
      onConfirm: () => updateProjectStatus(p.id, 'pending'),
    });
  };

  const handleReject = () => {
    showConfirmDialogFn({
      title: t(locale, 'confirmRejectTitle'),
      message: t(locale, 'confirmRejectMsg').replace('{name}', p.name),
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
          {t(locale, status.labelKey)}
        </span>
      </div>

      {/* Title */}
      <h3 className="iva-card-title">{p.name}</h3>

      {/* Meta Row */}
      <div className="iva-card-meta">
        <span className="iva-meta-item">
          <Building2 size={13} />
          {company}
        </span>
        <span className="iva-meta-item">
          <Tag size={13} />
          {p.niche}
        </span>
        <span className="iva-meta-item iva-meta-budget">
          <DollarSign size={13} />
          {budget} {t(locale, 'budgetUnit')}
        </span>
        <span className="iva-meta-item">
          <Calendar size={13} />
          {deadline}
        </span>
      </div>

      {/* Client Row */}
      <div className="iva-card-meta">
        <span className="iva-meta-item">
          <User size={13} />
          {client}
        </span>
        <span className="iva-meta-item">
          <MapPin size={13} />
          {p.country}
        </span>
      </div>

      {/* Score Bars */}
      <div className="iva-scores">
        <div className="iva-score-row">
          <span className="iva-score-label">{t(locale, 'relevance')}</span>
          <span className="iva-score-value" style={{ color: 'var(--gold-primary)' }}>{relevancePercent}</span>
        </div>
        <div className="iva-score-bar">
          <div className="iva-score-fill" style={{ width: `${relevancePercent}%`, background: 'var(--progress-relevance)' }} />
        </div>

        <div className="iva-score-row">
          <span className="iva-score-label">{t(locale, 'risk')}</span>
          <span className="iva-score-value" style={{ color: 'var(--color-danger)' }}>{riskScore}</span>
        </div>
        <div className="iva-score-bar">
          <div className="iva-score-fill" style={{ width: `${riskScore}%`, background: 'var(--progress-risk)' }} />
        </div>

        <div className="iva-score-row">
          <span className="iva-score-label">{t(locale, 'margin')}</span>
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
          <span>{t(locale, 'aiAnalysis')}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded && (
          <div className="iva-ai-content">
            <p>{getSummary()}</p>
            <div className="iva-ai-detail">
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiCountry')}</span>
                <span className="iva-ai-detail-value">{p.country}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiNiche')}</span>
                <span className="iva-ai-detail-value">{p.niche}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiGroup')}</span>
                <span className="iva-ai-detail-value">{p.grp}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiCompany')}</span>
                <span className="iva-ai-detail-value">{company}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiClient')}</span>
                <span className="iva-ai-detail-value">{client}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiBudget')}</span>
                <span className="iva-ai-detail-value">{budget} {t(locale, 'budgetUnit')}</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiMargin')}</span>
                <span className="iva-ai-detail-value" style={{ color: 'var(--color-success)' }}>{marginScore}%</span>
              </div>
              <div className="iva-ai-detail-row">
                <span className="iva-ai-detail-label">{t(locale, 'aiRisk')}</span>
                <span className="iva-ai-detail-value" style={{ color: 'var(--color-danger)' }}>{riskScore}%</span>
              </div>
            </div>
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
          {t(locale, 'btnApprove')}
        </button>
        <button className="iva-btn-defer" onClick={handleDefer}>
          <PauseCircle size={14} />
          {t(locale, 'btnDefer')}
        </button>
        <button className="iva-btn-reject" onClick={handleReject}>
          <XCircle size={14} />
          {t(locale, 'btnReject')}
        </button>
      </div>
    </div>
  );
}

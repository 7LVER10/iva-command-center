'use client';

import { useState } from 'react';
import { Project, ProjectStatus } from '@/lib/iva/types';
import { EnrichedProject, ExportFormat } from '@/lib/iva/vnext-types';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import {
  Building2, Tag, DollarSign, Calendar, ChevronDown, ChevronUp,
  CheckCircle, PauseCircle, XCircle, Sparkles, MapPin, User,
  Download, Copy, Target, AlertTriangle, TrendingUp,
  ChevronRight, Shield, Zap
} from 'lucide-react';

interface IvaProjectCardProps {
  project: Project;
  enriched?: EnrichedProject;
}

const companiesByLocale: Record<string, string[]> = {
  ru: ['ООО «Донстрой Инвест»', 'АО «ЛенСпецСМУ»', 'ООО «Альфа-Строй»', 'ПАО «Газпром»', 'ООО «Роснано»', 'АО «Ростех»', 'ООО «СтройГрупп»', 'АО «ТехноПром»', 'ООО «ИнвестПроект»', 'АО «ЕвроСтрой»', 'ООО «НовоДевелопмент»', 'АО «ПромСвязьСтрой»', 'ООО «ЭнергоСтрой»', 'АО «МеталлКонструкция»', 'ООО «СтеклоПром»'],
  en: ['Donstroy Invest LLC', 'LenSpecSMU JSC', 'Alpha-Stroy LLC', 'Gazprom PJSC', 'Rusnano LLC', 'Rostec JSC', 'StroyGroup LLC', 'TechnoProm JSC', 'InvestProject LLC', 'EuroStroy JSC', 'NovoDevelopment LLC', 'PromSvyazStroy JSC', 'EnergoStroy LLC', 'MetalKonstruktsiya JSC', 'StekloProm LLC'],
  de: ['Donstroy Invest GmbH', 'LenSpecSMU AG', 'Alpha-Bau GmbH', 'Gazprom PJSC', 'Rusnano LLC', 'Rostec AG', 'StroyGroup GmbH', 'TechnoProm AG', 'InvestProject GmbH', 'EuroStroy AG', 'NovoDevelopment GmbH', 'PromSvyazStroy AG', 'EnergoStroy GmbH', 'MetalKonstruktsiya AG', 'StekloProm GmbH'],
  tr: ['Donstroy İnşaat Ltd.', 'LenSpecSMU A.Ş.', 'Alfa-İnşaat Ltd.', 'Gazprom A.Ş.', 'Rusnano Ltd.', 'Rostec A.Ş.', 'StroyGroup Ltd.', 'TechnoProm A.Ş.', 'InvestProject Ltd.', 'EuroStroy A.Ş.', 'NovoDevelopment Ltd.', 'PromSvyazStroy A.Ş.', 'EnergoStroy Ltd.', 'MetalKonstruktsiya A.Ş.', 'StekloProm Ltd.'],
};

const clientsByLocale: Record<string, string[]> = {
  ru: ['Департамент строительства', 'Министерство инфраструктуры', 'Корпорация развития', 'Инвестфонд «Восток»', 'Группа компаний «Альфа»', 'Холдинг «Евразия»', 'Фонд прямых инвестиций', 'Частный инвестор', 'Государственная корпорация', 'Международный партнёр'],
  en: ['Department of Construction', 'Ministry of Infrastructure', 'Development Corporation', 'Eastern Investment Fund', 'Alpha Group', 'Eurasia Holdings', 'Direct Investment Fund', 'Private Investor', 'State Corporation', 'International Partner'],
  de: ['Baudepartement', 'Ministerium für Infrastruktur', 'Entwicklungskorporation', 'Ost-Investitionsfonds', 'Alpha-Gruppe', 'Eurasia-Holdings', 'Direktinvestitionsfonds', 'Privatinvestor', 'Staatliche Korporation', 'Internationaler Partner'],
  tr: ['İnşaat Dairesi', 'Altyapı Bakanlığı', 'Kalkınma Şirketi', 'Doğu Yatırım Fonu', 'Alfa Grubu', 'Avrasya Holding', 'Doğrudan Yatırım Fonu', 'Özel Yatırımcı', 'Devlet Şirketi', 'Uluslararası Ortağı'],
};

const deadlines = ['Q1 2027', 'Q2 2027', 'Q3 2027', 'Q4 2027', 'H1 2028', 'H2 2028'];

const exportFormats: { key: ExportFormat; labelKey: string }[] = [
  { key: 'brief', labelKey: 'exportBrief' },
  { key: 'sales_brief', labelKey: 'exportSales' },
  { key: 'crm_note', labelKey: 'exportCRM' },
  { key: 'telegram', labelKey: 'exportTelegram' },
];

const actionTypeColors: Record<string, string> = {
  opportunity: 'var(--color-success)',
  risk: 'var(--color-danger)',
  next_step: 'var(--gold-primary)',
  market_signal: 'var(--color-info)',
};

const actionTypeIcons: Record<string, typeof Target> = {
  opportunity: TrendingUp,
  risk: AlertTriangle,
  next_step: ChevronRight,
  market_signal: Zap,
};

export default function IvaProjectCard({ project, enriched }: IvaProjectCardProps) {
  const { locale, updateProjectStatus, showConfirmDialogFn, exportEnriched, copyExport } = useIvaStore();
  const [expanded, setExpanded] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const p = project;
  const relevancePercent = Math.round(p.relevance * 100);

  const companies = companiesByLocale[locale] || companiesByLocale.en;
  const clients = clientsByLocale[locale] || clientsByLocale.en;
  const company = companies[p.id % companies.length];
  const client = clients[p.id % clients.length];
  const deadline = deadlines[p.id % deadlines.length];
  const budget = (p.relevance * 1200).toFixed(0);

  const scores = enriched?.scores;
  const actions = enriched?.actions;
  const sources = enriched?.sources;
  const synthesis = enriched?.synthesis;
  const competitor = enriched?.competitorContext;

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
      {/* Header */}
      <div className="iva-card-header">
        <div className="iva-card-id">
          <span className="iva-card-id-icon">◈</span>
          <span className="iva-card-id-text">IVA-{String(p.id).padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          {scores && (
            <span className="iva-card-score-badge" style={{ color: 'var(--gold-primary)' }}>
              <Target size={11} /> {scores.opportunity.value}
            </span>
          )}
          <span className="iva-card-status-badge" style={{ color: status.color, background: status.bg, border: `1px solid ${status.color}40` }}>
            {t(locale, status.labelKey)}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="iva-card-title">{p.name}</h3>

      {/* Meta Row */}
      <div className="iva-card-meta">
        <span className="iva-meta-item"><Building2 size={13} />{company}</span>
        <span className="iva-meta-item"><Tag size={13} />{p.niche}</span>
        <span className="iva-meta-item iva-meta-budget"><DollarSign size={13} />{budget} {t(locale, 'budgetUnit')}</span>
        <span className="iva-meta-item"><Calendar size={13} />{deadline}</span>
      </div>
      <div className="iva-card-meta">
        <span className="iva-meta-item"><User size={13} />{client}</span>
        <span className="iva-meta-item"><MapPin size={13} />{p.country}</span>
      </div>

      {/* Scores */}
      <div className="iva-scores">
        {scores ? (
          <>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'scoreOpportunity')}</span>
              <span className="iva-score-value" style={{ color: 'var(--gold-primary)' }}>{scores.opportunity.value}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${scores.opportunity.value}%`, background: 'var(--progress-relevance)' }} />
            </div>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'risk')}</span>
              <span className="iva-score-value" style={{ color: 'var(--color-danger)' }}>{scores.risk.value}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${scores.risk.value}%`, background: 'var(--progress-risk)' }} />
            </div>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'margin')}</span>
              <span className="iva-score-value" style={{ color: 'var(--color-success)' }}>{scores.margin.value}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${scores.margin.value}%`, background: 'var(--progress-margin)' }} />
            </div>
          </>
        ) : (
          <>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'relevance')}</span>
              <span className="iva-score-value" style={{ color: 'var(--gold-primary)' }}>{relevancePercent}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${relevancePercent}%`, background: 'var(--progress-relevance)' }} />
            </div>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'risk')}</span>
              <span className="iva-score-value" style={{ color: 'var(--color-danger)' }}>{Math.round((1 - p.relevance) * 100)}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${Math.round((1 - p.relevance) * 100)}%`, background: 'var(--progress-risk)' }} />
            </div>
            <div className="iva-score-row">
              <span className="iva-score-label">{t(locale, 'margin')}</span>
              <span className="iva-score-value" style={{ color: 'var(--color-success)' }}>{Math.round(p.relevance * 85 + (p.id % 15))}</span>
            </div>
            <div className="iva-score-bar">
              <div className="iva-score-fill" style={{ width: `${Math.round(p.relevance * 85 + (p.id % 15))}%`, background: 'var(--progress-margin)' }} />
            </div>
          </>
        )}
      </div>

      {/* Actions Section */}
      {actions && actions.length > 0 && (
        <div className="iva-actions-section">
          <button className="iva-ai-toggle" onClick={() => setShowActions(!showActions)}>
            <Zap size={14} />
            <span>{t(locale, 'actionsTitle')} ({actions.length})</span>
            {showActions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showActions && (
            <div className="iva-actions-list">
              {actions.map((action, i) => {
                const Icon = actionTypeIcons[action.type] || ChevronRight;
                return (
                  <div key={i} className="iva-action-item">
                    <div className="iva-action-icon" style={{ color: actionTypeColors[action.type] }}>
                      <Icon size={14} />
                    </div>
                    <div className="iva-action-content">
                      <div className="iva-action-label">{action.label}</div>
                      <div className="iva-action-desc">{action.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AI Analysis Expandable */}
      <div className="iva-ai-section">
        <button className="iva-ai-toggle" onClick={() => setExpanded(!expanded)}>
          <Sparkles size={14} />
          <span>{t(locale, 'aiAnalysis')}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded && (
          <div className="iva-ai-content">
            {synthesis ? (
              <>
                <p className="iva-synthesis-summary">{synthesis.summary}</p>
                <p className="iva-synthesis-rec"><strong>{t(locale, 'recommendation')}:</strong> {synthesis.recommendation}</p>
                <div className="iva-ai-detail">
                  <div className="iva-ai-detail-row">
                    <span className="iva-ai-detail-label">{t(locale, 'aiConfidence')}</span>
                    <span className="iva-ai-detail-value">{Math.round(synthesis.confidence * 100)}%</span>
                  </div>
                  <div className="iva-ai-detail-row">
                    <span className="iva-ai-detail-label">{t(locale, 'aiCountry')}</span>
                    <span className="iva-ai-detail-value">{p.country}</span>
                  </div>
                  <div className="iva-ai-detail-row">
                    <span className="iva-ai-detail-label">{t(locale, 'aiNiche')}</span>
                    <span className="iva-ai-detail-value">{p.niche}</span>
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
                </div>
                {competitor && (
                  <div className="iva-competitor-block">
                    <div className="iva-competitor-title"><Shield size={12} /> {t(locale, 'competitorContext')}</div>
                    <div className="iva-ai-detail">
                      <div className="iva-ai-detail-row">
                        <span className="iva-ai-detail-label">{t(locale, 'compPosition')}</span>
                        <span className="iva-ai-detail-value">{competitor.market_position}</span>
                      </div>
                      <div className="iva-ai-detail-row">
                        <span className="iva-ai-detail-label">{t(locale, 'compCount')}</span>
                        <span className="iva-ai-detail-value">{competitor.competitor_count}</span>
                      </div>
                      <div className="iva-ai-detail-row">
                        <span className="iva-ai-detail-label">{t(locale, 'compThreat')}</span>
                        <span className="iva-ai-detail-value" style={{ color: competitor.threat_level === 'high' ? 'var(--color-danger)' : competitor.threat_level === 'medium' ? 'var(--color-warning)' : 'var(--color-success)' }}>{competitor.threat_level}</span>
                      </div>
                    </div>
                  </div>
                )}
                {sources && sources.length > 0 && (
                  <div className="iva-sources-block">
                    <div className="iva-sources-title">{t(locale, 'sourceConfidence')}</div>
                    {sources.map((src, i) => (
                      <div key={i} className="iva-source-item">
                        <span className="iva-source-type">{src.type}</span>
                        <span className="iva-source-fresh">{src.freshness}</span>
                        <span className="iva-source-conf" style={{ color: src.confidence > 0.8 ? 'var(--color-success)' : 'var(--color-warning)' }}>{Math.round(src.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p>{getSummary()}</p>
                <div className="iva-ai-detail">
                  <div className="iva-ai-detail-row"><span className="iva-ai-detail-label">{t(locale, 'aiCountry')}</span><span className="iva-ai-detail-value">{p.country}</span></div>
                  <div className="iva-ai-detail-row"><span className="iva-ai-detail-label">{t(locale, 'aiNiche')}</span><span className="iva-ai-detail-value">{p.niche}</span></div>
                  <div className="iva-ai-detail-row"><span className="iva-ai-detail-label">{t(locale, 'aiGroup')}</span><span className="iva-ai-detail-value">{p.grp}</span></div>
                  <div className="iva-ai-detail-row"><span className="iva-ai-detail-label">{t(locale, 'aiCompany')}</span><span className="iva-ai-detail-value">{company}</span></div>
                  <div className="iva-ai-detail-row"><span className="iva-ai-detail-label">{t(locale, 'aiClient')}</span><span className="iva-ai-detail-value">{client}</span></div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Export Section */}
      {enriched && (
        <div className="iva-export-section">
          <button className="iva-ai-toggle" onClick={() => setShowExport(!showExport)}>
            <Download size={14} />
            <span>{t(locale, 'exportHandoff')}</span>
            {showExport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showExport && (
            <div className="iva-export-grid">
              {exportFormats.map((fmt) => (
                <div key={fmt.key} className="iva-export-item">
                  <button className="iva-export-btn" onClick={() => exportEnriched(enriched, fmt.key)}>
                    <Download size={12} /> {t(locale, fmt.labelKey)}
                  </button>
                  <button className="iva-export-copy" onClick={() => copyExport(enriched, fmt.key)}>
                    <Copy size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="iva-card-actions">
        <button className="iva-btn-approve" onClick={handleApprove}>
          <CheckCircle size={14} /> {t(locale, 'btnApprove')}
        </button>
        <button className="iva-btn-defer" onClick={handleDefer}>
          <PauseCircle size={14} /> {t(locale, 'btnDefer')}
        </button>
        <button className="iva-btn-reject" onClick={handleReject}>
          <XCircle size={14} /> {t(locale, 'btnReject')}
        </button>
      </div>
    </div>
  );
}

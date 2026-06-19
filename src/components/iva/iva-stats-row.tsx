'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { useMemo } from 'react';
import { TrendingUp, Sparkles, BarChart3, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function IvaStatsRow() {
  const { locale, projects, setShowRelevanceModal, setShowMarginModal } = useIvaStore();

  const stats = useMemo(() => {
    const total = projects.length;
    const avgRelevance = total > 0
      ? Math.round(projects.reduce((a, p) => a + p.relevance, 0) / total * 100)
      : 0;
    const avgMargin = total > 0
      ? Math.round(projects.reduce((a, p) => a + (p.relevance * 85 + (p.id % 15)), 0) / total)
      : 0;
    const approved = projects.filter(p => p.status === 'completed').length;
    const deferred = projects.filter(p => p.status === 'pending').length;
    const rejected = projects.filter(p => p.status === 'archived').length;
    return { total, avgRelevance, avgMargin, approved, deferred, rejected };
  }, [projects]);

  return (
    <div className="iva-stats-section">
      {/* Hero KPI Cards */}
      <div className="iva-hero-row">
        <div className="iva-hero-card" onClick={() => setShowRelevanceModal(true)}>
          <div className="iva-hero-icon">
            <TrendingUp size={28} />
          </div>
          <div className="iva-hero-content">
            <div className="iva-hero-value">{stats.avgRelevance}</div>
            <div className="iva-hero-label">{t(locale, 'heroAvgRelevance')}</div>
          </div>
        </div>

        <div className="iva-hero-card" onClick={() => setShowMarginModal(true)}>
          <div className="iva-hero-icon">
            <Sparkles size={28} />
          </div>
          <div className="iva-hero-content">
            <div className="iva-hero-value" style={{ color: 'var(--color-success)' }}>{stats.avgMargin}</div>
            <div className="iva-hero-label">{t(locale, 'heroAvgMargin')}</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="iva-secondary-row">
        <div className="iva-secondary-card">
          <BarChart3 size={16} className="iva-secondary-icon" />
          <div className="iva-secondary-value">{stats.total}</div>
          <div className="iva-secondary-label">{t(locale, 'statTotal')}</div>
        </div>
        <div className="iva-secondary-card">
          <CheckCircle size={16} className="iva-secondary-icon" style={{ color: 'var(--color-success)' }} />
          <div className="iva-secondary-value">{stats.approved}</div>
          <div className="iva-secondary-label">{t(locale, 'statApproved')}</div>
        </div>
        <div className="iva-secondary-card">
          <Clock size={16} className="iva-secondary-icon" style={{ color: 'var(--color-warning)' }} />
          <div className="iva-secondary-value">{stats.deferred}</div>
          <div className="iva-secondary-label">{t(locale, 'statDeferred')}</div>
        </div>
        <div className="iva-secondary-card">
          <XCircle size={16} className="iva-secondary-icon" style={{ color: 'var(--color-danger)' }} />
          <div className="iva-secondary-value">{stats.rejected}</div>
          <div className="iva-secondary-label">{t(locale, 'statRejected')}</div>
        </div>
      </div>
    </div>
  );
}

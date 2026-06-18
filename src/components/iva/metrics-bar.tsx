'use client';

import { AnalysisMetrics } from '@/lib/iva/types';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Hash, Target, Zap } from 'lucide-react';

interface MetricsBarProps {
  metrics: AnalysisMetrics;
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const { locale } = useIvaStore();

  return (
    <div className="metrics-row">
      <div className="metric-box">
        <Hash size={20} className="metric-icon" />
        <div className="metric-value">{metrics.total}</div>
        <div className="metric-label">{t(locale, 'metricsTotal')}</div>
      </div>
      <div className="metric-box">
        <Target size={20} className="metric-icon" />
        <div className="metric-value">{metrics.avgRelevance}</div>
        <div className="metric-label">{t(locale, 'metricsRelevance')}</div>
      </div>
      <div className="metric-box">
        <Zap size={20} className="metric-icon" />
        <div className="metric-value">{metrics.highPriorityCount}</div>
        <div className="metric-label">{t(locale, 'metricsPriority')}</div>
      </div>
    </div>
  );
}

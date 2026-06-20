'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Clock, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export default function IvaHistoryPanel() {
  const { locale, analysisHistory } = useIvaStore();

  if (analysisHistory.length === 0) return null;

  return (
    <div className="iva-history-panel">
      <h3 className="iva-history-title">
        <Clock size={16} /> {t(locale, 'analysisHistory')}
      </h3>
      <div className="iva-history-list">
        {analysisHistory.slice(0, 10).map((entry) => (
          <div key={entry.id} className="iva-history-item">
            <div className="iva-history-main">
              <div className="ava-history-meta">
                <span className="iva-history-geo">{entry.geo || t(locale, 'allCountries')}</span>
                <span className="iva-history-sep">+</span>
                <span className="iva-history-niche">{entry.niche || t(locale, 'allNiches')}</span>
              </div>
              <div className="iva-history-scores">
                <span className="iva-history-score" style={{ color: 'var(--gold-primary)' }}>
                  <TrendingUp size={11} /> {entry.avg_opportunity}
                </span>
                <span className="iva-history-score" style={{ color: 'var(--color-danger)' }}>
                  <AlertTriangle size={11} /> {entry.avg_risk}
                </span>
                <span className="iva-history-score" style={{ color: 'var(--color-success)' }}>
                  <Sparkles size={11} /> {entry.avg_margin}
                </span>
              </div>
            </div>
            <div className="iva-history-footer">
              <span className="iva-history-count">{entry.result_count} {t(locale, 'projects').toLowerCase()}</span>
              <span className="iva-history-time">{new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

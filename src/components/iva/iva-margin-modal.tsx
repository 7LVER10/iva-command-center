'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Sparkles, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export default function IvaMarginModal() {
  const { locale, showMarginModal, setShowMarginModal } = useIvaStore();

  if (!showMarginModal) return null;

  return (
    <div className="iva-modal-overlay" onClick={() => setShowMarginModal(false)}>
      <div className="iva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iva-modal-header">
          <div className="iva-modal-title">
            <Sparkles size={20} />
            <span>{t(locale, 'marginModalTitle')}</span>
          </div>
          <button className="iva-modal-close" onClick={() => setShowMarginModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="iva-modal-subtitle">
          {t(locale, 'marginModalSubtitle')}
        </div>

        <div className="iva-modal-body">
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">{t(locale, 'methodology')}</h4>
            <p className="iva-modal-section-desc">
              {t(locale, 'marginMethodologyDesc')}
            </p>
          </div>

          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">{t(locale, 'marginFactors')}</h4>
            <div className="iva-params-list">
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <TrendingUp size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">{t(locale, 'marginFactor1')}</span>
                  <span className="iva-param-pct">35%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'marginFactor1Desc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <DollarSign size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">{t(locale, 'marginFactor2')}</span>
                  <span className="iva-param-pct">25%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'marginFactor2Desc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <BarChart3 size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">{t(locale, 'marginFactor3')}</span>
                  <span className="iva-param-pct">25%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'marginFactor3Desc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">{t(locale, 'marginFactor4')}</span>
                  <span className="iva-param-pct">15%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'marginFactor4Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="iva-modal-footer-strip">
          <div className="iva-strip-item">
            <div className="iva-strip-value" style={{ color: 'var(--color-success)' }}>48</div>
            <div className="iva-strip-label">{t(locale, 'stripAvgMargin')}</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">85%</div>
            <div className="iva-strip-label">{t(locale, 'stripForecastAccuracy')}</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">12</div>
            <div className="iva-strip-label">{t(locale, 'stripModels')}</div>
          </div>
        </div>

        <div className="iva-modal-footer">
          <button className="iva-btn-close-modal" onClick={() => setShowMarginModal(false)}>
            {t(locale, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
}

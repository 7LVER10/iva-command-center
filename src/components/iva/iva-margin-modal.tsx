'use client';

import { useIvaStore } from '@/lib/iva/store';
import { X, Sparkles, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export default function IvaMarginModal() {
  const { showMarginModal, setShowMarginModal } = useIvaStore();

  if (!showMarginModal) return null;

  return (
    <div className="iva-modal-overlay" onClick={() => setShowMarginModal(false)}>
      <div className="iva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iva-modal-header">
          <div className="iva-modal-title">
            <Sparkles size={20} />
            <span>Аналитика маржинальности</span>
          </div>
          <button className="iva-modal-close" onClick={() => setShowMarginModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="iva-modal-subtitle">
          Факторы маржинальности и прогноз прибыльности
        </div>

        <div className="iva-modal-body">
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">Методология</h4>
            <p className="iva-modal-section-desc">
              Маржинальность рассчитывается на основе 4 факторов: сложность проекта, доступность ресурсов, конкурентная среда и сезонность.
            </p>
          </div>

          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">Факторы</h4>
            <div className="iva-params-list">
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <TrendingUp size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">Сложность проекта</span>
                  <span className="iva-param-pct">35%</span>
                </div>
                <p className="iva-param-desc">Техническая сложность, уникальность решений, требования к квалификации.</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <DollarSign size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">Доступность ресурсов</span>
                  <span className="iva-param-pct">25%</span>
                </div>
                <p className="iva-param-desc">Наличие собственных мощностей, субподрядчиков, логистики.</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <BarChart3 size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">Конкурентная среда</span>
                  <span className="iva-param-pct">25%</span>
                </div>
                <p className="iva-param-desc">Количество конкурентов, их цены, уникальность предложения.</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span className="iva-param-name">Сезонность</span>
                  <span className="iva-param-pct">15%</span>
                </div>
                <p className="iva-param-desc">Влияние сезона на стоимость материалов и доступность рабочей силы.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="iva-modal-footer-strip">
          <div className="iva-strip-item">
            <div className="iva-strip-value" style={{ color: 'var(--color-success)' }}>48</div>
            <div className="iva-strip-label">СР. МАРЖА</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">85%</div>
            <div className="iva-strip-label">ТОЧНОСТЬ ПРОГНОЗА</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">12</div>
            <div className="iva-strip-label">МОДЕЛЕЙ</div>
          </div>
        </div>

        <div className="iva-modal-footer">
          <button className="iva-btn-close-modal" onClick={() => setShowMarginModal(false)}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Shield, Radio, Circle, CircleDot, FileText, Globe } from 'lucide-react';

const agentAudit = [
  { nameKey: 'agentDataCollector', status: 'COMPLETED', time: '2m ago', seconds: '847 sec', descKey: 'agentDataCollectorDesc', icon: Radio },
  { nameKey: 'agentClassifier', status: 'COMPLETED', time: '1m ago', seconds: '', descKey: 'agentClassifierDesc', icon: Circle },
  { nameKey: 'agentStrategist', status: 'COMPLETED', time: '', seconds: '847 sec', descKey: 'agentStrategistDesc', icon: CircleDot },
  { nameKey: 'agentGenerator', status: 'STANDBY', time: '', seconds: '12 sec', descKey: 'agentGeneratorDesc', icon: FileText },
  { nameKey: 'agentTranslator', status: 'ACTIVE', time: 'now', seconds: '234 sec', descKey: 'agentTranslatorDesc', icon: Globe },
];

const statusColors: Record<string, string> = {
  COMPLETED: '#30A840',
  ACTIVE: '#C8A040',
  STANDBY: '#C07020',
};

export default function IvaRelevanceModal() {
  const { locale, showRelevanceModal, setShowRelevanceModal } = useIvaStore();

  if (!showRelevanceModal) return null;

  return (
    <div className="iva-modal-overlay" onClick={() => setShowRelevanceModal(false)}>
      <div className="iva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iva-modal-header">
          <div className="iva-modal-title">
            <Shield size={20} />
            <span>{t(locale, 'relevanceModalTitle')}</span>
          </div>
          <button className="iva-modal-close" onClick={() => setShowRelevanceModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="iva-modal-subtitle">
          {t(locale, 'relevanceModalSubtitle')}
        </div>

        <div className="iva-modal-body">
          {/* Methodology */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">{t(locale, 'methodology')}</h4>
            <p className="iva-modal-section-desc">
              {t(locale, 'methodologyDesc')}
            </p>
          </div>

          {/* Parameters */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">{t(locale, 'paramsComparison')}</h4>
            <div className="iva-params-list">
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <span className="iva-param-icon">♚</span>
                  <span className="iva-param-name">{t(locale, 'paramCompanyProfile')}</span>
                  <span className="iva-param-pct">30%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'paramCompanyProfileDesc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <span className="iva-param-icon">↗</span>
                  <span className="iva-param-name">{t(locale, 'paramBudgetScale')}</span>
                  <span className="iva-param-pct">25%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'paramBudgetScaleDesc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <span className="iva-param-icon">⊙</span>
                  <span className="iva-param-name">{t(locale, 'paramRegionalPresence')}</span>
                  <span className="iva-param-pct">15%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'paramRegionalPresenceDesc')}</p>
              </div>
              <div className="iva-param-item">
                <div className="iva-param-header">
                  <span className="iva-param-icon">⚒</span>
                  <span className="iva-param-name">{t(locale, 'paramCategoryExperience')}</span>
                  <span className="iva-param-pct">20%</span>
                </div>
                <p className="iva-param-desc">{t(locale, 'paramCategoryExperienceDesc')}</p>
              </div>
            </div>
          </div>

          {/* Strategic Value */}
          <div className="iva-modal-section">
            <div className="iva-param-item">
              <div className="iva-param-header">
                <span className="iva-param-icon">◎</span>
                <span className="iva-param-name">{t(locale, 'paramStrategicValue')}</span>
                <span className="iva-param-pct">10%</span>
              </div>
              <p className="iva-param-desc">{t(locale, 'paramStrategicValueDesc')}</p>
            </div>
          </div>

          {/* AI Agent Audit */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">
              <span>⚡</span> {t(locale, 'agentAuditTitle')}
            </h4>
            <div className="iva-agent-audit-list">
              {agentAudit.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <div key={i} className="iva-agent-audit-item">
                    <div className="iva-agent-audit-icon">
                      <Icon size={16} />
                    </div>
                    <div className="iva-agent-audit-info">
                      <div className="iva-agent-audit-top">
                        <span className="iva-agent-audit-name">{t(locale, agent.nameKey)}</span>
                        <span className="iva-agent-audit-status" style={{ color: statusColors[agent.status] || '#8A8070' }}>
                          {agent.status}
                        </span>
                      </div>
                      <div className="iva-agent-audit-desc">{t(locale, agent.descKey)}</div>
                    </div>
                    <div className="iva-agent-audit-time">
                      {agent.time && <div>{agent.time}</div>}
                      {agent.seconds && <div className="iva-agent-audit-sec">{agent.seconds}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Metric Strip */}
        <div className="iva-modal-footer-strip">
          <div className="iva-strip-item">
            <div className="iva-strip-value">2m ago</div>
            <div className="iva-strip-label">{t(locale, 'stripLastAnalysis')}</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value" style={{ color: 'var(--gold-primary)' }}>94.7%</div>
            <div className="iva-strip-label">{t(locale, 'stripConfidence')}</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">5</div>
            <div className="iva-strip-label">{t(locale, 'stripDataSources')}</div>
          </div>
        </div>

        <div className="iva-modal-footer">
          <button className="iva-btn-close-modal" onClick={() => setShowRelevanceModal(false)}>
            {t(locale, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
}

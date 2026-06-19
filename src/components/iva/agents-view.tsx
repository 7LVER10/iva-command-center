'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import {
  Radio, Circle, CircleDot, Globe, FileText,
  Shield, Brain, Compass
} from 'lucide-react';

const iconMap: Record<string, typeof Radio> = {
  Radio, Circle, CircleDot, Globe, FileText,
  Shield, Brain, Compass,
};

export default function AgentsView() {
  const { locale, agents } = useIvaStore();

  return (
    <div className="agents-view">
      <h2 className="section-title">{t(locale, 'navAgents')}</h2>

      <div className="agents-grid">
        {agents.map((agent) => {
          const Icon = iconMap[agent.icon] || Circle;
          const statusColor = agent.status === 'online' ? 'var(--color-online, #3ACA3A)' :
                             agent.status === 'processing' ? 'var(--gold-primary)' :
                             'var(--text-muted)';
          const statusText = agent.status === 'online' ? t(locale, 'online') :
                            agent.status === 'processing' ? t(locale, 'processing') :
                            t(locale, 'offline');

          return (
            <div key={agent.id} className="agent-card">
              <div className="agent-header">
                <div className="agent-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="agent-name">{t(locale, agent.nameKey)}</div>
                  <div className="agent-status" style={{ color: statusColor }}>
                    ● {statusText}
                  </div>
                </div>
              </div>

              <div className="agent-description">
                {t(locale, agent.descriptionKey)}
              </div>

              <div className="agent-metrics">
                {agent.metricsKey.map((key) => (
                  <div key={key} className="agent-metric">
                    <div className="agent-metric-value">
                      {agent.metrics?.[key] ?? 0}
                    </div>
                    <div className="agent-metric-label">
                      {t(locale, key)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

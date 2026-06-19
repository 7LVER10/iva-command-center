'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Radio, Circle, CircleDot, Globe, FileText, Shield, Brain, Compass, Activity, Clock, Zap } from 'lucide-react';
import { Agent } from '@/lib/iva/types';

const iconMap: Record<string, typeof Radio> = {
  Radio, Circle, CircleDot, Globe, FileText,
  Shield, Brain, Compass,
};

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  const { locale } = useIvaStore();

  if (!agent) return null;

  const Icon = iconMap[agent.icon] || Circle;
  const statusColor = agent.status === 'online' ? '#3ACA3A' :
                     agent.status === 'processing' ? '#C8A040' : '#5A5040';

  const logs = [
    { time: '2m ago', action: 'Data collection completed', status: 'success' },
    { time: '5m ago', action: 'Processing batch #1247', status: 'active' },
    { time: '12m ago', action: 'Model calibration updated', status: 'success' },
    { time: '18m ago', action: 'New pattern detected', status: 'info' },
    { time: '25m ago', action: 'Rate limit adjusted', status: 'warning' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className="agent-icon" style={{ width: 44, height: 44 }}>
              <Icon size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{t(locale, agent.nameKey)}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                <span style={{ fontSize: '0.75rem', color: statusColor, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t(locale, agent.status || 'offline')}
                </span>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3>{t(locale, 'aiAnalysis')}</h3>
            <p className="detail-summary">{t(locale, agent.descriptionKey)}</p>
          </div>

          {/* Agent Metrics */}
          <div className="detail-section">
            <h3>Performance Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {agent.metricsKey.map((key) => (
                <div key={key} style={{
                  background: 'var(--bg-modal-inner)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                    {agent.metrics?.[key] ?? 0}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {t(locale, key)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="detail-section">
            <h3>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {logs.map((log, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-modal-inner)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: log.status === 'success' ? '#30A840' :
                               log.status === 'active' ? '#C8A040' :
                               log.status === 'warning' ? '#C07020' : '#3A6A9A',
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.action}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)', gap: 'var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-primary)' }}>
                <Clock size={14} style={{ marginRight: 4 }} />
                99.9%
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Uptime
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-success)' }}>
                <Zap size={14} style={{ marginRight: 4 }} />
                2.3ms
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Latency
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-info)' }}>
                <Activity size={14} style={{ marginRight: 4 }} />
                Active
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Status
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="confirm-cancel" onClick={onClose}>
            {t(locale, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
}

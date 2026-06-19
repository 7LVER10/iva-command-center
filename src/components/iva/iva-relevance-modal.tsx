'use client';

import { useIvaStore } from '@/lib/iva/store';
import { X, Shield, Radio, Circle, CircleDot, FileText, Globe } from 'lucide-react';

const methodologyParams = [
  { icon: '♚', name: 'Профиль компании', pct: 30, desc: 'Совпадение основной деятельности компании с требованиями проекта (дизайн, архитектура, девелопмент, строительство, реконструкция).' },
  { icon: '↗', name: 'Масштаб бюджета', pct: 25, desc: 'Соответствие объёма финансирования производственным мощностям и оборотному капиталу компании.' },
  { icon: '⊙', name: 'Региональное присутствие', pct: 15, desc: 'Наличие лицензий, ресурсов и партнёров в регионе реализации проекта.' },
  { icon: '⚒', name: 'Опыт в категории', pct: 20, desc: 'Количество реализованных проектов аналогичного типа и масштаба за последние 5 лет.' },
  { icon: '◎', name: 'Стратегическая ценность', pct: 10, desc: 'Потенциал проекта для развития компании: вход в новый сегмент, усилении портфолио, долгосрочное партнёрство.' },
];

const agentAudit = [
  { name: 'Агент сбора данных', status: 'COMPLETED', time: '2m ago', seconds: '847 сек', desc: 'Парсинг порталов, агрегаторов тендеров и государственных реестров. Извлечение ст...', icon: Radio },
  { name: 'Агент-Классификатор', status: 'COMPLETED', time: '1m ago', seconds: '', desc: 'Оценка релевантности проекта по профилю компании. Работал с 5ナходками', icon: Circle },
  { name: 'Агент-Стратег', status: 'COMPLETED', time: '', seconds: '847 сек', desc: 'Анализ рисков, маржинальных и конкурентных преимуществ.', icon: CircleDot },
  { name: 'Агент-Генератор КП', status: 'STANDBY', time: '', seconds: '12 сек', desc: 'Подготовка коммерческих предложений, планов действий и документов для тендер...', icon: FileText },
  { name: 'Агент-Переводчик', status: 'ACTIVE', time: 'now', seconds: '234 сек', desc: 'Глубокая локализация контента: перевод описаний, спецификаций и аналитических о...', icon: Globe },
];

const statusColors: Record<string, string> = {
  COMPLETED: '#30A840',
  ACTIVE: '#C8A040',
  STANDBY: '#C07020',
};

export default function IvaRelevanceModal() {
  const { showRelevanceModal, setShowRelevanceModal } = useIvaStore();

  if (!showRelevanceModal) return null;

  return (
    <div className="iva-modal-overlay" onClick={() => setShowRelevanceModal(false)}>
      <div className="iva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="iva-modal-header">
          <div className="iva-modal-title">
            <Shield size={20} />
            <span>Аналитика релевантности</span>
          </div>
          <button className="iva-modal-close" onClick={() => setShowRelevanceModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="iva-modal-subtitle">
          Методология оценки и профили клиентов
        </div>

        <div className="iva-modal-body">
          {/* Methodology */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">Методология</h4>
            <p className="iva-modal-section-desc">
              Оценка релевантности строится на анализе 5 ключевых параметров: соответствие профилю компании, масштаб бюджета, региональное присутствие, опыт в категории и стратегическая ценность проекта.
            </p>
          </div>

          {/* Parameters */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">Параметры сравнения</h4>
            <div className="iva-params-list">
              {methodologyParams.map((param, i) => (
                <div key={i} className="iva-param-item">
                  <div className="iva-param-header">
                    <span className="iva-param-icon">{param.icon}</span>
                    <span className="iva-param-name">{param.name}</span>
                    <span className="iva-param-pct">{param.pct}%</span>
                  </div>
                  <p className="iva-param-desc">{param.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Value */}
          <div className="iva-modal-section">
            <div className="iva-param-item">
              <div className="iva-param-header">
                <span className="iva-param-icon">◎</span>
                <span className="iva-param-name">Стратегическая ценность</span>
                <span className="iva-param-pct">10%</span>
              </div>
              <p className="iva-param-desc">Потенциал проекта для развития компании: вход в новый сегмент, усилении портфолио, долгосрочное партнёрство.</p>
            </div>
          </div>

          {/* AI Agent Audit */}
          <div className="iva-modal-section">
            <h4 className="iva-modal-section-title">
              <span>⚡</span> Операционный аудит AI-агентов
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
                        <span className="iva-agent-audit-name">{agent.name}</span>
                        <span className="iva-agent-audit-status" style={{ color: statusColors[agent.status] || '#8A8070' }}>
                          {agent.status}
                        </span>
                      </div>
                      <div className="iva-agent-audit-desc">{agent.desc}</div>
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
            <div className="iva-strip-label">ПОСЛЕДНИЙ АНАЛИЗ</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value" style={{ color: 'var(--gold-primary)' }}>94.7%</div>
            <div className="iva-strip-label">УРОВЕНЬ ДОСТОВЕРНОСТИ</div>
          </div>
          <div className="iva-strip-item">
            <div className="iva-strip-value">5</div>
            <div className="iva-strip-label">ИСТОЧНИКИ ДАННЫХ</div>
          </div>
        </div>

        <div className="iva-modal-footer">
          <button className="iva-btn-close-modal" onClick={() => setShowRelevanceModal(false)}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

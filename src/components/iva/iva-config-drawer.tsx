'use client';

import { useIvaStore } from '@/lib/iva/store';
import { X, Rocket, Radio, Circle, CircleDot, Globe, FileText } from 'lucide-react';

const topCountries = [
  'Россия', 'Турция', 'ОАЭ (Дубай)', 'Саудовская Аравия',
  'Катар', 'Германия', 'Великобритания', 'Италия',
];

const b2bNiches = [
  { icon: '◇', label: 'Архитектурное стекло и премиальное фасадное остекление' },
  { icon: '♛', label: 'Элитные девелоперские проекты и проектирование (Отели, К...' },
  { icon: '⚙', label: 'Системы промышленной автоматизации производства' },
  { icon: '◎', label: 'Интеграция корпоративного ИИ и разработка автономных аг...' },
  { icon: '⚒', label: 'Реставрация исторических объектов и традиционное стекло...' },
];

const agents = [
  { name: 'Scraper', icon: Radio, status: 'online' },
  { name: 'Classifier', icon: Circle, status: 'online' },
  { name: 'Strategist', icon: CircleDot, status: 'online' },
  { name: 'Generator', icon: FileText, status: 'online' },
  { name: 'Translator', icon: Globe, status: 'online' },
];

export default function IvaConfigDrawer() {
  const { showConfigDrawer, setShowConfigDrawer, runAnalysis } = useIvaStore();

  if (!showConfigDrawer) return null;

  const handleLaunch = () => {
    setShowConfigDrawer(false);
    runAnalysis();
  };

  return (
    <div className="iva-drawer-overlay" onClick={() => setShowConfigDrawer(false)}>
      <div className="iva-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="iva-drawer-header">
          <div className="iva-drawer-logo">
            <div className="iva-logo-icon" style={{ width: 48, height: 48, fontSize: '1rem' }}>IVA</div>
            <div>
              <div className="iva-logo-name" style={{ fontSize: '1.2rem' }}>IVA</div>
              <div className="iva-logo-sub">КОМАНДНЫЙ ЦЕНТР</div>
            </div>
          </div>
          <button className="iva-drawer-close" onClick={() => setShowConfigDrawer(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="iva-drawer-body">
          {/* Geography */}
          <div className="iva-drawer-section">
            <h3 className="iva-drawer-section-title">
              <span>◎</span> ГЕОГРАФИЯ ПРИСУТСТВИЯ
            </h3>
            <div className="iva-tag-grid">
              {topCountries.map((country) => (
                <button key={country} className="iva-tag-btn active">
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Niches */}
          <div className="iva-drawer-section">
            <h3 className="iva-drawer-section-title">
              <span>◎</span> КОММЕРЧЕСКИЕ НИШИ B2B
            </h3>
            <div className="iva-niche-list">
              {b2bNiches.map((niche, i) => (
                <button key={i} className="iva-niche-btn active">
                  <span className="iva-niche-icon">{niche.icon}</span>
                  <span className="iva-niche-label">{niche.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="iva-drawer-section">
            <div className="iva-agents-strip">
              <div className="iva-agents-header">
                <span>🤖 АКТИВНЫЕ АГЕНТЫ</span>
                <span className="iva-agents-online">
                  <span className="iva-online-dot" /> {agents.length} online
                </span>
              </div>
              <div className="iva-agents-list">
                {agents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <span key={agent.name} className="iva-agent-chip">
                      <Icon size={12} />
                      {agent.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button className="iva-launch-btn" onClick={handleLaunch}>
            <Rocket size={18} />
            Запуск
          </button>
        </div>
      </div>
    </div>
  );
}

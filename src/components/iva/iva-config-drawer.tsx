'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Rocket, Radio, Circle, CircleDot, Globe, FileText } from 'lucide-react';

const drawerCountries = [
  { id: 'russia', en: 'Russia', ru: 'Россия', de: 'Russland', tr: 'Rusya' },
  { id: 'turkey', en: 'Turkey', ru: 'Турция', de: 'Türkei', tr: 'Türkiye' },
  { id: 'uae', en: 'UAE (Dubai)', ru: 'ОАЭ (Дубай)', de: 'VAE (Dubai)', tr: 'BAE (Dubai)' },
  { id: 'saudi', en: 'Saudi Arabia', ru: 'Саудовская Аравия', de: 'Saudi-Arabien', tr: 'Suudi Arabistan' },
  { id: 'qatar', en: 'Qatar', ru: 'Катар', de: 'Katar', tr: 'Katar' },
  { id: 'germany', en: 'Germany', ru: 'Германия', de: 'Deutschland', tr: 'Almanya' },
  { id: 'uk', en: 'United Kingdom', ru: 'Великобритания', de: 'Großbritannien', tr: 'Birleşik Krallık' },
  { id: 'italy', en: 'Italy', ru: 'Италия', de: 'Italien', tr: 'İtalya' },
];

const drawerNiches = [
  { id: 'glass', icon: '◇', en: 'Architectural glass & premium facades', ru: 'Архитектурное стекло и премиальное фасадное остекление', de: 'Architekturglas & Premium-Fassaden', tr: 'Mimari cam & premium cephe' },
  { id: 'dev', icon: '♛', en: 'Elite development projects (Hotels, Residences)', ru: 'Элитные девелоперские проекты (Отели, Жилые комплексы)', de: 'Elite-Entwicklungsprojekte (Hotels, Wohnungen)', tr: 'Elite geliştirme projeleri (Otel, Konut)' },
  { id: 'automation', icon: '⚙', en: 'Industrial automation systems', ru: 'Системы промышленной автоматизации производства', de: 'Industrielle Automatisierungssysteme', tr: 'Endüstriyel otomasyon sistemleri' },
  { id: 'ai', icon: '◎', en: 'Corporate AI integration & autonomous agents', ru: 'Интеграция корпоративного ИИ и разработка автономных агентов', de: 'Unternehmens-KI-Integration & autonome Agenten', tr: 'Kurumsal yapay zeka entegrasyonu & otonom ajanlar' },
  { id: 'restoration', icon: '⚒', en: 'Historical restoration & traditional glass', ru: 'Реставрация исторических объектов и традиционное стеклоделие', de: 'Historische Restaurierung & traditionelles Glas', tr: 'Tarihi restorasyon & geleneksel camcılık' },
];

const agentList = [
  { nameKey: 'agentScraper', icon: Radio, status: 'online' },
  { nameKey: 'agentClassifier', icon: Circle, status: 'online' },
  { nameKey: 'agentStrategist', icon: CircleDot, status: 'online' },
  { nameKey: 'agentGenerator', icon: FileText, status: 'online' },
  { nameKey: 'agentTranslator', icon: Globe, status: 'online' },
];

export default function IvaConfigDrawer() {
  const { locale, showConfigDrawer, setShowConfigDrawer, countryFilter, setCountryFilter, nicheFilter, setNicheFilter, runAnalysis, agents } = useIvaStore();

  if (!showConfigDrawer) return null;

  const handleToggleCountry = (countryName: string) => {
    setCountryFilter(countryFilter === countryName ? 'all' : countryName);
  };

  const handleToggleNiche = (nicheName: string) => {
    setNicheFilter(nicheFilter === nicheName ? 'all' : nicheName);
  };

  const handleLaunch = () => {
    setShowConfigDrawer(false);
    runAnalysis();
  };

  const onlineAgents = agents.filter(a => a.status === 'online').length;

  return (
    <div className="iva-drawer-overlay" onClick={() => setShowConfigDrawer(false)}>
      <div className="iva-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="iva-drawer-header">
          <div className="iva-drawer-logo">
            <div className="iva-logo-icon" style={{ width: 48, height: 48, fontSize: '1rem' }}>IVA</div>
            <div>
              <div className="iva-logo-name" style={{ fontSize: '1.2rem' }}>IVA</div>
              <div className="iva-logo-sub">{t(locale, 'commandCenter')}</div>
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
              <span>◎</span> {t(locale, 'drawerGeography')}
            </h3>
            <div className="iva-tag-grid">
              {drawerCountries.map((country) => (
                <button
                  key={country.id}
                  className={`iva-tag-btn ${countryFilter === country[locale] ? 'active' : ''}`}
                  onClick={() => handleToggleCountry(country[locale])}
                >
                  {country[locale]}
                </button>
              ))}
            </div>
          </div>

          {/* Niches */}
          <div className="iva-drawer-section">
            <h3 className="iva-drawer-section-title">
              <span>◎</span> {t(locale, 'drawerNiches')}
            </h3>
            <div className="iva-niche-list">
              {drawerNiches.map((niche) => (
                <button
                  key={niche.id}
                  className={`iva-niche-btn ${nicheFilter === niche[locale] ? 'active' : ''}`}
                  onClick={() => handleToggleNiche(niche[locale])}
                >
                  <span className="iva-niche-icon">{niche.icon}</span>
                  <span className="iva-niche-label">{niche[locale]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="iva-drawer-section">
            <div className="iva-agents-strip">
              <div className="iva-agents-header">
                <span>🤖 {t(locale, 'drawerActiveAgents')}</span>
                <span className="iva-agents-online">
                  <span className="iva-online-dot" /> {onlineAgents} {t(locale, 'online')}
                </span>
              </div>
              <div className="iva-agents-list">
                {agentList.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <span key={agent.nameKey} className="iva-agent-chip">
                      <Icon size={12} />
                      {t(locale, agent.nameKey)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button className="iva-launch-btn" onClick={handleLaunch}>
            <Rocket size={18} />
            {t(locale, 'launch')}
          </button>
        </div>
      </div>
    </div>
  );
}

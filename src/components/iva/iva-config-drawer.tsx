'use client';

import { useState } from 'react';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { X, Rocket, Radio, Circle, CircleDot, Globe, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const allCountries = [
  { id: 'russia', en: 'Russia', ru: 'Россия', de: 'Russland', tr: 'Rusya' },
  { id: 'turkey', en: 'Turkey', ru: 'Турция', de: 'Türkei', tr: 'Türkiye' },
  { id: 'uae', en: 'UAE (Dubai)', ru: 'ОАЭ (Дубай)', de: 'VAE (Dubai)', tr: 'BAE (Dubai)' },
  { id: 'saudi', en: 'Saudi Arabia', ru: 'Саудовская Аравия', de: 'Saudi-Arabien', tr: 'Suudi Arabistan' },
  { id: 'qatar', en: 'Qatar', ru: 'Катар', de: 'Katar', tr: 'Katar' },
  { id: 'germany', en: 'Germany', ru: 'Германия', de: 'Deutschland', tr: 'Almanya' },
  { id: 'uk', en: 'United Kingdom', ru: 'Великобритания', de: 'Großbritannien', tr: 'Birleşik Krallık' },
  { id: 'italy', en: 'Italy', ru: 'Италия', de: 'Italien', tr: 'İtalya' },
  { id: 'france', en: 'France', ru: 'Франция', de: 'Frankreich', tr: 'Fransa' },
  { id: 'usa', en: 'United States', ru: 'США', de: 'USA', tr: 'ABD' },
  { id: 'china', en: 'China', ru: 'Китай', de: 'China', tr: 'Çin' },
  { id: 'japan', en: 'Japan', ru: 'Япония', de: 'Japan', tr: 'Japonya' },
  { id: 'korea', en: 'South Korea', ru: 'Южная Корея', de: 'Südkorea', tr: 'Güney Kore' },
  { id: 'singapore', en: 'Singapore', ru: 'Сингапур', de: 'Singapur', tr: 'Singapur' },
  { id: 'israel', en: 'Israel', ru: 'Израиль', de: 'Israel', tr: 'İsrail' },
  { id: 'india', en: 'India', ru: 'Индия', de: 'Indien', tr: 'Hindistan' },
  { id: 'brazil', en: 'Brazil', ru: 'Бразилия', de: 'Brasilien', tr: 'Brezilya' },
  { id: 'switzerland', en: 'Switzerland', ru: 'Швейцария', de: 'Schweiz', tr: 'İsviçre' },
  { id: 'netherlands', en: 'Netherlands', ru: 'Нидерланды', de: 'Niederlande', tr: 'Hollanda' },
  { id: 'spain', en: 'Spain', ru: 'Испания', de: 'Spanien', tr: 'İspanya' },
];

const allNiches = [
  { id: 'glass', icon: '◇', en: 'Architectural glass & premium facades', ru: 'Архитектурное стекло и премиальное фасадное остекление', de: 'Architekturglas & Premium-Fassaden', tr: 'Mimari cam & premium cephe' },
  { id: 'dev', icon: '♛', en: 'Elite development projects', ru: 'Элитные девелоперские проекты', de: 'Elite-Entwicklungsprojekte', tr: 'Elite geliştirme projeleri' },
  { id: 'automation', icon: '⚙', en: 'Industrial automation systems', ru: 'Системы промышленной автоматизации', de: 'Industrielle Automatisierung', tr: 'Endüstriyel otomasyon' },
  { id: 'ai', icon: '◎', en: 'Corporate AI & autonomous agents', ru: 'Корпоративный ИИ и автономные агенты', de: 'Unternehmens-KI & autonome Agenten', tr: 'Kurumsal YZ & otonom ajanlar' },
  { id: 'restoration', icon: '⚒', en: 'Historical restoration & glass', ru: 'Реставрация исторических объектов', de: 'Historische Restaurierung', tr: 'Tarihi restorasyon' },
  { id: 'pharma', icon: '💊', en: 'Pharmaceuticals & MedTech', ru: 'Фармацевтика и медтехнологии', de: 'Pharma & MedTech', tr: 'İlaç ve MedTech' },
  { id: 'finance', icon: '💰', en: 'Finance & Banking', ru: 'Финансы и банковское дело', de: 'Finanzen & Bankwesen', tr: 'Finans ve Bankacılık' },
  { id: 'energy', icon: '⚡', en: 'Energy & Renewables', ru: 'Энергетика и возобновляемые источники', de: 'Energie & Erneuerbare', tr: 'Enerji ve Yenilenebilir' },
  { id: 'logistics', icon: '🚛', en: 'Logistics & Transport', ru: 'Логистика и транспорт', de: 'Logistik & Transport', tr: 'Lojistik ve Ulaşım' },
  { id: 'defense', icon: '🛡', en: 'Aerospace & Defense', ru: 'Авиакосмос и оборона', de: 'Luftfahrt & Verteidigung', tr: 'Havacılık ve Savunma' },
  { id: 'realestate', icon: '🏗', en: 'Real Estate & Construction', ru: 'Недвижимость и строительство', de: 'Immobilien & Bau', tr: 'Gayrimenkul ve İnşaat' },
  { id: 'telecom', icon: '📡', en: 'Telecommunications', ru: 'Телекоммуникации', de: 'Telekommunikation', tr: 'Telekomünikasyon' },
];

const agentList = [
  { nameKey: 'agentScraper', icon: Radio, status: 'online' },
  { nameKey: 'agentClassifier', icon: Circle, status: 'online' },
  { nameKey: 'agentStrategist', icon: CircleDot, status: 'online' },
  { nameKey: 'agentGenerator', icon: FileText, status: 'online' },
  { nameKey: 'agentTranslator', icon: Globe, status: 'online' },
];

const SHOW_INITIAL = 8;

export default function IvaConfigDrawer() {
  const { locale, showConfigDrawer, setShowConfigDrawer, countryFilter, setCountryFilter, nicheFilter, setNicheFilter, runAnalysis, agents } = useIvaStore();
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllNiches, setShowAllNiches] = useState(false);

  if (!showConfigDrawer) return null;

  const visibleCountries = showAllCountries ? allCountries : allCountries.slice(0, SHOW_INITIAL);
  const visibleNiches = showAllNiches ? allNiches : allNiches.slice(0, 6);

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
            <div className="iva-logo-emblem" style={{ width: 48, height: 48 }}>
              <svg viewBox="0 0 80 80" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8C060"/>
                    <stop offset="50%" stopColor="#C8A040"/>
                    <stop offset="100%" stopColor="#A07828"/>
                  </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="38" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.5" opacity="0.4"/>
                <path d="M40 62 Q40 50 38 44 Q36 38 40 32" fill="none" stroke="url(#goldGrad2)" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M38 44 Q30 40 24 36" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M37 40 Q28 34 20 30" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M38 36 Q32 28 26 22" fill="none" stroke="url(#goldGrad2)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M42 44 Q50 40 56 36" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M43 40 Q52 34 60 30" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M42 36 Q48 28 54 22" fill="none" stroke="url(#goldGrad2)" strokeWidth="1" strokeLinecap="round"/>
                <path d="M40 14 Q30 8 22 14 Q16 20 22 28 Q28 34 40 40 Q52 34 58 28 Q64 20 58 14 Q50 8 40 14Z" fill="none" stroke="url(#goldGrad2)" strokeWidth="1.5" opacity="0.6"/>
                <circle cx="40" cy="10" r="2" fill="#E8C060" opacity="0.9"/>
              </svg>
            </div>
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
              {visibleCountries.map((country) => (
                <button
                  key={country.id}
                  className={`iva-tag-btn ${countryFilter === country[locale] ? 'active' : ''}`}
                  onClick={() => handleToggleCountry(country[locale])}
                >
                  {country[locale]}
                </button>
              ))}
            </div>
            {allCountries.length > SHOW_INITIAL && (
              <button className="iva-show-more" onClick={() => setShowAllCountries(!showAllCountries)}>
                {showAllCountries ? (
                  <><ChevronUp size={14} /> {t(locale, 'showLess')}</>
                ) : (
                  <><ChevronDown size={14} /> {t(locale, 'showMore')} ({allCountries.length - SHOW_INITIAL})</>
                )}
              </button>
            )}
          </div>

          {/* Niches */}
          <div className="iva-drawer-section">
            <h3 className="iva-drawer-section-title">
              <span>◎</span> {t(locale, 'drawerNiches')}
            </h3>
            <div className="iva-niche-list">
              {visibleNiches.map((niche) => (
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
            {allNiches.length > 6 && (
              <button className="iva-show-more" onClick={() => setShowAllNiches(!showAllNiches)}>
                {showAllNiches ? (
                  <><ChevronUp size={14} /> {t(locale, 'showLess')}</>
                ) : (
                  <><ChevronDown size={14} /> {t(locale, 'showMore')} ({allNiches.length - 6})</>
                )}
              </button>
            )}
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

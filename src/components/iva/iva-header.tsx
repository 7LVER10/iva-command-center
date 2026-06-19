'use client';

import { useState, useRef, useEffect } from 'react';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Settings, Palette } from 'lucide-react';

export default function IvaHeader() {
  const { locale, setLocale, theme, setTheme, setShowConfigDrawer } = useIvaStore();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const themes: Array<{ id: 'gold' | 'ocean' | 'forest'; label: string }> = [
    { id: 'gold', label: 'Gold' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'forest', label: 'Forest' },
  ];

  const cycleTheme = () => {
    const idx = themes.findIndex(th => th.id === theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next.id);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLangSelect = (l: 'ru' | 'en' | 'de' | 'tr') => {
    setLocale(l);
    setLangOpen(false);
  };

  return (
    <header className="iva-header">
      <div className="iva-header-left">
        <div className="iva-logo">
          <div className="iva-logo-emblem" title="IVA">
            <svg viewBox="0 0 80 80" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8C060"/>
                  <stop offset="50%" stopColor="#C8A040"/>
                  <stop offset="100%" stopColor="#A07828"/>
                </linearGradient>
                <radialGradient id="glowGrad" cx="50%" cy="30%" r="60%">
                  <stop offset="0%" stopColor="#E8C060" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#C8A040" stopOpacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="40" cy="40" r="38" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.4"/>
              <circle cx="40" cy="40" r="38" fill="url(#glowGrad)"/>
              {/* Tree trunk */}
              <path d="M40 62 Q40 50 38 44 Q36 38 40 32" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round"/>
              {/* Left branches */}
              <path d="M38 44 Q30 40 24 36" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M37 40 Q28 34 20 30" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M38 36 Q32 28 26 22" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M39 34 Q34 26 30 18" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" strokeLinecap="round"/>
              {/* Right branches */}
              <path d="M42 44 Q50 40 56 36" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M43 40 Q52 34 60 30" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M42 36 Q48 28 54 22" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M41 34 Q46 26 50 18" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" strokeLinecap="round"/>
              {/* Canopy heart shape */}
              <path d="M40 14 Q30 8 22 14 Q16 20 22 28 Q28 34 40 40 Q52 34 58 28 Q64 20 58 14 Q50 8 40 14Z" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" opacity="0.6"/>
              {/* Circuit dots */}
              <circle cx="22" cy="36" r="1.5" fill="#C8A040" opacity="0.7"/>
              <circle cx="20" cy="30" r="1" fill="#C8A040" opacity="0.5"/>
              <circle cx="26" cy="22" r="1.5" fill="#C8A040" opacity="0.7"/>
              <circle cx="56" cy="36" r="1.5" fill="#C8A040" opacity="0.7"/>
              <circle cx="60" cy="30" r="1" fill="#C8A040" opacity="0.5"/>
              <circle cx="54" cy="22" r="1.5" fill="#C8A040" opacity="0.7"/>
              <circle cx="40" cy="10" r="2" fill="#E8C060" opacity="0.9"/>
              {/* Binary hints */}
              <text x="18" y="42" fontSize="4" fill="#C8A040" opacity="0.3" fontFamily="monospace">01</text>
              <text x="56" y="42" fontSize="4" fill="#C8A040" opacity="0.3" fontFamily="monospace">10</text>
            </svg>
          </div>
          <div className="iva-logo-text">
            <span className="iva-logo-name">IVA</span>
            <span className="iva-logo-sub">{t(locale, 'commandCenter')}</span>
          </div>
        </div>
      </div>

      <div className="iva-header-right">
        <div className="locale-dropdown" ref={langRef}>
          <button className="locale-current" onClick={() => setLangOpen(!langOpen)}>
            <span style={{ fontSize: '0.85rem' }}>🌐</span>
            <span>{locale.toUpperCase()}</span>
            <span style={{ fontSize: '0.6rem' }}>▾</span>
          </button>
          {langOpen && (
            <div className="locale-menu-open">
              {(['ru', 'en', 'de', 'tr'] as const).map((l) => (
                <button
                  key={l}
                  className={`locale-menu-item ${locale === l ? 'active' : ''}`}
                  onClick={() => handleLangSelect(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="header-icon-btn" onClick={cycleTheme} title={t(locale, 'theme')}>
          <Palette size={18} />
        </button>

        <button className="header-icon-btn" onClick={() => setShowConfigDrawer(true)} title={t(locale, 'config')}>
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

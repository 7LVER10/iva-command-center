'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Settings, Palette } from 'lucide-react';

export default function IvaHeader() {
  const { locale, setLocale, theme, setTheme, setShowConfigDrawer } = useIvaStore();

  const themes: Array<{ id: 'gold' | 'ocean' | 'forest'; label: string }> = [
    { id: 'gold', label: 'Gold' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'forest', label: 'Forest' },
  ];

  const cycleTheme = () => {
    const idx = themes.findIndex(t => t.id === theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next.id);
  };

  return (
    <header className="iva-header">
      <div className="iva-header-left">
        <div className="iva-logo">
          <div className="iva-logo-icon">IVA</div>
          <div className="iva-logo-text">
            <span className="iva-logo-name">IVA</span>
            <span className="iva-logo-sub">{t(locale, 'commandCenter')}</span>
          </div>
        </div>
      </div>

      <div className="iva-header-right">
        <div className="locale-dropdown">
          <button className="locale-current">
            <span style={{ fontSize: '0.85rem' }}>🌐</span>
            <span>{locale.toUpperCase()}</span>
            <span style={{ fontSize: '0.6rem' }}>▾</span>
          </button>
          <div className="locale-menu">
            {(['ru', 'en', 'de', 'tr'] as const).map((l) => (
              <button
                key={l}
                className={`locale-menu-item ${locale === l ? 'active' : ''}`}
                onClick={() => setLocale(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button className="header-icon-btn" onClick={cycleTheme} title="Theme">
          <Palette size={18} />
        </button>

        <button className="header-icon-btn" onClick={() => setShowConfigDrawer(true)} title="Config">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

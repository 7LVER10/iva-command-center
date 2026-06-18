'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Locale, Theme } from '@/lib/iva/types';
import { Globe, Palette, Database, Info } from 'lucide-react';

const localeOptions: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
];

const themeOptions: { value: Theme; label: string; color: string }[] = [
  { value: 'gold', label: 'Gold', color: '#d4af37' },
  { value: 'ocean', label: 'Ocean', color: '#3b82c4' },
  { value: 'forest', label: 'Forest', color: '#2d8a6e' },
];

export default function SettingsView() {
  const { locale, theme, setLocale, setTheme, projects } = useIvaStore();

  return (
    <div className="settings-view">
      <h2 className="section-title">{t(locale, 'navSettings')}</h2>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <Globe size={20} className="settings-card-icon" />
            <h3>{t(locale, 'allCountries').split(' ')[0]} / Language</h3>
          </div>
          <div className="settings-card-body">
            <p className="settings-description">Select the display language for the interface.</p>
            <div className="locale-options">
              {localeOptions.map(({ code, label }) => (
                <button
                  key={code}
                  className={`locale-option ${locale === code ? 'active' : ''}`}
                  onClick={() => setLocale(code)}
                >
                  <span className="locale-code">{code.toUpperCase()}</span>
                  <span className="locale-name">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Palette size={20} className="settings-card-icon" />
            <h3>Theme</h3>
          </div>
          <div className="settings-card-body">
            <p className="settings-description">Choose the accent color theme.</p>
            <div className="theme-options">
              {themeOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  className={`theme-option ${theme === value ? 'active' : ''}`}
                  onClick={() => setTheme(value)}
                >
                  <span className="theme-swatch" style={{ background: color }} />
                  <span className="theme-name">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Database size={20} className="settings-card-icon" />
            <h3>Database</h3>
          </div>
          <div className="settings-card-body">
            <p className="settings-description">Local SQLite database information.</p>
            <div className="db-info">
              <div className="db-row">
                <span className="db-label">Engine</span>
                <span className="db-value">better-sqlite3</span>
              </div>
              <div className="db-row">
                <span className="db-label">Projects</span>
                <span className="db-value">{projects.length}</span>
              </div>
              <div className="db-row">
                <span className="db-label">File</span>
                <span className="db-value">iva.db</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Info size={20} className="settings-card-icon" />
            <h3>About</h3>
          </div>
          <div className="settings-card-body">
            <div className="about-info">
              <div className="db-row">
                <span className="db-label">Application</span>
                <span className="db-value">IVA Command Center</span>
              </div>
              <div className="db-row">
                <span className="db-label">Version</span>
                <span className="db-value">0.1.0</span>
              </div>
              <div className="db-row">
                <span className="db-label">Framework</span>
                <span className="db-value">Next.js 16</span>
              </div>
              <div className="db-row">
                <span className="db-label">Runtime</span>
                <span className="db-value">React 19</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

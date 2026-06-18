'use client';

import { useIvaStore } from '@/lib/iva/store';
import { Locale } from '@/lib/iva/types';

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'de', label: 'DE' },
  { code: 'tr', label: 'TR' },
];

export default function LocaleSwitcher() {
  const { locale, setLocale } = useIvaStore();

  return (
    <div className="locale-switcher">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          className={`locale-btn ${locale === code ? 'active' : ''}`}
          onClick={() => setLocale(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

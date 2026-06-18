'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Hexagon } from 'lucide-react';

export default function WelcomeScreen() {
  const { locale } = useIvaStore();

  return (
    <div className="welcome-screen">
      <Hexagon size={64} className="welcome-icon" />
      <h2 className="welcome-title">{t(locale, 'welcomeTitle')}</h2>
      <p className="welcome-text">{t(locale, 'welcomeText')}</p>
    </div>
  );
}

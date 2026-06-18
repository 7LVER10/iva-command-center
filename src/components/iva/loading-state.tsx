'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  const { locale } = useIvaStore();

  return (
    <div className="loading-state">
      <Loader2 size={48} className="spin loading-icon" />
      <p>{t(locale, 'loading')}</p>
    </div>
  );
}

'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { SearchX } from 'lucide-react';

export default function EmptyState() {
  const { locale } = useIvaStore();

  return (
    <div className="empty-state">
      <SearchX size={48} className="empty-icon" />
      <p>{t(locale, 'noResults')}</p>
    </div>
  );
}

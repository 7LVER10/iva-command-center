'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { countries, niches, groups, statuses } from '@/lib/iva/constants';
import { Search, Play, Loader2 } from 'lucide-react';

export default function TopBar() {
  const {
    locale, searchQuery, setSearchQuery,
    countryFilter, setCountryFilter,
    nicheFilter, setNicheFilter,
    groupFilter, setGroupFilter,
    statusFilter, setStatusFilter,
    analysisStatus, runAnalysis,
  } = useIvaStore();

  const isLoading = analysisStatus === 'loading';

  return (
    <div className="top-bar">
      <div className="search-area">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t(locale, 'searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) runAnalysis(); }}
          />
        </div>
        <button
          className="start-btn"
          onClick={runAnalysis}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={18} className="spin" /> : <Play size={18} />}
          <span>{t(locale, 'startAction')}</span>
        </button>
      </div>

      <div className="controls">
        <select
          className="control-select"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
        >
          <option value="all">{t(locale, 'allCountries')}</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="control-select"
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
        >
          <option value="all">{t(locale, 'allNiches')}</option>
          {niches.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select
          className="control-select"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
        >
          <option value="all">{t(locale, 'allGroups')}</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          className="control-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{t(locale, 'allStatuses')}</option>
          {statuses.map(s => (
            <option key={s} value={s}>{t(locale, `status${s.charAt(0).toUpperCase() + s.slice(1)}`)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

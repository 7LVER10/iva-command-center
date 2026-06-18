'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Globe, Layers, Flame, Target } from 'lucide-react';

export default function AnalyticsView() {
  const { locale, projects, loadProjects } = useIvaStore();

  useEffect(() => {
    if (projects.length === 0) loadProjects();
  }, [projects.length, loadProjects]);

  const stats = useMemo(() => {
    const total = projects.length;
    const avgRelevance = total > 0
      ? parseFloat((projects.reduce((a, p) => a + p.relevance, 0) / total).toFixed(2))
      : 0;
    const highPriority = projects.filter(p => p.priority === 'high').length;
    const activeCount = projects.filter(p => p.status === 'active').length;

    const byCountry: Record<string, number> = {};
    projects.forEach(p => { byCountry[p.country] = (byCountry[p.country] || 0) + 1; });
    const topCountries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const byNiche: Record<string, number> = {};
    projects.forEach(p => { byNiche[p.niche] = (byNiche[p.niche] || 0) + 1; });
    const topNiches = Object.entries(byNiche).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const byGroup: Record<string, number> = {};
    projects.forEach(p => { byGroup[p.grp] = (byGroup[p.grp] || 0) + 1; });

    const byStatus: Record<string, number> = {};
    projects.forEach(p => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

    const relevanceRanges = { high: 0, medium: 0, low: 0 };
    projects.forEach(p => {
      if (p.relevance >= 0.8) relevanceRanges.high++;
      else if (p.relevance >= 0.6) relevanceRanges.medium++;
      else relevanceRanges.low++;
    });

    return { total, avgRelevance, highPriority, activeCount, topCountries, topNiches, byGroup, byStatus, relevanceRanges };
  }, [projects]);

  const maxCountry = Math.max(...stats.topCountries.map(c => c[1]), 1);
  const maxNiche = Math.max(...stats.topNiches.map(n => n[1]), 1);

  return (
    <div className="analytics-view">
      <h2 className="section-title">{t(locale, 'navAnalytics')}</h2>

      <div className="analytics-summary-row">
        <div className="stat-card">
          <BarChart3 size={24} className="stat-icon" />
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">{t(locale, 'metricsTotal')}</div>
        </div>
        <div className="stat-card">
          <Target size={24} className="stat-icon" />
          <div className="stat-value">{stats.avgRelevance}</div>
          <div className="stat-label">{t(locale, 'metricsRelevance')}</div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} className="stat-icon" />
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">{t(locale, 'metricsPriority')}</div>
        </div>
        <div className="stat-card">
          <Flame size={24} className="stat-icon" />
          <div className="stat-value">{stats.activeCount}</div>
          <div className="stat-label">{t(locale, 'statusActive')}</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3><Globe size={18} /> {t(locale, 'allCountries')}</h3>
          <div className="bar-chart">
            {stats.topCountries.map(([country, count]) => (
              <div key={country} className="bar-row">
                <span className="bar-label">{country}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(count / maxCountry) * 100}%` }} />
                </div>
                <span className="bar-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3><Layers size={18} /> {t(locale, 'allNiches')}</h3>
          <div className="bar-chart">
            {stats.topNiches.map(([niche, count]) => (
              <div key={niche} className="bar-row">
                <span className="bar-label">{niche}</span>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-alt" style={{ width: `${(count / maxNiche) * 100}%` }} />
                </div>
                <span className="bar-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3><Flame size={18} /> {t(locale, 'allGroups')}</h3>
          <div className="donut-chart-wrapper">
            {Object.entries(stats.byGroup).map(([group, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={group} className="donut-item">
                  <div className="donut-ring" style={{
                    background: `conic-gradient(var(--iva-accent) ${pct}%, var(--iva-border) ${pct}%)`,
                  }}>
                    <div className="donut-center">{pct}%</div>
                  </div>
                  <span className="donut-label">{group}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h3><TrendingUp size={18} /> Relevance Distribution</h3>
          <div className="relevance-dist">
            <div className="dist-bar">
              <div className="dist-segment dist-high" style={{ width: `${stats.total > 0 ? (stats.relevanceRanges.high / stats.total) * 100 : 0}%` }}>
                {stats.relevanceRanges.high > 0 && <span>High ({stats.relevanceRanges.high})</span>}
              </div>
              <div className="dist-segment dist-medium" style={{ width: `${stats.total > 0 ? (stats.relevanceRanges.medium / stats.total) * 100 : 0}%` }}>
                {stats.relevanceRanges.medium > 0 && <span>Med ({stats.relevanceRanges.medium})</span>}
              </div>
              <div className="dist-segment dist-low" style={{ width: `${stats.total > 0 ? (stats.relevanceRanges.low / stats.total) * 100 : 0}%` }}>
                {stats.relevanceRanges.low > 0 && <span>Low ({stats.relevanceRanges.low})</span>}
              </div>
            </div>
            <div className="dist-legend">
              <span className="dist-legend-item"><span className="dot dot-high" /> 80-100%</span>
              <span className="dist-legend-item"><span className="dot dot-medium" /> 60-79%</span>
              <span className="dist-legend-item"><span className="dot dot-low" /> 0-59%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

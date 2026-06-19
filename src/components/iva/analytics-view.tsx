'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { BarChart3, TrendingUp, Globe, Layers, Flame, Target, Activity } from 'lucide-react';

const GOLD = '#C8A040';
const GOLD_DIM = '#A07828';
const GREEN = '#30A840';
const RED = '#C83030';
const ORANGE = '#C07020';
const BLUE = '#3A6A9A';
const MUTED = '#5A5040';

const PIE_COLORS = [GOLD, GREEN, BLUE, ORANGE, RED, '#8A5A20', '#4A8A8A', '#8A4A8A'];

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1C1814',
      border: '1px solid rgba(184,138,60,0.25)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
      color: '#F0EDE8',
    }}>
      <div style={{ color: '#8A8070', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || GOLD }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

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
    const countryData = Object.entries(byCountry)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, value]) => ({ name, value }));

    const byNiche: Record<string, number> = {};
    projects.forEach(p => { byNiche[p.niche] = (byNiche[p.niche] || 0) + 1; });
    const nicheData = Object.entries(byNiche)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    const byGroup: Record<string, number> = {};
    projects.forEach(p => { byGroup[p.grp] = (byGroup[p.grp] || 0) + 1; });
    const groupData = Object.entries(byGroup).map(([name, value]) => ({ name, value }));

    const byStatus: Record<string, number> = {};
    projects.forEach(p => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
    const statusData = Object.entries(byStatus).map(([name, value]) => ({
      name: t(locale, `status${name.charAt(0).toUpperCase() + name.slice(1)}`),
      value,
    }));

    const byPriority: Record<string, number> = {};
    projects.forEach(p => { byPriority[p.priority] = (byPriority[p.priority] || 0) + 1; });
    const priorityData = Object.entries(byPriority).map(([name, value]) => ({
      name: t(locale, `priority${name.charAt(0).toUpperCase() + name.slice(1)}`),
      value,
    }));

    const relevanceRanges = { high: 0, medium: 0, low: 0 };
    projects.forEach(p => {
      if (p.relevance >= 0.8) relevanceRanges.high++;
      else if (p.relevance >= 0.6) relevanceRanges.medium++;
      else relevanceRanges.low++;
    });

    const timelineData = (() => {
      const byDate: Record<string, number> = {};
      projects.forEach(p => {
        const date = p.created_at.split(' ')[0];
        byDate[date] = (byDate[date] || 0) + 1;
      });
      return Object.entries(byDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));
    })();

    const relevanceDistribution = projects.map(p => ({
      name: p.name.substring(0, 15),
      relevance: Math.round(p.relevance * 100),
    })).sort((a, b) => b.relevance - a.relevance).slice(0, 10);

    const radarData = [
      { subject: t(locale, 'metricsRelevance'), A: avgRelevance * 100, fullMark: 100 },
      { subject: t(locale, 'metricsPriority'), A: total > 0 ? (highPriority / total) * 100 : 0, fullMark: 100 },
      { subject: t(locale, 'metricsActive'), A: total > 0 ? (activeCount / total) * 100 : 0, fullMark: 100 },
      { subject: 'Countries', A: Object.keys(byCountry).length * 5, fullMark: 100 },
      { subject: 'Niches', A: Object.keys(byNiche).length * 3, fullMark: 100 },
    ];

    return {
      total, avgRelevance, highPriority, activeCount,
      countryData, nicheData, groupData, statusData, priorityData,
      relevanceRanges, timelineData, relevanceDistribution, radarData,
    };
  }, [projects, locale]);

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
          <div className="stat-label">{t(locale, 'metricsActive')}</div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Country Bar Chart */}
        <div className="chart-card">
          <h3><Globe size={18} /> {t(locale, 'allCountries')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.countryData} layout="vertical" margin={{ left: 80, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke={MUTED} fontSize={11} />
              <YAxis type="category" dataKey="name" stroke={MUTED} fontSize={11} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Niche Bar Chart */}
        <div className="chart-card">
          <h3><Layers size={18} /> {t(locale, 'allNiches')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.nicheData} layout="vertical" margin={{ left: 120, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" stroke={MUTED} fontSize={11} />
              <YAxis type="category" dataKey="name" stroke={MUTED} fontSize={10} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={GOLD_DIM} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Group Pie Chart */}
        <div className="chart-card">
          <h3><Flame size={18} /> {t(locale, 'allGroups')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.groupData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {stats.groupData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="chart-card">
          <h3><Activity size={18} /> Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {stats.statusData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Area Chart */}
        <div className="chart-card">
          <h3><TrendingUp size={18} /> Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.timelineData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke={MUTED} fontSize={11} />
              <YAxis stroke={MUTED} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke={GOLD} fill="url(#goldGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Relevance Distribution Bar */}
        <div className="chart-card">
          <h3><Target size={18} /> Relevance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.relevanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke={MUTED} fontSize={9} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke={MUTED} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="relevance" radius={[4, 4, 0, 0]}>
                {stats.relevanceDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.relevance >= 80 ? GREEN : entry.relevance >= 60 ? GOLD : RED} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Bar Chart */}
        <div className="chart-card">
          <h3><BarChart3 size={18} /> Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" stroke={MUTED} fontSize={12} />
              <YAxis stroke={MUTED} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.priorityData.map((entry, index) => (
                  <Cell key={index} fill={[RED, ORANGE, GREEN][index] || GOLD} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="chart-card">
          <h3><Activity size={18} /> Performance Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={stats.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" stroke={MUTED} fontSize={10} />
              <PolarRadiusAxis stroke={MUTED} fontSize={9} />
              <Radar name="IVA" dataKey="A" stroke={GOLD} fill={GOLD} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Relevance Distribution Bar */}
      <div className="chart-card" style={{ marginTop: 'var(--space-6)' }}>
        <h3><TrendingUp size={18} /> Relevance Spectrum</h3>
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
  );
}

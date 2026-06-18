'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { useEffect, useState } from 'react';
import { FileText, RefreshCw, Download, Clock } from 'lucide-react';

interface AnalysisLog {
  id: number;
  query: string;
  country_filter: string;
  niche_filter: string;
  group_filter: string;
  result_count: number;
  avg_relevance: number;
  high_priority_count: number;
  created_at: string;
}

export default function ReportsView() {
  const { locale } = useIvaStore();
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analysis/logs');
      const data = await res.json();
      setLogs(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/analysis/logs');
        const data = await res.json();
        if (!cancelled) setLogs(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const exportCSV = () => {
    const headers = ['ID', 'Query', 'Country', 'Niche', 'Group', 'Results', 'Avg Relevance', 'High Priority', 'Date'];
    const rows = logs.map(l =>
      [l.id, l.query, l.country_filter, l.niche_filter, l.group_filter, l.result_count, l.avg_relevance, l.high_priority_count, l.created_at].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iva-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-view">
      <div className="reports-header">
        <h2 className="section-title">{t(locale, 'navReports')}</h2>
        <div className="reports-actions">
          <button className="refresh-btn" onClick={fetchLogs} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <button className="export-btn" onClick={exportCSV} disabled={logs.length === 0}>
            <Download size={16} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw size={32} className="spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} className="empty-icon" />
          <p>{t(locale, 'noResults')}</p>
        </div>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t(locale, 'navSearch')}</th>
                <th>{t(locale, 'allCountries')}</th>
                <th>{t(locale, 'allNiches')}</th>
                <th>{t(locale, 'allGroups')}</th>
                <th>{t(locale, 'metricsTotal')}</th>
                <th>{t(locale, 'metricsRelevance')}</th>
                <th>{t(locale, 'metricsPriority')}</th>
                <th><Clock size={14} /></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td className="query-cell">{log.query || '—'}</td>
                  <td>{log.country_filter === 'all' ? '—' : log.country_filter}</td>
                  <td>{log.niche_filter === 'all' ? '—' : log.niche_filter}</td>
                  <td>{log.group_filter === 'all' ? '—' : log.group_filter}</td>
                  <td><strong>{log.result_count}</strong></td>
                  <td>{log.avg_relevance}</td>
                  <td>{log.high_priority_count}</td>
                  <td className="date-cell">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="reports-footer">
        <span>{logs.length} {t(locale, 'navReports').toLowerCase()}</span>
      </div>
    </div>
  );
}

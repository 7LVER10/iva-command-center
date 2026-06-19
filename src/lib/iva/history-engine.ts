import { AnalysisHistoryEntry } from './vnext-types';

const HISTORY_KEY = 'iva-analysis-history';
const MAX_HISTORY = 50;

export function getHistory(): AnalysisHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<AnalysisHistoryEntry, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const newEntry: AnalysisHistoryEntry = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  history.unshift(newEntry);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function compareEntries(a: AnalysisHistoryEntry, b: AnalysisHistoryEntry) {
  return {
    opportunityDelta: a.avg_opportunity - b.avg_opportunity,
    riskDelta: a.avg_risk - b.avg_risk,
    marginDelta: a.avg_margin - b.avg_margin,
    countDelta: a.result_count - b.result_count,
  };
}

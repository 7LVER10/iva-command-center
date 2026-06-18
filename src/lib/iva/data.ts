import { getDb, seedDatabase } from './db';
import type { Project, AnalysisResult, ProjectStatus } from './types';

export { countries, niches, groups, statuses } from './constants';

export function getAllProjects(): Project[] {
  const db = getDb();
  seedDatabase(db);
  const rows = db.prepare('SELECT * FROM projects ORDER BY id').all() as Project[];
  return rows;
}

export function getFilteredProjects(
  query: string,
  country: string,
  niche: string,
  group: string,
  status: string
): Project[] {
  const db = getDb();
  seedDatabase(db);

  let sql = 'SELECT * FROM projects WHERE 1=1';
  const params: (string | number)[] = [];

  if (query) {
    sql += ' AND (name LIKE ? OR country LIKE ? OR niche LIKE ? OR grp LIKE ? OR priority LIKE ?)';
    const q = `%${query}%`;
    params.push(q, q, q, q, q);
  }
  if (country && country !== 'all') {
    sql += ' AND country = ?';
    params.push(country);
  }
  if (niche && niche !== 'all') {
    sql += ' AND niche = ?';
    params.push(niche);
  }
  if (group && group !== 'all') {
    sql += ' AND grp = ?';
    params.push(group);
  }
  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY id';
  return db.prepare(sql).all(...params) as Project[];
}

export function runAnalysis(
  query: string,
  country: string,
  niche: string,
  group: string,
  status: string
): AnalysisResult {
  const items = getFilteredProjects(query, country, niche, group, status);
  const total = items.length;
  const avgRelevance = total > 0
    ? parseFloat((items.reduce((a, c) => a + c.relevance, 0) / total).toFixed(2))
    : 0;
  const highPriorityCount = items.filter(p => p.priority === 'high').length;

  const db = getDb();
  db.prepare(`
    INSERT INTO analysis_logs (query, country_filter, niche_filter, group_filter, result_count, avg_relevance, high_priority_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(query, country, niche, group, total, avgRelevance, highPriorityCount);

  return { items, metrics: { total, avgRelevance, highPriorityCount } };
}

export function updateProjectStatus(id: number, status: ProjectStatus): void {
  const db = getDb();
  db.prepare('UPDATE projects SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
}

export function deleteProject(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function createProject(data: {
  name: string;
  country: string;
  niche: string;
  grp: string;
  relevance: number;
  priority: string;
  status: string;
  summary_en?: string;
  summary_ru?: string;
  summary_de?: string;
  summary_tr?: string;
}): Project {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO projects (name, country, niche, grp, relevance, priority, status, summary_en, summary_ru, summary_de, summary_tr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.name, data.country, data.niche, data.grp,
    data.relevance, data.priority, data.status,
    data.summary_en || '', data.summary_ru || '', data.summary_de || '', data.summary_tr || ''
  );
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid) as Project;
}

export function updateProject(id: number, data: Partial<{
  name: string;
  country: string;
  niche: string;
  grp: string;
  relevance: number;
  priority: string;
  status: string;
  summary_en: string;
  summary_ru: string;
  summary_de: string;
  summary_tr: string;
}>): void {
  const db = getDb();
  const fields: string[] = [];
  const values: (string | number)[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length > 0) {
    fields.push('updated_at = datetime("now")');
    values.push(id);
    db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }
}

export function getAnalysisLogs() {
  const db = getDb();
  return db.prepare('SELECT * FROM analysis_logs ORDER BY id DESC LIMIT 50').all();
}

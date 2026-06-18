import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'iva.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      niche TEXT NOT NULL,
      grp TEXT NOT NULL,
      relevance REAL NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'active',
      summary_en TEXT NOT NULL DEFAULT '',
      summary_ru TEXT NOT NULL DEFAULT '',
      summary_de TEXT NOT NULL DEFAULT '',
      summary_tr TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS analysis_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL DEFAULT '',
      country_filter TEXT NOT NULL DEFAULT 'all',
      niche_filter TEXT NOT NULL DEFAULT 'all',
      group_filter TEXT NOT NULL DEFAULT 'all',
      result_count INTEGER NOT NULL DEFAULT 0,
      avg_relevance REAL NOT NULL DEFAULT 0,
      high_priority_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export function seedDatabase(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number };
  if (count.c > 0) return;

  const insert = db.prepare(`
    INSERT INTO projects (name, country, niche, grp, relevance, priority, status, summary_en, summary_ru, summary_de, summary_tr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const projects = [
    ['Operation Falcon', 'United States', 'IT & Software', 'Alpha', 0.92, 'high', 'active', 'Strategic deployment analysis for sector 7.', 'Стратегический анализ развёртывания для сектора 7.', 'Strategische Einsatzanalyse für Sektor 7.', '7. sektör için stratejik deployment analizi.'],
    ['Project Nightfall', 'Germany', 'Construction', 'Beta', 0.85, 'high', 'active', 'Infrastructure resilience assessment.', 'Оценка устойчивости инфраструктуры.', 'Infrastruktur-Widerstandsfähigkeitsbewertung.', 'Altyapı dayanıklılık değerlendirmesi.'],
    ['Initiative Aurora', 'Russia', 'Energy (Oil & Gas)', 'Gamma', 0.78, 'medium', 'pending', 'Resource allocation and logistics review.', 'Обзор распределения ресурсов и логистики.', 'Ressourcenallokation und Logistiküberprüfung.', 'Kaynak tahsisi ve lojistik incelemesi.'],
    ['Taskforce Shield', 'United States', 'IT & Software', 'Alpha', 0.91, 'high', 'active', 'Cybersecurity readiness evaluation.', 'Оценка готовности к кибербезопасности.', 'Cybersecurity-Bereitschaftsbewertung.', 'Siber güvenlik hazırlık değerlendirmesi.'],
    ['Blue Horizon', 'Germany', 'Finance & Banking', 'Beta', 0.74, 'low', 'completed', 'Market expansion risk analysis.', 'Анализ рисков расширения рынка.', 'Markterweiterungs-Risikoanalyse.', 'Pazar genişletme risk analizi.'],
    ['Red Summit', 'China', 'Telecommunications', 'Gamma', 0.88, 'high', 'active', 'Cross-border coordination efficiency.', 'Эффективность трансграничной координации.', 'Grenzüberschreitende Koordinationseffizienz.', 'Sınır ötesi koordinasyon verimliliği.'],
    ['Silent Watch', 'United Kingdom', 'IT & Software', 'Alpha', 0.65, 'medium', 'active', 'Surveillance system performance audit.', 'Аудит производительности системы наблюдения.', 'Überwachungsleistungs-Audit.', 'Gözlem sistemi performans denetimi.'],
    ['Iron Clad', 'France', 'Construction', 'Beta', 0.93, 'high', 'active', 'Supply chain security assessment.', 'Оценка безопасности цепочки поставок.', 'Lieferkettensicherheitsbewertung.', 'Tedarik zinciri güvenlik değerlendirmesi.'],
    ['Anadolu Kalkanı', 'Turkey', 'Automotive', 'Alpha', 0.89, 'high', 'active', 'Regional security cooperation assessment.', 'Оценка регионального сотрудничества в области безопасности.', 'Regionale Sicherheitskooperationsbewertung.', 'Bölgesel güvenlik işbirliği değerlendirmesi.'],
    ['Glass Fortress', 'Japan', 'Glass Industry', 'Gamma', 0.82, 'medium', 'pending', 'High-precision glass manufacturing analysis.', 'Анализ высокоточного производства стекла.', 'Hochpräzise Glasfertigungsanalyse.', 'Yüksek hassasiyetli cam üretimi analizi.'],
    ['Pharma Shield', 'Switzerland', 'Pharmaceuticals', 'Beta', 0.95, 'high', 'active', 'Drug safety and compliance review.', 'Обзор безопасности лекарств и соответствия.', 'Arzneimittelsicherheits- und Compliance-Überprüfung.', 'İlaç güvenliği ve uyumluluk incelemesi.'],
    ['Agri Future', 'Netherlands', 'Agritech', 'Alpha', 0.76, 'low', 'archived', 'Sustainable agriculture technology assessment.', 'Оценка технологий устойчивого сельского хозяйства.', 'Nachhaltige Landwirtschaftstechnologie-Bewertung.', 'Sürdürülebilir tarım teknolojisi değerlendirmesi.'],
    ['LogiCore', 'UAE', 'Logistics & Transport', 'Beta', 0.81, 'medium', 'active', 'Global shipping route optimization.', 'Оптимизация глобальных маршрутов доставки.', 'Globale Versandroutenoptimierung.', 'Küresel nakliye rotası optimizasyonu.'],
    ['Power Grid X', 'South Korea', 'Energy (Oil & Gas)', 'Gamma', 0.87, 'high', 'active', 'Renewable integration feasibility study.', 'Исследование интеграции возобновляемых источников.', 'Erneuerbare-Integration Machbarkeitsstudie.', 'Yenilenebilir entegrasyon fizibilite çalışması.'],
    ['FinNexus', 'Canada', 'Finance & Banking', 'Alpha', 0.79, 'medium', 'pending', 'Digital payment ecosystem risk analysis.', 'Анализ рисков экосистемы цифровых платежей.', 'Digitales Zahlungssystem Risikoanalyse.', 'Dijital ödeme ekosistemi risk analizi.'],
  ];

  const insertMany = db.transaction(() => {
    for (const p of projects) insert.run(...p);
  });
  insertMany();
}

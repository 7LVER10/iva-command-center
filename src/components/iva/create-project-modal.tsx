'use client';

import { useState } from 'react';
import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { countries, niches, groups } from '@/lib/iva/constants';
import { X, Plus } from 'lucide-react';
import { Priority, ProjectStatus } from '@/lib/iva/types';

export default function CreateProjectModal() {
  const { locale, showCreateModal, setShowCreateModal, createProject } = useIvaStore();
  const [form, setForm] = useState({
    name: '',
    country: countries[0],
    niche: niches[0],
    grp: groups[0],
    relevance: 0.5,
    priority: 'medium' as Priority,
    status: 'active' as ProjectStatus,
    summary_en: '',
    summary_ru: '',
    summary_de: '',
    summary_tr: '',
  });
  const [saving, setSaving] = useState(false);

  if (!showCreateModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const ok = await createProject(form);
    setSaving(false);
    if (ok) {
      setShowCreateModal(false);
      setForm({
        name: '', country: countries[0], niche: niches[0], grp: groups[0],
        relevance: 0.5, priority: 'medium', status: 'active',
        summary_en: '', summary_ru: '', summary_de: '', summary_tr: '',
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Plus size={20} /> Create Project</h2>
          <button className="modal-close" onClick={() => setShowCreateModal(false)}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Project Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>Country *</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Niche *</label>
              <select value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })}>
                {niches.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Group *</label>
              <select value={form.grp} onChange={(e) => setForm({ ...form, grp: e.target.value })}>
                {groups.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Relevance: {Math.round(form.relevance * 100)}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(form.relevance * 100)}
                onChange={(e) => setForm({ ...form, relevance: parseInt(e.target.value) / 100 })}
              />
            </div>
            <div className="form-row">
              <label>Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
                <option value="high">{t(locale, 'priorityHigh')}</option>
                <option value="medium">{t(locale, 'priorityMedium')}</option>
                <option value="low">{t(locale, 'priorityLow')}</option>
              </select>
            </div>
            <div className="form-row">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}>
                <option value="active">{t(locale, 'statusActive')}</option>
                <option value="pending">{t(locale, 'statusPending')}</option>
                <option value="completed">{t(locale, 'statusCompleted')}</option>
                <option value="archived">{t(locale, 'statusArchived')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>Summary (EN)</label>
            <textarea
              value={form.summary_en}
              onChange={(e) => setForm({ ...form, summary_en: e.target.value })}
              placeholder="English summary"
              rows={2}
            />
          </div>
          <div className="form-row">
            <label>Summary (RU)</label>
            <textarea
              value={form.summary_ru}
              onChange={(e) => setForm({ ...form, summary_ru: e.target.value })}
              placeholder="Русское описание"
              rows={2}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="confirm-cancel" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="start-btn" disabled={saving || !form.name.trim()}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

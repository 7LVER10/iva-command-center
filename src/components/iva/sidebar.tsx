'use client';

import { useIvaStore } from '@/lib/iva/store';
import { t } from '@/lib/iva/i18n';
import { NavSection } from '@/lib/iva/types';
import {
  Search, FolderOpen, BarChart3, FileText, Settings,
  PanelLeftClose, PanelLeftOpen, Hexagon, Plus, Bot
} from 'lucide-react';

const navItems: { key: NavSection; icon: typeof Search }[] = [
  { key: 'search', icon: Search },
  { key: 'projects', icon: FolderOpen },
  { key: 'analytics', icon: BarChart3 },
  { key: 'agents', icon: Bot },
  { key: 'reports', icon: FileText },
  { key: 'settings', icon: Settings },
];

const navKeyMap: Record<NavSection, string> = {
  search: 'navSearch',
  projects: 'navProjects',
  analytics: 'navAnalytics',
  agents: 'navAgents',
  reports: 'navReports',
  settings: 'navSettings',
};

export default function Sidebar() {
  const { locale, navSection, setNavSection, sidebarCollapsed, toggleSidebar, setShowCreateModal } = useIvaStore();

  return (
    <aside className="sidebar" data-collapsed={sidebarCollapsed}>
      <div className="sidebar-header">
        <button className="logo-btn" onClick={toggleSidebar} title="Toggle menu">
          <Hexagon className="logo-icon" />
          {!sidebarCollapsed && <span className="logo-text">IVA</span>}
        </button>
        {!sidebarCollapsed && (
          <div className="brand-subtitle">{t(locale, 'commandCenter')}</div>
        )}
      </div>

      <nav className="nav-section">
        {navItems.map(({ key, icon: Icon }) => (
          <button
            key={key}
            className={`nav-item ${navSection === key ? 'active' : ''}`}
            onClick={() => setNavSection(key)}
          >
            <Icon size={18} />
            {!sidebarCollapsed && <span>{t(locale, navKeyMap[key])}</span>}
          </button>
        ))}
      </nav>

      {!sidebarCollapsed && (
        <button className="nav-item create-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          <span>{t(locale, 'newProject')}</span>
        </button>
      )}

      <div className="sidebar-footer">
        {sidebarCollapsed ? (
          <PanelLeftOpen size={18} className="collapse-icon" onClick={toggleSidebar} />
        ) : (
          <PanelLeftClose size={18} className="collapse-icon" onClick={toggleSidebar} />
        )}
      </div>
    </aside>
  );
}

'use client';

import { useIvaStore } from '@/lib/iva/store';
import Sidebar from './sidebar';
import TopBar from './top-bar';
import LocaleSwitcher from './locale-switcher';
import ThemeSwitcher from './theme-switcher';
import WelcomeScreen from './welcome-screen';
import LoadingState from './loading-state';
import EmptyState from './empty-state';
import ResultCards from './result-cards';
import ProjectsView from './projects-view';
import AnalyticsView from './analytics-view';
import AgentsView from './agents-view';
import ReportsView from './reports-view';
import SettingsView from './settings-view';
import ToastContainer from './toast';
import ConfirmDialog from './confirm-dialog';
import CreateProjectModal from './create-project-modal';
import ProjectDetailModal from './project-detail-modal';
import { t } from '@/lib/iva/i18n';

export default function AppLayout() {
  const { theme, navSection, analysisStatus, analysisResult, locale } = useIvaStore();

  return (
    <div className="app-layout" data-theme={theme}>
      <Sidebar />
      <main className="main-area">
        {navSection === 'search' && (
          <>
            <div className="top-bar-wrapper">
              <TopBar />
              <div className="top-bar-controls">
                <ThemeSwitcher />
                <LocaleSwitcher />
              </div>
            </div>
            <div className="content-area">
              {analysisStatus === 'idle' && <WelcomeScreen />}
              {analysisStatus === 'loading' && <LoadingState />}
              {analysisStatus === 'error' && (
                <div className="error-state">
                  <p>{t(locale, 'error')}</p>
                </div>
              )}
              {analysisStatus === 'success' && analysisResult && (
                <>
                  <h2 className="section-title">{t(locale, 'resultsTitle')}</h2>
                  {analysisResult.items.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <ResultCards
                      items={analysisResult.items}
                      metrics={analysisResult.metrics}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}

        {navSection === 'projects' && (
          <div className="content-area">
            <ProjectsView />
          </div>
        )}

        {navSection === 'analytics' && (
          <div className="content-area">
            <AnalyticsView />
          </div>
        )}

        {navSection === 'agents' && (
          <div className="content-area">
            <AgentsView />
          </div>
        )}

        {navSection === 'reports' && (
          <div className="content-area">
            <ReportsView />
          </div>
        )}

        {navSection === 'settings' && (
          <div className="content-area">
            <SettingsView />
          </div>
        )}
      </main>

      <ToastContainer />
      <ConfirmDialog />
      <CreateProjectModal />
      <ProjectDetailModal />
    </div>
  );
}

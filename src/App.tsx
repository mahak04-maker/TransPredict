import { useState } from 'react';
import type { PageKey } from '@/types';
import { AppProvider } from '@/store';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { ToastContainer } from '@/components/Toast';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransformersPage } from '@/pages/TransformersPage';
import { RiskPredictionPage } from '@/pages/RiskPredictionPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { VoiceEscalationPage } from '@/pages/VoiceEscalationPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { ContactsPage } from '@/pages/ContactsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-navy-950">
        <Sidebar page={page} setPage={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar onMenu={() => setSidebarOpen(true)} page={page} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              {page === 'dashboard' && <DashboardPage setPage={setPage} />}
              {page === 'transformers' && <TransformersPage setPage={setPage} />}
              {page === 'risk' && <RiskPredictionPage />}
              {page === 'alerts' && <AlertsPage setPage={setPage} />}
              {page === 'voice' && <VoiceEscalationPage />}
              {page === 'maintenance' && <MaintenancePage />}
              {page === 'contacts' && <ContactsPage />}
              {page === 'analytics' && <AnalyticsPage />}
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;

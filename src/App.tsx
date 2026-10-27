import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { RevokedBanner } from './components/RevokedBanner';
import { DashboardOverview } from './components/DashboardOverview';
import { AdmissionsModule } from './components/AdmissionsModule';
import { AttendanceModule } from './components/AttendanceModule';
import { ExaminationsModule } from './components/ExaminationsModule';
import { FeesModule } from './components/FeesModule';
import { ReceiptOcrModule } from './components/ReceiptOcrModule';
import { UdiseModule } from './components/UdiseModule';
import { StaffModule } from './components/StaffModule';
import { AuditLogsModule } from './components/AuditLogsModule';
import { AppUpdatesModule } from './components/AppUpdatesModule';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const { currentUser, isRevoked } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar onOpenUpdates={() => setActiveTab('updates')} />

      {/* Revoked User Lockout Banner */}
      <RevokedBanner />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'overview' && <DashboardOverview onNavigate={setActiveTab} />}
          {activeTab === 'admissions' && <AdmissionsModule />}
          {activeTab === 'attendance' && <AttendanceModule />}
          {activeTab === 'examinations' && <ExaminationsModule />}
          {activeTab === 'fees' && <FeesModule />}
          {activeTab === 'receipt-ocr' && <ReceiptOcrModule />}
          {activeTab === 'udise' && <UdiseModule />}
          {activeTab === 'staff' && <StaffModule />}
          {activeTab === 'audit' && <AuditLogsModule />}
          {activeTab === 'updates' && <AppUpdatesModule />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>JNSD Education Centre</strong> • Affiliated to CBSE (Code: 09210401802) • Session 2026–27
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Database Status: Persistent Local Relational Store & Supabase Sync Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;


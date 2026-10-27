import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { RevokedBanner } from './components/RevokedBanner';
import { LoginPage } from './components/LoginPage';
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
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  Menu,
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, isManager, isPrincipal } = useAuth();

  // If user is not logged in, show dedicated Role-Based Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar with Safe Area Support */}
      <Navbar
        onOpenUpdates={() => setActiveTab('updates')}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Revoked User Lockout Banner */}
      <RevokedBanner />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Responsive Sidebar (Drawer on mobile, Static column on md+) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Content View Container: 100% width on mobile */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 md:pb-8">
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

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens < md) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-lg flex items-center justify-around px-2 py-1.5 no-print"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'overview'
              ? 'text-school-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard
            className={`w-5 h-5 mb-0.5 ${
              activeTab === 'overview' ? 'text-school-900' : 'text-slate-400'
            }`}
          />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'admissions'
              ? 'text-school-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus
            className={`w-5 h-5 mb-0.5 ${
              activeTab === 'admissions' ? 'text-school-900' : 'text-slate-400'
            }`}
          />
          <span>Students</span>
        </button>

        {isManager || isPrincipal ? (
          <button
            onClick={() => setActiveTab('fees')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              activeTab === 'fees'
                ? 'text-amber-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard
              className={`w-5 h-5 mb-0.5 ${
                activeTab === 'fees' ? 'text-amber-600' : 'text-slate-400'
              }`}
            />
            <span>Fees</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
              activeTab === 'attendance'
                ? 'text-teal-700 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CalendarCheck
              className={`w-5 h-5 mb-0.5 ${
                activeTab === 'attendance' ? 'text-teal-600' : 'text-slate-400'
              }`}
            />
            <span>Attendance</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('examinations')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'examinations'
              ? 'text-school-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap
            className={`w-5 h-5 mb-0.5 ${
              activeTab === 'examinations' ? 'text-school-900' : 'text-slate-400'
            }`}
          />
          <span>Exams</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
            isMobileMenuOpen
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5 text-slate-400" />
          <span>More</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 no-print pb-16 md:pb-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>JNSD Education Centre</strong> • Affiliated to CBSE (Code: 09210401802) • Session 2026–27
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Local Relational Engine & Supabase Sync Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

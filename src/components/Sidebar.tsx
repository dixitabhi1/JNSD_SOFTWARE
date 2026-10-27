import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  ScanLine,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Smartphone,
  Lock,
  X,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'admissions'
  | 'attendance'
  | 'examinations'
  | 'fees'
  | 'receipt-ocr'
  | 'udise'
  | 'staff'
  | 'audit'
  | 'updates';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen = false,
  onClose,
}) => {
  const { currentUser, switchUser, isManager, isPrincipal, isTeacher, isRevoked, logout } = useAuth();

  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      id: 'admissions' as ActiveTab,
      label: 'Admissions & Students',
      icon: UserPlus,
      allowed: !isRevoked,
      badge: isTeacher ? 'Assigned' : 'PG-8',
    },
    {
      id: 'attendance' as ActiveTab,
      label: 'Attendance Register',
      icon: CalendarCheck,
      allowed: !isRevoked,
    },
    {
      id: 'examinations' as ActiveTab,
      label: 'Examinations & Marks',
      icon: GraduationCap,
      allowed: !isRevoked,
    },
    {
      id: 'fees' as ActiveTab,
      label: 'Fees & Accounts',
      icon: CreditCard,
      allowed: isManager || isPrincipal,
      badge: isPrincipal ? 'Approval Mode' : undefined,
    },
    {
      id: 'receipt-ocr' as ActiveTab,
      label: 'Fee Receipt OCR',
      icon: ScanLine,
      allowed: isManager || isPrincipal,
    },
    {
      id: 'udise' as ActiveTab,
      label: 'UDISE+ Portal',
      icon: FileSpreadsheet,
      allowed: (isManager || isPrincipal) && !isRevoked,
    },
    {
      id: 'staff' as ActiveTab,
      label: 'Staff & Access Control',
      icon: Users,
      allowed: (isManager || isPrincipal) && !isRevoked,
    },
    {
      id: 'audit' as ActiveTab,
      label: 'Security & Audit Logs',
      icon: ShieldCheck,
      allowed: (isManager || isPrincipal) && !isRevoked,
    },
    {
      id: 'updates' as ActiveTab,
      label: 'App Updates & APK',
      icon: Smartphone,
      allowed: true,
      badge: 'v1.2.0',
    },
  ];

  const handleItemClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onClose) {
      onClose();
    }
  };

  const navListContent = (
    <div className="space-y-1">
      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        School Management
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (!item.allowed) {
          if (item.id === 'fees' || item.id === 'receipt-ocr') {
            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 cursor-not-allowed select-none bg-slate-50/50"
                title="Strictly prohibited for current role"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              </div>
            );
          }
          return null;
        }

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              isActive
                ? 'bg-school-900 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-school-200' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                  isActive ? 'bg-school-800 text-school-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar (Visible on md: and above) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="p-4">{navListContent}</div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">RBAC Enforcement Active</div>
            {isManager && <p className="text-amber-800 font-medium">Full Manager access granted.</p>}
            {isPrincipal && <p className="text-indigo-800 font-medium">Principal access (Fees approval mode).</p>}
            {isTeacher && <p className="text-teal-800 font-medium">Teacher access (Assigned classes only).</p>}
            {isRevoked && <p className="text-rose-700 font-bold">Access Revoked. All operations blocked.</p>}
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer Overlay (Visible on < md when isOpen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="relative z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full pt-safe pb-safe">
            {/* Drawer Header */}
            <div className="p-4 bg-school-900 text-white flex items-center justify-between border-b border-school-800 shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                  <img src="./school-logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">JNSD EDUCATION</div>
                  <div className="text-[10px] text-school-300">Navigation Menu</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-school-800 hover:bg-school-700 text-school-200 hover:text-white transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher in Mobile Drawer */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 shrink-0">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Active Role:</span>
                <span className="text-school-900 font-bold">{currentUser?.role}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => switchUser('MANAGER')}
                  className={`py-1.5 px-1 rounded text-center font-medium transition ${
                    currentUser?.role === 'MANAGER' && !isRevoked
                      ? 'bg-amber-600 text-white font-bold shadow'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Manager
                </button>
                <button
                  onClick={() => switchUser('PRINCIPAL')}
                  className={`py-1.5 px-1 rounded text-center font-medium transition ${
                    currentUser?.role === 'PRINCIPAL' && !isRevoked
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Principal
                </button>
                <button
                  onClick={() => switchUser('TEACHER')}
                  className={`py-1.5 px-1 rounded text-center font-medium transition ${
                    currentUser?.role === 'TEACHER' && !isRevoked
                      ? 'bg-teal-600 text-white font-bold shadow'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Teacher
                </button>
              </div>
            </div>

            {/* Scrollable Nav Item List */}
            <div className="p-3 overflow-y-auto flex-1">{navListContent}</div>

            {/* Drawer Bottom Status & Sign Out */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="text-xs min-w-0">
                <div className="font-semibold text-slate-800 truncate">{currentUser?.fullName}</div>
                <div className="text-[10px] text-slate-500">{currentUser?.role}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  if (onClose) onClose();
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-medium transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

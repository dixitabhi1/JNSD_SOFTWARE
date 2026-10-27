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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { isManager, isPrincipal, isTeacher, isRevoked } = useAuth();

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
      allowed: isManager, // STRICTLY MANAGER ONLY!
      restrictedNotice: 'Manager Exclusive',
    },
    {
      id: 'receipt-ocr' as ActiveTab,
      label: 'Fee Receipt OCR',
      icon: ScanLine,
      allowed: isManager, // STRICTLY MANAGER ONLY!
      restrictedNotice: 'Manager Exclusive',
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
      badge: 'v1.0.0',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          School Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // If not allowed to current role, show as disabled / lock if it's fees, or omit
          if (!item.allowed) {
            // For Principal or Teacher, display locked Fees indication showing strict RBAC
            if (item.id === 'fees' || item.id === 'receipt-ocr') {
              return (
                <div
                  key={item.id}
                  className="group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 cursor-not-allowed select-none bg-slate-50/50"
                  title="Strictly prohibited for Principal and Teachers"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-300" />
                    <span>{item.label}</span>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                </div>
              );
            }
            return null;
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-school-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-school-200' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
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

      {/* Role Notice Card in Sidebar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-500 space-y-1">
          <div className="font-medium text-slate-700">RBAC Enforcement Active</div>
          {isManager && <p className="text-amber-800 font-medium">Full Manager access granted.</p>}
          {isPrincipal && <p className="text-indigo-800 font-medium">Principal access (Fees strictly isolated).</p>}
          {isTeacher && <p className="text-teal-800 font-medium">Teacher access (Assigned classes only).</p>}
          {isRevoked && <p className="text-rose-700 font-bold">Access Revoked. All operations blocked.</p>}
        </div>
      </div>
    </aside>
  );
};

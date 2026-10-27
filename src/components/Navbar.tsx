import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCheck, AlertTriangle, LogOut, Smartphone, RefreshCw, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenUpdates: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpdates,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const { currentUser, switchUser, isRevoked, logout } = useAuth();

  return (
    <header className="bg-school-900 text-white shadow-md border-b border-school-800 sticky top-0 z-30 pt-safe transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Mobile Drawer Hamburger Button + Brand & Crest */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-school-200 hover:text-white hover:bg-school-800 focus:outline-none focus:ring-2 focus:ring-amber-400 shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white p-1 shadow-md border border-amber-400/50 flex items-center justify-center shrink-0 ring-1 ring-black/10 overflow-hidden">
            <img src="./school-logo.png" alt="JNSD School Logo" className="w-full h-full object-contain" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white truncate leading-tight">
                JNSD EDUCATION CENTRE
              </span>
              <span className="hidden sm:inline-block text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium border border-amber-500/30 shrink-0">
                Session 2026–27
              </span>
            </div>
            <p className="text-[11px] text-school-300 hidden sm:block truncate">
              Pre-Primary (PG) through Class 8 • Affiliation: CBSE-AFF-JNSD-0921
            </p>
          </div>
        </div>

        {/* Right Section: Role Simulator (desktop), Updates Pill, Profile & Logout */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* Quick Role Switcher for Desktop Audits */}
          <div className="hidden md:flex items-center space-x-1 bg-school-950 p-1 rounded-lg border border-school-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center space-x-1">
              <RefreshCw className="w-3 h-3" />
              <span>Role:</span>
            </span>
            <button
              onClick={() => switchUser('MANAGER')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser?.role === 'MANAGER' && !isRevoked
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-school-800'
              }`}
            >
              Manager Sir
            </button>
            <button
              onClick={() => switchUser('PRINCIPAL')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser?.role === 'PRINCIPAL' && !isRevoked
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-school-800'
              }`}
            >
              Principal
            </button>
            <button
              onClick={() => switchUser('TEACHER')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser?.role === 'TEACHER' && !isRevoked
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-school-800'
              }`}
            >
              Class Teacher
            </button>
            <button
              onClick={() => switchUser('TEACHER', 'staff-5')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                isRevoked
                  ? 'bg-rose-700 text-white shadow'
                  : 'text-rose-300 hover:text-white hover:bg-rose-900/50'
              }`}
              title="Test Revoked Teacher Account"
            >
              Revoked User
            </button>
          </div>

          {/* Updates Pill */}
          <button
            onClick={onOpenUpdates}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-school-800 hover:bg-school-700 border border-school-700 text-xs text-school-100 transition shadow-sm"
            title="App Updates & Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-school-300" />
            <span className="text-[11px] font-semibold">v1.2.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Current User Avatar & Sign Out */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 pl-1.5 sm:pl-2 border-l border-school-800">
            <div
              className="w-8 h-8 rounded-full bg-school-800 border border-school-600 flex items-center justify-center font-bold text-xs text-school-200"
              title={currentUser?.fullName}
            >
              {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-semibold text-white leading-tight flex items-center space-x-1">
                <span>{currentUser?.fullName}</span>
                {currentUser?.role === 'MANAGER' && <Shield className="w-3 h-3 text-amber-400" />}
                {currentUser?.role === 'PRINCIPAL' && <UserCheck className="w-3 h-3 text-indigo-400" />}
              </div>
              <div className="text-school-300 flex items-center space-x-1">
                {isRevoked ? (
                  <span className="text-rose-400 font-bold flex items-center space-x-0.5">
                    <AlertTriangle className="w-3 h-3" />
                    <span>REVOKED</span>
                  </span>
                ) : (
                  <span>{currentUser?.role}</span>
                )}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-school-800 hover:bg-rose-900/80 text-school-300 hover:text-white transition"
              title="Sign Out of Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

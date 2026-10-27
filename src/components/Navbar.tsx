import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCheck, AlertTriangle, LogOut, Smartphone, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface NavbarProps {
  onOpenUpdates: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpdates }) => {
  const { currentUser, switchUser, isRevoked, logout } = useAuth();

  return (
    <header className="bg-school-900 text-white shadow-md border-b border-school-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3">
          <div className="h-11 px-2.5 py-1 rounded-xl bg-white shadow-md border border-amber-400/40 flex items-center justify-center shrink-0 ring-1 ring-black/10 overflow-hidden">
            <img src="/school-logo-exact.png" alt="JNSD School Logo" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wide text-white">JNSD EDUCATION CENTRE</span>
              <span className="hidden sm:inline-block text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium border border-amber-500/30">
                Session 2026–27
              </span>
            </div>
            <p className="text-xs text-school-300 hidden sm:block">Pre-Primary (PG) through Class 8 • Affiliation: CBSE-AFF-JNSD-0921</p>
          </div>
        </div>

        {/* Right Section: Role Simulator & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Role Switcher for Pair-Programming & Audits */}
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
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-school-800 hover:bg-school-700 border border-school-700 text-xs text-school-100 transition shadow-sm"
            title="App Updates & Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-school-300" />
            <span className="hidden sm:inline">v1.0.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Current User Card & Sign Out */}
          <div className="flex items-center space-x-2 pl-2 border-l border-school-800">
            <div className="w-8 h-8 rounded-full bg-school-800 border border-school-600 flex items-center justify-center font-bold text-xs text-school-200">
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
              className="p-1.5 rounded-lg bg-school-800 hover:bg-rose-900/80 text-school-300 hover:text-white transition ml-1"
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

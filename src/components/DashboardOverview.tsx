import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import {
  Users,
  IndianRupee,
  CalendarCheck,
  GraduationCap,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface DashboardProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardOverview: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { currentUser, isManager, isPrincipal, isTeacher } = useAuth();

  const students = db.getStudents(currentUser);
  const totalStudents = students.length;

  let totalCollected = 0;
  let totalOutstanding = 0;
  let defaultersCount = 0;

  if (isManager) {
    try {
      const invoices = db.getFeeInvoices(currentUser);
      totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
      totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
      defaultersCount = invoices.filter((inv) => inv.balanceAmount > 0).length;
    } catch {
      // Ignored if unauthorized
    }
  }

  const staffList = (isManager || isPrincipal) ? db.getStaff(currentUser) : [];
  const activeStaff = staffList.filter((s) => s.status === 'ACTIVE').length;
  const udiseIssues = (isManager || isPrincipal) ? db.validateUdiseData().length : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-school-900 to-school-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-medium">
              Academic Session 2026-27
            </span>
            <span className="text-xs text-school-300">Kanpur, Uttar Pradesh</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">Welcome, {currentUser.fullName}</h1>
          <p className="text-school-200 text-sm mt-0.5">
            {isManager && 'Manager Dashboard — Full administrative, financial & oversight privileges.'}
            {isPrincipal && 'Principal Dashboard — Admissions, teachers & academic supervision.'}
            {isTeacher && 'Teacher Portal — Assigned classes, attendance & examination marks entry.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(isManager || isPrincipal) && (
            <button
              onClick={() => onNavigate('admissions')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg text-sm transition shadow flex items-center space-x-1.5"
            >
              <span>+ New Admission</span>
            </button>
          )}
          {isTeacher && (
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-sm transition shadow flex items-center space-x-1.5"
            >
              <span>Mark Today's Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {isTeacher ? 'My Class Students' : 'Total Students (PG–8)'}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> All sections active
            </p>
          </div>
          <div className="p-3 bg-school-50 text-school-700 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Manager-only Financial Cards */}
        {isManager ? (
          <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Fees Collected</p>
                <h3 className="text-2xl font-bold text-emerald-700 mt-1">₹{totalCollected.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-slate-500 mt-1">Current Term</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Outstanding Dues</p>
                <h3 className="text-2xl font-bold text-rose-700 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</h3>
                <p className="text-xs text-rose-600 font-medium mt-1">{defaultersCount} students pending</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </>
        ) : (
          /* Non-Manager Academic Cards */
          <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Daily Attendance</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">94.8%</h3>
                <p className="text-xs text-emerald-600 mt-1">Above school 75% norm</p>
              </div>
              <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Exams Published</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Term 1</h3>
                <p className="text-xs text-slate-500 mt-1">Report cards ready</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
          </>
        )}

        {/* Staff / UDISE Card */}
        {isManager || isPrincipal ? (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Staff & Teachers</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeStaff}</h3>
              <p className="text-xs text-slate-500 mt-1">1 Revoked account</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">My Assignment</p>
              <h3 className="text-base font-bold text-slate-900 mt-1">Class 5-A</h3>
              <p className="text-xs text-slate-500 mt-1">Maths & Science</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      {/* Module Quick Navigators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Admission Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-school-50 text-school-800 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Directory & Admission</h3>
            <p className="text-sm text-slate-600 mt-1">
              Access digital student profiles for PG to Class 8, parents info, masked Aadhaar compliance, and document scans.
            </p>
          </div>
          <button
            onClick={() => onNavigate('admissions')}
            className="mt-4 inline-flex items-center text-sm font-semibold text-school-700 hover:text-school-900"
          >
            <span>Open Student Records</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Daily Attendance Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Daily Attendance Register</h3>
            <p className="text-sm text-slate-600 mt-1">
              Class-wise daily registers, bulk marking, monthly matrices, and student low-attendance warnings.
            </p>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="mt-4 inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <span>Open Attendance Register</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Third Card depends on role */}
        {isManager ? (
          <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Fees & Accounts</h3>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">MANAGER ONLY</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Collect fees, print receipts, manage defaulters list, and scan receipts with automated OCR reconciliation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="mt-4 inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900"
            >
              <span>Manage Fee Accounts</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Examinations & Marks</h3>
              <p className="text-sm text-slate-600 mt-1">
                Enter marks by subject, auto-calculate CBSE grades, and generate official printable student report cards.
              </p>
            </div>
            <button
              onClick={() => onNavigate('examinations')}
              className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              <span>Open Marks Entry</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* UDISE+ Compliance Notice */}
      {(isManager || isPrincipal) && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">UDISE+ Reporting Health (Ministry of Education)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {udiseIssues === 0
                  ? 'All student profiles are verified and compliant with UDISE+ 2026-27 schema.'
                  : `${udiseIssues} validation warning(s) detected (Missing PEN/Aadhaar/Guardian contact).`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('udise')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Review UDISE+ Data
          </button>
        </div>
      )}
    </div>
  );
};

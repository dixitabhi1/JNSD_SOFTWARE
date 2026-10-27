import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { UdiseValidationIssue, UdiseSnapshot } from '../types';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  Building2,
  Users,
  ShieldCheck,
  FileJson,
} from 'lucide-react';

export const UdiseModule: React.FC = () => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<UdiseValidationIssue[]>(() => db.validateUdiseData());
  const [snapshot, setSnapshot] = useState<UdiseSnapshot>(() => db.generateUdiseSnapshot(currentUser));
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleRunValidation = () => {
    const freshIssues = db.validateUdiseData();
    setIssues(freshIssues);
    const newSnapshot = db.generateUdiseSnapshot(currentUser);
    setSnapshot(newSnapshot);
  };

  const handleExportJson = () => {
    const students = db.getStudents(currentUser);
    const exportData = {
      udiseVersion: '2026-27-v1.4',
      schoolCode: '09210401802',
      schoolName: 'JNSD Education Centre',
      affiliationNo: 'CBSE-AFF-JNSD-0921',
      district: 'Kanpur Nagar',
      state: 'Uttar Pradesh',
      summary: snapshot,
      records: students.map((s) => ({
        penNumber: s.penNumber || 'PENDING',
        admissionNo: s.admissionNo,
        fullName: s.fullName,
        dob: s.dob,
        gender: s.gender,
        socialCategory: s.casteCategory,
        religion: s.religion,
        isCwsn: s.isCwsn,
        currentClass: s.currentClass,
        currentSection: s.currentSection,
        guardianName: s.guardians[0]?.fullName,
        guardianPhone: s.guardians[0]?.phone,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDISE_JNSD_2026_27_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const students = db.getStudents(currentUser);
    const headers = ['PEN Number', 'Admission No', 'Student Name', 'DOB', 'Gender', 'Class', 'Section', 'Category', 'CWSN', 'Father Phone'];
    const rows = students.map((s) => [
      s.penNumber || '',
      s.admissionNo,
      `"${s.fullName}"`,
      s.dob,
      s.gender,
      `"${s.currentClass}"`,
      s.currentSection,
      s.casteCategory,
      s.isCwsn ? 'YES' : 'NO',
      s.guardians[0]?.phone || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UDISE_STUDENT_REGISTER_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredIssues = issues.filter((iss) => filterCategory === 'ALL' || iss.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">UDISE+ Data Preparation & Export</h2>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded uppercase">
              Ministry of Education
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Validated school reporting data aligned with official UDISE+ 2026-27 schema.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunValidation}
            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-school-600" />
            <span>Re-verify Data</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-school-50 text-school-900 border border-school-200 text-xs font-semibold rounded-lg hover:bg-school-100 flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-4 py-2 bg-school-900 hover:bg-school-800 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1.5"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>Export UDISE+ JSON</span>
          </button>
        </div>
      </div>

      {/* School Information Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-500 font-semibold block">School Name</span>
          <p className="font-bold text-slate-900 text-sm mt-0.5">JNSD Education Centre</p>
          <span className="text-[11px] text-slate-500">Kanpur Nagar, UP</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold block">UDISE Code</span>
          <p className="font-bold text-school-900 text-sm mt-0.5 font-mono">09210401802</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active & Registered</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold block">CBSE Affiliation No.</span>
          <p className="font-bold text-slate-900 text-sm mt-0.5 font-mono">CBSE-AFF-JNSD-0921</p>
          <span className="text-[11px] text-slate-500">Pre-Primary to Class 8</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold block">Reporting Academic Year</span>
          <p className="font-bold text-slate-900 text-sm mt-0.5">2026–2027</p>
          <span className="text-[11px] text-slate-500">Snapshot Status: Validated</span>
        </div>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Enrolled</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{snapshot.totalEnrolled}</p>
          <span className="text-[11px] text-slate-400">PG through Class 8</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-blue-600 font-medium">Boys Count</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{snapshot.boysCount}</p>
          <span className="text-[11px] text-slate-400">Regular enrollments</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-indigo-600 font-medium">Girls Count</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{snapshot.girlsCount}</p>
          <span className="text-[11px] text-slate-400">Regular enrollments</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-amber-600 font-medium">CWSN (Special Needs)</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{snapshot.cwsnCount}</p>
          <span className="text-[11px] text-slate-400">Inclusive education</span>
        </div>
      </div>

      {/* Social Category Breakdown */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Social Category Distribution</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500">General</span>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{snapshot.categoryBreakdown.general}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500">OBC</span>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{snapshot.categoryBreakdown.obc}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500">SC</span>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{snapshot.categoryBreakdown.sc}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500">ST</span>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{snapshot.categoryBreakdown.st}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500">EWS</span>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{snapshot.categoryBreakdown.ews}</p>
          </div>
        </div>
      </div>

      {/* Validation Issues Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-sm text-slate-900">Official Data Validation Report</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded font-bold ${
                issues.length === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {issues.length} {issues.length === 1 ? 'Warning' : 'Warnings'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Category Filter:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-school-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Identification">Identification (PEN / Aadhaar)</option>
              <option value="Demographic">Demographic (Category / Age)</option>
              <option value="Enrollment">Enrollment / Guardian</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Admission No.</th>
                <th className="px-4 py-3">Reporting Field</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Issue Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-6 h-6 inline mr-1 text-emerald-600" />
                    All records conform to UDISE+ validation rules! No missing or invalid mandatory fields.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          iss.severity === 'ERROR' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {iss.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{iss.studentName || '-'}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{iss.admissionNo || '-'}</td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-800">{iss.field}</td>
                    <td className="px-4 py-3 text-slate-600">{iss.category}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{iss.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

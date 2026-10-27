import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { AuditLog } from '../types';
import { ShieldCheck, Search, Filter, History, Lock } from 'lucide-react';

export const AuditLogsModule: React.FC = () => {
  const { currentUser, isManager, isPrincipal } = useAuth();

  if (!isManager && !isPrincipal) {
    return (
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-rose-900">403 — Unauthorized</h3>
        <p className="text-sm text-rose-800 mt-2">Only School Administration can view security audit logs.</p>
      </div>
    );
  }

  const [logs] = useState<AuditLog[]>(() => db.getAuditLogs(currentUser));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesModule = filterModule === 'ALL' || l.module === filterModule;
    const matchesSearch =
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Security & Operational Audit Logs</h2>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded uppercase">
              Immutable Records
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Chronological audit trail of all admissions, fee payments, marks updates, and staff access revocations.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Module:</span>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-school-500"
          >
            <option value="ALL">All Modules</option>
            <option value="ADMISSIONS">Admissions</option>
            <option value="FEES">Fees & Payments</option>
            <option value="ATTENDANCE">Attendance</option>
            <option value="ACADEMICS">Academics</option>
            <option value="STAFF">Staff & Access</option>
            <option value="UDISE">UDISE+</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC/IST)</th>
                <th className="px-4 py-3">Actor / Role</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Audit Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{log.actorName}</div>
                    <span className="text-[10px] text-school-600 font-medium">{log.actorRole}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[10px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-school-900">{log.action}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

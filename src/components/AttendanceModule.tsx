import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, ALL_CLASSES } from '../services/db';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { CalendarCheck, Check, X, Clock, AlertTriangle, Printer, Save, Users } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { currentUser, isTeacher } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>(isTeacher ? 'Class 5' : 'Class 5');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAttendance();
  }, [selectedClass, selectedSection, selectedDate]);

  const loadAttendance = () => {
    try {
      setErrorMsg(null);
      const records = db.getAttendance(currentUser, selectedClass, selectedSection, selectedDate);
      setAttendanceRecords(records);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load attendance');
      setAttendanceRecords([]);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
    setSaveSuccess(false);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status })));
    setSaveSuccess(false);
  };

  const handleSaveAttendance = () => {
    try {
      db.saveAttendance(currentUser, attendanceRecords);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save attendance');
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter((r) => r.status === 'ABSENT').length;
  const lateCount = attendanceRecords.filter((r) => r.status === 'LATE').length;
  const totalCount = attendanceRecords.length;
  const presentPct = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Class Attendance Register</h2>
          <p className="text-xs text-slate-500">
            Daily student presence tracking with duplicate check and low attendance alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={attendanceRecords.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-0.5 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-school-500"
            >
              {ALL_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="mt-0.5 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-school-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-0.5 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-school-500 font-medium"
            />
          </div>
        </div>

        {/* Quick Bulk Marking Actions */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Quick Mark:</span>
          <button
            onClick={() => handleMarkAll('PRESENT')}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded"
          >
            All Present
          </button>
          <button
            onClick={() => handleMarkAll('ABSENT')}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Students</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-emerald-600 font-medium">Present Today</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">{presentCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-rose-600 font-medium">Absent</span>
          <p className="text-xl font-bold text-rose-700 mt-0.5">{absentCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-school-700 font-medium">Attendance Rate</span>
          <p className="text-xl font-bold text-school-900 mt-0.5">{presentPct}%</p>
        </div>
      </div>

      {/* Error or Success alerts */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Attendance records successfully saved and logged to audit trail!</span>
        </div>
      )}

      {/* Attendance Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Roll #</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Admission No.</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Quick Toggle</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No students found in {selectedClass}-{selectedSection}.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-700">{r.rollNo || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{r.studentName}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{r.admissionNo}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'ABSENT'
                            ? 'bg-rose-100 text-rose-800'
                            : r.status === 'LATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleStatusChange(r.studentId, 'PRESENT')}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.studentId, 'ABSENT')}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === 'ABSENT'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.studentId, 'LATE')}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === 'LATE'
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          L
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="e.g. Medical leave, fever"
                        value={r.remarks || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAttendanceRecords((prev) =>
                            prev.map((rec) => (rec.studentId === r.studentId ? { ...rec, remarks: val } : rec))
                          );
                        }}
                        className="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-school-500"
                      />
                    </td>
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

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, ALL_CLASSES } from '../services/db';
import { StaffMember } from '../types';
import {
  Users,
  UserPlus,
  ShieldAlert,
  UserX,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  KeyRound,
  PauseCircle,
  X,
  Check,
} from 'lucide-react';

export const StaffModule: React.FC = () => {
  const { currentUser, isManager, isPrincipal } = useAuth();
  const [staffList, setStaffList] = useState<StaffMember[]>(() => db.getStaff(currentUser));

  // Provision Teacher Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherQualification, setTeacherQualification] = useState('');
  const [assignedClass, setAssignedClass] = useState('Class 3');
  const [assignedSection, setAssignedSection] = useState('A');
  const [assignedSubject, setAssignedSubject] = useState('English');
  const [isClassTeacher, setIsClassTeacher] = useState(true);

  // Revoke Modal
  const [revokeStaffTarget, setRevokeStaffTarget] = useState<StaffMember | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Notifications
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const refreshList = () => {
    setStaffList(db.getStaff(currentUser));
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !teacherEmail || !teacherPhone) {
      alert('Please fill all mandatory teacher details.');
      return;
    }

    try {
      const created = db.createTeacher(currentUser, {
        fullName: teacherName,
        email: teacherEmail,
        phone: teacherPhone,
        qualification: teacherQualification || 'B.Ed.',
        assignedClasses: [`${assignedClass}-${assignedSection}`],
        assignedSubjects: [assignedSubject],
        isClassTeacher,
      });

      refreshList();
      setIsCreateModalOpen(false);
      setTeacherName('');
      setTeacherEmail('');
      setTeacherPhone('');
      setBannerNotice(`Successfully provisioned teacher account for ${created.fullName} (${created.employeeId})!`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to create teacher account.');
    }
  };

  const handleConfirmRevoke = () => {
    if (!revokeStaffTarget || !revokeReason.trim()) {
      alert('Please provide a mandatory revocation reason.');
      return;
    }

    try {
      db.revokeStaffAccess(currentUser, revokeStaffTarget.id, revokeReason);
      refreshList();
      setRevokeStaffTarget(null);
      setRevokeReason('');
      setBannerNotice(`Access REVOKED for ${revokeStaffTarget.fullName}. Account is locked.`);
      setTimeout(() => setBannerNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Revocation failed.');
    }
  };

  const handleSuspendStaff = (staffId: string) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;
    try {
      db.suspendStaffAccess(currentUser, staffId, reason);
      refreshList();
      setBannerNotice('Staff account has been suspended.');
      setTimeout(() => setBannerNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Suspension failed.');
    }
  };

  const handleRestoreStaff = (staffId: string) => {
    try {
      db.restoreStaffAccess(currentUser, staffId);
      refreshList();
      setBannerNotice('Staff account restored to ACTIVE status.');
      setTimeout(() => setBannerNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Restore failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Staff Accounts & Access Management</h2>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 px-2 py-0.5 rounded uppercase">
              Principal & Manager
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Create teacher accounts, assign classes & subjects, manage credentials, and execute immediate access revocations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-school-900 hover:bg-school-800 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>+ Provision Class Teacher</span>
        </button>
      </div>

      {/* Banner Notice */}
      {bannerNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Staff Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Role / Designation</th>
                <th className="px-4 py-3">Assigned Classes</th>
                <th className="px-4 py-3">Subjects</th>
                <th className="px-4 py-3">Contact Email</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-mono font-bold text-school-900">{st.employeeId}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{st.fullName}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{st.designation}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                      {st.assignedClasses.join(', ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{st.assignedSubjects.join(', ')}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{st.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                        st.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.status === 'SUSPENDED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {st.role !== 'MANAGER' && st.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleSuspendStaff(st.id)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-semibold text-[11px] transition flex items-center space-x-1"
                            title="Suspend Account Temporarily"
                          >
                            <PauseCircle className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                          <button
                            onClick={() => setRevokeStaffTarget(st)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded font-semibold text-[11px] transition flex items-center space-x-1"
                            title="Mandatory Revoke Access"
                          >
                            <UserX className="w-3 h-3 text-rose-600" />
                            <span>Revoke Access</span>
                          </button>
                        </>
                      )}

                      {st.status === 'REVOKED' && isManager && (
                        <button
                          onClick={() => handleRestoreStaff(st.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px] transition flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-600" />
                          <span>Restore Access</span>
                        </button>
                      )}

                      {st.role === 'MANAGER' && (
                        <span className="text-[10px] text-slate-400 italic">Protected Root</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Teacher Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Provision New Class Teacher Account</h3>
                <p className="text-xs text-school-300">Generates unique teacher ID and assigns classes</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="e.g. Meera Joshi"
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="mjoshi@jnsd.edu"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    placeholder="+91 98390 00000"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Educational Qualification</label>
                <input
                  type="text"
                  value={teacherQualification}
                  onChange={(e) => setTeacherQualification(e.target.value)}
                  placeholder="e.g. M.A. English, B.Ed."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Assigned Class *</label>
                  <select
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Section *</label>
                  <select
                    value={assignedSection}
                    onChange={(e) => setAssignedSection(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Primary Subject *</label>
                  <input
                    type="text"
                    required
                    value={assignedSubject}
                    onChange={(e) => setAssignedSubject(e.target.value)}
                    placeholder="e.g. Science"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="classTch"
                  checked={isClassTeacher}
                  onChange={(e) => setIsClassTeacher(e.target.checked)}
                  className="rounded text-school-700"
                />
                <label htmlFor="classTch" className="text-slate-700 font-semibold cursor-pointer">
                  Designate as Class Incharge / Class Teacher
                </label>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                <strong>Security Policy:</strong> A temporary password will be established. The teacher will be prompted to change their password upon their first login.
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-school-900 hover:bg-school-800 text-white rounded-lg font-bold shadow flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Revoke Access Confirmation Modal */}
      {revokeStaffTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-rose-300 overflow-hidden">
            <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-300" />
                <h3 className="font-bold text-base">Mandatory Access Revocation</h3>
              </div>
              <button onClick={() => setRevokeStaffTarget(null)} className="text-rose-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1">
                <p className="font-bold">Are you certain you want to revoke access?</p>
                <p>
                  Target Account: <strong>{revokeStaffTarget.fullName}</strong> ({revokeStaffTarget.employeeId})
                </p>
                <p className="text-[11px] text-rose-700">
                  On confirmation, active sessions will be terminated immediately. The user will be blocked from logging in on both Web and Android APK.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-800">Reason for Revocation * (Mandatory for Audit Trail)</label>
                <textarea
                  required
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="Specify official reason (e.g. Resignation, disciplinary action, contract end)..."
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setRevokeStaffTarget(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRevoke}
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold shadow flex items-center space-x-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Confirm Revocation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


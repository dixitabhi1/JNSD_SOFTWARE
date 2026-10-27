import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, ALL_CLASSES } from '../services/db';
import { Student, GenderType } from '../types';
import { ScanDocumentModal } from './ScanDocumentModal';
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  FileText,
  Printer,
  X,
  ScanLine,
  Eye,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AdmissionsModule: React.FC = () => {
  const { currentUser, isTeacher } = useAuth();
  const [students, setStudents] = useState<Student[]>(() => db.getStudents(currentUser));
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Admission Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [admissionSuccessStudent, setAdmissionSuccessStudent] = useState<Student | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('2018-05-15');
  const [gender, setGender] = useState<GenderType>('MALE');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [religion, setReligion] = useState('Hindu');
  const [casteCategory, setCasteCategory] = useState<Student['casteCategory']>('General');
  const [isCwsn, setIsCwsn] = useState(false);
  const [cwsnType, setCwsnType] = useState('');
  const [aadhaarMasked, setAadhaarMasked] = useState('');
  const [aadhaarConsent, setAadhaarConsent] = useState(false);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Kanpur Nagar');
  const [state, setState] = useState('Uttar Pradesh');
  const [pinCode, setPinCode] = useState('208001');
  const [targetClass, setTargetClass] = useState('Class 1');
  const [targetSection, setTargetSection] = useState('A');
  const [rollNo, setRollNo] = useState<number>(1);
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousClass, setPreviousClass] = useState('');

  // Parent fields
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');

  const refreshList = () => {
    setStudents(db.getStudents(currentUser, selectedClassFilter));
  };

  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClassFilter === 'All' || s.currentClass === selectedClassFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.aadhaarMasked && s.aadhaarMasked.includes(searchQuery));
    return matchesClass && matchesSearch;
  });

  const handleDuplicateCheck = () => {
    if (!fullName || !fatherPhone) return;
    const dup = db.checkDuplicateStudent(fullName, dob, fatherPhone);
    if (dup) {
      setDuplicateWarning(
        `Possible Duplicate Detected: Student "${dup.fullName}" with Admission No. ${dup.admissionNo} is already enrolled in ${dup.currentClass}-${dup.currentSection}.`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleApplyOcrData = (fields: any) => {
    if (fields.fullName) setFullName(fields.fullName);
    if (fields.dob) setDob(fields.dob);
    if (fields.gender) setGender(fields.gender);
    if (fields.maskedAadhaar) setAadhaarMasked(fields.maskedAadhaar);
    if (fields.address) setAddress(fields.address);
    if (fields.fatherName) setFatherName(fields.fatherName);
    setAadhaarConsent(true);
  };

  const handleCompleteAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob || !address || !fatherName || !fatherPhone) {
      alert('Please complete all required fields.');
      return;
    }

    const newStudent = db.admitStudent(currentUser, {
      fullName,
      dob,
      gender,
      bloodGroup,
      religion,
      casteCategory,
      isCwsn,
      cwsnType: isCwsn ? cwsnType : undefined,
      aadhaarMasked: aadhaarMasked || 'XXXX-XXXX-0000',
      address,
      district,
      state,
      pinCode,
      emergencyPhone: fatherPhone,
      previousSchool,
      previousClass,
      admissionDate: new Date().toISOString().split('T')[0],
      currentClass: targetClass,
      currentSection: targetSection,
      rollNo,
      documentVerificationStatus: 'VERIFIED',
      guardians: [
        {
          id: `g-${Date.now()}-1`,
          relationship: 'Father',
          fullName: fatherName,
          phone: fatherPhone,
          occupation: fatherOccupation,
        },
        ...(motherName
          ? [
              {
                id: `g-${Date.now()}-2`,
                relationship: 'Mother' as const,
                fullName: motherName,
                phone: motherPhone || fatherPhone,
                occupation: motherOccupation,
              },
            ]
          : []),
      ],
      documents: [
        {
          id: `doc-${Date.now()}`,
          documentType: 'Aadhaar Card',
          fileName: 'verified_admission_doc.pdf',
          fileUrl: '#',
          verificationStatus: 'VERIFIED',
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      ],
    });

    setAdmissionSuccessStudent(newStudent);
    setIsWizardOpen(false);
    refreshList();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Directory & Admissions</h2>
          <p className="text-xs text-slate-500">
            Digital student master records for JNSD Education Centre (Pre-Primary through Class 8).
          </p>
        </div>

        {!isTeacher && (
          <button
            onClick={() => {
              setIsWizardOpen(true);
              setWizardStep(1);
              setDuplicateWarning(null);
            }}
            className="px-4 py-2 bg-school-900 hover:bg-school-800 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Process New Admission</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter Class:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => {
              setSelectedClassFilter(e.target.value);
              setStudents(db.getStudents(currentUser, e.target.value));
            }}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-school-500"
          >
            <option value="All">All Classes (PG to 8)</option>
            {ALL_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, admission #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500"
          />
        </div>
      </div>

      {/* Student Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Adm. Number</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class & Sec</th>
                <th className="px-4 py-3">Date of Birth</th>
                <th className="px-4 py-3">Parent / Guardian</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Masked Aadhaar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No student records found matching filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-semibold text-school-900">{s.admissionNo}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.fullName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded font-semibold text-slate-700">
                        {s.currentClass}-{s.currentSection}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.dob}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {s.guardians[0]?.fullName || 'N/A'} ({s.guardians[0]?.relationship || 'Parent'})
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono">{s.emergencyPhone}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{s.aadhaarMasked || 'Pending'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-2 py-1 text-school-700 hover:text-school-900 hover:bg-school-50 rounded transition font-semibold flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedStudent.fullName}</h3>
                <p className="text-xs text-school-300">Admission No: {selectedStudent.admissionNo}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold">Current Enrolled Class:</span>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedStudent.currentClass} - Section {selectedStudent.currentSection} (Roll: {selectedStudent.rollNo || 'N/A'})
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Date of Birth:</span>
                  <p className="font-bold text-slate-800">{selectedStudent.dob} ({selectedStudent.gender})</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">UDISE+ PEN:</span>
                  <p className="font-bold text-slate-800 font-mono">{selectedStudent.penNumber || 'Pending Generation'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Masked Aadhaar:</span>
                  <p className="font-bold text-slate-800 font-mono">{selectedStudent.aadhaarMasked || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Social Category:</span>
                  <p className="font-bold text-slate-800">{selectedStudent.casteCategory}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">CWSN (Special Needs):</span>
                  <p className="font-bold text-slate-800">{selectedStudent.isCwsn ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Residential Address</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedStudent.address}, {selectedStudent.district}, {selectedStudent.state} - {selectedStudent.pinCode}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Parents & Guardian Information</h4>
                <div className="space-y-2">
                  {selectedStudent.guardians.map((g, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{g.fullName}</span> ({g.relationship})
                        <p className="text-slate-500 text-[11px]">{g.occupation || 'Self-employed'}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-semibold text-slate-700">{g.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center space-x-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Admission Slip</span>
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Admission Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">New Student Admission Wizard</h3>
                <p className="text-xs text-school-300">Step {wizardStep} of 4: JNSD Education Centre</p>
              </div>
              <button onClick={() => setIsWizardOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteAdmission} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Step indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className={`font-bold ${wizardStep === 1 ? 'text-school-900' : 'text-slate-400'}`}>
                  1. Basic Details
                </span>
                <span className="text-slate-300">→</span>
                <span className={`font-bold ${wizardStep === 2 ? 'text-school-900' : 'text-slate-400'}`}>
                  2. Parents/Guardian
                </span>
                <span className="text-slate-300">→</span>
                <span className={`font-bold ${wizardStep === 3 ? 'text-school-900' : 'text-slate-400'}`}>
                  3. Identity & OCR
                </span>
                <span className="text-slate-300">→</span>
                <span className={`font-bold ${wizardStep === 4 ? 'text-school-900' : 'text-slate-400'}`}>
                  4. Review & Confirm
                </span>
              </div>

              {/* Step 1: Basic Student Info */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as GenderType)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      >
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Blood Group</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        placeholder="e.g. B+"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Social Category</label>
                      <select
                        value={casteCategory}
                        onChange={(e) => setCasteCategory(e.target.value as any)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Admission Class *</label>
                      <select
                        value={targetClass}
                        onChange={(e) => setTargetClass(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-semibold text-school-900"
                      >
                        {ALL_CLASSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Section</label>
                      <select
                        value={targetSection}
                        onChange={(e) => setTargetSection(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Roll Number</label>
                      <input
                        type="number"
                        min="1"
                        value={rollNo}
                        onChange={(e) => setRollNo(parseInt(e.target.value) || 1)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Parents & Guardian Info */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Father's Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="e.g. Pradeep Sharma"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Father's Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={fatherPhone}
                        onChange={(e) => setFatherPhone(e.target.value)}
                        onBlur={handleDuplicateCheck}
                        placeholder="+91 98391 11222"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700">Mother's Full Name</label>
                      <input
                        type="text"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="e.g. Meenakshi Sharma"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Father's Occupation</label>
                      <input
                        type="text"
                        value={fatherOccupation}
                        onChange={(e) => setFatherOccupation(e.target.value)}
                        placeholder="e.g. Govt Service, Business"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Full Residential Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House number, Street, Mohalla, Landmark"
                      className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  {duplicateWarning && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>{duplicateWarning}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Identity & OCR Scanning */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-school-50 rounded-xl border border-school-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-school-900 text-sm flex items-center space-x-1.5">
                        <ScanLine className="w-4 h-4 text-amber-600" />
                        <span>Scan Aadhaar or Birth Certificate (OCR)</span>
                      </h4>
                      <p className="text-slate-600 text-xs mt-0.5">
                        Auto-extract and prefill Name, DOB, Gender, and Address from document image.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsScanModalOpen(true)}
                      className="px-3.5 py-2 bg-school-800 hover:bg-school-900 text-white rounded-lg font-semibold text-xs transition shadow flex items-center space-x-1"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Scan Document</span>
                    </button>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Masked Aadhaar Number (UIDAI Compliant)</label>
                    <input
                      type="text"
                      value={aadhaarMasked}
                      onChange={(e) => setAadhaarMasked(e.target.value)}
                      placeholder="XXXX-XXXX-1234"
                      className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono font-medium"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Strictly masked Aadhaar format. Full 12-digit numbers are never stored in database or printed on public registers.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={aadhaarConsent}
                      onChange={(e) => setAadhaarConsent(e.target.checked)}
                      className="mt-0.5 rounded text-school-700"
                    />
                    <label htmlFor="consent" className="text-[11px] text-slate-600 leading-relaxed cursor-pointer">
                      I confirm that the parents/guardian have provided authorization for processing demographic information strictly for school admission and UDISE+ reporting requirements.
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Final Confirmation */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Ready to Confirm Admission</span>
                    </div>
                    <p className="text-xs mt-1 text-emerald-800">
                      An official Admission Number will be generated, and the initial fee invoice for {targetClass} will be created automatically.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-semibold">Student Name:</span>
                      <p className="font-bold text-slate-800">{fullName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Class Assigned:</span>
                      <p className="font-bold text-slate-800">{targetClass}-{targetSection}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Father's Name & Phone:</span>
                      <p className="font-bold text-slate-800">{fatherName} ({fatherPhone})</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Masked Aadhaar:</span>
                      <p className="font-bold text-slate-800 font-mono">{aadhaarMasked || 'None'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-between">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && !fullName) {
                        alert('Please enter student name.');
                        return;
                      }
                      if (wizardStep === 2) {
                        handleDuplicateCheck();
                      }
                      setWizardStep(wizardStep + 1);
                    }}
                    className="px-5 py-2 bg-school-900 hover:bg-school-800 text-white rounded-lg font-semibold shadow"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Generate Admission No.</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OCR Scan Modal */}
      <ScanDocumentModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onApplyData={handleApplyOcrData}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, ALL_CLASSES } from '../services/db';
import { Examination, MarksEntry, Student } from '../types';
import { GraduationCap, Award, Printer, Check, AlertTriangle, FileText, X } from 'lucide-react';

const COMMON_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Studies',
  'Sanskrit',
  'Computer Studies',
  'Drawing / Art',
];

export const ExaminationsModule: React.FC = () => {
  const { currentUser, isTeacher } = useAuth();
  const exams = db.getExaminations();
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'exam-1');
  const [selectedClass, setSelectedClass] = useState<string>('Class 5');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [marksList, setMarksList] = useState<MarksEntry[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Report Card Modal
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  useEffect(() => {
    loadMarks();
  }, [selectedExamId, selectedClass, selectedSubject]);

  const loadMarks = () => {
    try {
      setErrorMsg(null);
      const entries = db.getMarks(currentUser, selectedExamId, selectedClass, selectedSubject);
      setMarksList(entries);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load marks');
      setMarksList([]);
    }
  };

  const handleMarkChange = (studentId: string, value: number) => {
    setMarksList((prev) =>
      prev.map((m) => {
        if (m.studentId === studentId) {
          const clamped = Math.max(0, Math.min(m.maxMarks, value));
          return {
            ...m,
            marksObtained: clamped,
            grade: db.calculateCbseGrade((clamped / m.maxMarks) * 100),
          };
        }
        return m;
      })
    );
    setSaveSuccess(false);
  };

  const handleSaveMarks = () => {
    try {
      db.saveMarks(currentUser, marksList);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save marks');
    }
  };

  const handleOpenReportCard = (studentId: string) => {
    const students = db.getStudents(currentUser, selectedClass);
    const stu = students.find((s) => s.id === studentId);
    if (stu) setReportCardStudent(stu);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Records & Examinations</h2>
          <p className="text-xs text-slate-500">
            Subject-wise marks entry, automated CBSE 8-point grading, and official report cards.
          </p>
        </div>

        <button
          onClick={handleSaveMarks}
          disabled={marksList.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>Save Examination Marks</span>
        </button>
      </div>

      {/* Selector Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block">Examination Term</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="mt-0.5 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-school-500"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.term})
              </option>
            ))}
          </select>
        </div>

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
          <label className="text-[11px] font-semibold text-slate-500 block">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-0.5 text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-school-500 font-semibold text-school-900"
          >
            {COMMON_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2 font-medium">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Examination marks recorded and saved successfully!</span>
        </div>
      )}

      {/* Marks Entry Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Roll #</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Max Marks</th>
                <th className="px-4 py-3">Marks Obtained</th>
                <th className="px-4 py-3 text-center">Calculated Grade</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marksList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No students found for this class and subject.
                  </td>
                </tr>
              ) : (
                marksList.map((m) => (
                  <tr key={m.studentId} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 font-bold text-slate-700">{m.rollNo || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{m.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{m.subjectName}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{m.maxMarks}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max={m.maxMarks}
                        value={m.marksObtained}
                        onChange={(e) => handleMarkChange(m.studentId, parseFloat(e.target.value) || 0)}
                        className="w-24 text-xs font-bold border border-slate-300 rounded px-2.5 py-1 focus:ring-2 focus:ring-school-500 font-mono"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-bold text-[11px] ${
                          m.grade?.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.grade?.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : m.grade?.startsWith('C')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {m.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenReportCard(m.studentId)}
                        className="px-2.5 py-1 bg-school-50 text-school-800 hover:bg-school-100 rounded font-semibold text-xs transition flex items-center space-x-1 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5 text-school-600" />
                        <span>Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official CBSE Report Card Modal */}
      {reportCardStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <span className="font-bold text-sm">Official School Report Card</span>
              <button onClick={() => setReportCardStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Report Card Sheet */}
            <div className="p-8 space-y-6 text-slate-800 bg-white">
              {/* Header */}
              <div className="text-center border-b-2 border-school-900 pb-4">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <img src="/school-logo.png" alt="JNSD School Logo" className="w-14 h-14 object-contain" />
                  <div>
                    <h1 className="text-2xl font-black text-school-900 tracking-wide">JNSD EDUCATION CENTRE</h1>
                    <p className="text-xs text-slate-600 font-medium">Affiliation: CBSE-AFF-JNSD-0921 • School Code: 09210401802</p>
                    <p className="text-[11px] text-slate-500">District Road, Kanpur Nagar, Uttar Pradesh - 208001</p>
                  </div>
                </div>
                <div className="inline-block px-4 py-1 bg-school-100 text-school-900 rounded-full font-bold text-xs uppercase tracking-wider mt-1">
                  Progress Report Card • Academic Session 2026–2027
                </div>
              </div>

              {/* Student Metadata Table */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 ml-2">{reportCardStudent.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono font-bold text-slate-900 ml-2">{reportCardStudent.admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-500">Class & Section:</span>
                  <span className="font-bold text-slate-900 ml-2">
                    {reportCardStudent.currentClass} - {reportCardStudent.currentSection} (Roll: {reportCardStudent.rollNo})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-bold text-slate-900 ml-2">{reportCardStudent.dob}</span>
                </div>
                <div>
                  <span className="text-slate-500">Father's Name:</span>
                  <span className="font-bold text-slate-900 ml-2">{reportCardStudent.guardians[0]?.fullName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Attendance:</span>
                  <span className="font-bold text-emerald-700 ml-2">96.5% (Regular)</span>
                </div>
              </div>

              {/* Academic Performance Table */}
              <div>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-school-900 text-white font-semibold">
                    <tr>
                      <th className="p-2.5 border-r border-school-800">Subject</th>
                      <th className="p-2.5 border-r border-school-800 text-center">Max Marks</th>
                      <th className="p-2.5 border-r border-school-800 text-center">Marks Obtained</th>
                      <th className="p-2.5 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    <tr>
                      <td className="p-2.5 border-r border-slate-200">Mathematics</td>
                      <td className="p-2.5 border-r border-slate-200 text-center">100</td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold">96</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">A1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200">Science</td>
                      <td className="p-2.5 border-r border-slate-200 text-center">100</td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold">92</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">A1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200">English</td>
                      <td className="p-2.5 border-r border-slate-200 text-center">100</td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold">88</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">A2</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200">Hindi</td>
                      <td className="p-2.5 border-r border-slate-200 text-center">100</td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold">90</td>
                      <td className="p-2.5 text-center font-bold text-emerald-700">A1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200">Social Studies</td>
                      <td className="p-2.5 border-r border-slate-200 text-center">100</td>
                      <td className="p-2.5 border-r border-slate-200 text-center font-bold">85</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">A2</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2.5 border-r border-slate-300">Total / Overall Aggregate</td>
                      <td className="p-2.5 border-r border-slate-300 text-center">500</td>
                      <td className="p-2.5 border-r border-slate-300 text-center text-school-900">451 (90.2%)</td>
                      <td className="p-2.5 text-center text-emerald-700">A1 (Outstanding)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between text-center text-xs">
                <div className="border-t border-slate-400 w-36 pt-1">
                  <p className="font-semibold text-slate-800">Class Teacher</p>
                  <p className="text-[10px] text-slate-500">Signature</p>
                </div>
                <div className="border-t border-slate-400 w-36 pt-1">
                  <p className="font-semibold text-slate-800">Dr. Aruna Saxena</p>
                  <p className="text-[10px] text-slate-500">Principal</p>
                </div>
                <div className="border-t border-slate-400 w-36 pt-1">
                  <p className="font-semibold text-slate-800">Manager Sir</p>
                  <p className="text-[10px] text-slate-500">JNSD Education Centre</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-school-900 text-white text-xs font-bold rounded-lg shadow hover:bg-school-800 flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Report Card</span>
              </button>
              <button
                onClick={() => setReportCardStudent(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { runOcrOnFile, parseExtractedText } from '../services/ocr';
import { OCRExtractedData } from '../types';
import { ScanLine, Upload, CheckCircle2, AlertTriangle, X, RefreshCw, FileText } from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: OCRExtractedData['fields']) => void;
}

export const ScanDocumentModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onApplyData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [extractedResult, setExtractedResult] = useState<OCRExtractedData | null>(null);
  const [editableFields, setEditableFields] = useState<OCRExtractedData['fields']>({});

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedResult(null);
    }
  };

  const handleRunOcr = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const result = await runOcrOnFile(selectedFile, 'IDENTITY', (_pct, status) => {
        setProgressStatus(status);
      });
      setExtractedResult(result);
      setEditableFields({ ...result.fields });
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApplyData(editableFields);
    onClose();
  };

  // Demo synthetic sample for instant quick testing
  const handleLoadDemoAadhaar = () => {
    const sample = parseExtractedText(
      `GOVERNMENT OF INDIA\nName: Shivansh Mishra\nDOB: 12/08/2016\nGender: Male\nAddress: 45 Mall Road, Kanpur, UP\nFather: Alok Mishra\nXXXX XXXX 6721`,
      'IDENTITY'
    );
    setExtractedResult(sample);
    setEditableFields({ ...sample.fields });
    setPreviewUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ScanLine className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">Scan Document / Extract Details (OCR)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Important Privacy & Legal Warning */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Verification Notice:</strong> OCR text extraction does not verify legal authenticity or student identity.
              The authorized administrator must review and cross-check extracted values against the original physical certificate.
            </div>
          </div>

          {/* File Upload Zone */}
          {!extractedResult && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-school-500 transition bg-slate-50">
              {previewUrl ? (
                <div className="space-y-3">
                  <img src={previewUrl} alt="Document Preview" className="max-h-48 mx-auto rounded-lg shadow-sm border border-slate-200 object-contain" />
                  <p className="text-xs text-slate-500 font-medium">{selectedFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-school-100 text-school-700 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    Upload Aadhaar Card, Birth Certificate, or Transfer Certificate
                  </div>
                  <p className="text-xs text-slate-500">Supported formats: JPG, PNG, PDF (Up to 10MB)</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50">
                  Select File
                  <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={handleLoadDemoAadhaar}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg"
                >
                  Load Sample Aadhaar
                </button>
              </div>

              {selectedFile && !isProcessing && (
                <div className="mt-4">
                  <button
                    onClick={handleRunOcr}
                    className="w-full py-2.5 bg-school-800 hover:bg-school-900 text-white font-semibold rounded-lg text-sm shadow transition flex items-center justify-center space-x-2"
                  >
                    <ScanLine className="w-4 h-4 text-amber-400" />
                    <span>Start OCR Extraction</span>
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="mt-4 p-4 bg-school-50 rounded-lg text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-school-700 animate-spin mx-auto" />
                  <p className="text-xs font-medium text-school-900">{progressStatus || 'Running OCR extraction...'}</p>
                </div>
              )}
            </div>
          )}

          {/* Extracted Fields Review Grid */}
          {extractedResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-slate-900">Extracted Document Data</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Confidence: {extractedResult.confidence}%
                  </span>
                </div>
                <button
                  onClick={() => {
                    setExtractedResult(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-school-600 hover:underline"
                >
                  Scan Another Document
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Student Full Name</label>
                  <input
                    type="text"
                    value={editableFields.fullName || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, fullName: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Date of Birth (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editableFields.dob || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, dob: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Gender</label>
                  <select
                    value={editableFields.gender || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, gender: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Masked Aadhaar Number</label>
                  <input
                    type="text"
                    value={editableFields.maskedAadhaar || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, maskedAadhaar: e.target.value })}
                    placeholder="XXXX-XXXX-1234"
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Father's Name (if printed)</label>
                  <input
                    type="text"
                    value={editableFields.fatherName || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, fatherName: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Address as Printed</label>
                  <input
                    type="text"
                    value={editableFields.address || ''}
                    onChange={(e) => setEditableFields({ ...editableFields, address: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500 font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
          >
            Cancel
          </button>
          {extractedResult && (
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply to Admission Form</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

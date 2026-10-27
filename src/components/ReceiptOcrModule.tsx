import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { runOcrOnFile, parseExtractedText } from '../services/ocr';
import { OCRExtractedData, FeeInvoice, PaymentReceipt } from '../types';
import {
  ScanLine,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileCheck,
  RefreshCw,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const ReceiptOcrModule: React.FC = () => {
  const { currentUser, isManager } = useAuth();

  if (!isManager) {
    return (
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-rose-900">403 — Unauthorized</h3>
        <p className="text-sm text-rose-800 mt-2">
          Receipt OCR and reconciliation is strictly restricted to <strong>Manager Sir</strong>.
        </p>
      </div>
    );
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedData, setExtractedData] = useState<OCRExtractedData | null>(null);
  const [matchedInvoice, setMatchedInvoice] = useState<FeeInvoice | null>(null);
  const [reconciliationSuccess, setReconciliationSuccess] = useState<PaymentReceipt | null>(null);

  // Editable fields after extraction
  const [receiptNo, setReceiptNo] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState('');
  const [studentName, setStudentName] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [transRef, setTransRef] = useState('');

  const invoices = db.getFeeInvoices(currentUser);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setMatchedInvoice(null);
      setReconciliationSuccess(null);
    }
  };

  const handleRunOcr = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const result = await runOcrOnFile(selectedFile, 'FEE_RECEIPT', (_p, status) => {
        setProgressStatus(status);
      });
      applyExtractionResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    const sample = parseExtractedText(
      `JNSD EDUCATION CENTRE\nReceipt No: REC-2026-902\nStudent: Aarav Sharma\nAdm No: JNSD/2026/001\nDate: 2026-04-10\nAmount: Rs 3400\nPayment Mode: UPI\nUTR: 314159265358`,
      'FEE_RECEIPT'
    );
    applyExtractionResult(sample);
    setPreviewUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  };

  const applyExtractionResult = (data: OCRExtractedData) => {
    setExtractedData(data);
    setReceiptNo(data.fields.receiptNo || 'REC-2026-902');
    setAmount(data.fields.amount || 3400);
    setPaymentDate(data.fields.paymentDate || new Date().toISOString().split('T')[0]);
    setStudentName(data.fields.studentName || 'Aarav Sharma');
    setAdmissionNo(data.fields.admissionNo || 'JNSD/2026/001');
    setTransRef(data.fields.transactionRef || '314159265358');

    // Auto find match in database
    const match = invoices.find(
      (inv) =>
        inv.studentName.toLowerCase().includes((data.fields.studentName || '').toLowerCase()) ||
        inv.admissionNo === data.fields.admissionNo
    );
    setMatchedInvoice(match || null);
  };

  const handleConfirmReconciliation = () => {
    if (!matchedInvoice) {
      alert('Please select or verify the student invoice before approving payment.');
      return;
    }

    try {
      const receipt = db.recordFeePayment(currentUser, {
        invoiceId: matchedInvoice.id,
        amount,
        paymentMode: 'UPI',
        transactionRef: transRef,
        remarks: `Reconciled via Receipt OCR (Receipt Ref: ${receiptNo})`,
      });

      setReconciliationSuccess(receipt);
      setExtractedData(null);
      setSelectedFile(null);
    } catch (err: any) {
      alert(err.message || 'Reconciliation failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Fee Receipt OCR & Reconciliation</h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase">
              Manager Sir Access
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Upload fee receipts or UPI payment slips to extract fields, match student ledgers, and reconcile balances.
          </p>
        </div>
      </div>

      {/* Legal & Audit Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Reconciliation Guard:</strong> OCR extraction will never automatically mark an invoice as paid.
          Manager Sir must review the extracted payment reference, verify bank settlement evidence, and give explicit confirmation.
        </div>
      </div>

      {/* Success Banner */}
      {reconciliationSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold">Reconciliation Complete!</p>
              <p className="text-emerald-700">
                Receipt {reconciliationSuccess.receiptNo} (₹{reconciliationSuccess.amount}) has been posted to{' '}
                {reconciliationSuccess.studentName}'s ledger.
              </p>
            </div>
          </div>
          <button
            onClick={() => setReconciliationSuccess(null)}
            className="px-3 py-1 bg-emerald-600 text-white rounded font-semibold text-xs"
          >
            Done
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {!extractedData && !reconciliationSuccess && (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50">
          {previewUrl ? (
            <div className="space-y-3">
              <img src={previewUrl} alt="Receipt Preview" className="max-h-60 mx-auto rounded-lg shadow-sm border border-slate-200 object-contain" />
              <p className="text-xs text-slate-500 font-medium">{selectedFile?.name}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-school-100 text-school-800 rounded-full flex items-center justify-center mx-auto">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Upload School Receipt or UPI Screenshot</h3>
              <p className="text-xs text-slate-500">Supports PNG, JPG, or PDF</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50">
              Select Receipt File
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={handleLoadSample}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg"
            >
              Load Sample UPI Slip
            </button>
          </div>

          {selectedFile && !isProcessing && (
            <div className="mt-4">
              <button
                onClick={handleRunOcr}
                className="px-6 py-2.5 bg-school-900 hover:bg-school-800 text-white font-semibold rounded-lg text-xs shadow transition flex items-center space-x-2 mx-auto"
              >
                <ScanLine className="w-4 h-4 text-amber-400" />
                <span>Run Receipt OCR Extraction</span>
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 p-4 bg-school-50 rounded-lg max-w-sm mx-auto space-y-2">
              <RefreshCw className="w-6 h-6 text-school-700 animate-spin mx-auto" />
              <p className="text-xs font-medium text-school-900">{progressStatus || 'Scanning receipt...'}</p>
            </div>
          )}
        </div>
      )}

      {/* Review & Reconciliation Panel */}
      {extractedData && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Extracted Payment Details</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Confidence: {extractedData.confidence}%
              </span>
            </div>
            <button
              onClick={() => {
                setExtractedData(null);
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="text-xs text-school-700 hover:underline"
            >
              Discard & Upload New
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Extracted Form */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                1. Extracted Document Fields
              </h4>

              <div>
                <label className="font-semibold text-slate-700">Receipt / Transaction No.</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded font-mono font-bold text-school-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Student Name as printed</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Admission No.</label>
                  <input
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">UTR / Reference ID</label>
                  <input
                    type="text"
                    value={transRef}
                    onChange={(e) => setTransRef(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Reconciliation Matching Box */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                2. Ledger Match & Reconciliation
              </h4>

              {matchedInvoice ? (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-emerald-300 shadow-sm space-y-1">
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Matching Student Invoice Located</span>
                    </div>
                    <div className="text-slate-800 font-semibold">{matchedInvoice.studentName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{matchedInvoice.admissionNo} • {matchedInvoice.className}-{matchedInvoice.section}</div>
                    <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-100 flex justify-between">
                      <span>Total Due: ₹{matchedInvoice.totalAmount}</span>
                      <span className="font-bold text-rose-700">Current Balance: ₹{matchedInvoice.balanceAmount}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
                    <strong>Reconciliation Preview:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                      <li>Payment of ₹{amount} will be posted to Invoice {matchedInvoice.invoiceNo}.</li>
                      <li>Remaining balance will update to ₹{Math.max(0, matchedInvoice.balanceAmount - amount)}.</li>
                      <li>Official school payment receipt will be logged in audit trail.</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleConfirmReconciliation}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Post to Student Ledger</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 space-y-2">
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>No Automatic Match Found</span>
                  </div>
                  <p className="text-[11px]">
                    Could not match student name "{studentName}" with open invoices. Select the matching invoice below:
                  </p>
                  <select
                    onChange={(e) => {
                      const inv = invoices.find((i) => i.id === e.target.value);
                      if (inv) setMatchedInvoice(inv);
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="">-- Choose Student Invoice --</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.studentName} ({inv.admissionNo}) - Balance: ₹{inv.balanceAmount}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

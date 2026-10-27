import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { FeeInvoice, FeeStructure, FeeSubmission, PaymentReceipt } from '../types';
import {
  CreditCard,
  IndianRupee,
  Receipt,
  Printer,
  PlusCircle,
  AlertTriangle,
  Lock,
  Search,
  CheckCircle2,
  X,
  Calculator,
  Clock,
  Check,
  Ban,
  Tag,
  DollarSign,
  HelpCircle,
  ArrowRight,
  Copy,
  Layers,
  Edit2,
} from 'lucide-react';

export const FeesModule: React.FC = () => {
  const { currentUser, isManager, isPrincipal } = useAuth();

  // If neither Manager nor Principal, hard block in UI
  if (!isManager && !isPrincipal) {
    return (
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-rose-900">403 — Unauthorized Access</h3>
        <p className="text-sm text-rose-800 mt-2">
          Fees & Accounts is restricted to <strong>Manager Sir (Lalitesh Kumar Dixit)</strong> and <strong>Principal (Ram Jiyawan Yadav)</strong>.
          Class Teachers and unauthorized staff are not permitted access to fee ledgers or transactions.
        </p>
      </div>
    );
  }

  // Active view tab
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'pending' | 'structures' | 'calculator'>('invoices');

  // Core Data
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => db.getFeeInvoices(currentUser));
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => db.getPaymentReceipts(currentUser));
  const [structures, setStructures] = useState<FeeStructure[]>(() => db.getFeeStructures(currentUser));
  const [submissions, setSubmissions] = useState<FeeSubmission[]>(() => db.getFeeSubmissions(currentUser));

  // Invoices search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Record Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<PaymentReceipt['paymentMode']>('UPI');
  const [transRef, setTransRef] = useState('');
  const [payRemarks, setPayRemarks] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);

  // Add / Edit Fee Structure Modal
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
  const [structClass, setStructClass] = useState('Class 1');
  const [structHead, setStructHead] = useState<FeeStructure['feeHead']>('Tuition Fee');
  const [structAmount, setStructAmount] = useState<number>(1800);
  const [structFrequency, setStructFrequency] = useState<FeeStructure['frequency']>('Monthly');

  // Rejection Reason Modal for Manager
  const [rejectModalSubmissionId, setRejectModalSubmissionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fee Calculator State
  const [calcClass, setCalcClass] = useState('Class 1');
  const [calcMonths, setCalcMonths] = useState(1);
  const [optTransport, setOptTransport] = useState(false);
  const [transportAmount, setTransportAmount] = useState(600);
  const [optComputer, setOptComputer] = useState(false);
  const [computerAmount, setComputerAmount] = useState(250);
  const [optSports, setOptSports] = useState(false);
  const [sportsAmount, setSportsAmount] = useState(150);
  const [optKit, setOptKit] = useState(false);
  const [kitAmount, setKitAmount] = useState(1200);
  const [concessionType, setConcessionType] = useState<'none' | 'sibling' | 'ews' | 'staff' | 'merit' | 'flat'>('none');
  const [flatConcession, setFlatConcession] = useState(0);
  const [hasLateFee, setHasLateFee] = useState(false);
  const [lateDays, setLateDays] = useState(5);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Notifications
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Recalculate metrics
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
  const defaultersCount = invoices.filter((inv) => inv.balanceAmount > 0).length;
  const pendingApprovalsCount = submissions.filter((s) => s.status === 'PENDING_MANAGER_APPROVAL').length;

  const refreshData = () => {
    setInvoices(db.getFeeInvoices(currentUser));
    setReceipts(db.getPaymentReceipts(currentUser));
    setStructures(db.getFeeStructures(currentUser));
    setSubmissions(db.getFeeSubmissions(currentUser));
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Open Payment modal
  const handleOpenPay = (invoice: FeeInvoice) => {
    setSelectedInvoice(invoice);
    setPayAmount(invoice.balanceAmount);
    setPayMode('UPI');
    setTransRef('');
    setPayRemarks('');
    setIsPayModalOpen(true);
  };

  // Process payment submission
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const result = db.recordFeePayment(currentUser, {
        invoiceId: selectedInvoice.id,
        amount: payAmount,
        paymentMode: payMode,
        transactionRef: transRef,
        remarks: payRemarks,
      });

      refreshData();
      setIsPayModalOpen(false);

      if (result.status === 'CONFIRMED') {
        setActiveReceipt(result.receipt);
        setNoticeMessage(`Payment of ₹${payAmount} confirmed immediately by Manager Sir.`);
      } else {
        setNoticeMessage(
          `Payment of ₹${payAmount} for ${selectedInvoice.studentName} has been submitted by Principal (Ram Jiyawan Yadav) for Manager Sir's (Lalitesh Kumar Dixit) approval.`
        );
        setActiveSubTab('pending');
      }
    } catch (err: any) {
      alert(err.message || 'Payment processing failed.');
    }
  };

  // Manager Approve Submission
  const handleApproveSubmission = (subId: string) => {
    try {
      const res = db.approveFeeSubmission(currentUser, subId);
      refreshData();
      setActiveReceipt(res.receipt);
      setNoticeMessage(`Fee submission confirmed and official receipt issued for ${res.submission.studentName}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to approve submission.');
    }
  };

  // Manager Reject Submission
  const handleRejectSubmission = () => {
    if (!rejectModalSubmissionId || !rejectionReason.trim()) {
      alert('Please provide a reason for rejecting this submission.');
      return;
    }
    try {
      db.rejectFeeSubmission(currentUser, rejectModalSubmissionId, rejectionReason.trim());
      refreshData();
      setRejectModalSubmissionId(null);
      setRejectionReason('');
      setNoticeMessage('Fee submission marked as REJECTED.');
    } catch (err: any) {
      alert(err.message || 'Failed to reject submission.');
    }
  };

  // Open Add Structure Modal
  const handleOpenAddStructure = () => {
    setEditingStructureId(null);
    setStructClass('Class 1');
    setStructHead('Tuition Fee');
    setStructAmount(1800);
    setStructFrequency('Monthly');
    setIsStructureModalOpen(true);
  };

  // Open Edit Structure Modal
  const handleOpenEditStructure = (item: FeeStructure) => {
    setEditingStructureId(item.id);
    setStructClass(item.className);
    setStructHead(item.feeHead);
    setStructAmount(item.amount);
    setStructFrequency(item.frequency);
    setIsStructureModalOpen(true);
  };

  // Save Structure (Add or Edit)
  const handleSaveStructure = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStructureId) {
        db.updateFeeStructure(currentUser, editingStructureId, structAmount);
        setNoticeMessage(`Updated fee amount to ₹${structAmount} for ${structClass} ${structHead}.`);
      } else {
        db.addFeeStructure(currentUser, {
          className: structClass,
          feeHead: structHead,
          amount: structAmount,
          frequency: structFrequency,
        });
        setNoticeMessage(`Added new fee component for ${structClass}: ${structHead} (₹${structAmount}).`);
      }
      refreshData();
      setIsStructureModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save fee structure.');
    }
  };

  // Calculator Computations
  const classBaseTuition =
    structures.find((s) => s.className === calcClass && s.feeHead === 'Tuition Fee')?.amount || 2000;
  const grossTuition = classBaseTuition * calcMonths;

  let addOns = 0;
  if (optTransport) addOns += transportAmount * calcMonths;
  if (optComputer) addOns += computerAmount * calcMonths;
  if (optSports) addOns += sportsAmount * calcMonths;
  if (optKit) addOns += kitAmount;

  let discount = 0;
  if (concessionType === 'sibling') discount = Math.round(grossTuition * 0.1);
  else if (concessionType === 'ews') discount = Math.round(grossTuition * 0.25);
  else if (concessionType === 'staff') discount = Math.round(grossTuition * 0.5);
  else if (concessionType === 'merit') discount = grossTuition;
  else if (concessionType === 'flat') discount = flatConcession;

  const lateFine = hasLateFee ? lateDays * 20 : 0;
  const netPayable = Math.max(0, grossTuition + addOns - discount + lateFine);

  const handleCopyQuotation = () => {
    const text = `*JNSD EDUCATION CENTRE — OFFICIAL FEE ESTIMATE*
Class: ${calcClass} | Period: ${calcMonths} Month(s)
----------------------------------------
Base Tuition Fee: ₹${grossTuition.toLocaleString('en-IN')}
Add-on Facilities: ₹${addOns.toLocaleString('en-IN')}
Concession/Rebate: -₹${discount.toLocaleString('en-IN')}
Late Fine: ₹${lateFine.toLocaleString('en-IN')}
----------------------------------------
*NET PAYABLE AMOUNT: ₹${netPayable.toLocaleString('en-IN')}*
Affiliation: CBSE-AFF-JNSD-0921 | Session 2026-27`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice if any */}
      {noticeMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{noticeMessage}</span>
          </div>
          <button onClick={() => setNoticeMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Role & 2-Tier Confirmation Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Fees & Accounts Management</h2>
            {isManager && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase">
                Manager Sir (Lalitesh Kumar Dixit)
              </span>
            )}
            {isPrincipal && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded uppercase">
                Principal (Ram Jiyawan Yadav) — 2-Tier Approval Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Class fee structures, student ledgers, interactive fee calculator, and Manager confirmation workflow.
          </p>
        </div>

        {/* Quick Add Fee Head */}
        <button
          onClick={handleOpenAddStructure}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-school-900 text-white rounded-lg text-xs font-bold hover:bg-school-800 shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add / Update Fee Amount</span>
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Fee Collected</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-slate-400">Session 2026-27</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Outstanding Balance</span>
            <p className="text-2xl font-black text-amber-600 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-slate-400">Total Pending Dues</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Defaulters</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{defaultersCount}</p>
            <span className="text-[11px] text-slate-400">Unpaid / Partial Invoices</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('pending')}
          className={`p-4 rounded-xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
            pendingApprovalsCount > 0
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/50'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold uppercase text-slate-700">Pending Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </div>
            <p className="text-2xl font-black text-amber-700 mt-1">{pendingApprovalsCount}</p>
            <span className="text-[11px] text-slate-500">
              {isManager ? 'Awaiting Your Confirmation' : 'Awaiting Manager Sir'}
            </span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Module Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar flex-nowrap pb-0.5">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 shrink-0 whitespace-nowrap transition ${
            activeSubTab === 'invoices'
              ? 'border-school-900 text-school-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices & Collections ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pending')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 shrink-0 whitespace-nowrap transition ${
            activeSubTab === 'pending'
              ? 'border-school-900 text-school-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals</span>
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('structures')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 shrink-0 whitespace-nowrap transition ${
            activeSubTab === 'structures'
              ? 'border-school-900 text-school-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Fee Structures & Breakdown ({structures.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`pb-2.5 px-3 border-b-2 flex items-center space-x-1.5 shrink-0 whitespace-nowrap transition ${
            activeSubTab === 'calculator'
              ? 'border-school-900 text-school-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700">Fee Calculator & Estimator</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: INVOICES & COLLECTIONS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, admission no, invoice..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-school-800"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              {(['ALL', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md font-bold transition ${
                    filterStatus === st
                      ? 'bg-school-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Student & Admission No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Remaining Balance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono text-school-900 font-bold">{inv.invoiceNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{inv.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.admissionNo}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {inv.className}-{inv.section}
                    </td>
                    <td className="p-3 font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-emerald-700 font-bold">₹{inv.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      {inv.balanceAmount > 0 ? (
                        <span className="font-bold text-rose-600">₹{inv.balanceAmount.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">₹0 (Clear)</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-blue-100 text-blue-800'
                            : inv.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800 font-black'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {inv.balanceAmount > 0 ? (
                        <button
                          onClick={() => handleOpenPay(inv)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-bold text-xs shadow-xs"
                        >
                          {isPrincipal ? 'Submit Payment' : 'Collect Fee'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const found = receipts.find((r) => r.invoiceId === inv.id);
                            if (found) setActiveReceipt(found);
                            else alert('Receipt record not found.');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 rounded border border-slate-200 text-xs font-semibold"
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PENDING APPROVALS QUEUE (2-TIER PRINCIPAL -> MANAGER) */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 flex items-start space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs text-amber-900">
              <h4 className="font-bold text-sm">Two-Tier Fee Confirmation Policy</h4>
              <p className="mt-0.5 leading-relaxed">
                When <strong>Principal (Ram Jiyawan Yadav)</strong> records a fee collection, it enters this approval queue.
                The student ledger and invoice balances are <strong>officially updated only after Manager Sir (Lalitesh Kumar Dixit) confirms and stamps the payment.</strong>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pending & Recent Fee Submissions ({submissions.length})
              </h3>
              <span className="text-xs text-slate-500">
                {isManager ? 'Manager Sir Operational Review' : 'Principal Submission Log'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment Mode</th>
                    <th className="p-3">Submitted By</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        No fee submissions in queue.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-800">
                          {sub.studentName}
                          <div className="text-[10px] text-slate-400 font-mono">{sub.admissionNo}</div>
                        </td>
                        <td className="p-3 text-slate-600">{sub.className}</td>
                        <td className="p-3 font-bold text-emerald-700 text-sm">
                          ₹{sub.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-700">{sub.paymentMode}</span>
                          {sub.transactionRef && (
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                              {sub.transactionRef}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-bold">{sub.submittedBy}</span>
                          <div className="text-[10px] text-blue-600 font-semibold">{sub.submittedByRole}</div>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            {sub.status === 'PENDING_MANAGER_APPROVAL'
                              ? 'Awaiting Manager Confirmation'
                              : sub.status}
                          </span>
                          {sub.approvedBy && (
                            <div className="text-[10px] text-slate-400 mt-0.5">By: {sub.approvedBy}</div>
                          )}
                          {sub.rejectionReason && (
                            <div className="text-[10px] text-rose-600 mt-0.5 italic">
                              Reason: {sub.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {sub.status === 'PENDING_MANAGER_APPROVAL' ? (
                            isManager ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleApproveSubmission(sub.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs flex items-center space-x-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Confirm & Stamp</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectModalSubmissionId(sub.id);
                                    setRejectionReason('');
                                  }}
                                  className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded font-semibold text-xs border border-rose-300"
                                >
                                  <Ban className="w-3.5 h-3.5 inline mr-1" />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-semibold italic">
                                Queued for Manager Sir
                              </span>
                            )
                          ) : sub.receiptId ? (
                            <button
                              onClick={() => {
                                const found = receipts.find((r) => r.id === sub.receiptId);
                                if (found) setActiveReceipt(found);
                              }}
                              className="px-2 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold hover:bg-slate-200"
                            >
                              View Receipt
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: FEE STRUCTURES & PRICING (ADD / UPDATE FEE AMOUNTS) */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'structures' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configure baseline class-wise fee schedules (Tuition, Admission, Annual, Computer, Smart Lab, Sports).
            </p>
            <button
              onClick={handleOpenAddStructure}
              className="px-3 py-1.5 bg-school-900 text-white rounded-lg text-xs font-bold hover:bg-school-800 flex items-center space-x-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Fee Component</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Class</th>
                  <th className="p-3">Fee Head / Component</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {structures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-school-900">{item.className}</td>
                    <td className="p-3 font-semibold text-slate-800">{item.feeHead}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-200">
                        {item.frequency}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-700 text-sm">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleOpenEditStructure(item)}
                        className="px-2.5 py-1 text-school-800 hover:bg-school-50 rounded border border-school-300 font-bold text-xs inline-flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Update Amount</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: INTERACTIVE FEE CALCULATOR */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Calculation Parameters */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">Fee Estimation & Calculator</h3>
            </div>

            {/* Class & Billing Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student Class</label>
                <select
                  value={calcClass}
                  onChange={(e) => setCalcClass(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-1 focus:ring-school-800"
                >
                  {[
                    'Play Group',
                    'Nursery',
                    'LKG',
                    'UKG',
                    'Class 1',
                    'Class 2',
                    'Class 3',
                    'Class 4',
                    'Class 5',
                    'Class 6',
                    'Class 7',
                    'Class 8',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Base Tuition: ₹{classBaseTuition.toLocaleString('en-IN')}/mo
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Billing Period / Duration</label>
                <select
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-1 focus:ring-school-800"
                >
                  <option value={1}>1 Month (Monthly)</option>
                  <option value={3}>3 Months (Quarterly - 1 Term)</option>
                  <option value={6}>6 Months (Half-Yearly)</option>
                  <option value={12}>12 Months (Full Annual Session)</option>
                </select>
              </div>
            </div>

            {/* Optional Facilities & Services */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Optional Services & Facilities</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optTransport}
                    onChange={(e) => setOptTransport(e.target.checked)}
                    className="rounded text-school-900 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">School Van / Transport</span>
                    <span className="text-[10px] text-slate-400 block">₹{transportAmount}/mo</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optComputer}
                    onChange={(e) => setOptComputer(e.target.checked)}
                    className="rounded text-school-900 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">Smart Computer & Coding Lab</span>
                    <span className="text-[10px] text-slate-400 block">₹{computerAmount}/mo</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optSports}
                    onChange={(e) => setOptSports(e.target.checked)}
                    className="rounded text-school-900 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">Sports & Martial Arts</span>
                    <span className="text-[10px] text-slate-400 block">₹{sportsAmount}/mo</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optKit}
                    onChange={(e) => setOptKit(e.target.checked)}
                    className="rounded text-school-900 focus:ring-0"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">Annual Stationery & Activity Kit</span>
                    <span className="text-[10px] text-slate-400 block">₹{kitAmount} (One-Time)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Concession / Scholarships */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship / Concession Policy</label>
                <select
                  value={concessionType}
                  onChange={(e) => setConcessionType(e.target.value as any)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                >
                  <option value="none">None (Standard Fee)</option>
                  <option value="sibling">Sibling Concession (10% on Tuition)</option>
                  <option value="ews">EWS / Need-Based Scholarship (25%)</option>
                  <option value="staff">Staff Child Concession (50%)</option>
                  <option value="merit">Merit Scholar (100% Tuition Waiver)</option>
                  <option value="flat">Custom Flat Concession (₹ Amount)</option>
                </select>
              </div>

              {concessionType === 'flat' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Concession Amount (₹)</label>
                  <input
                    type="number"
                    value={flatConcession}
                    onChange={(e) => setFlatConcession(Number(e.target.value))}
                    min={0}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Late Fee Calculation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasLateFee}
                  onChange={(e) => setHasLateFee(e.target.checked)}
                  className="rounded text-school-900"
                />
                <span>Apply Late Fee Fine</span>
              </label>

              {hasLateFee && (
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">Days Overdue:</span>
                  <input
                    type="number"
                    value={lateDays}
                    onChange={(e) => setLateDays(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-16 p-1 text-xs border border-slate-300 rounded text-center font-bold"
                  />
                  <span className="text-slate-500">× ₹20/day = ₹{lateFine}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Net Bill & Actions */}
          <div className="bg-gradient-to-br from-school-900 to-school-800 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-school-700 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-school-300 font-semibold uppercase">Fee Breakdown Estimate</span>
                  <h4 className="text-lg font-black mt-0.5">{calcClass}</h4>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-md font-bold">
                  {calcMonths} Month{calcMonths > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-school-200">
                  <span>Gross Tuition Fee:</span>
                  <span className="font-mono font-bold text-white">₹{grossTuition.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-school-200">
                  <span>Add-on Facilities:</span>
                  <span className="font-mono font-bold text-white">+₹{addOns.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span>Concession / Discount:</span>
                    <span className="font-mono font-bold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {lateFine > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>Late Fine Penalty:</span>
                    <span className="font-mono font-bold">+₹{lateFine.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-school-700/80">
                <span className="text-xs text-school-300 uppercase tracking-wider font-semibold block">
                  Net Payable Amount
                </span>
                <p className="text-3xl font-black text-emerald-400 mt-1">₹{netPayable.toLocaleString('en-IN')}</p>
                <span className="text-[10px] text-school-400 block mt-1">
                  Includes all calculated tuition, services & concessions.
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={handleCopyQuotation}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-school-950 rounded-xl font-bold text-xs shadow flex items-center justify-center space-x-1.5 transition"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary for Parent / WhatsApp'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-school-800 hover:bg-school-700 text-white border border-school-600 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Fee Quotation Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: RECORD FEE PAYMENT (2-TIER SUBMISSION) */}
      {/* ------------------------------------------------------------- */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isPrincipal ? 'Submit Fee Collection (Principal)' : 'Record Fee Payment (Manager)'}
                </h3>
                <span className="text-xs text-slate-500">Invoice: {selectedInvoice.invoiceNo}</span>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Notice */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                isPrincipal
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              {isPrincipal ? (
                <div>
                  <strong>Principal Submission (Ram Jiyawan Yadav):</strong> This payment will be submitted to{' '}
                  <strong>Manager Sir (Lalitesh Kumar Dixit)</strong> for confirmation. Invoice balance will update upon
                  approval.
                </div>
              ) : (
                <div>
                  <strong>Manager Confirmation (Lalitesh Kumar Dixit):</strong> Direct administrative posting. Ledger
                  updates immediately and official receipt is generated.
                </div>
              )}
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Student:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.studentName}</span>
                </div>
                <div className="flex justify-between text-slate-600 mt-1">
                  <span>Class:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedInvoice.className}-{selectedInvoice.section}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 mt-1">
                  <span>Remaining Due:</span>
                  <span className="font-bold text-rose-600">₹{selectedInvoice.balanceAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Collection Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  max={selectedInvoice.balanceAmount}
                  min={1}
                  required
                  className="w-full text-base font-bold text-emerald-700 p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-school-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Channel</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="UPI">UPI (PhonePe, GooglePay, Paytm)</option>
                  <option value="CASH">Cash (Office Counter)</option>
                  <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  placeholder="e.g., UPI/314159265358 or CHQ-99120"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  placeholder="e.g., April fee paid in full"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isPrincipal ? 'Submit for Manager Approval' : 'Confirm & Issue Receipt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: ADD / EDIT FEE STRUCTURE AMOUNT */}
      {/* ------------------------------------------------------------- */}
      {isStructureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingStructureId ? 'Update Fee Amount' : 'Add New Fee Component'}
              </h3>
              <button onClick={() => setIsStructureModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStructure} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Class</label>
                <select
                  value={structClass}
                  onChange={(e) => setStructClass(e.target.value)}
                  disabled={Boolean(editingStructureId)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                >
                  {[
                    'Play Group',
                    'Nursery',
                    'LKG',
                    'UKG',
                    'Class 1',
                    'Class 2',
                    'Class 3',
                    'Class 4',
                    'Class 5',
                    'Class 6',
                    'Class 7',
                    'Class 8',
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Head / Type</label>
                <select
                  value={structHead}
                  onChange={(e) => setStructHead(e.target.value as any)}
                  disabled={Boolean(editingStructureId)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Admission Fee">Admission Fee</option>
                  <option value="Annual Charges">Annual Charges</option>
                  <option value="Examination Fee">Examination Fee</option>
                  <option value="Computer/Smart Lab">Computer/Smart Lab</option>
                  <option value="Activity & Sports">Activity & Sports</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                <select
                  value={structFrequency}
                  onChange={(e) => setStructFrequency(e.target.value as any)}
                  disabled={Boolean(editingStructureId)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Amount (₹)</label>
                <input
                  type="number"
                  value={structAmount}
                  onChange={(e) => setStructAmount(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full text-base font-bold text-emerald-700 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsStructureModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-school-900 hover:bg-school-800 text-white rounded-lg font-bold shadow"
                >
                  {editingStructureId ? 'Save Updated Amount' : 'Create Fee Structure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: REJECTION REASON MODAL (MANAGER SIR) */}
      {/* ------------------------------------------------------------- */}
      {rejectModalSubmissionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-rose-900">Reject Fee Payment Submission</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please enter the official reason for rejecting this fee submission by Principal (Ram Jiyawan Yadav).
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Cash not deposited at front desk, or Ref ID mismatch in bank passbook."
              rows={3}
              className="w-full mt-3 p-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500"
            />

            <div className="mt-4 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setRejectModalSubmissionId(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmission}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: OFFICIAL PRINTABLE RECEIPT */}
      {/* ------------------------------------------------------------- */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <span className="font-bold text-sm">Official School Fee Receipt</span>
              <button onClick={() => setActiveReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 text-slate-800 bg-white">
              <div className="text-center border-b-2 border-school-900 pb-3">
                <div className="flex items-center justify-center space-x-3 mb-1">
                  <img src="/school-logo.png" alt="JNSD School Logo" className="w-14 h-14 object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-school-900 tracking-wide">JNSD EDUCATION CENTRE</h2>
                    <p className="text-[10px] text-slate-500 font-semibold">Affiliation: CBSE-AFF-JNSD-0921 • Kanpur, UP</p>
                  </div>
                </div>
                <div className="inline-block px-3 py-0.5 bg-school-100 text-school-900 rounded font-bold text-[10px] uppercase">
                  Official Fee Receipt
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-mono font-bold ml-1">{activeReceipt.receiptNo}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold ml-1">{activeReceipt.paymentDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold ml-1">{activeReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono ml-1">{activeReceipt.admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-500">Class:</span>
                  <span className="font-semibold ml-1">{activeReceipt.className}</span>
                </div>
                <div>
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-emerald-700 ml-1">{activeReceipt.paymentMode}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-200">Fee Head</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReceipt.feeBreakdown.map((item, idx) => (
                      <tr key={idx} className="border-t border-slate-200">
                        <td className="p-2 border-r border-slate-200">{item.head}</td>
                        <td className="p-2 text-right font-mono font-semibold">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                      <td className="p-2 border-r border-slate-200">Total Paid</td>
                      <td className="p-2 text-right font-mono text-emerald-700 text-sm">
                        ₹{activeReceipt.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
                <div>
                  <div>Received / Submitted By: {activeReceipt.receivedBy}</div>
                  {activeReceipt.approvedBy && (
                    <div className="text-emerald-800 font-bold mt-0.5">
                      ✓ Confirmed by Manager Sir: {activeReceipt.approvedBy}
                    </div>
                  )}
                  {activeReceipt.transactionRef && (
                    <div className="font-mono text-[10px]">Ref: {activeReceipt.transactionRef}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-school-900 font-bold">Lalitesh Kumar Dixit</div>
                  <div className="border-t border-slate-400 mt-1 pt-0.5 text-[9px] uppercase tracking-wider font-semibold">
                    Authorized Signatory (Manager Sir)
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2 no-print">
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-school-900 hover:bg-school-800 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

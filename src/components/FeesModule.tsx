import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { FeeInvoice, PaymentReceipt } from '../types';
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
} from 'lucide-react';

export const FeesModule: React.FC = () => {
  const { currentUser, isManager } = useAuth();

  // If not Manager, hard block in UI as well
  if (!isManager) {
    return (
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-rose-900">403 — Unauthorized Access</h3>
        <p className="text-sm text-rose-800 mt-2">
          Fees & Accounts is strictly restricted to <strong>Manager Sir</strong>.
          Neither Principal nor Class Teachers are permitted access to financial balances, ledger queries, or receipts.
        </p>
      </div>
    );
  }

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => db.getFeeInvoices(currentUser));
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => db.getPaymentReceipts(currentUser));
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

  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
  const defaultersCount = invoices.filter((inv) => inv.balanceAmount > 0).length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPay = (invoice: FeeInvoice) => {
    setSelectedInvoice(invoice);
    setPayAmount(invoice.balanceAmount);
    setPayMode('UPI');
    setTransRef('');
    setPayRemarks('');
    setIsPayModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      const receipt = db.recordFeePayment(currentUser, {
        invoiceId: selectedInvoice.id,
        amount: payAmount,
        paymentMode: payMode,
        transactionRef: transRef,
        remarks: payRemarks,
      });

      setInvoices(db.getFeeInvoices(currentUser));
      setReceipts(db.getPaymentReceipts(currentUser));
      setIsPayModalOpen(false);
      setActiveReceipt(receipt);
    } catch (err: any) {
      alert(err.message || 'Payment processing failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900">Fees & Accounts Management</h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase">
              Manager Sir Access
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Class fee structures, student ledgers, receipt generation, and fee collection oversight.
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Fee Collected</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-slate-400">Academic Session 2026-27</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Outstanding Balances</span>
            <p className="text-2xl font-black text-rose-700 mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-rose-600 font-medium">{defaultersCount} students pending</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Invoices Issued</span>
            <p className="text-2xl font-black text-school-900 mt-1">{invoices.length}</p>
            <span className="text-[11px] text-slate-400">{receipts.length} receipts generated</span>
          </div>
          <div className="p-3 bg-school-50 text-school-700 rounded-lg">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-school-500"
          >
            <option value="ALL">All Invoices</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student, adm #, inv #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-school-500"
          />
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Billing Period</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3 font-semibold text-school-900">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{inv.studentName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {inv.className}-{inv.section}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{inv.monthOrPeriod}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">₹{inv.paidAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-rose-700">₹{inv.balanceAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-500">{inv.dueDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'PARTIALLY_PAID'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.balanceAmount > 0 ? (
                      <button
                        onClick={() => handleOpenPay(inv)}
                        className="px-2.5 py-1 bg-school-900 hover:bg-school-800 text-white font-semibold rounded text-xs transition flex items-center space-x-1 ml-auto"
                      >
                        <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                        <span>Collect</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const r = receipts.find((rec) => rec.studentId === inv.studentId);
                          if (r) setActiveReceipt(r);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition flex items-center space-x-1 ml-auto"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Record Fee Payment</h3>
                <p className="text-xs text-school-300">Invoice: {selectedInvoice.invoiceNo}</p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span className="font-bold text-slate-800">
                    {selectedInvoice.className}-{selectedInvoice.section}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-bold text-rose-700">₹{selectedInvoice.balanceAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={selectedInvoice.balanceAmount}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm font-bold text-school-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Mode *</label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value as any)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="UPI">UPI (PhonePe, GPay, Paytm)</option>
                  <option value="CASH">Cash in Hand</option>
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                  <option value="CHEQUE">Bank Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Transaction Ref / UTR / Cheque No.</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/314159265358 or CHQ-00213"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Paid by father in school office"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Issue Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Branded Fee Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-school-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <span className="font-bold text-sm">Official School Fee Receipt</span>
              <button onClick={() => setActiveReceipt(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-8 space-y-6 text-slate-800 bg-white">
              <div className="text-center border-b-2 border-school-900 pb-3">
                <div className="flex items-center justify-center space-x-3 mb-1">
                  <img src="/school-logo.png" alt="JNSD School Logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h2 className="text-xl font-black text-school-900 tracking-wide">JNSD EDUCATION CENTRE</h2>
                    <p className="text-[10px] text-slate-500 font-semibold">Affiliation: CBSE-AFF-JNSD-0921 • Kanpur, UP</p>
                  </div>
                </div>
                <div className="inline-block px-3 py-0.5 bg-school-100 text-school-900 rounded font-bold text-[10px] uppercase">
                  Official Fee Receipt
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Receipt No:</span>
                  <span className="font-mono font-bold text-school-900 ml-1.5">{activeReceipt.receiptNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Date:</span>
                  <span className="font-bold text-slate-900 ml-1.5">{activeReceipt.paymentDate}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admission No:</span>
                  <span className="font-mono font-bold text-slate-900">{activeReceipt.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class & Section:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.paymentMode}</span>
                </div>
                {activeReceipt.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction Reference:</span>
                    <span className="font-mono text-slate-800">{activeReceipt.transactionRef}</span>
                  </div>
                )}
              </div>

              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2 border-b">Fee Head / Description</th>
                      <th className="p-2 border-b text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeReceipt.feeBreakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{item.head}</td>
                        <td className="p-2 text-right font-medium">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2 text-school-900">Total Paid Amount</td>
                      <td className="p-2 text-right text-emerald-800 text-sm">₹{activeReceipt.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-6 flex justify-between items-end text-xs">
                <div className="text-[10px] text-slate-400">
                  <p>Computer generated school fee receipt.</p>
                  <p>Valid without physical stamp if verified.</p>
                </div>
                <div className="text-center border-t border-slate-400 w-36 pt-1">
                  <p className="font-bold text-slate-800">Manager Sir</p>
                  <p className="text-[10px] text-slate-500">Authorized Signatory</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-school-900 text-white text-xs font-bold rounded-lg shadow hover:bg-school-800 flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
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


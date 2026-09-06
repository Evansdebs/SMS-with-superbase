'use client';

import React, { useEffect, useState } from 'react';

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  term: string;
  academicYear: string;
  feeType: string;
  totalAmount: number;
  discountAmount: number;
  scholarshipName: string | null;
  amountPaid: number;
  balance: number;
  status: string;
  paymentDate: string | null;
  receiptNumber: string | null;
}
import Link from 'next/link';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Printer,
  Filter,
  Receipt,
  Award,
  Layers,
  BarChart3,
  Building,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

// Production clean state - live data is populated from institutional billing actions
const INITIAL_FEE_RECORDS: FeeRecord[] = [];
const INITIAL_STRUCTURES: { id: string; name: string; amount: number; category: string; academicYear: string }[] = [];
const INITIAL_EXPENSES: { id: string; category: string; description: string; amount: number; expenseDate: string; approvedBy: string }[] = [];

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'structures' | 'scholarships' | 'expenses' | 'statement'>('ledgers');
  const [records, setRecords] = useState<FeeRecord[]>(INITIAL_FEE_RECORDS as FeeRecord[]);
  const [structures, setStructures] = useState(INITIAL_STRUCTURES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MOBILE_MONEY');

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [newStructure, setNewStructure] = useState({ name: '', amount: 100, category: 'Tuition' });

  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);
  const [scholarshipData, setScholarshipData] = useState({ feeId: '', name: 'Academic Scholarship', discount: 150 });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'UTILITIES', description: '', amount: 500 });

  // Filtered Ledgers
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Totals
  const totalInvoiced = records.reduce((s, r) => s + r.totalAmount, 0);
  const totalDiscounts = records.reduce((s, r) => s + r.discountAmount, 0);
  const totalCollected = records.reduce((s, r) => s + r.amountPaid, 0);
  const totalOutstanding = records.reduce((s, r) => s + r.balance, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netCashflow = totalCollected - totalExpenses;

  // Handlers
  const handleOpenPayment = (fee: any) => {
    setSelectedFee(fee);
    setPaymentAmount(fee.balance.toString());
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !paymentAmount) return;

    const amt = parseFloat(paymentAmount);
    const receiptNum = `TLS-RCP-2025-${String(Date.now()).slice(-4)}`;

    const updated = records.map((r) => {
      if (r.id === selectedFee.id) {
        const newPaid = r.amountPaid + amt;
        const newBal = Math.max(0, r.totalAmount - r.discountAmount - newPaid);
        return {
          ...r,
          amountPaid: newPaid,
          balance: newBal,
          status: newBal === 0 ? 'PAID' : 'PARTIAL',
          receiptNumber: receiptNum,
          paymentDate: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    });

    setRecords(updated);
    setIsPaymentModalOpen(false);

    // Auto-prompt receipt
    const paidRec = updated.find((r) => r.id === selectedFee.id);
    setActiveReceipt({ ...paidRec, lastPaymentAmount: amt });
    setIsReceiptModalOpen(true);
  };

  const handleApplyScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scholarshipData.feeId) return;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === scholarshipData.feeId) {
          const discount = Number(scholarshipData.discount);
          const netTotal = Math.max(0, r.totalAmount - discount);
          const newBal = Math.max(0, netTotal - r.amountPaid);
          return {
            ...r,
            discountAmount: discount,
            scholarshipName: scholarshipData.name,
            balance: newBal,
            status: newBal === 0 ? 'PAID' : r.amountPaid > 0 ? 'PARTIAL' : 'UNPAID',
          };
        }
        return r;
      })
    );
    setIsScholarshipModalOpen(false);
  };

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    setStructures([
      ...structures,
      {
        id: `fs-${Date.now()}`,
        name: newStructure.name,
        amount: Number(newStructure.amount),
        category: newStructure.category,
        academicYear: '2025/2026',
      },
    ]);
    setIsStructureModalOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenses([
      {
        id: `exp-${Date.now()}`,
        category: newExpense.category,
        description: newExpense.description,
        amount: Number(newExpense.amount),
        expenseDate: new Date().toISOString().split('T')[0],
        approvedBy: 'Administrator',
      },
      ...expenses,
    ]);
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Treasury & Accounts
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Phase 4 Complete</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Fees & Financial Operations
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage student fee ledgers, fee structures, scholarships, operational expenses, and terminal P&L reports.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              <span>Log Expense</span>
            </Button>
            <Button
              onClick={() => setIsScholarshipModalOpen(true)}
              size="sm"
              className="text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              <Award className="h-3.5 w-3.5 mr-1" />
              <span>Grant Scholarship</span>
            </Button>
          </div>
        </div>

        {/* Financial KPI Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Gross Invoiced</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                GHS {totalInvoiced.toLocaleString()}
              </div>
              <span className="text-[11px] text-amber-600 font-semibold">
                Less GHS {totalDiscounts.toLocaleString()} Grants
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Revenue Collected</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                GHS {totalCollected.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {totalInvoiced - totalDiscounts > 0
                  ? Math.round((totalCollected / (totalInvoiced - totalDiscounts)) * 100)
                  : 0}% Collection Rate
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Outstanding Arrears</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">
                GHS {totalOutstanding.toLocaleString()}
              </div>
              <span className="text-[11px] text-rose-500">Uncollected dues</span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Net Operating Cashflow</div>
              <div className={`text-2xl font-bold mt-1 ${netCashflow >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                GHS {netCashflow.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">After GHS {totalExpenses.toLocaleString()} expenses</span>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ledgers')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ledgers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Student Ledgers</span>
          </button>

          <button
            onClick={() => setActiveTab('structures')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'structures'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Fee Structures</span>
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'scholarships'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Scholarships & Grants</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Operational Expenses</span>
          </button>

          <button
            onClick={() => setActiveTab('statement')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'statement'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>P&L Financial Statement</span>
          </button>
        </div>

        {/* Tab 1: Student Ledgers */}
        {activeTab === 'ledgers' && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search student, class, admission no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
                >
                  <option value="ALL">All Payment Statuses</option>
                  <option value="PAID">Fully Paid</option>
                  <option value="PARTIAL">Partially Paid</option>
                  <option value="UNPAID">Unpaid / Arrears</option>
                </select>
              </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              {filteredRecords.length === 0 ? (
                <div className="p-12 text-center max-w-sm mx-auto">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Receipt className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    No Fee Invoices or Ledgers Found
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {searchTerm || statusFilter !== 'ALL'
                      ? 'No records match your active search filters.'
                      : 'Fee billing records and student receipts will display here once tuition invoices are generated.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                        <th className="p-3.5">Student / Admission</th>
                        <th className="p-3.5">Class Tier</th>
                        <th className="p-3.5">Gross Bill</th>
                        <th className="p-3.5">Scholarship</th>
                        <th className="p-3.5">Paid Amount</th>
                        <th className="p-3.5">Outstanding Balance</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {filteredRecords.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {fee.studentName}
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">
                            {fee.admissionNumber}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                          {fee.class}
                        </td>
                        <td className="p-3.5 font-mono text-slate-900 dark:text-white font-semibold">
                          GHS {fee.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          {fee.discountAmount > 0 ? (
                            <div>
                              <span className="text-emerald-600 font-bold font-mono">
                                -GHS {fee.discountAmount.toFixed(2)}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">
                                {fee.scholarshipName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-600">
                          GHS {fee.amountPaid.toFixed(2)}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-rose-600">
                          GHS {fee.balance.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              fee.status === 'PAID'
                                ? 'success'
                                : fee.status === 'PARTIAL'
                                ? 'warning'
                                : 'destructive'
                            }
                            className="text-[10px]"
                          >
                            {fee.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {fee.balance > 0 && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenPayment(fee)}
                                className="text-xs h-7 px-2.5 bg-blue-600 hover:bg-blue-700"
                              >
                                Record Payment
                              </Button>
                            )}
                            {fee.receiptNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setActiveReceipt(fee);
                                  setIsReceiptModalOpen(true);
                                }}
                                className="text-xs h-7 px-2"
                                title="Print Receipt"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          </div>
        )}

        {/* Tab 2: Fee Structures */}
        {activeTab === 'structures' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active School Fee Components
                </h3>
                <p className="text-xs text-slate-500">
                  Standardized billing heads applied during terminal invoice generation
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsStructureModalOpen(true)}
                className="text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Add Fee Component</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {structures.map((s) => (
                <Card key={s.id} className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {s.category}
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h4>
                      <span className="text-[11px] text-slate-500">Academic Year: {s.academicYear}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                        GHS {s.amount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Scholarships & Grants */}
        {activeTab === 'scholarships' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Scholarship & Fee Concession Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Beneficiaries of merit awards, staff dependent discounts, and bursaries
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsScholarshipModalOpen(true)}
                className="text-xs font-semibold"
              >
                <Award className="h-3.5 w-3.5 mr-1" />
                <span>Award New Scholarship</span>
              </Button>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                      <th className="p-3.5">Beneficiary Student</th>
                      <th className="p-3.5">Class</th>
                      <th className="p-3.5">Scholarship Scheme</th>
                      <th className="p-3.5">Discount Concession</th>
                      <th className="p-3.5">Net Fee Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {records
                      .filter((r) => r.discountAmount > 0)
                      .map((sc) => (
                        <tr key={sc.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {sc.studentName} ({sc.admissionNumber})
                          </td>
                          <td className="p-3.5 text-slate-600">{sc.class}</td>
                          <td className="p-3.5 font-semibold text-blue-600">{sc.scholarshipName}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-600">
                            -GHS {sc.discountAmount.toFixed(2)}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                            GHS {(sc.totalAmount - sc.discountAmount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 4: Operational Expenses */}
        {activeTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Operational Expenditure Register
                </h3>
                <p className="text-xs text-slate-500">
                  Track campus bills, supplies, lab apparatus, and maintenance outlays
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsExpenseModalOpen(true)}
                className="text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Record Outlay</span>
              </Button>
            </div>

            <Card className="border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Expense Date</th>
                      <th className="p-3.5">Approved By</th>
                      <th className="p-3.5 text-right">Amount (GHS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {exp.category}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                          {exp.description}
                        </td>
                        <td className="p-3.5 text-slate-500">{exp.expenseDate}</td>
                        <td className="p-3.5 text-slate-600">{exp.approvedBy}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-rose-600">
                          GHS {exp.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 5: P&L Statement */}
        {activeTab === 'statement' && (
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">
                    Terminal Income Statement (Profit & Loss)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Academic Year 2025/2026 • First Term Operating Review
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs"
                >
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  <span>Print Financial Report</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Revenue Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-2">
                    1. Operating Inflow (Fee Collections)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Total Student Invoiced Billing:</span>
                      <span className="font-mono font-semibold">GHS {totalInvoiced.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-amber-600">
                      <span>Less Scholarship / Grants Disbursed:</span>
                      <span className="font-mono font-semibold">-GHS {totalDiscounts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700 font-bold">
                      <span className="text-slate-900 dark:text-white">Actual Fee Cash Received:</span>
                      <span className="font-mono text-emerald-600">GHS {totalCollected.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-rose-600 tracking-wider mb-2">
                    2. Operating Outflows (Campus Expenses)
                  </h4>
                  <div className="space-y-2 text-xs">
                    {expenses.map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"
                      >
                        <span className="text-slate-600 dark:text-slate-400">{e.description} ({e.category}):</span>
                        <span className="font-mono font-semibold text-rose-600">GHS {e.amount.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700 font-bold">
                      <span className="text-slate-900 dark:text-white">Total Operating Expenditures:</span>
                      <span className="font-mono text-rose-600">GHS {totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Summary */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-500 block">
                      Net Terminal Surplus / (Deficit)
                    </span>
                    <span className="text-xs text-slate-500">
                      Available Cash Balance for Capital Reserve
                    </span>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${netCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    GHS {netCashflow.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Fee Payment"
        description={selectedFee ? `Receiving dues for ${selectedFee.studentName} (${selectedFee.admissionNumber})` : ''}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Outstanding Balance (GHS)
            </label>
            <Input value={`GHS ${selectedFee?.balance.toFixed(2)}`} disabled className="bg-slate-100" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Amount Paid Now (GHS) *
            </label>
            <Input
              type="number"
              step="0.01"
              required
              max={selectedFee?.balance}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Channel
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              <option value="MOBILE_MONEY">Mobile Money (MTN / Telecel MoMo)</option>
              <option value="BANK">Bank Deposit / Transfer (GCB Bank)</option>
              <option value="CASH">Cash at Bursary Counter</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPaymentModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Generate Official Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable Official Receipt Modal */}
      {activeReceipt && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Official Payment Receipt"
          description="Ghana Education Service Compliant Receipt"
          maxWidth="md"
        >
          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl space-y-4 bg-slate-50/50">
            <div className="text-center pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base tracking-tight text-slate-900">
                THE LIVING SPRING SCHOOL
              </h3>
              <p className="text-[11px] text-slate-500">
                Plot 42, East Legon, Accra • GPS: GA-183-9201
              </p>
              <Badge variant="outline" className="mt-1 font-mono text-[10px]">
                {activeReceipt.receiptNumber}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold">{activeReceipt.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admission No:</span>
                <span className="font-mono">{activeReceipt.admissionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class:</span>
                <span>{activeReceipt.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span>{activeReceipt.paymentDate || 'Today'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-t border-b border-slate-200 font-bold">
                <span>Amount Tendered:</span>
                <span className="text-emerald-600 font-mono text-sm">
                  GHS {(activeReceipt.lastPaymentAmount || activeReceipt.amountPaid).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Remaining Balance:</span>
                <span className="font-mono">GHS {activeReceipt.balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-slate-400">
              Authorized Electronic Signature • Systems Validated
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs"
            >
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print Receipt
            </Button>
            <Button size="sm" onClick={() => setIsReceiptModalOpen(false)} className="text-xs">
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* Add Fee Structure Modal */}
      <Modal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
        title="Add Fee Component"
        description="Define a new fee head for student invoicing"
      >
        <form onSubmit={handleCreateStructure} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fee Component Name *
            </label>
            <Input
              required
              placeholder="e.g. Science Laboratory Maintenance"
              value={newStructure.name}
              onChange={(e) => setNewStructure({ ...newStructure, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Amount (GHS) *
              </label>
              <Input
                type="number"
                required
                value={newStructure.amount}
                onChange={(e) =>
                  setNewStructure({ ...newStructure, amount: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={newStructure.category}
                onChange={(e) =>
                  setNewStructure({ ...newStructure, category: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="Tuition">Tuition</option>
                <option value="Laboratory">Laboratory & STEM</option>
                <option value="Development">PTA / Development</option>
                <option value="Sports">Sports & Culture</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsStructureModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Save Component
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grant Scholarship Modal */}
      <Modal
        isOpen={isScholarshipModalOpen}
        onClose={() => setIsScholarshipModalOpen(false)}
        title="Award Scholarship / Grant"
        description="Apply financial concession to a student's terminal dues"
      >
        <form onSubmit={handleApplyScholarship} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Student Fee Record *
            </label>
            <select
              value={scholarshipData.feeId}
              onChange={(e) =>
                setScholarshipData({ ...scholarshipData, feeId: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              required
            >
              <option value="">Choose student...</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.studentName} ({r.admissionNumber}) — Gross: GHS {r.totalAmount}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Scholarship / Scheme Title *
            </label>
            <Input
              required
              placeholder="e.g. Merit Scholarship 2025"
              value={scholarshipData.name}
              onChange={(e) =>
                setScholarshipData({ ...scholarshipData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Concession Amount (GHS) *
            </label>
            <Input
              type="number"
              required
              value={scholarshipData.discount}
              onChange={(e) =>
                setScholarshipData({ ...scholarshipData, discount: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsScholarshipModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Apply Grant
            </Button>
          </div>
        </form>
      </Modal>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Log Operational Expenditure"
        description="Record a campus utility, repair, or procurement expense"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="UTILITIES">Utilities (Water, ECG)</option>
                <option value="MAINTENANCE">Facility Repairs</option>
                <option value="SUPPLIES">Academic Stationery</option>
                <option value="ICT">ICT & Internet</option>
                <option value="SANITATION">Sanitation & Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Amount (GHS) *
              </label>
              <Input
                type="number"
                required
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Outlay Description *
            </label>
            <Input
              required
              placeholder="e.g. Replacement of Science Lab microscope bulbs"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsExpenseModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Save Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

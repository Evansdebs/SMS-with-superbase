'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  Search,
  BookOpen,
  Download,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinanceAccountingPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'journal'>('chart');
  const [showJournalModal, setShowJournalModal] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const chartOfAccounts = [
    { code: '1000', name: 'GCB Bank Main Operating Account', category: 'ASSETS', subCategory: 'Cash & Cash Equivalents', balance: 'GH₵ 142,500.00' },
    { code: '1010', name: 'MTN Mobile Money Merchant Till', category: 'ASSETS', subCategory: 'Mobile Money Till', balance: 'GH₵ 34,200.00' },
    { code: '1020', name: 'Petty Cash Drawer Bursary', category: 'ASSETS', subCategory: 'Cash on Hand', balance: 'GH₵ 13,200.00' },
    { code: '1200', name: 'Student Tuition Fees Receivable', category: 'ASSETS', subCategory: 'Receivables', balance: 'GH₵ 62,500.00' },
    { code: '2000', name: 'GRA PAYE Tax Withholding Payable', category: 'LIABILITIES', subCategory: 'Current Statutory Liabilities', balance: 'GH₵ 8,150.00' },
    { code: '2010', name: 'SSNIT Tier 1 & 2 Contribution Payable', category: 'LIABILITIES', subCategory: 'Current Statutory Liabilities', balance: 'GH₵ 10,027.00' },
    { code: '3000', name: 'School Operating Reserves & Retained Earnings', category: 'EQUITY', subCategory: 'Institutional Reserves', balance: 'GH₵ 210,000.00' },
    { code: '4000', name: 'Gross Student Tuition Fee Revenue', category: 'REVENUE', subCategory: 'Operating Revenue', balance: 'GH₵ 345,000.00' },
    { code: '5000', name: 'Faculty & Administrative Staff Salaries', category: 'EXPENSES', subCategory: 'Personnel & Payroll', balance: 'GH₵ 54,200.00' },
    { code: '5100', name: 'Science Lab & Instructional Supplies', category: 'EXPENSES', subCategory: 'Academic Operating Expenses', balance: 'GH₵ 12,400.00' },
  ];

  const journalEntries = [
    { entryNo: 'JRN-2026-081', date: 'Oct 31, 2026', desc: 'Monthly Faculty Payroll Recognition (Oct 2026)', debit: 'GH₵ 54,200.00', credit: 'GH₵ 54,200.00', postedBy: 'Grace Darko (Bursar)' },
    { entryNo: 'JRN-2026-080', date: 'Oct 28, 2026', desc: 'Campus Generator Diesel Purchase Disbursement', debit: 'GH₵ 7,200.00', credit: 'GH₵ 7,200.00', postedBy: 'Grace Darko (Bursar)' },
    { entryNo: 'JRN-2026-079', date: 'Oct 25, 2026', desc: 'MTN Internet Bandwidth Termly Subscription', debit: 'GH₵ 4,500.00', credit: 'GH₵ 4,500.00', postedBy: 'Grace Darko (Bursar)' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">General Ledger & Chart of Accounts</h1>
          <p className="text-slate-600 text-sm mt-1">
            Standard double-entry accounting structure, ledger balances, journal adjustments, and financial periods.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => alert('Opening manual journal entry drawer...')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Post Journal Entry
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('chart')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'chart'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>Chart of Accounts ({chartOfAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('journal')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'journal'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>General Journal Transactions</span>
        </button>
      </div>

      {/* Chart of Accounts */}
      {activeTab === 'chart' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Institutional Chart of Accounts</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Categorized under GAAP / IFRS reporting principles
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Primary Category</th>
                  <th className="py-3 px-4">Sub-Ledger</th>
                  <th className="py-3 px-4 text-right">Current Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chartOfAccounts.map((ac) => (
                  <tr key={ac.code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{ac.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{ac.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={`text-[10px] ${
                        ac.category === 'ASSETS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        ac.category === 'REVENUE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        ac.category === 'LIABILITIES' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {ac.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{ac.subCategory}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{ac.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Journal View */}
      {activeTab === 'journal' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">General Journal Entries</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Balanced debit and credit transaction history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Journal #</th>
                  <th className="py-3 px-4">Posting Date</th>
                  <th className="py-3 px-4">Narrative Description</th>
                  <th className="py-3 px-4 text-right">Debit (GH₵)</th>
                  <th className="py-3 px-4 text-right">Credit (GH₵)</th>
                  <th className="py-3 px-4 text-right">Author</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journalEntries.map((j) => (
                  <tr key={j.entryNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{j.entryNo}</td>
                    <td className="py-3 px-4 text-slate-500">{j.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{j.desc}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">{j.debit}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900">{j.credit}</td>
                    <td className="py-3 px-4 text-right text-slate-500">{j.postedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </main>
  );
}


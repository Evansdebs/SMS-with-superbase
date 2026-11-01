'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Users,
  Wallet,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function FinanceDashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const stats = {
    termRevenueBilled: 'GH₵ 345,000.00',
    totalCollected: 'GH₵ 282,500.00',
    collectionRate: '81.8%',
    outstandingReceivables: 'GH₵ 62,500.00',
    monthlyPayroll: 'GH₵ 54,200.00',
    totalExpenses: 'GH₵ 38,400.00',
    netCashPosition: 'GH₵ 189,900.00',
  };

  const dailyCollections = [
    { receipt: 'REC-2026-90422', student: 'Akua Ansah (P5)', payer: 'Mr. Kwame Ansah', amount: 'GH₵ 350.00', channel: 'MTN Mobile Money', time: '11:15 AM' },
    { receipt: 'REC-2026-90421', student: 'Kofi Mensah (JHS 2)', payer: 'Madam Faustina Mensah', amount: 'GH₵ 1,200.00', channel: 'GCB Bank Transfer', time: '10:40 AM' },
    { receipt: 'REC-2026-90420', student: 'Ama Serwaa (JHS 3)', payer: 'Dr. Serwaa', amount: 'GH₵ 2,450.00', channel: 'Ecobank Visa', time: '09:25 AM' },
    { receipt: 'REC-2026-90419', student: 'Yaw Boateng (JHS 1)', payer: 'Mr. Boateng', amount: 'GH₵ 500.00', channel: 'Cash Office', time: '08:50 AM' },
  ];

  const recentExpenses = [
    { desc: 'Science Laboratory Chemistry Consumables', category: 'Instructional Supplies', amount: 'GH₵ 2,850.00', date: 'Oct 30', status: 'PAID' },
    { desc: 'Campus Generator Diesel Supply (500L)', category: 'Utilities & Power', amount: 'GH₵ 7,200.00', date: 'Oct 28', status: 'PAID' },
    { desc: 'MTN Dedicated Internet Bandwidth (Termly)', category: 'ICT & Infrastructure', amount: 'GH₵ 4,500.00', date: 'Oct 25', status: 'PAID' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Academic Year 2025/2026 • Term 1 Financial Period</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Institutional Bursary & Financial Cockpit
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Live monitor of fee collections, outstanding debt aging, operating expenses, and GRA/SSNIT statutory liabilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/finance/collections">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs">
                <Receipt className="h-4 w-4 mr-1.5" />
                Issue Manual Receipt
              </Button>
            </Link>
            <Link href="/finance/reports">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium">
                <FileSpreadsheet className="h-4 w-4 mr-1.5" />
                Financial Statements
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Term Fees Collected</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.totalCollected}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">{stats.collectionRate} Recovery Rate</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Outstanding Receivables</span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{stats.outstandingReceivables}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Across 38 students</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Monthly Payroll Liability</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.monthlyPayroll}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">18 Staff • Net Pay</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Net Operating Cash</span>
            <div className="text-2xl font-extrabold text-teal-800 mt-1">{stats.netCashPosition}</div>
            <span className="text-[11px] text-teal-600 font-medium mt-0.5 block">GCB + MoMo Merchant</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Collections & Expense Ledgers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Daily Collection Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Today's Collections Journal</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Transactions received via Mobile Money, Bank Transfer, and Cash Counter
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                GH₵ 4,500.00 Today
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Student & Payer</th>
                    <th className="py-3 px-4">Payment Channel</th>
                    <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyCollections.map((col) => (
                    <tr key={col.receipt} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {col.receipt}
                        <span className="block text-[10px] text-slate-400 font-normal">{col.time}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{col.student}</div>
                        <div className="text-[11px] text-slate-500">{col.payer}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="border-slate-200 text-slate-700 bg-slate-50">
                          {col.channel}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                        {col.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Operating Expenses */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Recent Operating Expenses</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Approved disbursements from the School Operating Account
                </CardDescription>
              </div>
              <Link href="/finance/accounting">
                <Button variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-900">
                  General Ledger →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {recentExpenses.map((exp, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{exp.desc}</h5>
                    <div className="text-slate-500 text-[11px] mt-0.5">{exp.category} • {exp.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-rose-700 text-sm">{exp.amount}</div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {exp.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bank Accounts & GRA SSNIT Summary (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">School Bank Accounts</CardTitle>
                <Landmark className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-3">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>GCB Bank Ghana (Main)</span>
                  <span className="font-mono text-emerald-800">GH₵ 142,500.00</span>
                </div>
                <div className="text-slate-500 font-mono text-[11px] mt-1">A/C: 1041130008422</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>MTN MoMo Merchant Till</span>
                  <span className="font-mono text-slate-900">GH₵ 34,200.00</span>
                </div>
                <div className="text-slate-500 font-mono text-[11px] mt-1">Merchant ID: 642911</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center font-bold text-slate-900">
                  <span>Petty Cash Drawer</span>
                  <span className="font-mono text-slate-900">GH₵ 13,200.00</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-1">Bursary Safe Custody</div>
              </div>
            </CardContent>
          </Card>

          {/* Ghana Statutory Remittances (GRA & SSNIT) */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Statutory Tax & Pension</CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">GRA / SSNIT</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span>SSNIT Tier 1 (13.5%):</span>
                <span className="font-mono font-bold text-slate-800">GH₵ 7,317.00</span>
              </div>
              <div className="flex justify-between">
                <span>SSNIT Tier 2 (5% Private):</span>
                <span className="font-mono font-bold text-slate-800">GH₵ 2,710.00</span>
              </div>
              <div className="flex justify-between">
                <span>GRA PAYE Income Tax:</span>
                <span className="font-mono font-bold text-slate-800">GH₵ 8,150.00</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Next Remittance Due:</span>
                <span className="text-amber-700">Nov 14, 2026</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


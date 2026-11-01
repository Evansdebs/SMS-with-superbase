'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Receipt,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function StudentFeesPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const feeSummary = {
    totalBilled: 'GH₵ 3,250.00',
    totalPaid: 'GH₵ 3,250.00',
    outstandingBalance: 'GH₵ 0.00',
    status: 'CLEARED',
    term: 'Term 1 (2025/2026)',
  };

  const paymentHistory = [
    {
      receiptNo: 'REC-2026-00412',
      date: 'Sept 05, 2026',
      amount: 'GH₵ 2,000.00',
      method: 'MTN Mobile Money (MoMo)',
      description: 'Term 1 Tuition & Learning Materials Deposit',
      status: 'CONFIRMED',
    },
    {
      receiptNo: 'REC-2026-00891',
      date: 'Oct 02, 2026',
      amount: 'GH₵ 1,250.00',
      method: 'Bank Transfer (GCB Bank)',
      description: 'Final Term 1 Clearance (ICT & Lab Levies)',
      status: 'CONFIRMED',
    },
  ];

  const feeItems = [
    { item: 'Tuition & Academic Instructional Fee', amount: 'GH₵ 1,800.00' },
    { item: 'Science Laboratory & Practical Consumables', amount: 'GH₵ 450.00' },
    { item: 'Computer Lab / ICT & Digital Resources Fee', amount: 'GH₵ 400.00' },
    { item: 'Sports, House & Co-Curricular Facilities', amount: 'GH₵ 300.00' },
    { item: 'Terminal Assessment & Report Slip Processing', amount: 'GH₵ 300.00' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Student Financial Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Statement & Receipts</h1>
          <p className="text-slate-600 text-sm mt-1">
            Review your terminal invoice breakdown, verified payment receipts, and balance status.
          </p>
        </div>

        <div>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download Clearance Slip
          </Button>
        </div>
      </div>

      {/* Financial Status Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Terminal Account Status</span>
            <h2 className="text-3xl font-extrabold mt-1">Account Fully Cleared</h2>
            <p className="text-xs text-emerald-100 mt-1">
              All term dues are settled. You are eligible for all terminal examinations and exeat requests.
            </p>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-emerald-500/40 sm:pl-6">
            <span className="text-xs text-emerald-100">Outstanding Balance</span>
            <div className="text-3xl font-extrabold mt-0.5">{feeSummary.outstandingBalance}</div>
            <span className="text-[11px] text-emerald-100">Paid: {feeSummary.totalPaid}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Invoice Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Term 1 Invoice Schedule</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Itemized breakdown approved by the School Board of Governors
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">Billing Item</th>
                    <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{item.item}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{item.amount}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-3 px-4">Total Billed for Term 1</td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-indigo-700">{feeSummary.totalBilled}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment Receipts (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Payment Receipts</CardTitle>
                <Receipt className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {paymentHistory.map((rec) => (
                <div key={rec.receiptNo} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{rec.receiptNo}</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {rec.status}
                    </Badge>
                  </div>
                  <div className="text-emerald-700 font-extrabold text-sm">{rec.amount}</div>
                  <div className="text-slate-600 text-[11px]">{rec.description}</div>
                  <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-200 flex justify-between">
                    <span>{rec.method}</span>
                    <span>{rec.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


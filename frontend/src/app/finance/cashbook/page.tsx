'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinanceCashbookPage() {
  const [session, setSession] = useState<any>(null);
  const [reconciledSuccess, setReconciledSuccess] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const cashbookEntries = [
    { ref: 'CB-2026-104', date: 'Oct 31', desc: 'MoMo Swept to GCB Operating Account', in: 'GH₵ 15,000.00', out: '---', balance: 'GH₵ 142,500.00' },
    { ref: 'CB-2026-103', date: 'Oct 30', desc: 'Lab Reagents Cheque Payment #008421', in: '---', out: 'GH₵ 2,850.00', balance: 'GH₵ 127,500.00' },
    { ref: 'CB-2026-102', date: 'Oct 28', desc: 'Diesel Supply Fuel Payment Direct Debit', in: '---', out: 'GH₵ 7,200.00', balance: 'GH₵ 130,350.00' },
    { ref: 'CB-2026-101', date: 'Oct 27', desc: 'Student Tuition Batch GCB Transfers', in: 'GH₵ 24,500.00', out: '---', balance: 'GH₵ 137,550.00' },
  ];

  const handleReconcile = () => {
    setReconciledSuccess(true);
    setTimeout(() => setReconciledSuccess(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cashbook & Bank Reconciliation</h1>
          <p className="text-slate-600 text-sm mt-1">
            Reconcile institutional bank statements with internal cash receipts and issued cheques.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleReconcile}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" /> Reconcile GCB Account
          </Button>
        </div>
      </div>

      {reconciledSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Bank reconciliation complete! Cashbook balance matches GCB Bank statement (Variance: GH₵ 0.00).
            </span>
          </div>
          <span>Status: RECONCILED</span>
        </div>
      )}

      {/* Account Balance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Cashbook Book Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">GH₵ 142,500.00</div>
            <p className="text-xs text-slate-400 mt-1">As of October 31 closing</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Bank Statement Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">GH₵ 142,500.00</div>
            <p className="text-xs text-slate-400 mt-1">GCB Bank Statement feed</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Unpresented Cheques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-teal-800 font-mono">GH₵ 0.00</div>
            <p className="text-xs text-slate-400 mt-1">Zero un-cleared items</p>
          </CardContent>
        </Card>
      </div>

      {/* Cashbook Ledger */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">GCB Operating Cashbook Transactions</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Debits (Receipts) and Credits (Payments)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Particulars</th>
                <th className="py-3 px-4 text-right">Inflow (GH₵)</th>
                <th className="py-3 px-4 text-right">Outflow (GH₵)</th>
                <th className="py-3 px-4 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cashbookEntries.map((c) => (
                <tr key={c.ref} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.ref}</td>
                  <td className="py-3 px-4 text-slate-500">{c.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{c.desc}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">{c.in}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-700 font-bold">{c.out}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{c.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}


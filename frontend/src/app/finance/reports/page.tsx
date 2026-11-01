'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function FinanceReportsPage() {
  const [session, setSession] = useState<any>(null);
  const [reportType, setReportType] = useState<'income' | 'balanceSheet'>('income');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Reports & Statements</h1>
          <p className="text-slate-600 text-sm mt-1">
            Institutional Income Statement (Profit & Loss), Balance Sheet, and Trial Balance reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Download className="h-4 w-4 mr-1.5" /> Export Stamped PDF
          </Button>
        </div>
      </div>

      {/* Report Switcher */}
      <div className="flex space-x-3 mb-6">
        <Button
          size="sm"
          variant={reportType === 'income' ? 'default' : 'outline'}
          onClick={() => setReportType('income')}
          className={`text-xs ${reportType === 'income' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border-slate-200'}`}
        >
          Statement of Comprehensive Income (P&L)
        </Button>
        <Button
          size="sm"
          variant={reportType === 'balanceSheet' ? 'default' : 'outline'}
          onClick={() => setReportType('balanceSheet')}
          className={`text-xs ${reportType === 'balanceSheet' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'border-slate-200'}`}
        >
          Statement of Financial Position (Balance Sheet)
        </Button>
      </div>

      {reportType === 'income' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Income Statement: Term 1 (2025/2026)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Period Ending October 31, 2026 • Currency in Ghana Cedis (GH₵)
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Audit Ready
            </Badge>
          </CardHeader>

          <CardContent className="p-6 text-xs space-y-6">
            {/* Revenue Section */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                1. Operating Revenue
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700">Gross Student Tuition & Levies Billed</span>
                  <span className="font-mono font-semibold text-slate-900">GH₵ 345,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 text-slate-500">
                  <span>Less: Scholarships & Merit Waivers Awarded</span>
                  <span className="font-mono text-rose-600">(GH₵ 8,050.00)</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-slate-900">
                  <span>Net Operating Revenue</span>
                  <span className="font-mono text-emerald-800 text-sm">GH₵ 336,950.00</span>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                2. Operating Expenditures
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700">Faculty & Staff Compensation (Gross Payroll)</span>
                  <span className="font-mono font-semibold text-slate-900">GH₵ 72,377.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700">Science Lab, Books & Teaching Consumables</span>
                  <span className="font-mono font-semibold text-slate-900">GH₵ 12,400.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700">Utilities (Electricity, Water & Generator Diesel)</span>
                  <span className="font-mono font-semibold text-slate-900">GH₵ 14,200.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700">Campus Maintenance, Sanitation & Repairs</span>
                  <span className="font-mono font-semibold text-slate-900">GH₵ 6,800.00</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-slate-900">
                  <span>Total Operating Expenses</span>
                  <span className="font-mono text-rose-700 text-sm">GH₵ 105,777.00</span>
                </div>
              </div>
            </div>

            {/* Net Surplus */}
            <div className="pt-4 border-t-2 border-slate-300">
              <div className="flex justify-between font-extrabold text-base text-slate-900">
                <span>Net Operational Surplus (Term 1)</span>
                <span className="font-mono text-emerald-700">GH₵ 231,173.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {reportType === 'balanceSheet' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">
              Statement of Financial Position (Balance Sheet)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              As of October 31, 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-xs space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase mb-2 border-b border-slate-200 pb-1">
                Assets
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-700">Cash & Bank Balances (GCB + MoMo)</span>
                  <span className="font-mono font-semibold">GH₵ 189,900.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Student Fee Receivables</span>
                  <span className="font-mono font-semibold">GH₵ 62,500.00</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Assets</span>
                  <span className="font-mono text-sm text-emerald-800">GH₵ 252,400.00</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase mb-2 border-b border-slate-200 pb-1">
                Liabilities & Reserves
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-700">Statutory Remittances Payable (GRA + SSNIT)</span>
                  <span className="font-mono font-semibold">GH₵ 18,177.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Institutional Operating Reserves</span>
                  <span className="font-mono font-semibold">GH₵ 234,223.00</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Liabilities & Equity</span>
                  <span className="font-mono text-sm text-emerald-800">GH₵ 252,400.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}


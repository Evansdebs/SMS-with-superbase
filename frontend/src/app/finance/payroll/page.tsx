'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Download,
  CheckCircle2,
  FileText,
  DollarSign,
  Printer,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinancePayrollPage() {
  const [session, setSession] = useState<any>(null);
  const [payrollProcessed, setPayrollProcessed] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const staffPayroll = [
    {
      id: 'EMP-TCH-001',
      name: 'Mr. Kwame Mensah',
      role: 'Senior Teacher & Head of Science',
      basicSalary: 'GH₵ 4,200.00',
      allowances: 'GH₵ 800.00', // Responsibility + Science Lab
      gross: 'GH₵ 5,000.00',
      ssnit55: 'GH₵ 275.00', // 5.5% employee SSNIT
      payeTax: 'GH₵ 620.00', // GRA PAYE progressive tax
      totalDeductions: 'GH₵ 895.00',
      netPay: 'GH₵ 4,105.00',
      bank: 'GCB Bank - 1041130098',
      status: 'PAID',
    },
    {
      id: 'EMP-TCH-002',
      name: 'Ms. Cynthia Addo',
      role: 'Head of Languages (English)',
      basicSalary: 'GH₵ 3,800.00',
      allowances: 'GH₵ 600.00',
      gross: 'GH₵ 4,400.00',
      ssnit55: 'GH₵ 242.00',
      payeTax: 'GH₵ 510.00',
      totalDeductions: 'GH₵ 752.00',
      netPay: 'GH₵ 3,648.00',
      bank: 'Ecobank Ghana - 00214890',
      status: 'PAID',
    },
    {
      id: 'EMP-TCH-003',
      name: 'Mr. Emmanuel Ofori',
      role: 'Social Studies & Lab Master',
      basicSalary: 'GH₵ 3,200.00',
      allowances: 'GH₵ 400.00',
      gross: 'GH₵ 3,600.00',
      ssnit55: 'GH₵ 198.00',
      payeTax: 'GH₵ 380.00',
      totalDeductions: 'GH₵ 578.00',
      netPay: 'GH₵ 3,022.00',
      bank: 'Standard Chartered - 010042',
      status: 'PAID',
    },
    {
      id: 'EMP-STAFF-001',
      name: 'Grace Darko',
      role: 'Chief Accountant & Bursar',
      basicSalary: 'GH₵ 4,500.00',
      allowances: 'GH₵ 750.00',
      gross: 'GH₵ 5,250.00',
      ssnit55: 'GH₵ 288.75',
      payeTax: 'GH₵ 675.00',
      totalDeductions: 'GH₵ 963.75',
      netPay: 'GH₵ 4,286.25',
      bank: 'Fidelity Bank - 209041',
      status: 'PAID',
    },
  ];

  const handleProcessBatch = () => {
    setPayrollProcessed(true);
    setTimeout(() => setPayrollProcessed(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty & Staff Payroll Management</h1>
          <p className="text-slate-600 text-sm mt-1">
            Configure salary structures, allowances, staff loans, and generate digitized monthly payslips.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleProcessBatch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Send className="h-4 w-4 mr-1.5" /> Process Bank Batch Advice
          </Button>
        </div>
      </div>

      {payrollProcessed && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Monthly payroll processed! GCB Bank electronic salary batch instruction generated and dispatched.
            </span>
          </div>
          <span>Status: BATCH_POSTED</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Total Gross Salaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">GH₵ 72,377.00</div>
            <p className="text-xs text-slate-400 mt-1">18 Full-Time Staff</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Net Disbursed to Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">GH₵ 54,200.00</div>
            <p className="text-xs text-slate-400 mt-1">Direct Bank Wire / MoMo</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Withholdings (GRA + SSNIT)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-700 font-mono">GH₵ 18,177.00</div>
            <p className="text-xs text-slate-400 mt-1">Remitted to Statutory Agencies</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">October 2026 Payroll Master Sheet</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Basic Salary + Allowances - SSNIT (5.5%) - GRA PAYE
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
            Approved by Headmaster
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4 text-right">Basic</th>
                <th className="py-3 px-4 text-right">Allowances</th>
                <th className="py-3 px-4 text-right font-bold text-slate-800">Gross</th>
                <th className="py-3 px-4 text-right text-rose-700">SSNIT (5.5%)</th>
                <th className="py-3 px-4 text-right text-rose-700">GRA PAYE</th>
                <th className="py-3 px-4 text-right font-bold text-emerald-700">Net Pay</th>
                <th className="py-3 px-4 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffPayroll.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{s.id} • {s.role}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{s.basicSalary}</td>
                  <td className="py-3 px-4 text-right font-mono">{s.allowances}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{s.gross}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600">{s.ssnit55}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-600">{s.payeTax}</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-700 text-sm">
                    {s.netPay}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => alert(`Generating confidential payslip PDF for ${s.name}...`)}
                      className="h-7 text-xs text-slate-600 hover:text-slate-900"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}


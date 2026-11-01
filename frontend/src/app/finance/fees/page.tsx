'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Filter,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinanceFeesPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'structures' | 'invoices'>('structures');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const feeStructures = [
    {
      id: 'fs-jhs',
      name: 'Junior High School (JHS 1 - 3) Day Student Scheme',
      level: 'JHS',
      termTotal: 'GH₵ 3,250.00',
      itemsCount: 5,
      studentsBilled: 115,
      status: 'ACTIVE_BILLING',
      items: [
        { name: 'Tuition & Instructional Fee', amount: 'GH₵ 1,800.00' },
        { name: 'Science Laboratory Consumables', amount: 'GH₵ 450.00' },
        { name: 'ICT & Computing Labs', amount: 'GH₵ 400.00' },
        { name: 'Sports & Co-Curricular Levies', amount: 'GH₵ 300.00' },
        { name: 'Assessment & Reports Processing', amount: 'GH₵ 300.00' },
      ],
    },
    {
      id: 'fs-pri',
      name: 'Primary School (Class 1 - 6) Tuition Scheme',
      level: 'PRIMARY',
      termTotal: 'GH₵ 2,650.00',
      itemsCount: 4,
      studentsBilled: 160,
      status: 'ACTIVE_BILLING',
      items: [
        { name: 'Instructional Tuition', amount: 'GH₵ 1,500.00' },
        { name: 'Creative Arts & Reading Kits', amount: 'GH₵ 350.00' },
        { name: 'French & Language Lab', amount: 'GH₵ 300.00' },
        { name: 'Optional Lunch Scheme', amount: 'GH₵ 500.00' },
      ],
    },
    {
      id: 'fs-kg',
      name: 'Kindergarten & Nursery (Early Childhood)',
      level: 'NURSERY',
      termTotal: 'GH₵ 2,100.00',
      itemsCount: 3,
      studentsBilled: 70,
      status: 'ACTIVE_BILLING',
      items: [
        { name: 'Early Childhood Care & Tuition', amount: 'GH₵ 1,400.00' },
        { name: 'Sensory Play & Montessori Kit', amount: 'GH₵ 400.00' },
        { name: 'Campus Pediatric Health Bay', amount: 'GH₵ 300.00' },
      ],
    },
  ];

  const studentInvoices = [
    { invNo: 'INV-2026-001', student: 'Kofi Ansah', class: 'JHS 1 (Gold)', billed: 'GH₵ 3,250.00', paid: 'GH₵ 3,250.00', balance: 'GH₵ 0.00', status: 'PAID' },
    { invNo: 'INV-2026-002', student: 'Akua Ansah', class: 'Primary 5 (Emerald)', billed: 'GH₵ 2,650.00', paid: 'GH₵ 2,300.00', balance: 'GH₵ 350.00', status: 'PARTIAL' },
    { invNo: 'INV-2026-003', student: 'Kwabena Ansah', class: 'Kindergarten 2 (Blue)', billed: 'GH₵ 2,100.00', paid: 'GH₵ 2,100.00', balance: 'GH₵ 0.00', status: 'PAID' },
    { invNo: 'INV-2026-004', student: 'Yaw Boateng', class: 'JHS 1 (Gold)', billed: 'GH₵ 3,250.00', paid: 'GH₵ 2,000.00', balance: 'GH₵ 1,250.00', status: 'PARTIAL' },
    { invNo: 'INV-2026-005', student: 'Abena Mensah', class: 'JHS 2 (Gold)', billed: 'GH₵ 3,250.00', paid: 'GH₵ 3,250.00', balance: 'GH₵ 0.00', status: 'PAID' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Fee Structures & Invoicing</h1>
          <p className="text-slate-600 text-sm mt-1">
            Configure termly tuition fee items, batch generate student billing ledgers, and manage payment deadlines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => alert('Batch generating termly invoices for all enrolled students...')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Batch Bill Students
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('structures')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'structures'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Configured Fee Structures ({feeStructures.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'invoices'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Generated Invoices Ledger</span>
        </button>
      </div>

      {/* Fee Structures View */}
      {activeTab === 'structures' && (
        <div className="space-y-6">
          {feeStructures.map((fs) => (
            <Card key={fs.id} className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {fs.level}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{fs.studentsBilled} Students Billed</span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 mt-1">{fs.name}</CardTitle>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Per Term</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">{fs.termTotal}</span>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {fs.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex justify-between items-center">
                      <span className="text-slate-700 font-medium truncate mr-2">{it.name}</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">{it.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Invoices Ledger View */}
      {activeTab === 'invoices' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Student Terminal Invoices</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Individual billing and ledger reconciliations
              </CardDescription>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search student or invoice #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs bg-slate-50"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4 text-right">Billed Amount</th>
                  <th className="py-3 px-4 text-right">Paid to Date</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentInvoices.map((inv) => (
                  <tr key={inv.invNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{inv.student}</div>
                      <div className="text-[11px] text-slate-500">{inv.class}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">{inv.billed}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">{inv.paid}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{inv.balance}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className={`text-[10px] ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {inv.status}
                      </Badge>
                    </td>
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


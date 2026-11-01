'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Percent,
  Plus,
  Search,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinanceScholarshipsPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const beneficiaries = [
    {
      id: 'sch-01',
      student: 'Kofi Ansah',
      class: 'JHS 1 (Gold)',
      type: 'ACADEMIC_MERIT_SCHOLARSHIP',
      discountPercentage: '100% Tuition Waiver',
      sponsor: 'School Board of Governors Distinction Fund',
      termSavings: 'GH₵ 1,800.00',
      approvedDate: 'Sept 01, 2026',
      status: 'ACTIVE',
    },
    {
      id: 'sch-02',
      student: 'Kwame Nkrumah',
      class: 'JHS 1 (Gold)',
      type: 'STAFF_CHILD_CONCESSION',
      discountPercentage: '50% Tuition Discount',
      sponsor: 'School Faculty Staff Welfare Scheme',
      termSavings: 'GH₵ 900.00',
      approvedDate: 'Sept 01, 2026',
      status: 'ACTIVE',
    },
    {
      id: 'sch-03',
      student: 'Efua Sutherland',
      class: 'JHS 2 (Gold)',
      type: 'NEED_BASED_BURSARY',
      discountPercentage: '75% Tuition Subsidy',
      sponsor: 'Alumni Endowment Trust Ghana',
      termSavings: 'GH₵ 1,350.00',
      approvedDate: 'Aug 20, 2026',
      status: 'ACTIVE',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scholarships, Concessions & Fee Waivers</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage academic merit bursaries, staff child discounts, need-based fee remissions, and alumni sponsorship funds.
          </p>
        </div>

        <div>
          <Button
            onClick={() => alert('Opening award application drawer...')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Award Scholarship / Waiver
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Total Sponsoring Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-700">GH₵ 24,000.00</div>
            <p className="text-xs text-slate-400 mt-1">Annual endowed capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Active Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-slate-900">12 Students</div>
            <p className="text-xs text-slate-400 mt-1">Across Primary & JHS streams</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">Term Waivers Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-teal-800">GH₵ 8,050.00</div>
            <p className="text-xs text-slate-400 mt-1">Deducted from gross fee ledger</p>
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Current Scholarship Beneficiaries</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Approved concessions credited directly to student billing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Scholarship Scheme</th>
                <th className="py-3 px-4">Waiver Level</th>
                <th className="py-3 px-4 text-right">Term Remission</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {beneficiaries.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{b.student}</td>
                  <td className="py-3 px-4 text-slate-600">{b.class}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{b.sponsor}</div>
                    <div className="text-[10px] text-slate-400">{b.type}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {b.discountPercentage}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">{b.termSavings}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">
                      {b.status}
                    </Badge>
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


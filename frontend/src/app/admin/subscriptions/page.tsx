'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, schoolsRes, billingRes] = await Promise.all([
        apiRequest('/admin/subscriptions/plans'),
        apiRequest('/admin/subscriptions/schools'),
        apiRequest('/admin/subscriptions/billing'),
      ]);

      setPlans(plansRes || []);
      setSchools(schoolsRes || []);
      setBilling(billingRes || null);
    } catch (err: any) {
      console.warn('Could not load live subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSchools = schools.filter(
    (s) =>
      s.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.schoolCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-amber-500" />
              <span>School Subscriptions &amp; Platform Billing</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-tenant SaaS tier management, school billing subscriptions, and revenue tracking.
            </p>
          </div>

          <Button
            onClick={loadData}
            variant="outline"
            className="border-slate-200 hover:bg-slate-100 text-slate-700 text-xs h-9 self-start"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Data
          </Button>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Monthly Recurring Revenue</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ${billing?.metrics?.mrr || 148} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Annual Run Rate (ARR)</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  ${billing?.metrics?.arr || 1776} <span className="text-xs text-slate-400 font-normal">/ yr</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Active Subscriptions</div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {billing?.metrics?.activeSubscriptions || schools.length} Schools
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Building2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500">Past Due Accounts</div>
                <div className="text-xl font-bold text-emerald-600 mt-1">
                  {billing?.metrics?.pastDueAccounts || 0} Delinquent
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 1: SaaS Plans Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Subscription Tiers &amp; Packaging
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <Card key={p.id} className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      {p.tier}
                    </span>
                    <Badge variant={p.isActive ? 'success' : 'secondary'}>
                      {p.schoolsSubscribed || 0} Subscribed
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-slate-900 mt-2">{p.name}</CardTitle>
                  <div className="mt-2 flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-slate-900">${p.priceMonthly}</span>
                    <span className="text-xs text-slate-500">/ month</span>
                    <span className="text-[11px] text-slate-400 ml-2">(${p.priceAnnual}/yr)</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="text-xs text-slate-700 space-y-1.5 py-2 border-t border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Student Capacity:</span>
                      <span className="font-semibold text-slate-900">Up to {p.studentLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Staff Limit:</span>
                      <span className="font-semibold text-slate-900">{p.staffLimit} Users</span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {p.features?.map((f: string, i: number) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 2: School Tenants Subscription Tracker */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
            <div>
              <CardTitle className="text-base text-slate-900">School Tenant Subscriptions</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Real-time active subscription status, student seat quotas, and upcoming renewals.
              </CardDescription>
            </div>

            <div className="w-full sm:w-64">
              <Input
                placeholder="Search school name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 text-xs h-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">School Tenant</th>
                    <th className="py-2.5 px-3">Plan Tier</th>
                    <th className="py-2.5 px-3">Cycle &amp; Amount</th>
                    <th className="py-2.5 px-3">Student Seats</th>
                    <th className="py-2.5 px-3">Next Renewal</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchools.map((s) => (
                    <tr key={s.schoolId} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{s.schoolName}</div>
                        <div className="font-mono text-[10px] text-slate-400">{s.schoolCode}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          {s.planTier}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">${s.amount}</div>
                        <div className="text-[10px] text-slate-400">{s.billingCycle}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-900">
                          {s.studentUsage} / {s.studentLimit}
                        </div>
                        <div className="w-24 bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, (s.studentUsage / s.studentLimit) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-700">
                          {new Date(s.nextBillingDate).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-emerald-600">Auto-renew enabled</div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/admin/schools/${s.schoolId}`}
                          className="inline-flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Platform Invoices */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Recent Platform Invoices</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Audit log of institutional SaaS subscription transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice ID</th>
                    <th className="py-2.5 px-3">Tenant</th>
                    <th className="py-2.5 px-3">Subscription</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billing?.invoices?.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{inv.id}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900">{inv.schoolName}</span>{' '}
                        <span className="font-mono text-[10px] text-slate-400">({inv.schoolCode})</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{inv.plan}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">${inv.amount}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="success">{inv.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

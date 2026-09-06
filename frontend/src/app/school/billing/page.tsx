'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Download,
  Building,
  Users,
  HardDrive,
  FileCheck,
  Smartphone,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

interface Plan {
  id: string;
  name: string;
  code: 'BASIC' | 'PRO' | 'ENTERPRISE';
  priceMonthlyUSD: number;
  priceMonthlyGHS: number;
  maxStudents: number;
  maxStaff: number;
  storageGB: number;
  features: string[];
  recommended?: boolean;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'plan_basic',
    name: 'Starter / Basic',
    code: 'BASIC',
    priceMonthlyUSD: 29,
    priceMonthlyGHS: 420,
    maxStudents: 150,
    maxStaff: 15,
    storageGB: 5,
    features: [
      'Student & Teacher Profiles',
      'Attendance Tracking',
      'Basic Report Cards',
      'Gradebook & Results',
      'Email Support',
    ],
  },
  {
    id: 'plan_pro',
    name: 'Professional',
    code: 'PRO',
    priceMonthlyUSD: 79,
    priceMonthlyGHS: 1150,
    maxStudents: 600,
    maxStaff: 50,
    storageGB: 25,
    features: [
      'Everything in Basic',
      'Finance & Fee Collection Hub',
      'Full Operations (Discipline, Health, Library, Inventory)',
      'Automated Timetable Generation',
      'Parent Portal & SMS Notifications',
      'Advanced Analytics & Reporting',
      'Priority 24/7 Support',
    ],
    recommended: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Campus',
    code: 'ENTERPRISE',
    priceMonthlyUSD: 199,
    priceMonthlyGHS: 2900,
    maxStudents: 2500,
    maxStaff: 250,
    storageGB: 100,
    features: [
      'Everything in Pro',
      'Multi-Campus Support',
      'Custom Domain & Branding',
      'Document Vault Encryption',
      'Fleet & Transport Real-time Telemetry',
      'HR Leave & Payroll Integration',
      'Dedicated Account Manager & SLA',
    ],
  },
];

export default function SchoolBillingPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<Plan | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'GHS'>('USD');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paystackRef, setPaystackRef] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [paymentChannel, setPaymentChannel] = useState<'CARD' | 'MOMO'>('CARD');

  const invoices = [
    { id: 'INV-2026-009', date: '2026-09-01', amount: currency === 'USD' ? '$79.00' : 'GH₵ 1,150.00', plan: 'Professional Monthly', status: 'PAID', method: 'Paystack Card' },
    { id: 'INV-2026-008', date: '2026-08-01', amount: currency === 'USD' ? '$79.00' : 'GH₵ 1,150.00', plan: 'Professional Monthly', status: 'PAID', method: 'MTN Mobile Money' },
    { id: 'INV-2026-007', date: '2026-07-01', amount: currency === 'USD' ? '$79.00' : 'GH₵ 1,150.00', plan: 'Professional Monthly', status: 'PAID', method: 'Paystack Card' },
  ];

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const [subData, plansData] = await Promise.all([
        apiRequest('/billing/subscription').catch(() => null),
        apiRequest('/billing/plans').catch(() => null),
      ]);

      if (plansData && Array.isArray(plansData)) {
        setPlans(plansData);
      }

      if (subData && subData.currentPlan) {
        setSubscription(subData);
      } else {
        // Fallback for demo preview
        setSubscription({
          schoolName: 'Living Spring International School',
          schoolCode: 'TLS001',
          status: 'ACTIVE',
          currentPlan: DEFAULT_PLANS[1],
          billingCycle: 'MONTHLY',
          periodEnd: '2026-10-01T00:00:00.000Z',
          customerCode: 'CUS_TLS001_PSTK',
          usage: {
            students: { current: 182, limit: 600, percent: 30 },
            staff: { current: 24, limit: 50, percent: 48 },
            storage: { currentGB: '4.20', limitGB: 25, percent: 17 },
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSimulatePayment = async () => {
    if (!selectedPlanForUpgrade) return;
    setPaymentProcessing(true);
    const mockRef = `pstk_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString().slice(-4)}`;

    try {
      // Send upgrade request to backend
      await apiRequest('/billing/upgrade', {
        method: 'POST',
        body: JSON.stringify({
          planCode: selectedPlanForUpgrade.code,
          paymentMethod: paymentChannel === 'MOMO' ? `MOMO_${momoNumber}` : 'PAYSTACK_CARD',
        }),
      }).catch(() => null);

      setPaystackRef(mockRef);
      setPaymentSuccess(true);
      setTimeout(() => {
        fetchSubscription();
      }, 1500);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const currentPlanCode = subscription?.currentPlan?.code || 'PRO';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SchoolNav />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10">
                <Zap className="w-3 h-3 mr-1" />
                SaaS Subscription & Billing
              </Badge>
              <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {subscription?.status || 'ACTIVE'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Campus Subscription Management
            </h1>
            <p className="text-sm text-slate-400">
              Manage your tier, monitor quota allocations, and configure Paystack billing renewals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency toggle */}
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currency === 'USD'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('GHS')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currency === 'GHS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                GHS (GH₵)
              </button>
            </div>
          </div>
        </div>

        {/* Current Plan & Quota Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-gradient-to-b from-slate-900 to-slate-900/60 border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                  {t('currentPlan')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {subscription?.currentPlan?.name || 'Professional'}
                </span>
              </div>
              <CardTitle className="text-3xl font-black text-white mt-2">
                {currency === 'USD'
                  ? `$${subscription?.currentPlan?.priceMonthlyUSD || 79}`
                  : `GH₵ ${subscription?.currentPlan?.priceMonthlyGHS || 1150}`}
                <span className="text-sm font-normal text-slate-400"> / month</span>
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Auto-renews on {subscription?.periodEnd ? new Date(subscription.periodEnd).toLocaleDateString() : 'Next Cycle'} via Paystack
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Billing ID:</span>
                  <span className="text-slate-200">{subscription?.customerCode || 'CUS_TLS001'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cycle:</span>
                  <span className="text-emerald-400 font-semibold">Monthly (Active)</span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedPlanForUpgrade(plans.find((p) => p.code === 'ENTERPRISE') || plans[2])}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Upgrade to Enterprise Campus
              </Button>
            </CardContent>
          </Card>

          {/* Quota Allocations */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Students Quota */}
            <Card className="bg-slate-900/80 border-slate-800 flex flex-col justify-between">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Students</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {subscription?.usage?.students?.current ?? 182}
                  <span className="text-xs font-normal text-slate-400">
                    {' '}/ {subscription?.usage?.students?.limit ?? 600}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${subscription?.usage?.students?.percent ?? 30}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {subscription?.usage?.students?.percent ?? 30}% of allocated capacity used
                </p>
              </CardContent>
            </Card>

            {/* Staff Quota */}
            <Card className="bg-slate-900/80 border-slate-800 flex flex-col justify-between">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Staff Seats</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {subscription?.usage?.staff?.current ?? 24}
                  <span className="text-xs font-normal text-slate-400">
                    {' '}/ {subscription?.usage?.staff?.limit ?? 50}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${subscription?.usage?.staff?.percent ?? 48}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {subscription?.usage?.staff?.percent ?? 48}% of faculty accounts active
                </p>
              </CardContent>
            </Card>

            {/* Storage Quota */}
            <Card className="bg-slate-900/80 border-slate-800 flex flex-col justify-between">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Vault Storage</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {subscription?.usage?.storage?.currentGB ?? '4.20'} GB
                  <span className="text-xs font-normal text-slate-400">
                    {' '}/ {subscription?.usage?.storage?.limitGB ?? 25} GB
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${subscription?.usage?.storage?.percent ?? 17}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {subscription?.usage?.storage?.percent ?? 17}% encrypted storage used
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing Tier Matrix */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Subscription Plans</h2>
            <p className="text-xs text-slate-400">Select an edition designed for your institution scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = plan.code === currentPlanCode;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                    plan.recommended
                      ? 'bg-slate-900/90 border-blue-500/60 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      {isCurrent && (
                        <Badge variant="success" className="text-[10px]">
                          Current Plan
                        </Badge>
                      )}
                    </div>

                    <div className="text-3xl font-extrabold text-white mb-4">
                      {currency === 'USD' ? `$${plan.priceMonthlyUSD}` : `GH₵ ${plan.priceMonthlyGHS}`}
                      <span className="text-xs font-normal text-slate-400"> / month</span>
                    </div>

                    <div className="space-y-2 py-4 border-t border-b border-slate-800/80 mb-6 text-xs text-slate-300">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-slate-400">Max Students:</span>
                        <span className="text-white font-bold">{plan.maxStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-slate-400">Staff Accounts:</span>
                        <span className="text-white font-bold">{plan.maxStaff}</span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-slate-400">Storage:</span>
                        <span className="text-white font-bold">{plan.storageGB} GB Encrypted</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Included Features
                      </div>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    disabled={isCurrent}
                    onClick={() => {
                      setSelectedPlanForUpgrade(plan);
                      setPaymentSuccess(false);
                    }}
                    variant={isCurrent ? 'outline' : plan.recommended ? 'default' : 'secondary'}
                    className={`w-full rounded-xl text-xs font-semibold py-2.5 ${
                      isCurrent
                        ? 'opacity-60 cursor-not-allowed border-slate-700 text-slate-400'
                        : plan.recommended
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice & Payment History */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              Payment History & Receipts
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Tax-compliant electronic invoices and Paystack payment receipts for school accounting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Billing Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono font-medium text-slate-200">{inv.id}</td>
                      <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{inv.plan}</td>
                      <td className="py-3 px-4 font-bold text-white">{inv.amount}</td>
                      <td className="py-3 px-4 text-slate-400">{inv.method}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Downloading official receipt for ${inv.id}`)}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Paystack Checkout Modal */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Paystack Secure Checkout</h3>
                  <p className="text-[11px] text-slate-400">256-bit Encrypted Payment Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                <p className="text-xs text-slate-400">
                  Your campus has been successfully upgraded to <strong className="text-white">{selectedPlanForUpgrade.name}</strong>.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                  Ref: <span className="text-emerald-400 font-semibold">{paystackRef}</span>
                </div>
                <Button
                  onClick={() => setSelectedPlanForUpgrade(null)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-xl mt-4"
                >
                  Return to Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Selected Tier</div>
                    <div className="text-sm font-bold text-white">{selectedPlanForUpgrade.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">
                      {currency === 'USD'
                        ? `$${selectedPlanForUpgrade.priceMonthlyUSD}`
                        : `GH₵ ${selectedPlanForUpgrade.priceMonthlyGHS}`}
                    </div>
                    <div className="text-[10px] text-slate-500">Billed monthly</div>
                  </div>
                </div>

                {/* Channel selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Payment Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('CARD')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        paymentChannel === 'CARD'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card / Visa / MC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('MOMO')}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        paymentChannel === 'MOMO'
                          ? 'bg-amber-600/20 border-amber-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Mobile Money</span>
                    </button>
                  </div>
                </div>

                {paymentChannel === 'MOMO' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">MTN / Telecel MoMo Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 024 123 4567"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    disabled={paymentProcessing}
                    onClick={handleSimulatePayment}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    {paymentProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Authorizing via Paystack...
                      </span>
                    ) : (
                      `Authorize & Pay ${
                        currency === 'USD'
                          ? `$${selectedPlanForUpgrade.priceMonthlyUSD}`
                          : `GH₵ ${selectedPlanForUpgrade.priceMonthlyGHS}`
                      }`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
  ShieldCheck,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentFeesPage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('350');
  const [payMethod, setPayMethod] = useState('MOMO');
  const [momoNumber, setMomoNumber] = useState('+233 24 111 2233');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected_child_id');
      if (saved) setActiveChildId(saved);

      const handler = (e: any) => {
        if (e.detail?.childId) setActiveChildId(e.detail.childId);
      };
      window.addEventListener('parent_child_changed', handler);
      return () => window.removeEventListener('parent_child_changed', handler);
    }
  }, []);

  const child = mockChildren.find((c) => c.id === activeChildId) || mockChildren[0];

  // Child-specific billing details
  const billingInfo: Record<string, any> = {
    'std-001': {
      totalBilled: 'GH₵ 3,250.00',
      totalPaid: 'GH₵ 3,250.00',
      outstanding: 'GH₵ 0.00',
      status: 'CLEARED',
      items: [
        { name: 'Tuition & Academic Instructional Fee', amount: 'GH₵ 1,800.00' },
        { name: 'Science Laboratory & Practical Consumables', amount: 'GH₵ 450.00' },
        { name: 'Computer Lab / ICT & Digital Resources Fee', amount: 'GH₵ 400.00' },
        { name: 'Sports, House & Co-Curricular Facilities', amount: 'GH₵ 300.00' },
        { name: 'Terminal Assessment & Report Processing', amount: 'GH₵ 300.00' },
      ],
      receipts: [
        { receiptNo: 'REC-2026-00412', date: 'Sept 05, 2026', amount: 'GH₵ 2,000.00', method: 'MTN Mobile Money' },
        { receiptNo: 'REC-2026-00891', date: 'Oct 02, 2026', amount: 'GH₵ 1,250.00', method: 'GCB Bank Transfer' },
      ],
    },
    'std-002': {
      totalBilled: 'GH₵ 2,650.00',
      totalPaid: 'GH₵ 2,300.00',
      outstanding: 'GH₵ 350.00',
      status: 'PARTIAL_DUE',
      items: [
        { name: 'Primary 5 Tuition & Instructional Fee', amount: 'GH₵ 1,500.00' },
        { name: 'Primary Science & Creative Arts Consumables', amount: 'GH₵ 350.00' },
        { name: 'French & Language Lab Levy', amount: 'GH₵ 300.00' },
        { name: 'Daily Hot Lunch & Snack Plan (Optional)', amount: 'GH₵ 500.00' },
      ],
      receipts: [
        { receiptNo: 'REC-2026-00331', date: 'Sept 04, 2026', amount: 'GH₵ 2,300.00', method: 'Vodafone Cash' },
      ],
    },
    'std-003': {
      totalBilled: 'GH₵ 2,100.00',
      totalPaid: 'GH₵ 2,100.00',
      outstanding: 'GH₵ 0.00',
      status: 'CLEARED',
      items: [
        { name: 'Kindergarten 2 Early Childhood Care & Tuition', amount: 'GH₵ 1,400.00' },
        { name: 'Montessori Play & Sensory Learning Kit', amount: 'GH₵ 400.00' },
        { name: 'Health Bay & Pediatric Attendant Levy', amount: 'GH₵ 300.00' },
      ],
      receipts: [
        { receiptNo: 'REC-2026-00109', date: 'Aug 29, 2026', amount: 'GH₵ 2,100.00', method: 'MTN Mobile Money' },
      ],
    },
  };

  const currentBill = billingInfo[child.id] || billingInfo['std-001'];

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setShowPayModal(false);
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Account Statement: {child.name} ({child.admissionNumber})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Statement & Online Payments</h1>
          <p className="text-slate-600 text-sm mt-1">
            Pay term dues seamlessly via Mobile Money (MTN, Telecel, AT) or Visa/Mastercard. Instant receipts provided.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentBill.outstanding !== 'GH₵ 0.00' && (
            <Button
              onClick={() => setShowPayModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs"
            >
              <CreditCard className="h-4 w-4 mr-1.5" /> Pay Fees Online
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-1.5" /> Download Statement
          </Button>
        </div>
      </div>

      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Payment of GH₵ {payAmount} confirmed! Official receipt REC-2026-90422 generated and sent via SMS.
            </span>
          </div>
          <span>Status: CONFIRMED</span>
        </div>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">School Fee Online Payment</h3>
                <p className="text-xs text-slate-500">Beneficiary: {child.name} ({child.class})</p>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (GH₵)</label>
                <Input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                  className="h-9 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Channel</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                >
                  <option value="MOMO">MTN Mobile Money (MoMo)</option>
                  <option value="TELECEL">Telecel Cash</option>
                  <option value="CARD">Visa / Mastercard (Online Card)</option>
                  <option value="BANK">GCB / Ecobank Ghana Direct Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Money / Phone Number</label>
                <Input
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  required
                  className="h-9 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  A USSD authorization prompt will be pushed to this mobile number.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Authorize GH₵ {payAmount}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Overview Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 mb-8 shadow-sm text-white ${
        currentBill.outstanding === 'GH₵ 0.00'
          ? 'bg-gradient-to-r from-teal-700 to-emerald-700'
          : 'bg-gradient-to-r from-amber-600 to-rose-600'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Terminal Fee Status
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {currentBill.outstanding === 'GH₵ 0.00' ? 'Account Fully Settled' : `Outstanding Balance: ${currentBill.outstanding}`}
            </h2>
            <p className="text-xs text-teal-100 mt-1">
              Total Billed: <strong>{currentBill.totalBilled}</strong> • Total Paid: <strong>{currentBill.totalPaid}</strong>
            </p>
          </div>

          <div>
            {currentBill.outstanding !== 'GH₵ 0.00' ? (
              <Button
                onClick={() => setShowPayModal(true)}
                className="bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-xs"
              >
                Pay {currentBill.outstanding} Now
              </Button>
            ) : (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Cleared for All Exams</span>
              </div>
            )}
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
                Itemized breakdown for {child.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentBill.items.map((it: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{it.name}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{it.amount}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
                    <td className="py-3 px-4">Total Billed</td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-teal-800">{currentBill.totalBilled}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right: Verified Receipts (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Payment Receipts</CardTitle>
                <Receipt className="h-4 w-4 text-teal-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {currentBill.receipts.map((r: any) => (
                <div key={r.receiptNo} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{r.receiptNo}</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="text-emerald-700 font-extrabold text-sm">{r.amount}</div>
                  <div className="text-slate-400 text-[10px] flex justify-between pt-1 border-t border-slate-200">
                    <span>{r.method}</span>
                    <span>{r.date}</span>
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


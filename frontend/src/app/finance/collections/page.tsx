'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Printer,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function FinanceCollectionsPage() {
  const [session, setSession] = useState<any>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('Kofi Ansah (JHS 1)');
  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState('MTN_MOMO');
  const [payerName, setPayerName] = useState('Kwame Ansah');
  const [receiptIssued, setReceiptIssued] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [collections, setCollections] = useState([
    {
      receiptNo: 'REC-2026-90422',
      date: 'Today, 11:15 AM',
      student: 'Akua Ansah (P5)',
      payer: 'Mr. Kwame Ansah',
      amount: 'GH₵ 350.00',
      method: 'MTN Mobile Money',
      reference: 'MOMO-REF-984210',
      status: 'VERIFIED',
    },
    {
      receiptNo: 'REC-2026-90421',
      date: 'Today, 10:40 AM',
      student: 'Kofi Mensah (JHS 2)',
      payer: 'Madam Faustina Mensah',
      amount: 'GH₵ 1,200.00',
      method: 'GCB Bank Transfer',
      reference: 'GCB-TX-440192',
      status: 'VERIFIED',
    },
    {
      receiptNo: 'REC-2026-90420',
      date: 'Today, 09:25 AM',
      student: 'Ama Serwaa (JHS 3)',
      payer: 'Dr. Serwaa',
      amount: 'GH₵ 2,450.00',
      method: 'Visa / Mastercard',
      reference: 'CARD-AUTH-88402',
      status: 'VERIFIED',
    },
    {
      receiptNo: 'REC-2026-90419',
      date: 'Today, 08:50 AM',
      student: 'Yaw Boateng (JHS 1)',
      payer: 'Mr. Boateng',
      amount: 'GH₵ 500.00',
      method: 'Bursary Cash Office',
      reference: 'CASH-SLIP-091',
      status: 'VERIFIED',
    },
  ]);

  const handleIssueReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newRec = {
      receiptNo: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      student: selectedStudent,
      payer: payerName,
      amount: `GH₵ ${parseFloat(amount).toFixed(2)}`,
      method: paymentMethod.replace('_', ' '),
      reference: `MANUAL-${Date.now().toString().slice(-6)}`,
      status: 'VERIFIED',
    };

    setCollections([newRec, ...collections]);
    setReceiptIssued(true);
    setShowIssueModal(false);
    setTimeout(() => setReceiptIssued(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Collections, Payments & Official Receipts</h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time fee collection journal, receipt generation, refunds processing, and payment channel reconciliations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowIssueModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Issue Payment Receipt
          </Button>
        </div>
      </div>

      {receiptIssued && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Receipt generated successfully and credited to student's fee ledger!</span>
          </div>
          <span>Status: POSTED</span>
        </div>
      )}

      {/* Modal: Issue Receipt */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Issue Fee Collection Receipt</h3>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueReceipt} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                >
                  <option>Kofi Ansah (JHS 1 Gold - STD2026001)</option>
                  <option>Akua Ansah (P5 Emerald - STD2026048)</option>
                  <option>Yaw Boateng (JHS 1 Gold - STD2026005)</option>
                  <option>Ama Serwaa (JHS 3 Gold - STD2026008)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount Paid (GH₵)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                  >
                    <option value="MTN_MOMO">MTN Mobile Money</option>
                    <option value="TELECEL_CASH">Telecel Cash</option>
                    <option value="GCB_BANK_TRANSFER">GCB Bank Transfer</option>
                    <option value="CASH_OFFICE">Cash Counter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payer Name & Phone</label>
                <Input
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIssueModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Generate Official Receipt
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collections Journal Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Collections Master Register</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Verified receipts issued during Term 1 academic period
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Payer</th>
                <th className="py-3 px-4">Channel & Ref</th>
                <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collections.map((col) => (
                <tr key={col.receiptNo} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{col.receiptNo}</td>
                  <td className="py-3 px-4 text-slate-500">{col.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{col.student}</td>
                  <td className="py-3 px-4 text-slate-600">{col.payer}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="border-slate-200 text-slate-700 bg-slate-50 text-[10px]">
                      {col.method}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                    {col.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => alert(`Printing official duplicate receipt ${col.receiptNo}...`)}
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


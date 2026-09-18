'use client';

import React, { useEffect, useState } from 'react';
import {
  Banknote,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  Search,
  Filter,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'heads' | 'income' | 'banks'>('summary');
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    feeIncome: 145200,
    directIncome: 32450,
    totalIncome: 177650,
    totalExpenses: 89400,
    netCashFlow: 88250,
    currency: 'GHS',
  });

  const [heads, setHeads] = useState<any[]>([]);
  const [incomeList, setIncomeList] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  // Modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  // Forms
  const [incomeForm, setIncomeForm] = useState({
    accountHead: 'INC-102',
    amount: '',
    paymentMethod: 'MOBILE_MONEY',
    payer: '',
    reference: '',
    description: '',
  });

  const [headForm, setHeadForm] = useState({
    name: '',
    code: '',
    type: 'INCOME',
    description: '',
  });

  const [bankForm, setBankForm] = useState({
    accountName: '',
    bankName: 'Ghana Commercial Bank (GCB)',
    accountNumber: '',
    branch: '',
    openingBalance: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sum, h, inc, banks] = await Promise.all([
        apiRequest('/accounting/summary'),
        apiRequest('/accounting/heads'),
        apiRequest('/accounting/income'),
        apiRequest('/accounting/bank-accounts'),
      ]);
      if (sum) setSummary(sum);
      if (h) setHeads(h);
      if (inc) setIncomeList(inc);
      if (banks) setBankAccounts(banks);
    } catch {
      // Fallback Ghanaian sample financial data
      setHeads([
        { id: '1', code: 'INC-101', name: 'Tuition Fee Income', type: 'INCOME', description: 'Core term fees' },
        { id: '2', code: 'INC-102', name: 'Feeding & Canteen Revenue', type: 'INCOME', description: 'Daily meal tickets' },
        { id: '3', code: 'INC-103', name: 'Boarding & Lodging', type: 'INCOME', description: 'Dormitory student fees' },
        { id: '4', code: 'EXP-201', name: 'Staff Salaries & Allowances', type: 'EXPENSE', description: 'Monthly payroll' },
        { id: '5', code: 'EXP-202', name: 'SSNIT Tier 1 & 2 Contributions', type: 'EXPENSE', description: 'Statutory pensions' },
        { id: '6', code: 'EXP-203', name: 'Electricity & Water (ECG/GWCL)', type: 'EXPENSE', description: 'Utility bills' },
      ]);
      setIncomeList([
        { id: '1', receiptNumber: 'INC-00821', accountHead: 'Feeding & Canteen Revenue', amount: 4500, paymentMethod: 'MOBILE_MONEY', payer: 'Nana Akua Catering', incomeDate: new Date().toISOString() },
        { id: '2', receiptNumber: 'INC-00820', accountHead: 'PTA Development Dues', amount: 12800, paymentMethod: 'BANK', payer: 'PTA Secretariat', incomeDate: new Date().toISOString() },
        { id: '3', receiptNumber: 'INC-00819', accountHead: 'Books & Stationery Sales', amount: 3200, paymentMethod: 'CASH', payer: 'Bookstore Storekeeper', incomeDate: new Date().toISOString() },
      ]);
      setBankAccounts([
        { id: '1', bankName: 'GCB Bank PLC', accountName: 'School Operating Account', accountNumber: '1011002345678', branch: 'High Street, Accra', currentBalance: 65400, currency: 'GHS' },
        { id: '2', bankName: 'MTN Mobile Money Merchant', accountName: 'School MoMo Collection', accountNumber: '0240000000', branch: 'Merchant ID: 554210', currentBalance: 22850, currency: 'GHS' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/accounting/income', {
        method: 'POST',
        body: JSON.stringify({
          accountHead: incomeForm.accountHead,
          amount: parseFloat(incomeForm.amount),
          paymentMethod: incomeForm.paymentMethod,
          payer: incomeForm.payer,
          reference: incomeForm.reference,
          description: incomeForm.description,
        }),
      });
      setIsIncomeModalOpen(false);
      setIncomeForm({ accountHead: 'INC-102', amount: '', paymentMethod: 'MOBILE_MONEY', payer: '', reference: '', description: '' });
      loadData();
    } catch {
      alert('Error recording income transaction');
    }
  };

  const handleCreateHead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/accounting/heads', {
        method: 'POST',
        body: JSON.stringify(headForm),
      });
      setIsHeadModalOpen(false);
      setHeadForm({ name: '', code: '', type: 'INCOME', description: '' });
      loadData();
    } catch {
      alert('Error adding account head');
    }
  };

  const handleCreateBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/accounting/bank-accounts', {
        method: 'POST',
        body: JSON.stringify({
          ...bankForm,
          openingBalance: parseFloat(bankForm.openingBalance || '0'),
        }),
      });
      setIsBankModalOpen(false);
      setBankForm({ accountName: '', bankName: 'Ghana Commercial Bank (GCB)', accountNumber: '', branch: '', openingBalance: '' });
      loadData();
    } catch {
      alert('Error adding bank account');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  School Accounting & Cash Flow
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Chart of accounts, general ledger income, bank accounts & financial statements (Ghana Cedis)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsHeadModalOpen(true)}
              className="gap-2 border-slate-300 dark:border-slate-700"
            >
              <Plus className="h-4 w-4" /> Add Account Head
            </Button>
            <Button
              onClick={() => setIsIncomeModalOpen(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <ArrowDownRight className="h-4 w-4" /> Record Income
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Income
                </span>
                <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                  <ArrowDownRight className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-3">
                GH₵ {summary.totalIncome?.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-600 font-medium">
                Tuition + Canteen + Dues
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Expenses
                </span>
                <span className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-lg">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-3">
                GH₵ {summary.totalExpenses?.toLocaleString()}
              </p>
              <span className="text-xs text-rose-600 font-medium">
                Salaries, Utilities, ECG
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Net Cash Flow
                </span>
                <span className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-3">
                GH₵ {summary.netCashFlow?.toLocaleString()}
              </p>
              <span className="text-xs text-blue-500 font-medium">
                Operating Surplus
              </span>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bank & MoMo
                </span>
                <span className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-lg">
                  <Building2 className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-3">
                {bankAccounts.length} Accounts
              </p>
              <span className="text-xs text-amber-600 font-medium">
                GCB, Ecobank, MTN MoMo
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Ledger Overview
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'income'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Income Transactions ({incomeList.length})
          </button>
          <button
            onClick={() => setActiveTab('heads')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'heads'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Chart of Accounts ({heads.length})
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'banks'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Bank Accounts & Wallets ({bankAccounts.length})
          </button>
        </div>

        {/* TAB 1: LEDGER OVERVIEW */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Direct Incomes</CardTitle>
                  <CardDescription>Direct cash receipts, sales and miscellaneous revenue</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {incomeList.slice(0, 5).map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.accountHead}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 font-mono">
                              {item.receiptNumber || 'REC-DIRECT'}
                            </Badge>
                            <span className="text-xs text-slate-500">Payer: {item.payer || 'Anonymous'}</span>
                            <span className="text-xs text-slate-400">• {item.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">+ GH₵ {item.amount?.toLocaleString()}</p>
                          <span className="text-xs text-slate-400">
                            {new Date(item.incomeDate).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side column: Bank summaries */}
            <div className="space-y-6">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    School Bank Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bankAccounts.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{b.bankName}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{b.accountNumber} ({b.accountName})</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Current Balance:</span>
                        <span className="font-bold text-emerald-600">GH₵ {b.currentBalance?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => setIsBankModalOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Bank Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: INCOME TRANSACTIONS */}
        {activeTab === 'income' && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Income Transactions</CardTitle>
                <CardDescription>Verified income entries recorded in the financial ledger</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsIncomeModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Record New Income
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3">Receipt #</th>
                      <th className="px-5 py-3">Account Head</th>
                      <th className="px-5 py-3">Payer</th>
                      <th className="px-5 py-3">Method</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {incomeList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                          {tx.receiptNumber || 'REC-DIR'}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          {tx.accountHead}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                          {tx.payer || 'Walk-in'}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="outline" className="text-xs uppercase">
                            {tx.paymentMethod}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          GH₵ {tx.amount?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">
                          {new Date(tx.incomeDate).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: CHART OF ACCOUNTS */}
        {activeTab === 'heads' && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Standard Chart of Accounts</CardTitle>
                <CardDescription>General ledger account heads classified by Income, Expense, and Asset</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsHeadModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Account Code
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3">Code</th>
                      <th className="px-5 py-3">Account Title</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {heads.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {h.code}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-slate-100">
                          {h.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            className={`text-xs ${
                              h.type === 'INCOME'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : h.type === 'EXPENSE'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}
                          >
                            {h.type}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                          {h.description || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: BANK ACCOUNTS */}
        {activeTab === 'banks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => (
              <Card key={account.id} className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{account.bankName}</CardTitle>
                  <CardDescription>{account.accountName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Account #:</span>
                    <span className="font-mono font-medium">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Branch:</span>
                    <span>{account.branch || 'Head Office'}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs uppercase font-bold text-slate-400">Available Balance</span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      GH₵ {account.currentBalance?.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card
              onClick={() => setIsBankModalOpen(true)}
              className="border-dashed border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 cursor-pointer flex flex-col items-center justify-center p-8 text-center transition"
            >
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-full text-emerald-600 mb-3">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Register New Account</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Add GCB, Ecobank, Stanbic or MTN MoMo merchant wallet
              </p>
            </Card>
          </div>
        )}

        {/* MODAL: RECORD INCOME */}
        <Modal
          isOpen={isIncomeModalOpen}
          onClose={() => setIsIncomeModalOpen(false)}
          title="Record Income Transaction"
        >
          <form onSubmit={handleRecordIncome} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Account Category</label>
              <select
                value={incomeForm.accountHead}
                onChange={(e) => setIncomeForm({ ...incomeForm, accountHead: e.target.value })}
                className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                {heads.filter((h) => h.type === 'INCOME').map((h) => (
                  <option key={h.id} value={h.name}>{h.name} ({h.code})</option>
                ))}
                <option value="Feeding & Canteen Revenue">Feeding & Canteen Revenue</option>
                <option value="PTA Development Dues">PTA Development Dues</option>
                <option value="Books & Stationery Sales">Books & Stationery Sales</option>
                <option value="Uniforms Sales">Uniforms Sales</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Amount (GH₵)</label>
              <Input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 2500"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Payment Channel</label>
                <select
                  value={incomeForm.paymentMethod}
                  onChange={(e) => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value })}
                  className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="MOBILE_MONEY">MTN / Telecel MoMo</option>
                  <option value="BANK">Bank Deposit / Transfer</option>
                  <option value="CASH">Cash at Counter</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Payer Name / Source</label>
                <Input
                  placeholder="e.g. PTA Treasurer"
                  value={incomeForm.payer}
                  onChange={(e) => setIncomeForm({ ...incomeForm, payer: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Transaction Reference / Description</label>
              <Input
                placeholder="e.g. MoMo Ref #001239 or Term 1 Canteen Collection"
                value={incomeForm.reference}
                onChange={(e) => setIncomeForm({ ...incomeForm, reference: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsIncomeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save & Post to Ledger
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: ADD ACCOUNT HEAD */}
        <Modal
          isOpen={isHeadModalOpen}
          onClose={() => setIsHeadModalOpen(false)}
          title="Add Chart of Account Head"
        >
          <form onSubmit={handleCreateHead} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Account Title</label>
              <Input
                required
                placeholder="e.g. Science Laboratory Fees"
                value={headForm.name}
                onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Account Code</label>
                <Input
                  required
                  placeholder="e.g. INC-107"
                  value={headForm.code}
                  onChange={(e) => setHeadForm({ ...headForm, code: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Classification</label>
                <select
                  value={headForm.type}
                  onChange={(e) => setHeadForm({ ...headForm, type: e.target.value })}
                  className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="INCOME">INCOME</option>
                  <option value="EXPENSE">EXPENSE</option>
                  <option value="ASSET">ASSET</option>
                  <option value="LIABILITY">LIABILITY</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
              <Input
                placeholder="Purpose of this financial category"
                value={headForm.description}
                onChange={(e) => setHeadForm({ ...headForm, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsHeadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Create Account Head
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: ADD BANK ACCOUNT */}
        <Modal
          isOpen={isBankModalOpen}
          onClose={() => setIsBankModalOpen(false)}
          title="Register Bank Account or Wallet"
        >
          <form onSubmit={handleCreateBank} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Bank / Provider</label>
              <Input
                required
                placeholder="e.g. GCB Bank, Ecobank, CalBank, MTN MoMo"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Account Name</label>
              <Input
                required
                placeholder="e.g. Achimota Preparatory School - Operations"
                value={bankForm.accountName}
                onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Account / Mobile #</label>
                <Input
                  required
                  placeholder="e.g. 1011002345678"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Branch</label>
                <Input
                  placeholder="e.g. Spintex Road Branch"
                  value={bankForm.branch}
                  onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Opening Balance (GH₵)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={bankForm.openingBalance}
                onChange={(e) => setBankForm({ ...bankForm, openingBalance: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsBankModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Register Bank Account
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

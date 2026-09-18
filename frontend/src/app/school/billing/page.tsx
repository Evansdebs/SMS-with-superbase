'use client';

import { useState, useEffect, useCallback } from 'react';
import { Receipt, Plus, RefreshCw, AlertTriangle, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

interface Bill {
  id: string;
  student: { firstName: string; lastName: string; admissionNumber: string; class?: { name: string; stream: string } };
  feeCategory: { name: string };
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
  dueDate: string;
  term: string;
  academicYear: string;
}

interface FeeCategory { id: string; name: string; frequency: string; }
interface FeeSummary {
  counts: { total: number; paid: number; partial: number; pending: number };
  financials: { totalExpected: number; totalCollected: number; totalOutstanding: number; collectionRate: number };
}

const STATUS_VARIANT: Record<string, any> = { PAID: 'success', PARTIAL: 'warning', PENDING: 'destructive' };

export default function BillingPage() {
  const [tab, setTab] = useState<'bills' | 'categories' | 'debtors'>('bills');
  const [bills, setBills] = useState<Bill[]>([]);
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [debtors, setDebtors] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [termFilter, setTermFilter] = useState('Term 1');
  const [yearFilter, setYearFilter] = useState('2025/2026');
  const [genForm, setGenForm] = useState({ feeCategoryId: '', amount: '', dueDate: '', academicYear: '2025/2026', term: 'Term 1', classId: '' });
  const [catForm, setCatForm] = useState({ name: '', description: '', frequency: 'TERMLY' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [billsRes, catsRes, debtorsRes, summaryRes] = await Promise.allSettled([
        apiRequest(`/fees/bills?term=${encodeURIComponent(termFilter)}&academicYear=${encodeURIComponent(yearFilter)}`),
        apiRequest('/fees/categories'),
        apiRequest(`/fees/debtors?term=${encodeURIComponent(termFilter)}&academicYear=${encodeURIComponent(yearFilter)}`),
        apiRequest('/fees/summary'),
      ]);
      if (billsRes.status === 'fulfilled') setBills(Array.isArray(billsRes.value) ? billsRes.value : []);
      if (catsRes.status === 'fulfilled') setCategories(Array.isArray(catsRes.value) ? catsRes.value : []);
      if (debtorsRes.status === 'fulfilled') setDebtors(Array.isArray(debtorsRes.value) ? debtorsRes.value : []);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
    } finally { setLoading(false); }
  }, [termFilter, yearFilter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const result = await apiRequest('/fees/bills/generate', { method: 'POST', body: JSON.stringify({ ...genForm, amount: parseFloat(genForm.amount) }) });
      alert(`✅ ${result.message}`);
      setShowGenerate(false);
      fetchAll();
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiRequest('/fees/categories', { method: 'POST', body: JSON.stringify(catForm) });
      setShowCategory(false);
      setCatForm({ name: '', description: '', frequency: 'TERMLY' });
      fetchAll();
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const fmt = (n: number) => `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;

  const summaryCards = summary ? [
    { label: 'Total Expected', value: fmt(summary.financials.totalExpected), icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'Collected', value: fmt(summary.financials.totalCollected), icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Outstanding', value: fmt(summary.financials.totalOutstanding), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
    { label: 'Collection Rate', value: `${summary.financials.collectionRate}%`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-indigo-500" /> Billing & Debtors
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage student bills, fee categories, and outstanding balances</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => setShowCategory(true)}><Plus className="h-4 w-4 mr-1" />Fee Category</Button>
          <Button onClick={() => setShowGenerate(true)}><Plus className="h-4 w-4 mr-2" />Generate Bills</Button>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                  <div><div className="text-lg font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Period Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="border rounded-md px-3 py-2 text-sm bg-background" value={termFilter} onChange={(e) => setTermFilter(e.target.value)}>
          <option>Term 1</option><option>Term 2</option><option>Term 3</option>
        </select>
        <select className="border rounded-md px-3 py-2 text-sm bg-background" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option>2025/2026</option><option>2024/2025</option><option>2023/2024</option>
        </select>
        <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['bills', 'categories', 'debtors'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t === 'bills' ? '📋 Student Bills' : t === 'categories' ? '🏷️ Fee Categories' : <>⚠️ Debtors {debtors.length > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5">{debtors.length}</span>}</>}
          </button>
        ))}
      </div>

      {/* Bills */}
      {tab === 'bills' && (
        <Card>
          <CardContent className="p-0">
            {loading ? <div className="flex items-center justify-center py-16 text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mr-2" />Loading bills…</div>
              : bills.length === 0 ? <div className="py-16 text-center text-muted-foreground"><p>No bills found for this period.</p><Button size="sm" className="mt-3" onClick={() => setShowGenerate(true)}>Generate Bills</Button></div>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                      <tr>{['Student','Class','Category','Amount','Paid','Balance','Status','Due Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {bills.map((b) => (
                        <tr key={b.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3"><div className="font-semibold">{b.student.firstName} {b.student.lastName}</div><div className="text-xs text-muted-foreground">{b.student.admissionNumber}</div></td>
                          <td className="px-4 py-3 text-muted-foreground">{b.student.class?.name || '—'}</td>
                          <td className="px-4 py-3">{b.feeCategory.name}</td>
                          <td className="px-4 py-3">{fmt(b.amount)}</td>
                          <td className="px-4 py-3 text-emerald-600">{fmt(b.paidAmount)}</td>
                          <td className={`px-4 py-3 font-bold ${b.balance > 0 ? 'text-red-500' : 'text-emerald-600'}`}>{fmt(b.balance)}</td>
                          <td className="px-4 py-3"><Badge variant={STATUS_VARIANT[b.status] || 'secondary'}>{b.status}</Badge></td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{b.dueDate ? new Date(b.dueDate).toLocaleDateString('en-GH') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <Card>
          <CardContent className="p-0">
            {categories.length === 0 ? <div className="py-16 text-center text-muted-foreground"><p>No fee categories yet.</p><Button size="sm" className="mt-3" onClick={() => setShowCategory(true)}>Create Category</Button></div>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                      <tr>{['Category Name','Frequency'].map((h) => <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-semibold">{c.name}</td>
                          <td className="px-4 py-3"><Badge variant="secondary">{c.frequency}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Debtors */}
      {tab === 'debtors' && (
        <Card>
          <CardContent className="p-0">
            {debtors.length === 0
              ? <div className="py-16 text-center text-emerald-600 font-medium">🎉 No outstanding debtors for this period!</div>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/40">
                      <tr>{['Student','Class','Category','Balance Owed','Due Date'].map((h) => <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {debtors.map((d) => (
                        <tr key={d.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3"><div className="font-semibold">{d.student.firstName} {d.student.lastName}</div><div className="text-xs text-muted-foreground">{d.student.admissionNumber}</div></td>
                          <td className="px-4 py-3 text-muted-foreground">{d.student.class?.name || '—'}</td>
                          <td className="px-4 py-3">{d.feeCategory.name}</td>
                          <td className="px-4 py-3 font-bold text-red-500 text-base">{fmt(d.balance)}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-GH') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Generate Bills Modal */}
      {showGenerate && (
        <Modal isOpen={showGenerate} onClose={() => setShowGenerate(false)} title="Generate Student Bills">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Fee Category *</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" required value={genForm.feeCategoryId} onChange={(e) => setGenForm({ ...genForm, feeCategoryId: e.target.value })}>
                <option value="">— Select Category —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium mb-1 block">Amount (GHS) *</label><Input type="number" required value={genForm.amount} onChange={(e) => setGenForm({ ...genForm, amount: e.target.value })} /></div>
            <div><label className="text-xs font-medium mb-1 block">Due Date *</label><Input type="date" required value={genForm.dueDate} onChange={(e) => setGenForm({ ...genForm, dueDate: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block">Term</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={genForm.term} onChange={(e) => setGenForm({ ...genForm, term: e.target.value })}>
                  <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                </select>
              </div>
              <div><label className="text-xs font-medium mb-1 block">Academic Year</label><Input value={genForm.academicYear} onChange={(e) => setGenForm({ ...genForm, academicYear: e.target.value })} /></div>
            </div>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 p-3 text-xs text-indigo-700 dark:text-indigo-400">
              Bills will be generated for all active students. Duplicates are skipped automatically.
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setShowGenerate(false)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>{actionLoading ? 'Generating…' : 'Generate Bills'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* New Category Modal */}
      {showCategory && (
        <Modal isOpen={showCategory} onClose={() => setShowCategory(false)} title="New Fee Category">
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div><label className="text-xs font-medium mb-1 block">Category Name *</label><Input required placeholder="e.g. School Fees, PTA Levy" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} /></div>
            <div><label className="text-xs font-medium mb-1 block">Description</label><Input value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} /></div>
            <div>
              <label className="text-xs font-medium mb-1 block">Frequency</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={catForm.frequency} onChange={(e) => setCatForm({ ...catForm, frequency: e.target.value })}>
                <option value="TERMLY">Termly</option><option value="ANNUAL">Annual</option><option value="MONTHLY">Monthly</option><option value="ONE_TIME">One-Time</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setShowCategory(false)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>{actionLoading ? 'Saving…' : 'Create Category'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

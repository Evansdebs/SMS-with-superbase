'use client';

import { useState, useEffect, useCallback } from 'react';
import { Banknote, Plus, RefreshCw, PlayCircle, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';

interface PayrollPeriod {
  id: string;
  month: number;
  year: number;
  status: string;
  totalGross?: number;
  totalPaye?: number;
  totalSsnit?: number;
  totalNet?: number;
  _count?: { payslips: number };
}

interface SalaryStructure {
  id: string;
  staffId: string;
  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  ssnitNumber?: string;
  tinNumber?: string;
  bankName?: string;
  accountNumber?: string;
  staff: { id: string; firstName: string; lastName: string; employeeId: string; role: string };
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STATUS_VARIANT: Record<string, string> = {
  DRAFT: 'secondary',
  REVIEW: 'warning',
  APPROVED: 'default',
  FINALIZED: 'success',
  LOCKED: 'purple',
};

const STATUS_FLOW: Record<string, string> = {
  DRAFT: 'REVIEW',
  REVIEW: 'APPROVED',
  APPROVED: 'FINALIZED',
  FINALIZED: 'LOCKED',
};

export default function PayrollPage() {
  const [tab, setTab] = useState<'periods' | 'salaries'>('periods');
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [salaries, setSalaries] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showNewPeriod, setShowNewPeriod] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [newPeriod, setNewPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/hr/payroll/periods');
      setPeriods(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, []);

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/hr/salary-structures');
      setSalaries(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (tab === 'periods') fetchPeriods();
    else fetchSalaries();
  }, [tab, fetchPeriods, fetchSalaries]);

  const handleCreatePeriod = async () => {
    setActionLoading(true);
    try {
      await apiRequest('/hr/payroll/periods', { method: 'POST', body: JSON.stringify(newPeriod) });
      setShowNewPeriod(false);
      fetchPeriods();
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const handleRunPayroll = async (periodId: string) => {
    if (!confirm('Compute payroll? This calculates PAYE and SSNIT for all configured staff.')) return;
    setActionLoading(true);
    try {
      const result = await apiRequest(`/hr/payroll/periods/${periodId}/run`, { method: 'POST' });
      alert(`✅ Payroll computed for ${result.totalStaff} staff members`);
      fetchPeriods();
      setSelectedPeriod(null);
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const handleAdvanceStatus = async (periodId: string, nextStatus: string) => {
    setActionLoading(true);
    try {
      await apiRequest(`/hr/payroll/periods/${periodId}/status`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
      fetchPeriods();
      setSelectedPeriod(null);
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const handleGeneratePayslips = async (periodId: string) => {
    setActionLoading(true);
    try {
      const result = await apiRequest(`/hr/payroll/periods/${periodId}/payslips`, { method: 'POST' });
      alert(`✅ Generated ${result.generated} payslips`);
      fetchPeriods();
    } catch (e: any) { alert(e?.message); }
    finally { setActionLoading(false); }
  };

  const fmt = (n?: number) => n != null ? `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` : '—';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Banknote className="h-6 w-6 text-violet-500" /> Payroll Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Ghana PAYE & SSNIT compliant payroll processing</p>
        </div>
        {tab === 'periods' && (
          <Button onClick={() => setShowNewPeriod(true)}><Plus className="h-4 w-4 mr-2" />New Pay Period</Button>
        )}
      </div>

      {/* Ghana Payroll Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20">
        {[
          { label: 'PAYE Bands', value: '6 bands • 0%–30%' },
          { label: 'SSNIT Tier 1 (Employer)', value: '13.5% of gross' },
          { label: 'SSNIT Tier 2 (Employee)', value: '5.5% of gross' },
          { label: 'Tax-Free Band', value: 'GHS 490 / month' },
        ].map((i) => (
          <div key={i.label} className="text-center">
            <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">{i.label}</div>
            <div className="text-sm font-bold text-violet-800 dark:text-violet-300 mt-0.5">{i.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['periods', 'salaries'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'periods' ? '📅 Pay Periods' : '💰 Salary Structures'}
          </button>
        ))}
      </div>

      {/* Pay Periods */}
      {tab === 'periods' && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Pay Periods</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mr-2" />Loading…</div>
            ) : periods.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
                <Banknote className="h-12 w-12 opacity-30" />
                <p>No payroll periods yet. Create one to start.</p>
                <Button size="sm" onClick={() => setShowNewPeriod(true)}><Plus className="h-4 w-4 mr-1" />Create Period</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      {['Period', 'Status', 'Gross Payroll', 'PAYE Tax', 'SSNIT', 'Net Payroll', 'Payslips', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {periods.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold">{MONTHS[p.month - 1]} {p.year}</td>
                        <td className="px-4 py-3"><Badge variant={(STATUS_VARIANT[p.status] as any) || 'secondary'}>{p.status}</Badge></td>
                        <td className="px-4 py-3 text-muted-foreground">{fmt(p.totalGross)}</td>
                        <td className="px-4 py-3 text-amber-600 font-medium">{fmt(p.totalPaye)}</td>
                        <td className="px-4 py-3 text-violet-600 font-medium">{fmt(p.totalSsnit)}</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">{fmt(p.totalNet)}</td>
                        <td className="px-4 py-3 text-center">{p._count?.payslips ?? 0}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPeriod(p)}>
                            Manage <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Salary Structures */}
      {tab === 'salaries' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Staff Salary Structures</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground"><RefreshCw className="h-5 w-5 animate-spin mr-2" />Loading…</div>
            ) : salaries.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <p>No salary structures configured.</p>
                <p className="text-xs mt-1">Add salary details in Staff profiles to enable payroll computation.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      {['Staff','Employee ID','Role','Basic Salary','Housing','Transport','Est. Gross','SSNIT No.','Bank'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {salaries.map((s) => {
                      const gross = (s.basicSalary||0) + (s.housingAllowance||0) + (s.transportAllowance||0) + (s.otherAllowances||0);
                      return (
                        <tr key={s.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-semibold">{s.staff.firstName} {s.staff.lastName}</td>
                          <td className="px-4 py-3 font-mono text-xs text-indigo-500">{s.staff.employeeId}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.staff.role}</td>
                          <td className="px-4 py-3">{fmt(s.basicSalary)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(s.housingAllowance)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{fmt(s.transportAllowance)}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">{fmt(gross)}</td>
                          <td className="px-4 py-3 font-mono text-xs">{s.ssnitNumber || '—'}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.bankName || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New Period Modal */}
      {showNewPeriod && (
        <Modal isOpen={showNewPeriod} onClose={() => setShowNewPeriod(false)} title="Create Pay Period">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">Month</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={newPeriod.month} onChange={(e) => setNewPeriod({ ...newPeriod, month: parseInt(e.target.value) })}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Year</label>
              <Input type="number" value={newPeriod.year} onChange={(e) => setNewPeriod({ ...newPeriod, year: parseInt(e.target.value) })} />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t">
              <Button variant="outline" onClick={() => setShowNewPeriod(false)}>Cancel</Button>
              <Button onClick={handleCreatePeriod} disabled={actionLoading}>{actionLoading ? 'Creating…' : 'Create Period'}</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manage Period Modal */}
      {selectedPeriod && (
        <Modal isOpen={!!selectedPeriod} onClose={() => setSelectedPeriod(null)} title={`${MONTHS[selectedPeriod.month - 1]} ${selectedPeriod.year} Payroll`}>
          <div className="space-y-4">
            {/* Summary grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Gross Payroll', value: fmt(selectedPeriod.totalGross), color: 'text-indigo-600' },
                { label: 'PAYE Tax', value: fmt(selectedPeriod.totalPaye), color: 'text-amber-600' },
                { label: 'SSNIT (Employee)', value: fmt(selectedPeriod.totalSsnit), color: 'text-violet-600' },
                { label: 'Net Payroll', value: fmt(selectedPeriod.totalNet), color: 'text-emerald-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border p-3 text-center bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                  <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              {selectedPeriod.status === 'DRAFT' && (
                <Button className="w-full" onClick={() => handleRunPayroll(selectedPeriod.id)} disabled={actionLoading}>
                  <PlayCircle className="h-4 w-4 mr-2" /> Compute Payroll (PAYE + SSNIT)
                </Button>
              )}
              {STATUS_FLOW[selectedPeriod.status] && (
                <Button variant="outline" className="w-full" onClick={() => handleAdvanceStatus(selectedPeriod.id, STATUS_FLOW[selectedPeriod.status])} disabled={actionLoading}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Advance to {STATUS_FLOW[selectedPeriod.status]}
                </Button>
              )}
              {['APPROVED','FINALIZED','LOCKED'].includes(selectedPeriod.status) && (
                <Button variant="outline" className="w-full" onClick={() => handleGeneratePayslips(selectedPeriod.id)} disabled={actionLoading}>
                  <FileText className="h-4 w-4 mr-2" /> Generate Payslips
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Plus, Search, CheckCircle2, XCircle, Clock, Users,
  ChevronRight, UserPlus, Filter, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

interface Admission {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  guardianName: string;
  guardianPhone: string;
  applyingForClass?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  submitted: number;
  underReview: number;
  accepted: number;
  rejected: number;
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'secondary',
  SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  SHORTLISTED: 'purple',
  ACCEPTED: 'success',
  REJECTED: 'destructive',
  WAITLISTED: 'orange',
  WITHDRAWN: 'secondary',
};

const STATUS_FLOW: Record<string, string[]> = {
  DRAFT: ['SUBMITTED', 'WITHDRAWN'],
  SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN'],
  UNDER_REVIEW: ['SHORTLISTED', 'REJECTED', 'WAITLISTED'],
  SHORTLISTED: ['ACCEPTED', 'REJECTED'],
  WAITLISTED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['WITHDRAWN'],
  REJECTED: [],
  WITHDRAWN: [],
};

const EMPTY_FORM = {
  firstName: '', lastName: '', dateOfBirth: '', gender: 'MALE', nationality: 'Ghanaian',
  previousSchool: '', applyingForClass: '', guardianName: '', guardianPhone: '',
  guardianEmail: '', guardianAddress: '', guardianRelationship: 'PARENT',
  medicalConditions: '', applicationFee: '',
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Admission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appsRes, statsRes] = await Promise.allSettled([
        apiRequest(`/admissions?search=${encodeURIComponent(search)}&status=${filterStatus}&limit=50`),
        apiRequest('/admissions/stats'),
      ]);
      if (appsRes.status === 'fulfilled') setAdmissions(appsRes.value?.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    } catch (e: any) {
      setError(e?.message || 'Failed to load admissions data');
    } finally { setLoading(false); }
  }, [search, filterStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiRequest('/admissions', {
        method: 'POST',
        body: JSON.stringify({ ...form, applicationFee: parseFloat(form.applicationFee) || 0 }),
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (e: any) {
      alert(`Error: ${e?.message || 'Failed to create application'}`);
    } finally { setActionLoading(false); }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      await apiRequest(`/admissions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      fetchData();
      setSelectedApp(null);
    } catch (e: any) {
      alert(`Error: ${e?.message}`);
    } finally { setActionLoading(false); }
  };

  const handleConvert = async (id: string) => {
    if (!confirm('Convert this accepted applicant to an enrolled student? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      const result = await apiRequest(`/admissions/${id}/convert-to-student`, { method: 'POST' });
      alert(`✅ ${result.message}`);
      fetchData();
      setSelectedApp(null);
    } catch (e: any) {
      alert(`Error: ${e?.message}`);
    } finally { setActionLoading(false); }
  };

  const statCards = stats ? [
    { label: 'Total Applications', value: stats.total, icon: ClipboardList, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'Submitted', value: stats.submitted, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Under Review', value: stats.underReview, icon: Search, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-500" />
            Admissions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage student applications and enrolment pipeline</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Application
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 text-sm text-amber-700 dark:text-amber-400">
          ⚠️ {error} — Backend may be initialising or credentials are needed.
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, application no, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background text-foreground min-w-[160px]"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {['DRAFT','SUBMITTED','UNDER_REVIEW','SHORTLISTED','ACCEPTED','REJECTED','WAITLISTED','WITHDRAWN'].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Applications ({admissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Loading applications…
            </div>
          ) : admissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <ClipboardList className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-muted-foreground">No applications found.</p>
              <Button size="sm" onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" />Add First Application</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40">
                  <tr>
                    {['App No.', 'Applicant', 'Class', 'Guardian', 'Phone', 'Status', 'Date', ''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {admissions.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-500 dark:text-indigo-400">{app.applicationNumber}</td>
                      <td className="px-4 py-3 font-semibold">{app.firstName} {app.lastName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.applyingForClass || '—'}</td>
                      <td className="px-4 py-3">{app.guardianName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.guardianPhone}</td>
                      <td className="px-4 py-3">
                        <Badge variant={(STATUS_BADGE[app.status] as any) || 'secondary'}>
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(app.createdAt).toLocaleDateString('en-GH')}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
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

      {/* New Application Modal */}
      {showForm && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Admission Application">
          <form onSubmit={handleCreate} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Applicant Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium mb-1 block">First Name *</label><Input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Last Name *</label><Input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Date of Birth</label><Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Gender</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="MALE">Male</option><option value="FEMALE">Female</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium mb-1 block">Nationality</label><Input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Applying For Class</label><Input placeholder="e.g. JHS 1" value={form.applyingForClass} onChange={(e) => setForm({ ...form, applyingForClass: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Previous School</label><Input value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Application Fee (GHS)</label><Input type="number" value={form.applicationFee} onChange={(e) => setForm({ ...form, applicationFee: e.target.value })} /></div>
                <div className="col-span-2"><label className="text-xs font-medium mb-1 block">Medical Conditions</label><Input placeholder="Any known conditions or allergies" value={form.medicalConditions} onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })} /></div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Guardian / Parent Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium mb-1 block">Guardian Name *</label><Input required value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Phone *</label><Input required value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} /></div>
                <div><label className="text-xs font-medium mb-1 block">Email</label><Input type="email" value={form.guardianEmail} onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} /></div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Relationship</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.guardianRelationship} onChange={(e) => setForm({ ...form, guardianRelationship: e.target.value })}>
                    <option value="PARENT">Parent</option><option value="GUARDIAN">Guardian</option><option value="RELATIVE">Relative</option>
                  </select>
                </div>
                <div className="col-span-2"><label className="text-xs font-medium mb-1 block">Address</label><Input value={form.guardianAddress} onChange={(e) => setForm({ ...form, guardianAddress: e.target.value })} /></div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>{actionLoading ? 'Submitting…' : 'Submit Application'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Manage Application Modal */}
      {selectedApp && (
        <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Manage: ${selectedApp.firstName} ${selectedApp.lastName}`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm font-semibold">{selectedApp.applicationNumber}</div>
                <Badge variant={(STATUS_BADGE[selectedApp.status] as any) || 'secondary'} className="mt-1">
                  {selectedApp.status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>

            {STATUS_FLOW[selectedApp.status]?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Change Status:</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW[selectedApp.status].map((s) => (
                    <Button
                      key={s}
                      variant={s === 'ACCEPTED' ? 'default' : s === 'REJECTED' ? 'destructive' : 'outline'}
                      size="sm"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate(selectedApp.id, s)}
                    >
                      → {s.replace(/_/g, ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedApp.status === 'ACCEPTED' && (
              <div className="pt-2 border-t">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={actionLoading}
                  onClick={() => handleConvert(selectedApp.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convert to Enrolled Student
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">This will create a student record and guardian profile.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

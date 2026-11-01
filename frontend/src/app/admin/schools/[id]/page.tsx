'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Building2,
  ChevronLeft,
  Users,
  Save,
  Sliders,
  CreditCard,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const availableModules = [
  { key: 'attendance', name: 'Attendance Register', desc: 'Daily roll call, late, absent, and excused tracking' },
  { key: 'results_stanine', name: 'Results & Stanine Grading', desc: 'CA 50% + Exam 50% entry and BECE 9-point stanine aggregates' },
  { key: 'fees', name: 'Fee Collections & Finance', desc: 'Tuition fees, receipts, fee schedules, and debtor reports' },
  { key: 'timetable', name: 'Timetable & Class Schedules', desc: 'Weekly period grids, classroom and teacher allocations' },
  { key: 'assignments', name: 'Assignments & Homework', desc: 'Student assignments, deadlines, and submissions' },
  { key: 'parents', name: 'Parent Link & Directory', desc: 'Parent/guardian accounts and child linking' },
  { key: 'discipline', name: 'Discipline & Conduct', desc: 'Infractions, merits, and sanction management' },
  { key: 'health', name: 'Health & Sick Bay', desc: 'Medical visits, health conditions, and incident logs' },
  { key: 'library', name: 'Library & Book Loans', desc: 'Catalog, book borrowing, and returns' },
  { key: 'inventory', name: 'Inventory & Fixed Assets', desc: 'Campus assets and equipment register' },
  { key: 'transport', name: 'Transport Fleet', desc: 'Bus routes, vehicle manifests, and stops' },
  { key: 'hr', name: 'HR & Staff Leave', desc: 'Employee records and leave approval workflows' },
  { key: 'billing', name: 'SaaS Platform Billing', desc: 'Allows school admins to view subscription plans and invoices' },
];

export default function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const schoolId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'subscription' | 'users'>('overview');
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingModules, setSavingModules] = useState(false);
  const [savingSub, setSavingSub] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // School data
  const [school, setSchool] = useState<any>({
    id: schoolId,
    name: 'Loading School...',
    schoolCode: '...',
    email: '',
    phoneNumber: '',
    address: '',
    status: 'ACTIVE',
    createdAt: '',
    academicYear: '2025/2026',
    currentTerm: 'Term 1',
    _count: { students: 0, teachers: 0, classes: 0, subjects: 0, memberships: 0 },
    memberships: [],
  });

  // Module toggles
  const [moduleConfig, setModuleConfig] = useState<Record<string, boolean>>({
    attendance: true,
    results_stanine: true,
    fees: true,
    timetable: true,
    assignments: true,
    parents: true,
    discipline: true,
    health: true,
    library: true,
    inventory: true,
    transport: true,
    hr: true,
    billing: true,
  });

  // Subscription state
  const [subscription, setSubscription] = useState({
    tier: 'PRO',
    billingCycle: 'ANNUAL',
    studentLimit: 1000,
    status: 'ACTIVE',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schoolRes, configRes] = await Promise.all([
        apiRequest(`/admin/schools/${schoolId}`),
        apiRequest(`/admin/schools/${schoolId}/config`).catch(() => null),
      ]);

      if (schoolRes?.id) {
        setSchool(schoolRes);
      }
      if (configRes) {
        setModuleConfig((prev) => ({ ...prev, ...configRes }));
      }
    } catch (err: any) {
      console.warn('Could not load live school data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await apiRequest(`/admin/schools/${schoolId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setSchool((prev: any) => ({ ...prev, status: newStatus }));
      showNotification('success', `School status updated to ${newStatus}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status');
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      await apiRequest(`/admin/schools/${schoolId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: school.name,
          email: school.email,
          phoneNumber: school.phoneNumber,
          address: school.address,
        }),
      });
      showNotification('success', 'School details updated successfully');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update school');
    } finally {
      setSavingDetails(false);
    }
  };

  const toggleModule = (modKey: string) => {
    setModuleConfig((prev) => ({
      ...prev,
      [modKey]: !prev[modKey],
    }));
  };

  const handleSaveModules = async () => {
    setSavingModules(true);
    try {
      await apiRequest(`/admin/schools/${schoolId}/config`, {
        method: 'PATCH',
        body: JSON.stringify(moduleConfig),
      });
      showNotification('success', 'Tenant module configuration saved');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save module configuration');
    } finally {
      setSavingModules(false);
    }
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSub(true);
    try {
      await apiRequest(`/admin/subscriptions/schools/${schoolId}`, {
        method: 'PATCH',
        body: JSON.stringify(subscription),
      });
      showNotification('success', `Subscription updated to ${subscription.tier}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update subscription');
    } finally {
      setSavingSub(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/schools"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to School Tenants</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Tenant Status:</span>
            <Badge
              variant={
                school.status === 'ACTIVE'
                  ? 'success'
                  : school.status === 'SUSPENDED'
                  ? 'danger'
                  : 'secondary'
              }
            >
              {school.status}
            </Badge>
          </div>
        </div>

        {notification && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 ml-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tenant Header Card */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Building2 className="h-7 w-7 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {school.name}
                    </h1>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {school.schoolCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {school.address || 'Address not registered'} • Academic Term: {school.academicYear || '2025/2026'} ({school.currentTerm || 'Term 1'})
                  </p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2">
                {school.status !== 'ACTIVE' && (
                  <Button
                    onClick={() => handleStatusChange('ACTIVE')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 shadow-sm"
                  >
                    Activate School
                  </Button>
                )}
                {school.status !== 'SUSPENDED' && (
                  <Button
                    onClick={() => handleStatusChange('SUSPENDED')}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs h-8"
                  >
                    Suspend School
                  </Button>
                )}
                <Button
                  onClick={fetchData}
                  variant="outline"
                  className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-8 shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Total Students</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{school._count?.students || 0}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Faculty &amp; Staff</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{school._count?.teachers || 0}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Classes</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{school._count?.classes || 0}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div className="text-[11px] text-slate-500">Portal Members</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{school._count?.memberships || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex space-x-6 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-b-2 border-amber-500 text-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>School Details</span>
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'modules'
                ? 'border-b-2 border-amber-500 text-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Feature / Module Toggles</span>
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'subscription'
                ? 'border-b-2 border-amber-500 text-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Subscription &amp; Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'users'
                ? 'border-b-2 border-amber-500 text-amber-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff &amp; Administrators</span>
          </button>
        </div>

        {/* Tab 1: School Overview & Details Editing */}
        {activeTab === 'overview' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Institutional Details</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Update the official name, physical address, and institutional contact channels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">School Name</label>
                    <Input
                      value={school.name || ''}
                      onChange={(e) => setSchool({ ...school, name: e.target.value })}
                      required
                      className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">School Code (Immutable Identifier)</label>
                    <Input
                      value={school.schoolCode || ''}
                      disabled
                      className="bg-slate-50 border-slate-200 text-slate-400 font-mono text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Official Contact Email</label>
                    <Input
                      type="email"
                      value={school.email || ''}
                      onChange={(e) => setSchool({ ...school, email: e.target.value })}
                      className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <Input
                      value={school.phoneNumber || ''}
                      onChange={(e) => setSchool({ ...school, phoneNumber: e.target.value })}
                      className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Campus Physical Address</label>
                    <Input
                      value={school.address || ''}
                      onChange={(e) => setSchool({ ...school, address: e.target.value })}
                      placeholder="e.g. 15 Independence Ave, Ridge, Accra"
                      className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingDetails}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    {savingDetails ? 'Saving Changes...' : 'Save School Details'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Feature & Module Toggles */}
        {activeTab === 'modules' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base text-slate-900">Tenant Feature Flags</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Enable or disable specific modules for this school tenant according to their package.
                </CardDescription>
              </div>
              <Button
                onClick={handleSaveModules}
                disabled={savingModules}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-8 px-4 shadow-sm"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                {savingModules ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableModules.map((mod) => {
                  const isEnabled = !!moduleConfig[mod.key];
                  return (
                    <div
                      key={mod.key}
                      onClick={() => toggleModule(mod.key)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start justify-between ${
                        isEnabled
                          ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5 pr-3">
                        <div className="text-xs font-semibold text-slate-900 flex items-center space-x-2">
                          <span>{mod.name}</span>
                          {isEnabled && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                              Enabled
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-relaxed">
                          {mod.desc}
                        </div>
                      </div>

                      <div className="flex-shrink-0 pt-0.5">
                        {isEnabled ? (
                          <ToggleRight className="h-6 w-6 text-amber-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Subscription & Billing */}
        {activeTab === 'subscription' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">SaaS Subscription Management</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Manage the school's SaaS tier, student quota limits, and billing cycle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSubscription} className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Subscription Tier</label>
                  <select
                    value={subscription.tier}
                    onChange={(e) => setSubscription({ ...subscription, tier: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                  >
                    <option value="BASIC">BASIC (Starter Academy - $49/mo)</option>
                    <option value="PRO">PRO (Professional Institution - $99/mo)</option>
                    <option value="ENTERPRISE">ENTERPRISE (Campus Unlimited - $199/mo)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Billing Cycle</label>
                  <select
                    value={subscription.billingCycle}
                    onChange={(e) => setSubscription({ ...subscription, billingCycle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                  >
                    <option value="MONTHLY">Monthly Billing</option>
                    <option value="ANNUAL">Annual Billing (20% Discount)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Student Quota Limit</label>
                  <Input
                    type="number"
                    value={subscription.studentLimit}
                    onChange={(e) => setSubscription({ ...subscription, studentLimit: parseInt(e.target.value, 10) || 0 })}
                    className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                  />
                  <p className="text-[10px] text-slate-400">
                    Currently utilizing {school._count?.students || 0} enrolled student seats.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingSub}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    {savingSub ? 'Updating...' : 'Update Subscription'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Users & Staff */}
        {activeTab === 'users' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">School Administrators &amp; Staff</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Users with institutional memberships in this tenant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {school.memberships && school.memberships.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Profile Role</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {school.memberships.map((m: any) => (
                        <tr key={m.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {m.user?.profile?.firstName} {m.user?.profile?.lastName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {m.user?.email}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {m.profile}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <Badge variant={m.status === 'ACTIVE' ? 'success' : 'secondary'}>
                              {m.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No registered staff or administrator accounts found for this school.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

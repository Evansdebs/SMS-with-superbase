'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Building2,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Users,
  GraduationCap,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SchoolTenant {
  id: string;
  name: string;
  schoolCode: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  adminEmail: string;
  studentsCount: number;
  teachersCount: number;
  createdAt: string;
  plan: 'Standard' | 'Enterprise';
}

export default function AdminSchoolsPage() {
  const [tenants, setTenants] = useState<SchoolTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const res = await apiRequest('/admin/schools');
        if (Array.isArray(res)) {
          setTenants(
            res.map((s: any) => ({
              id: s.id,
              name: s.name,
              schoolCode: s.schoolCode,
              status: s.status || 'ACTIVE',
              adminEmail: s.email || s.adminEmail || 'admin@' + (s.schoolCode?.toLowerCase() || 'school') + '.edu',
              studentsCount: s._count?.students || s.studentsCount || 0,
              teachersCount: s._count?.teachers || s.teachersCount || 0,
              createdAt: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'Today',
              plan: s.plan || 'Standard',
            }))
          );
        } else {
          setTenants([]);
        }
      } catch {
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const filtered = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.schoolCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id: string) => {
    try {
      const current = tenants.find((t) => t.id === id);
      const nextStatus = current?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      await apiRequest(`/admin/schools/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setTenants(
        tenants.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
      );
    } catch {
      setTenants(
        tenants.map((t) => {
          if (t.id === id) {
            const nextStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
            return { ...t, status: nextStatus };
          }
          return t;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Multi-Tenant Oversight
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Platform Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
              Registered School Tenants
            </h1>
            <p className="text-sm text-slate-500">
              Manage school organizations, monitor tenant populations, and regulate platform access status.
            </p>
          </div>

          <Link href="/admin/schools/new">
            <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Provision New School</span>
            </Button>
          </Link>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardContent className="p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tenants</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{tenants.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardContent className="p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Schools</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {tenants.filter((t) => t.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardContent className="p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Students</div>
              <div className="text-2xl font-black text-amber-700 mt-1">
                {tenants.reduce((sum, t) => sum + t.studentsCount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 text-slate-900 shadow-xs">
            <CardContent className="p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Teachers</div>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {tenants.reduce((sum, t) => sum + t.teachersCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search school name, code, admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 outline-none shadow-2xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="PENDING">Pending Setup</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Schools Table */}
        <Card className="bg-white border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              Loading platform tenants...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center max-w-md mx-auto">
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto mb-3">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {searchTerm || statusFilter !== 'ALL' ? 'No Matching Schools Found' : 'No Schools Registered Yet'}
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try clearing your search or status filter criteria.'
                  : 'Your database has zero dummy schools. Use the onboarding wizard to register your first school tenant.'}
              </p>
              <Link href="/admin/schools/new">
                <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Provision First School
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-4">School Institution</th>
                    <th className="p-4">Tenant Code</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Population</th>
                    <th className="p-4">Admin Contact</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((tenant) => {
                    const isActive = tenant.status === 'ACTIVE';
                    const isSuspended = tenant.status === 'SUSPENDED';

                    return (
                      <tr key={tenant.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <Link
                            href={`/admin/schools/${tenant.id}`}
                            className="font-bold text-sm text-slate-900 hover:text-amber-700 transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{tenant.name}</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Tier: {tenant.plan}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-amber-800">
                          <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {tenant.schoolCode}
                          </span>
                        </td>

                        <td className="p-4">
                          <Badge
                            variant={isActive ? 'success' : isSuspended ? 'destructive' : 'warning'}
                          >
                            {tenant.status}
                          </Badge>
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-900">
                            {tenant.studentsCount.toLocaleString()} Students
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tenant.teachersCount} Faculty Staff
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-600">{tenant.adminEmail}</td>

                        <td className="p-4 text-slate-500">{tenant.createdAt}</td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link href={`/admin/schools/${tenant.id}`}>
                              <button
                                title="View School Details"
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition-colors text-xs font-medium border border-slate-200 shadow-2xs"
                              >
                                Manage
                              </button>
                            </Link>

                            <button
                              onClick={() => handleToggleStatus(tenant.id)}
                              title={isActive ? 'Suspend Access' : 'Activate Access'}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                                isActive
                                  ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

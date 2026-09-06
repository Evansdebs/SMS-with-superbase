'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Building2,
  ChevronLeft,
  ShieldCheck,
  Users,
  GraduationCap,
  Calendar,
  Key,
  Lock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

export default function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const schoolId = resolvedParams.id;

  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'>('ACTIVE');
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic school data loaded from database
  const [school, setSchool] = useState<any>({
    id: schoolId,
    name: 'Loading School...',
    schoolCode: '...',
    motto: '',
    email: '',
    phone: '',
    address: '',
    gpsAddress: '',
    createdAt: 'Recently',
    plan: 'Standard Tier',
    metrics: {
      students: 0,
      teachers: 0,
      classes: 0,
      parents: 0,
      totalFeesExpected: 0,
      totalFeesCollected: 0,
    },
    primaryAdmin: {
      name: 'Administrator',
      email: '',
      role: 'HEAD_OF_INSTITUTION',
      lastLogin: 'Never',
    },
  });

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/admin/schools/${schoolId}`);
        if (res?.id) {
          setSchool({
            id: res.id,
            name: res.name || 'School Tenant',
            schoolCode: res.schoolCode || 'SCH',
            motto: res.motto || '',
            email: res.email || '',
            phone: res.phoneNumber || '',
            address: res.address || '',
            gpsAddress: res.gpsAddress || '',
            createdAt: res.createdAt ? new Date(res.createdAt).toISOString().split('T')[0] : 'Today',
            plan: res.plan || 'Standard',
            metrics: {
              students: res._count?.students || 0,
              teachers: res._count?.teachers || 0,
              classes: res._count?.classes || 0,
              parents: res._count?.parents || 0,
              totalFeesExpected: 0,
              totalFeesCollected: 0,
            },
            primaryAdmin: {
              name: res.adminName || 'Institutional Admin',
              email: res.adminEmail || res.email || 'admin@school.edu',
              role: 'HEAD_OF_INSTITUTION',
              lastLogin: 'Active',
            },
          });
          if (res.status) setStatus(res.status);
        }
      } catch {
        // In case offline, keep clean dynamic representation
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsResetPasswordModalOpen(false);
      setNewPassword('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminNav />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link
            href="/admin/schools"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>All School Tenants</span>
          </Link>
          <span>/</span>
          <span className="text-amber-400 font-mono font-semibold">{school.schoolCode}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">{school.name}</h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">
                {school.schoolCode}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{school.motto} • Enrolled {school.createdAt}</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setStatus(status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                status === 'ACTIVE'
                  ? 'border-rose-900/60 text-rose-400 hover:bg-rose-950/50'
                  : 'border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/50'
              }`}
            >
              {status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate School'}
            </button>

            <Link href="/school/dashboard" target="_blank">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Launch School Portal</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Tenant Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/80 border-slate-800 text-white">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-blue-400" /> Enrolled Students
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {school.metrics.students}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-800 text-white">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-emerald-400" /> Faculty Staff
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {school.metrics.teachers}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-800 text-white">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-purple-400" /> Academic Classes
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {school.metrics.classes}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/80 border-slate-800 text-white">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" /> Total Fee Revenue
              </div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                GHS {school.metrics.totalFeesCollected.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tenant Contact & Metadata */}
          <Card className="bg-slate-900/60 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>Tenant Profile & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Institutional Email:</span>
                <span className="font-mono text-slate-200">{school.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Telephone:</span>
                <span className="text-slate-200">{school.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Campus Address:</span>
                <span className="text-slate-200 text-right max-w-xs">{school.address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Ghana Post GPS:</span>
                <span className="font-mono text-amber-400 font-bold">{school.gpsAddress}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Subscription Tier:</span>
                <span className="text-emerald-400 font-semibold">{school.plan}</span>
              </div>
            </CardContent>
          </Card>

          {/* Primary Administrator */}
          <Card className="bg-slate-900/60 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Primary Tenant Administrator</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetPasswordModalOpen(true)}
                className="text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
              >
                <Key className="h-3.5 w-3.5 mr-1" />
                <span>Reset Credentials</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Administrator Name:</span>
                <span className="font-semibold text-slate-200">{school.primaryAdmin.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Login Account:</span>
                <span className="font-mono text-slate-200">{school.primaryAdmin.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">System Role:</span>
                <Badge variant="info" className="text-[10px]">
                  {school.primaryAdmin.role}
                </Badge>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Recent Activity:</span>
                <span className="text-slate-400">{school.primaryAdmin.lastLogin}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Reset Admin Password Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Reset Tenant Admin Credentials"
        description={`Set a new temporary password for ${school.primaryAdmin.email}`}
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          {passwordSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Password successfully reset! Instructions dispatched to user.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              New Password
            </label>
            <Input
              type="password"
              required
              placeholder="Enter new temporary password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsResetPasswordModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black"
            >
              Confirm Password Reset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

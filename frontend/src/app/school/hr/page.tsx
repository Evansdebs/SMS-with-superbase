'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Building,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface LeaveItem {
  id: string;
  staffName: string;
  employeeId: string;
  role: string;
  leaveType: 'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'STUDY';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export default function HrPage() {
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    staffName: '',
    employeeId: '',
    role: '',
    leaveType: 'CASUAL' as LeaveItem['leaveType'],
    startDate: '',
    endDate: '',
    daysCount: 1,
    reason: '',
  });

  const filtered = leaves.filter((item) => {
    const matchesSearch =
      item.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LeaveItem = {
      id: `lv-${Date.now()}`,
      staffName: formData.staffName,
      employeeId: formData.employeeId,
      role: formData.role,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysCount: Number(formData.daysCount),
      reason: formData.reason,
      status: 'PENDING',
    };
    setLeaves([created, ...leaves]);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setLeaves(
      leaves.map((l) =>
        l.id === id ? { ...l, status: newStatus, approvedBy: 'Administrator' } : l
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Personnel & Human Resources
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="secondary">Staff Leave Portal</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Staff Leave & Absence Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Submit and approve staff leave requests, review medical certificates, and track teaching faculty attendance.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Apply for Leave</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Applications</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {leaves.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Pending Review</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {leaves.filter((l) => l.status === 'PENDING').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Approved Leaves</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {leaves.filter((l) => l.status === 'APPROVED').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Active Faculty on Leave</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">1</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search faculty name, employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Leaves Table */}
        <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                  <th className="p-3.5">Faculty Member</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Days</th>
                  <th className="p-3.5">Reason / Justification</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filtered.map((lv) => (
                  <tr key={lv.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {lv.staffName}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lv.employeeId} • {lv.role}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px]">
                        {lv.leaveType}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-slate-700 dark:text-slate-300">
                      {lv.startDate} → {lv.endDate}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {lv.daysCount} Day(s)
                    </td>

                    <td className="p-3.5 max-w-xs text-slate-600 dark:text-slate-400">
                      {lv.reason}
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant={
                          lv.status === 'APPROVED'
                            ? 'success'
                            : lv.status === 'PENDING'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-[10px]"
                      >
                        {lv.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right">
                      {lv.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(lv.id, 'APPROVED')}
                            className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(lv.id, 'REJECTED')}
                            className="text-xs h-7 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Signed by {lv.approvedBy}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Staff Leave Application"
        description="Formal leave request for administrative review and approval"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Faculty / Staff Member *
            </label>
            <select
              value={formData.staffName}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  staffName: name,
                  employeeId: name === 'Mr. Emmanuel Mensah' ? 'EMP-TCH-001' : 'EMP-TCH-002',
                  role: name === 'Mr. Emmanuel Mensah' ? 'Mathematics Master' : 'Science Lead',
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              <option value="Mr. Emmanuel Mensah">Mr. Emmanuel Mensah (EMP-TCH-001)</option>
              <option value="Mrs. Faustina Ofori">Mrs. Faustina Ofori (EMP-TCH-002)</option>
              <option value="Mr. Samuel Boakye">Mr. Samuel Boakye (EMP-TCH-005)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Leave Category *
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="CASUAL">Casual / Personal</option>
                <option value="SICK">Medical / Sick Leave</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="MATERNITY">Maternity / Paternity</option>
                <option value="STUDY">Study / Professional Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Working Days Count *
              </label>
              <Input
                type="number"
                min={1}
                required
                value={formData.daysCount}
                onChange={(e) => setFormData({ ...formData, daysCount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date *
              </label>
              <Input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Date *
              </label>
              <Input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason / Relieving Arrangements *
            </label>
            <textarea
              required
              rows={3}
              placeholder="State reason for absence and which colleague will cover your periods..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

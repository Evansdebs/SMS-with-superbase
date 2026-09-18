'use client';

import React, { useEffect, useState } from 'react';
import {
  DoorOpen,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  Search,
  Filter,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function ExeatsPage() {
  const [exeats, setExeats] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New Exeat Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    reason: '',
    destination: '',
    departureTime: '',
    expectedReturn: '',
    parentContacted: true,
    remarks: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [exList, stdList] = await Promise.all([
        apiRequest('/operations/exeats'),
        apiRequest('/students'),
      ]);
      if (exList) setExeats(exList);
      if (stdList) setStudents(stdList);
    } catch {
      // Fallback sample data for Ghanaian schools
      setExeats([
        {
          id: '1',
          student: { firstName: 'Kwesi', lastName: 'Mensah', admissionNumber: 'STD-2025-012', class: { name: 'JHS 2', stream: 'Gold' } },
          reason: 'Medical checkup at Ridge Hospital',
          destination: 'Ridge Hospital, Accra',
          departureTime: new Date(Date.now() - 3600000 * 4).toISOString(),
          expectedReturn: new Date(Date.now() + 3600000 * 2).toISOString(),
          status: 'APPROVED',
          parentContacted: true,
          remarks: 'Guardian Mrs. Mensah phoned at 08:30 AM',
        },
        {
          id: '2',
          student: { firstName: 'Abena', lastName: 'Osei', admissionNumber: 'STD-2025-045', class: { name: 'Class 6', stream: 'A' } },
          reason: 'Family emergency (funeral travel)',
          destination: 'Kumasi',
          departureTime: new Date(Date.now() - 3600000 * 28).toISOString(),
          expectedReturn: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'OVERDUE',
          parentContacted: true,
          remarks: 'Expected return was yesterday 4:00 PM',
        },
        {
          id: '3',
          student: { firstName: 'Kofi', lastName: 'Addae', admissionNumber: 'STD-2025-089', class: { name: 'JHS 3', stream: 'A' } },
          reason: 'Weekend home visit request',
          destination: 'Tema Community 4',
          departureTime: new Date(Date.now() + 3600000 * 12).toISOString(),
          expectedReturn: new Date(Date.now() + 3600000 * 60).toISOString(),
          status: 'PENDING',
          parentContacted: false,
          remarks: 'Awaiting house master signature',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExeat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/operations/exeats', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setIsModalOpen(false);
      setFormData({
        studentId: '',
        reason: '',
        destination: '',
        departureTime: '',
        expectedReturn: '',
        parentContacted: true,
        remarks: '',
      });
      loadData();
    } catch {
      alert('Failed to submit exeat request');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'RETURNED') => {
    try {
      await apiRequest(`/operations/exeats/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch {
      alert('Failed to update exeat status');
    }
  };

  const filteredExeats = exeats.filter((item) => {
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const fullName = `${item.student?.firstName || ''} ${item.student?.lastName || ''}`.toLowerCase();
    const adm = (item.student?.admissionNumber || '').toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || adm.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Approved (Active)</Badge>;
      case 'RETURNED':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Returned Safe</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold animate-pulse">Overdue Return</Badge>;
      case 'REJECTED':
        return <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pending Approval</Badge>;
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
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                <DoorOpen className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Student Exeat Management
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Track boarding & day student leaves, parent contact verification, departure and return security
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Issue New Exeat
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['ALL', 'PENDING', 'APPROVED', 'OVERDUE', 'RETURNED'].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={filterStatus === st ? 'default' : 'outline'}
                onClick={() => setFilterStatus(st)}
                className={`text-xs ${filterStatus === st ? 'bg-blue-600 text-white' : ''}`}
              >
                {st === 'ALL' ? 'All Requests' : st}
              </Button>
            ))}
          </div>
        </div>

        {/* Exeat List */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5">Student Details</th>
                    <th className="px-5 py-3.5">Destination & Reason</th>
                    <th className="px-5 py-3.5">Departure</th>
                    <th className="px-5 py-3.5">Expected Return</th>
                    <th className="px-5 py-3.5">Parent Contact</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExeats.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {ex.student?.firstName} {ex.student?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {ex.student?.admissionNumber} • {ex.student?.class?.name}
                        </p>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{ex.destination}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{ex.reason}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {new Date(ex.departureTime).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {new Date(ex.expectedReturn).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        {ex.parentContacted ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <Clock className="h-3.5 w-3.5" /> Not Contacted
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(ex.status)}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {ex.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(ex.id, 'APPROVED')}
                              className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(ex.id, 'REJECTED')}
                              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {ex.status === 'APPROVED' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(ex.id, 'RETURNED')}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Mark Returned
                          </Button>
                        )}
                        {ex.status === 'OVERDUE' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(ex.id, 'RETURNED')}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Confirm Arrival
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredExeats.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500">
                        No exeat records found matching current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MODAL: ISSUE NEW EXEAT */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Issue Student Exeat Permission"
        >
          <form onSubmit={handleCreateExeat} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Select Student</label>
              <select
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.admissionNumber}) - {s.class?.name || 'Student'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Destination</label>
              <Input
                required
                placeholder="e.g. Ridge Hospital / Tema Community 2"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Reason for Leave</label>
              <Input
                required
                placeholder="e.g. Medical emergency / Family bereavement"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Departure Time</label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Expected Return</label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.expectedReturn}
                  onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="parentContact"
                checked={formData.parentContacted}
                onChange={(e) => setFormData({ ...formData, parentContacted: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="parentContact" className="text-sm text-slate-700 dark:text-slate-300">
                Parent / Legal Guardian has been notified and gave verbal consent
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Remarks / Gate Note</label>
              <Input
                placeholder="Security gate pass notes or medical officer stamp"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Exeat Request
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

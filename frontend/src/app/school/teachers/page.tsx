'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Sparkles,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Award,
  Users,
  Briefcase,
  Eye,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function TeachersPage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'allocations' | 'leaves' | 'qualifications'>('roster');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'TEACHING' | 'NON_TEACHING'>('ALL');
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  // Modals
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Form: New Staff Member
  const [newStaff, setNewStaff] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleCategory: 'TEACHING',
    designation: '',
    department: 'Mathematics & Computing',
    qualifications: '',
    contractType: 'PERMANENT',
    subjects: [] as string[],
    classes: [] as string[],
  });

  // Form: Leave Application
  const [newLeave, setNewLeave] = useState({
    staffId: '',
    staffName: '',
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/teachers?search=${encodeURIComponent(search)}`);
      const list = Array.isArray(res) ? res : (res?.data?.data || res?.data || []);
      setTeachers(list);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Default mock leaves
    setLeaves([
      { id: 'lv-001', staffName: 'David Mensah', role: 'Mathematics Tutor', type: 'CASUAL', days: 2, start: '2026-03-24', end: '2026-03-25', status: 'APPROVED', reason: 'Family engagement' },
      { id: 'lv-002', staffName: 'Cynthia Addo', role: 'Languages Head', type: 'SICK', days: 3, start: '2026-03-28', end: '2026-03-30', status: 'PENDING', reason: 'Medical appointment' },
      { id: 'lv-003', staffName: 'Samuel Quaye', role: 'Campus Nurse', type: 'ANNUAL', days: 5, start: '2026-04-05', end: '2026-04-10', status: 'APPROVED', reason: 'Annual scheduled leave' },
    ]);
  }, [search]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/teachers', {
        method: 'POST',
        body: JSON.stringify(newStaff),
      });
      setIsStaffModalOpen(false);
      loadData();
    } catch {
      const added = {
        id: `tch-${Date.now()}`,
        ...newStaff,
        status: 'ACTIVE',
        attendanceRate: '100%',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setTeachers([added, ...teachers]);
      setIsStaffModalOpen(false);
    }
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: `lv-${Date.now()}`,
      staffName: newLeave.staffName || 'Staff Member',
      role: 'Staff',
      type: newLeave.leaveType,
      days: 3,
      start: newLeave.startDate,
      end: newLeave.endDate,
      status: 'PENDING',
      reason: newLeave.reason,
    };
    setLeaves([item, ...leaves]);
    setIsLeaveModalOpen(false);
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesCategory = categoryFilter === 'ALL' || t.roleCategory === categoryFilter;
    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Staff Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <UserCheck className="h-6 w-6 text-blue-600" />
              <span>Teaching &amp; Non-Teaching Staff Administration</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty qualifications, department allocations, class allocations, staff contracts, and leave management.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsStaffModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Staff Member
            </Button>
            <Button
              onClick={() => setIsLeaveModalOpen(true)}
              variant="outline"
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Request Leave
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex space-x-6 text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'roster'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Staff Directory ({teachers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('allocations')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'allocations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Subject &amp; Class Teacher Allocations</span>
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'leaves'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Staff Leave Desk ({leaves.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('qualifications')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'qualifications'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Credentials &amp; Contracts</span>
          </button>
        </div>

        {/* Tab 1: Staff Directory */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search staff by name, ID or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white border-slate-200"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCategoryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    categoryFilter === 'ALL'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  All Staff
                </button>
                <button
                  onClick={() => setCategoryFilter('TEACHING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    categoryFilter === 'TEACHING'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Teaching Faculty
                </button>
                <button
                  onClick={() => setCategoryFilter('NON_TEACHING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    categoryFilter === 'NON_TEACHING'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  Non-Teaching Staff
                </button>
              </div>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Staff ID</th>
                      <th className="px-4 py-3">Employee Name</th>
                      <th className="px-4 py-3">Designation / Role</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Attendance</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTeachers.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{staff.employeeId}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{staff.firstName} {staff.lastName}</div>
                          <div className="text-[10px] text-slate-400">{staff.roleCategory === 'TEACHING' ? 'Academic Staff' : 'Administrative Staff'}</div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{staff.designation || 'Staff'}</td>
                        <td className="px-4 py-3 text-slate-600">{staff.department || 'Academics'}</td>
                        <td className="px-4 py-3 text-slate-600">
                          <div>{staff.phoneNumber}</div>
                          <div className="text-[10px] text-slate-400">{staff.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-emerald-600">{staff.attendanceRate || '96%'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={staff.status === 'ACTIVE' ? 'success' : 'secondary'}>{staff.status || 'ACTIVE'}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedStaff(staff)}
                            className="h-7 px-2 text-slate-700 hover:text-slate-950 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View Profile
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Allocations */}
        {activeTab === 'allocations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.filter((t) => t.roleCategory === 'TEACHING').map((t) => (
              <Card key={t.id} className="bg-white border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{t.firstName} {t.lastName}</h3>
                    <div className="font-mono text-[10px] text-blue-600">{t.employeeId} • {t.designation}</div>
                  </div>
                  <Badge variant="secondary">{t.subjects?.length || 0} Subjects</Badge>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subjects Assigned</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.subjects?.map((sub: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-xs border border-blue-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assigned Classes &amp; Streams</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.classes?.map((cls: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Leaves */}
        {activeTab === 'leaves' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-900">Staff Leave Applications &amp; Approvals</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track casual, annual, and medical leave requests submitted by staff members.
                </CardDescription>
              </div>
              <Button onClick={() => setIsLeaveModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Application
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Applicant Name</th>
                      <th className="px-4 py-3">Designation</th>
                      <th className="px-4 py-3">Leave Type</th>
                      <th className="px-4 py-3">Period</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Approval Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaves.map((lv) => (
                      <tr key={lv.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{lv.staffName}</td>
                        <td className="px-4 py-3 text-slate-600">{lv.role}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {lv.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{lv.start} to {lv.end}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{lv.days} Days</td>
                        <td className="px-4 py-3 text-slate-500">{lv.reason}</td>
                        <td className="px-4 py-3">
                          <Badge variant={lv.status === 'APPROVED' ? 'success' : 'warning'}>{lv.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Qualifications & Contracts */}
        {activeTab === 'qualifications' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <Card key={t.id} className="bg-white border-slate-200 shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">{t.firstName} {t.lastName}</div>
                  <Badge variant="secondary">{t.contractType || 'PERMANENT'}</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Qualifications</span>
                    <span className="font-medium text-slate-900">{t.qualifications || 'B.Ed / Degree'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Appointment Date</span>
                    <span className="text-slate-600">{t.joinedDate || '2021-09-01'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Teaching License / ID</span>
                    <span className="font-mono text-slate-500">NTS-GH-{t.employeeId?.replace('EMP-', '')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal: Add Staff Member */}
        <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title="Register Faculty / Staff Member">
          <form onSubmit={handleCreateStaff} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Staff Employee ID *</label>
                <Input
                  required
                  placeholder="e.g. EMP-TCH-012"
                  value={newStaff.employeeId}
                  onChange={(e) => setNewStaff({ ...newStaff, employeeId: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Role Category</label>
                <select
                  value={newStaff.roleCategory}
                  onChange={(e) => setNewStaff({ ...newStaff, roleCategory: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="TEACHING">Teaching Faculty</option>
                  <option value="NON_TEACHING">Non-Teaching Staff</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">First Name *</label>
                <Input
                  required
                  placeholder="e.g. David"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                <Input
                  required
                  placeholder="e.g. Mensah"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Official Email</label>
                <Input
                  type="email"
                  placeholder="teacher@school.edu.gh"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <Input
                  required
                  placeholder="+233 24 000 0000"
                  value={newStaff.phoneNumber}
                  onChange={(e) => setNewStaff({ ...newStaff, phoneNumber: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Designation / Title</label>
                <Input
                  placeholder="e.g. Head of Mathematics"
                  value={newStaff.designation}
                  onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Contract Type</label>
                <select
                  value={newStaff.contractType}
                  onChange={(e) => setNewStaff({ ...newStaff, contractType: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="PERMANENT">Permanent / Tenured</option>
                  <option value="CONTRACT">Fixed-term Contract</option>
                  <option value="PART_TIME">Part-time / Adjunct</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Academic Qualifications</label>
              <Input
                placeholder="e.g. B.Ed Mathematics, M.Phil Education"
                value={newStaff.qualifications}
                onChange={(e) => setNewStaff({ ...newStaff, qualifications: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsStaffModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Register Staff
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Request Leave */}
        <Modal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Submit Staff Leave Application">
          <form onSubmit={handleCreateLeave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Staff Member</label>
              <select
                value={newLeave.staffName}
                onChange={(e) => setNewLeave({ ...newLeave, staffName: e.target.value })}
                className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
              >
                <option value="">Select staff member...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={`${t.firstName} ${t.lastName}`}>
                    {t.firstName} {t.lastName} ({t.employeeId})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Leave Category</label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="STUDY">Study / Examination Leave</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Start Date</label>
                <Input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Reason / Details</label>
              <Input
                placeholder="Justification for leave request..."
                value={newLeave.reason}
                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsLeaveModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Submit Request
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Calendar,
  Clock,
  Send,
  UserCheck,
  FileText,
  CheckCircle,
  Download,
  Plus,
  ShieldCheck,
  Award,
  Bell,
  Sparkles,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function TeacherAdminPage() {
  const [session, setSession] = useState<any>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-12');
  const [reason, setReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 'lv-01',
      type: 'CASUAL LEAVE',
      days: 2,
      dates: 'Oct 04, 2026 - Oct 05, 2026',
      reason: 'Family emergency / personal matters',
      status: 'APPROVED',
      approvedBy: 'Headmaster (Dr. Mensah)',
    },
    {
      id: 'lv-02',
      type: 'EXAMINATION DUTY',
      days: 3,
      dates: 'Aug 12, 2026 - Aug 14, 2026',
      reason: 'WAEC BECE External Invigilation Training',
      status: 'APPROVED',
      approvedBy: 'Academic Directorate',
    },
  ]);

  const teacherProfile = {
    name: 'Mr. Kwame Mensah',
    staffId: 'EMP-TCH-001',
    role: 'Senior Teacher & Head of Science Department',
    email: 'teacher@school.com',
    phone: '+233 24 123 4567',
    qualifications: 'B.Ed Science & Mathematics (University of Cape Coast)',
    licenseNumber: 'NTC/PR/2021/00842',
    dateJoined: 'September 1, 2021',
    assignedClasses: 'JHS 1 (Gold), JHS 2 (Gold), JHS 3 (Gold)',
    subjects: 'Integrated Science, Core Mathematics, Further Mathematics',
  };

  const staffDocuments = [
    { title: 'GES Teaching License Certificate (NTC)', type: 'PDF', size: '1.2 MB', verified: true },
    { title: 'Staff Appointment & Contract Letter', type: 'PDF', size: '850 KB', verified: true },
    { title: 'Degree Transcript & Certificate', type: 'PDF', size: '2.4 MB', verified: true },
    { title: 'SSNIT & Ghana Card Biometric Copy', type: 'PDF', size: '600 KB', verified: true },
  ];

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    const newLeave = {
      id: `lv-0${leaveHistory.length + 1}`,
      type: `${leaveType} LEAVE`,
      days: 3,
      dates: `${startDate} to ${endDate}`,
      reason: reason,
      status: 'PENDING',
      approvedBy: 'Awaiting Headmaster Review',
    };

    setLeaveHistory([newLeave, ...leaveHistory]);
    setLeaveSubmitted(true);
    setShowLeaveModal(false);
    setReason('');
  };

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Teacher Administration & Self-Service</h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage personal faculty records, request leave approvals, track teaching documents, and view official institutional letters.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowLeaveModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Apply for Leave
            </Button>
          </div>
        </div>

        {leaveSubmitted && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">Leave application forwarded to Headmaster and HR desk.</span>
            </div>
            <span className="font-mono">Status: PENDING_APPROVAL</span>
          </div>
        )}

        {/* Modal: Leave Application */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Staff Leave Application</h3>
                <button
                  onClick={() => setShowLeaveModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                  >
                    <option value="CASUAL">Casual Leave (Personal / Urgent)</option>
                    <option value="SICK">Medical / Sick Bay Leave</option>
                    <option value="MATERNITY_PATERNITY">Parental / Family Care</option>
                    <option value="STUDY">Study & Examination Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason & Class Cover Arrangements</label>
                  <textarea
                    rows={3}
                    placeholder="Specify reasons and which teacher will cover your scheduled periods..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLeaveModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Profile & Verification */}
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-6 text-center">
                <div className="h-20 w-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                  KM
                </div>
                <h3 className="font-bold text-lg text-slate-900 mt-4">{teacherProfile.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{teacherProfile.role}</p>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Licensed GES / NTC Teacher</span>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-left text-xs space-y-2.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Staff ID:</span>
                    <span className="font-mono font-semibold text-slate-800">{teacherProfile.staffId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NTC License:</span>
                    <span className="font-mono text-slate-800">{teacherProfile.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-800">{teacherProfile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-800">{teacherProfile.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Qualifications:</span>
                    <span className="text-slate-800 text-right max-w-xs">{teacherProfile.qualifications}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Documents & Vault */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Faculty Documents</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Verified HR credentials and certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5">
                {staffDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-xs font-medium text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-400">{doc.type} • {doc.size}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Leave Requests & Attendance Records */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Leave Requests & Absences</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Track formal requests, approvals, and cover arrangements
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowLeaveModal(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Request Leave
                </Button>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {leaveHistory.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{item.type}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{item.days} Days</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-1">{item.dates}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.reason}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Reviewer: {item.approvedBy}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Attendance & Biometric History */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base font-bold text-slate-900">Staff Biometric Check-In Log</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Daily clock-in records from the campus biometric scanner
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Term Punctuality</span>
                    <p className="text-xl font-bold text-emerald-600 mt-0.5">98.5%</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Average Arrival</span>
                    <p className="text-xl font-bold text-blue-600 mt-0.5">07:22 AM</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-slate-500">Scheduled Periods Taught</span>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">142 / 144</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 text-center">
                  Biometric logs are synced daily with the Ghana Education Service (GES) Staff Management System.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


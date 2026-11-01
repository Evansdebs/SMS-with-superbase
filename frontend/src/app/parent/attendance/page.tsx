'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentAttendancePage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');

  useEffect(() => {
    setSession(getStoredSession());
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected_child_id');
      if (saved) setActiveChildId(saved);

      const handler = (e: any) => {
        if (e.detail?.childId) setActiveChildId(e.detail.childId);
      };
      window.addEventListener('parent_child_changed', handler);
      return () => window.removeEventListener('parent_child_changed', handler);
    }
  }, []);

  const child = mockChildren.find((c) => c.id === activeChildId) || mockChildren[0];

  const attendanceLog = [
    { date: 'Today (Nov 01)', checkIn: '07:22 AM', status: 'PRESENT', remark: 'On-time arrival. Period 1-4 attended.' },
    { date: 'Yesterday (Oct 31)', checkIn: '07:28 AM', status: 'PRESENT', remark: 'On-time arrival.' },
    { date: 'Wednesday (Oct 30)', checkIn: '07:19 AM', status: 'PRESENT', remark: 'On-time arrival.' },
    { date: 'Tuesday (Oct 29)', checkIn: '07:44 AM', status: 'LATE', remark: 'Late arrival: heavy traffic at Dome junction.' },
    { date: 'Monday (Oct 28)', checkIn: '07:20 AM', status: 'PRESENT', remark: 'On-time arrival.' },
    { date: 'Friday (Oct 25)', checkIn: '07:15 AM', status: 'PRESENT', remark: 'On-time arrival.' },
    { date: 'Thursday (Oct 24)', checkIn: '---', status: 'EXCUSED', remark: 'Excused: Attended dental clinic (Exeat approved).' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Attendance Log: {child.name} ({child.admissionNumber})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Class Attendance & Check-In History</h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time campus biometric turnstile logs, teacher roll call registers, and tardiness records.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Attendance Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{child.attendanceRate}</div>
            <span className="text-[11px] text-slate-400">58 of 60 days present</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Late Arrivals</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">1 Day</div>
            <span className="text-[11px] text-slate-400">Traffic delay recorded</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Excused Absences</span>
            <div className="text-2xl font-extrabold text-teal-700 mt-1">1 Day</div>
            <span className="text-[11px] text-slate-400">Medical clinic appointment</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Unexcused Absences</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">0 Days</div>
            <span className="text-[11px] text-emerald-600 font-medium">Clean record</span>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Log Table */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">Recent Attendance Daily Log</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Automated notifications are sent via SMS whenever an unexcused absence is registered
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gate Clock-In</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Teacher Roll Call Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceLog.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{log.date}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{log.checkIn}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className={`text-xs font-semibold ${
                      log.status === 'PRESENT'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : log.status === 'LATE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-teal-50 text-teal-700 border-teal-200'
                    }`}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{log.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}


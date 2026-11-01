'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  Calendar,
  CreditCard,
  FileCheck2,
  Bell,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChildren, Child } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentDashboardPage() {
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

  // Dynamic child-specific data
  const childDetails: Record<string, any> = {
    'std-001': {
      classMaster: 'Mr. Kwame Mensah (+233 24 123 4567)',
      todayStatus: 'Present in Class (Checked in 07:22 AM)',
      termAggregate: 'Aggregate 7 (Division 1 Distinction)',
      todayClasses: [
        { period: 'Period 1', time: '08:00 AM', subject: 'Integrated Science', status: 'COMPLETED' },
        { period: 'Period 2', time: '08:50 AM', subject: 'English Language', status: 'COMPLETED' },
        { period: 'Period 3', time: '09:40 AM', subject: 'Core Mathematics', status: 'UPCOMING' },
        { period: 'Period 4', time: '11:15 AM', subject: 'Social Studies', status: 'UPCOMING' },
      ],
      pendingHomework: [
        { title: 'Mathematics Homework 4', due: 'Friday, 5:00 PM', marks: '25 Marks' },
        { title: 'Science Titration Write-up', due: 'Monday, 8:00 AM', marks: '20 Marks' },
      ],
      feeStatus: 'CLEARED',
      balance: 'GH₵ 0.00',
    },
    'std-002': {
      classMaster: 'Madam Beatrice Osei (+233 20 444 8899)',
      todayStatus: 'Present in Class (Checked in 07:35 AM)',
      termAggregate: 'Primary Division 1 (87.5% Average)',
      todayClasses: [
        { period: 'Period 1', time: '08:00 AM', subject: 'Primary Mathematics', status: 'COMPLETED' },
        { period: 'Period 2', time: '08:50 AM', subject: 'Natural Science', status: 'COMPLETED' },
        { period: 'Period 3', time: '09:40 AM', subject: 'Creative Arts', status: 'UPCOMING' },
      ],
      pendingHomework: [
        { title: 'Creative Arts: Drawing Native Pottery', due: 'Thursday, 3:00 PM', marks: '15 Marks' },
      ],
      feeStatus: 'PARTIAL_DUE',
      balance: 'GH₵ 350.00',
    },
    'std-003': {
      classMaster: 'Mrs. Janet Ansah (+233 55 222 1100)',
      todayStatus: 'Present in Nursery Suite (Checked in 07:45 AM)',
      termAggregate: 'Early Years Developmental Milestones: Proficient',
      todayClasses: [
        { period: 'Morning Circle', time: '08:30 AM', subject: 'Phonics & Letter Rhymes', status: 'COMPLETED' },
        { period: 'Activity 1', time: '09:30 AM', subject: 'Montessori Counting Pegs', status: 'UPCOMING' },
      ],
      pendingHomework: [
        { title: 'Trace & Color Letters A-D Workbook', due: 'Friday Morning', marks: 'Completion Sticker' },
      ],
      feeStatus: 'CLEARED',
      balance: 'GH₵ 0.00',
    },
  };

  const details = childDetails[child.id] || childDetails['std-001'];

  const recentNotifications = [
    {
      id: 'notif-1',
      title: 'Roll Call Check-In: Kofi Ansah Marked Present',
      desc: 'Marked on-time attendance for Wednesday Period 1 Science by Mr. Kwame Mensah.',
      time: '08:05 AM Today',
      type: 'ATTENDANCE',
      badge: 'Arrival',
    },
    {
      id: 'notif-2',
      title: 'Continuous Assessment Result Published',
      desc: 'Kofi scored 88% (Grade 1) in Mid-Term Core Mathematics Assessment.',
      time: 'Yesterday',
      type: 'ACADEMICS',
      badge: 'New Grade',
    },
    {
      id: 'notif-3',
      title: 'Term 1 Mid-Term Examination Dates Released',
      desc: 'Academic examinations start Monday, Nov 16 across all primary and JHS departments.',
      time: '2 days ago',
      type: 'NOTICE',
      badge: 'School Notice',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Multi-Child Selector Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guardian Ward Switcher</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                Select child to inspect isolated academic records, fees, and exeat slips:
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
            {mockChildren.map((ch) => {
              const isSelected = ch.id === child.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChildId(ch.id);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selected_child_id', ch.id);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ch.avatar}
                  </span>
                  <span>{ch.name}</span>
                  <span className="text-[10px] font-normal opacity-85">({ch.class.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Child Summary Spotlight */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-2xl border border-white/20 shrink-0">
              {child.avatar}
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Admission: {child.admissionNumber} • {child.class}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {child.name}
              </h1>
              <p className="text-teal-100 text-xs sm:text-sm mt-1">
                Class Master: <strong>{details.classMaster}</strong>
              </p>
              <div className="mt-2 flex items-center space-x-2 text-xs text-teal-100">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>{details.todayStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/parent/academics">
              <Button className="bg-white text-teal-800 hover:bg-teal-50 font-semibold text-xs shadow-xs">
                <Award className="h-4 w-4 mr-1.5" />
                Terminal Report Card
              </Button>
            </Link>
            <Link href="/parent/requests">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs font-semibold">
                <FileCheck2 className="h-4 w-4 mr-1.5" />
                Submit Exeat Request
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards for Selected Child */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Term Attendance</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{child.attendanceRate}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">58 of 60 days present</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Academic Standing</p>
                <p className="text-2xl font-bold text-teal-700 mt-1">{child.averageGrade.split(' ')[0]}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{child.averageGrade.split(' ')[1] || 'Division 1'}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Pending Homework</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{details.pendingHomework.length} Due</p>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">Requires home prep</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Term Fee Balance</p>
                <p className={`text-2xl font-bold mt-1 ${details.balance === 'GH₵ 0.00' ? 'text-slate-900' : 'text-rose-600'}`}>
                  {details.balance}
                </p>
                <p className={`text-[11px] font-medium mt-0.5 ${details.balance === 'GH₵ 0.00' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {details.feeStatus === 'CLEARED' ? 'Cleared' : 'Outstanding Balance'}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Classroom Schedule & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Schedule & Homework (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  {child.name}'s Schedule Today ({child.class})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Live classroom periods and completion tracking
                </CardDescription>
              </div>
              <Link href="/parent/timetable">
                <Button variant="ghost" size="sm" className="text-xs text-teal-700 hover:text-teal-900 font-semibold">
                  Full Timetable →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {details.todayClasses.map((cl: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-700 px-2 py-1 rounded bg-slate-100 border border-slate-200 text-[11px]">
                      {cl.time}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{cl.subject}</div>
                      <div className="text-[11px] text-slate-400">{cl.period}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${
                    cl.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}>
                    {cl.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Homework Requiring Guardian Attention */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Assigned Homework & Projects</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Ensure your ward completes tasks prior to the stated deadline
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {details.pendingHomework.map((hw: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{hw.title}</h5>
                    <div className="text-amber-700 font-semibold text-[11px] mt-0.5">Due: {hw.due}</div>
                  </div>
                  <Badge variant="outline" className="border-slate-300 text-slate-700 font-mono text-[10px]">
                    {hw.marks}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Instant Notifications & Guardian Support (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Parent Notification Alerts</CardTitle>
                <Bell className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {recentNotifications.map((n) => (
                <div key={n.id} className="text-xs border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-teal-700">{n.badge}</span>
                    <span className="text-slate-400">{n.time}</span>
                  </div>
                  <p className="font-bold text-slate-900 mb-0.5">{n.title}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Pay CTA if balance exists */}
          {details.balance !== 'GH₵ 0.00' && (
            <Card className="bg-gradient-to-r from-rose-50 to-amber-50 border-rose-200 shadow-xs">
              <CardContent className="p-4 text-xs">
                <div className="flex items-center space-x-2 text-rose-700 font-bold mb-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Fee Invoice Pending Payment</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Outstanding balance of <strong>{details.balance}</strong> for {child.name}. Pay via Mobile Money or Visa online.
                </p>
                <div className="mt-3">
                  <Link href="/parent/fees">
                    <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs">
                      <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Make Online Payment Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency School Helpdesk */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Direct School Lines</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-2 text-slate-600">
              <div className="flex justify-between items-center">
                <span>Front Desk:</span>
                <span className="font-mono font-semibold text-slate-800">+233 24 000 1111</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sick Bay Clinic:</span>
                <span className="font-mono font-semibold text-slate-800">+233 24 000 2222</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bursar / Accounts:</span>
                <span className="font-mono font-semibold text-slate-800">+233 24 000 3333</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


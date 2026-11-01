'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Award,
  ArrowRight,
  ClipboardCheck,
  Bell,
  Sparkles,
  ChevronRight,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function TeacherDashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const todayClasses = [
    {
      period: 'Period 1',
      time: '08:00 - 08:45 AM',
      subject: 'Integrated Science',
      class: 'JHS 2 (Gold)',
      topic: 'Photosynthesis & Light-Dependent Reactions',
      room: 'Science Lab 1',
      attendanceDone: true,
      studentsCount: 38,
      status: 'COMPLETED',
    },
    {
      period: 'Period 3',
      time: '09:40 - 10:25 AM',
      subject: 'Core Mathematics',
      class: 'JHS 1 (Gold)',
      topic: 'Linear Equations & Cartesian Coordinates',
      room: 'Block B - Room 12',
      attendanceDone: true,
      studentsCount: 42,
      status: 'CURRENT',
    },
    {
      period: 'Period 5',
      time: '11:15 - 12:00 PM',
      subject: 'Integrated Science',
      class: 'JHS 3 (Gold)',
      topic: 'Acids, Bases & Neutralization Titration',
      room: 'Science Lab 2',
      attendanceDone: false,
      studentsCount: 35,
      status: 'UPCOMING',
    },
    {
      period: 'Period 7',
      time: '01:30 - 02:15 PM',
      subject: 'Further Mathematics',
      class: 'JHS 3 (Gold)',
      topic: 'Quadratic Curves & Parabolic Roots',
      room: 'Block B - Room 14',
      attendanceDone: false,
      studentsCount: 28,
      status: 'UPCOMING',
    },
  ];

  const pendingTasks = [
    {
      id: 'task-1',
      title: 'Roll Call Pending: JHS 3 Science',
      desc: 'Period 5 lesson starts at 11:15 AM. 35 students to mark.',
      category: 'Attendance',
      badge: 'Urgent',
      href: '/teacher/attendance',
      actionText: 'Take Roll Call',
    },
    {
      id: 'task-2',
      title: 'Grade Submission: Mid-Term CA 1',
      desc: 'JHS 1 Mathematics test scores due in 24 hours (12 marks unsubmitted).',
      category: 'Assessment',
      badge: 'Deadline Today',
      href: '/teacher/assessment',
      actionText: 'Enter Marks',
    },
    {
      id: 'task-3',
      title: 'Lesson Plan Review for Week 8',
      desc: 'Submit lesson plan on Redox reactions to HOD for sign-off.',
      category: 'Academics',
      badge: 'Action Needed',
      href: '/teacher/lessons',
      actionText: 'Upload Plan',
    },
  ];

  const upcomingExams = [
    {
      date: 'Nov 12, 2026',
      title: 'End of Term Mock Exam: Science',
      class: 'JHS 3',
      venue: 'Main Assembly Hall',
      duration: '2 Hours',
    },
    {
      date: 'Nov 16, 2026',
      title: 'BECE Mid-Term Diagnostic Math Test',
      class: 'JHS 2 & 3',
      venue: 'Block B Examination Suites',
      duration: '1.5 Hours',
    },
  ];

  const announcements = [
    {
      id: 'anc-1',
      sender: 'Academic Directorate',
      title: 'Continuous Assessment 50% Weights Locked',
      desc: 'Please ensure all Classwork (20%) and Homework/Project (30%) components are uploaded before Friday 5:00 PM.',
      time: '2 hours ago',
    },
    {
      id: 'anc-2',
      sender: 'Head of Department (Science)',
      title: 'Chemistry Lab Consumables Restocked',
      desc: 'Hydrochloric acid, phenolphthalein, and test-tubes are now available at Lab Bay 2 for titration practicals.',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Term 1 • Week 7 • Academic Year 2025/2026</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, Mr. Kwame Mensah
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                You have 4 teaching sessions scheduled today (2 completed, 2 upcoming) and 1 pending attendance roll call.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/teacher/attendance">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs">
                  <ClipboardCheck className="h-4 w-4 mr-1.5" />
                  Quick Roll Call
                </Button>
              </Link>
              <Link href="/teacher/assessment">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium">
                  <Award className="h-4 w-4 mr-1.5" />
                  Enter Continuous Marks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick KPI Stat Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Today's Classes</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">4 Periods</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">2 completed</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Active Students</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">115</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Across 3 streams</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Pending Grading</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">14 Scripts</p>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">CA Class Test 2</p>
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
                  <p className="text-xs font-medium text-slate-500">My Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">98.5%</p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% on-time</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid: Today's Schedule & Actionable Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Today's Timetable / Classes (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Today's Teaching Schedule</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Live period tracker and classroom readiness
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 font-mono text-xs">
                  Wednesday, Term 1
                </Badge>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {todayClasses.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className={`mt-0.5 px-2.5 py-1.5 rounded-lg text-center font-mono text-xs font-semibold ${
                        item.status === 'CURRENT'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : item.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <div>{item.period}</div>
                        <div className="text-[10px] font-normal opacity-90">{item.time.split(' ')[0]}</div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{item.subject}</h4>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {item.class}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium">{item.topic}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1.5">
                          <span>Venue: {item.room}</span>
                          <span>•</span>
                          <span>{item.studentsCount} Students Registered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.attendanceDone ? (
                        <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Roll Call Marked
                        </span>
                      ) : (
                        <Link href="/teacher/attendance">
                          <Button size="sm" variant="outline" className="text-xs text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100">
                            <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                            Take Attendance
                          </Button>
                        </Link>
                      )}
                      <Link href="/teacher/lessons">
                        <Button size="sm" variant="ghost" className="text-xs text-slate-600 hover:text-slate-900">
                          Notes
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Teaching Resource & Lesson Prep Quick Access */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Current Lesson Modules & Material</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Syllabus progress aligned to GES / NaCCA curriculum guidelines
                  </CardDescription>
                </div>
                <Link href="/teacher/lessons">
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                    View All Modules <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">JHS 2 Integrated Science — Unit 3.2: Energy Conversions</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Slides, 2 PDF Worksheets, 1 Lab Guide attached</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-[11px]">
                    Week 7 Ready
                  </Badge>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">JHS 1 Core Mathematics — Unit 4.1: Linear Equations</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Homework 4 (25 questions) assigned • Due Friday</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-normal text-[11px]">
                    Active Homework
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Urgent Action Items & Notices (1 col) */}
          <div className="space-y-6">
            {/* Urgent Tasks */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900">Action Required</CardTitle>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                </div>
                <CardDescription className="text-xs text-slate-500">
                  Immediate deadlines & teaching items
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {task.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {task.badge}
                      </span>
                    </div>
                    <h5 className="font-semibold text-xs text-slate-900">{task.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.desc}</p>
                    <div className="mt-2 text-right">
                      <Link href={task.href}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 hover:text-blue-800 font-semibold p-0">
                          {task.actionText} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Exams & Tests */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Upcoming Assessments</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Scheduled examinations & invigilation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {upcomingExams.map((exam, i) => (
                  <div key={i} className="flex items-start space-x-3 p-2.5 rounded-lg border border-slate-100 bg-white">
                    <div className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-center text-xs font-bold leading-tight">
                      <div>{exam.date.split(' ')[0]}</div>
                      <div>{exam.date.split(' ')[1].replace(',', '')}</div>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900">{exam.title}</h5>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {exam.class} • {exam.duration}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{exam.venue}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* School Announcements */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900">Staff Announcements</CardTitle>
                  <Bell className="h-4 w-4 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {announcements.map((anc) => (
                  <div key={anc.id} className="text-xs border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-medium text-blue-600">{anc.sender}</span>
                      <span>{anc.time}</span>
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">{anc.title}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{anc.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  ArrowRight,
  ClipboardCheck,
  Bell,
  Sparkles,
  CreditCard,
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function StudentDashboardPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const todayClasses = [
    {
      period: 'Period 1',
      time: '08:00 - 08:45 AM',
      subject: 'Integrated Science',
      topic: 'Photosynthesis & Light-Dependent Reactions',
      room: 'Science Lab 1',
      teacher: 'Mr. Kwame Mensah',
      status: 'COMPLETED',
    },
    {
      period: 'Period 2',
      time: '08:50 - 09:35 AM',
      subject: 'English Language',
      topic: 'Direct & Indirect Speech Rules',
      room: 'Block B - Room 12',
      teacher: 'Ms. Cynthia Addo',
      status: 'COMPLETED',
    },
    {
      period: 'Period 3',
      time: '09:40 - 10:25 AM',
      subject: 'Core Mathematics',
      topic: 'Linear Equations & Cartesian Coordinates',
      room: 'Block B - Room 12',
      teacher: 'Mr. Kwame Mensah',
      status: 'UPCOMING',
    },
    {
      period: 'Period 5',
      time: '11:15 - 12:00 PM',
      subject: 'Social Studies',
      topic: 'The 1992 Constitution & Civic Responsibilities',
      room: 'Block B - Room 12',
      teacher: 'Mr. Ofori',
      status: 'UPCOMING',
    },
  ];

  const pendingAssignments = [
    {
      id: 'asg-1',
      title: 'Mathematics Homework 4: Linear Equations',
      subject: 'Core Mathematics',
      dueDate: 'Friday, 05:00 PM',
      status: 'PENDING',
      points: '25 Marks',
    },
    {
      id: 'asg-2',
      title: 'Science Lab Report: Titration Reaction',
      subject: 'Integrated Science',
      dueDate: 'Monday, 08:00 AM',
      status: 'IN_PROGRESS',
      points: '20 Marks',
    },
  ];

  const announcements = [
    {
      id: 'anc-1',
      title: 'Term 1 Mid-Term Examination Timetable Released',
      sender: 'Academic Directorate',
      date: 'Yesterday',
      desc: 'Examinations begin Nov 16 across all JHS streams. Revision materials available in your portal.',
    },
    {
      id: 'anc-2',
      title: 'Inter-House Athletics Competition Next Friday',
      sender: 'Sports & House Masters',
      date: '2 days ago',
      desc: 'All Aggrey House athletes are to report to the sports pavilion daily at 3:30 PM for track drills.',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Academic Year 2025/2026 • Term 1 • Week 7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, Kofi Ansah! 👋
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
              You have 2 classes remaining today, 2 active homework tasks, and a high term attendance rate of 98%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/assignments">
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs shadow-xs">
                <FileText className="h-4 w-4 mr-1.5" />
                Submit Homework
              </Button>
            </Link>
            <Link href="/student/grades">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs font-semibold">
                <Award className="h-4 w-4 mr-1.5" />
                View Report Card
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
                <p className="text-xs font-medium text-slate-500">Attendance Rate</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">98%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">58 of 60 days present</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Term Average</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">83.8%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Stanine Grade 1 (Distinction)</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
                <p className="text-2xl font-bold text-amber-600 mt-1">2 Due</p>
                <p className="text-[11px] text-amber-700 font-medium mt-0.5">Due before Friday</p>
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
                <p className="text-xs font-medium text-slate-500">Fee Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">GH₵ 0.00</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Fully Cleared (Term 1)</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Timetable & Actionable Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Timetable / Classes (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Today's Timetable Schedule</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Wednesday timetable for JHS 1 (Gold Stream)
                </CardDescription>
              </div>
              <Link href="/student/timetable">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                  Full Week View →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {todayClasses.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div className={`mt-0.5 px-2.5 py-1.5 rounded-lg text-center font-mono text-xs font-semibold ${
                      item.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}>
                      <div>{item.period}</div>
                      <div className="text-[10px] font-normal opacity-80">{item.time.split(' ')[0]}</div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{item.subject}</h4>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">{item.teacher}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{item.topic}</p>
                      <div className="text-[11px] text-slate-400 mt-1">Venue: {item.room}</div>
                    </div>
                  </div>

                  <div>
                    {item.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Attended
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Homework & Quizzes */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Active Assignments & Online Tests</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Items requiring preparation or submission
                </CardDescription>
              </div>
              <Link href="/student/assignments">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                  View All Tasks →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {pendingAssignments.map((asg) => (
                <div key={asg.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{asg.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{asg.subject} • {asg.points}</div>
                      <div className="text-[11px] font-semibold text-amber-700 mt-1">Due: {asg.dueDate}</div>
                    </div>
                  </div>

                  <Link href="/student/assignments">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                      Submit Work
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Notices, Exeat, House Info */}
        <div className="space-y-6">
          {/* Aggrey House & School Life */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">My House & Campus Life</CardTitle>
                <Compass className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="font-bold text-emerald-900 text-sm">Aggrey House (Green)</div>
                <div className="text-emerald-700 text-xs mt-0.5">House Master: Mr. Kwabena Mensah</div>
                <div className="text-slate-600 text-[11px] mt-1">Current House Standing: <strong>2nd Place (340 pts)</strong></div>
              </div>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Boarding Facility:</span>
                  <span className="font-semibold text-slate-800">Day Student (Non-Boarder)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">School Bus Route:</span>
                  <span className="font-semibold text-slate-800">Route 4 (Achimota - Dome)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Club Membership:</span>
                  <span className="font-semibold text-slate-800">Robotics & Science Club</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* School Notices */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Official Notices</CardTitle>
                <Bell className="h-4 w-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {announcements.map((anc) => (
                <div key={anc.id} className="text-xs border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-600">{anc.sender}</span>
                    <span>{anc.date}</span>
                  </div>
                  <p className="font-bold text-slate-900 mb-1">{anc.title}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{anc.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Self-Service Exeat / Document Request */}
          <Card className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-slate-200 shadow-xs">
            <CardContent className="p-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Need a Permission or Document?</h4>
              <p className="text-slate-500 mt-1">
                Submit an exeat request or order official transcripts and recommendation letters directly online.
              </p>
              <div className="mt-3">
                <Link href="/student/services">
                  <Button size="sm" variant="outline" className="w-full text-xs font-semibold bg-white border-slate-300 text-slate-800 hover:bg-slate-50">
                    Open Student Services Portal →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


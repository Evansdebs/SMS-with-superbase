'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  Plus,
  Users,
  Search,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest, getStoredSession } from '@/lib/api';
import { DonutChart, BarChart } from '@/components/ui/charts';

export default function SchoolDashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const school = session?.user?.school || {
    name: 'School Management Portal',
    schoolCode: 'PORTAL',
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const sess = getStoredSession();
      setSession(sess);

      // Fetch students and classes
      const [studentsRes, classesRes, teachersRes] = await Promise.all([
        apiRequest('/students?limit=5').catch(() => ({ data: [], meta: { total: 0 } })),
        apiRequest('/academics/classes').catch(() => []),
        apiRequest('/teachers').catch(() => []),
      ]);

      setRecentStudents(studentsRes?.data || []);
      setStats({
        totalStudents: studentsRes?.meta?.total || (studentsRes?.data?.length || 0),
        totalClasses: Array.isArray(classesRes) ? classesRes.length : 0,
        totalTeachers: Array.isArray(teachersRes) ? teachersRes.length : 0,
        attendanceRate: '100%',
      });
    } catch {
      setRecentStudents([]);
      setStats({
        totalStudents: 0,
        totalClasses: 0,
        totalTeachers: 0,
        attendanceRate: '0%',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Banner with Tenant Identity */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-7 shadow-sm mb-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-xs font-semibold tracking-wider bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-0.5 rounded">
                  TENANT: {school.schoolCode}
                </span>
                <span className="text-xs text-slate-400">Strict Data Isolation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {school.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Institutional administration dashboard. Manage admissions, curriculum, faculty, and student registries.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/school/students">
                <Button className="bg-white text-blue-950 hover:bg-blue-50 font-bold shadow-md">
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Admission
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Enrolled Students
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <GraduationCap className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents ?? 0}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Active Admissions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Teaching Faculty
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <UserCheck className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTeachers ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">Assigned to classes</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Classes
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <BookOpen className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClasses ?? 0}</div>
              <p className="text-xs text-slate-500 mt-1">KG, Primary & JHS tiers</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Attendance Rate
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.attendanceRate ?? '96%'}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Current Term Average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Performance Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fee Collection Breakdown */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-bold">Term 1 Fee Revenue Distribution</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Target collection: GHS 303,600 • 80% collection efficiency
                </CardDescription>
              </div>
              <Link href="/school/fees">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                  Fees Ledger
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-4 flex justify-center">
              <DonutChart
                data={[
                  { label: 'Fully Paid', value: 242500, color: '#10b981' },
                  { label: 'Partial Payments', value: 42900, color: '#f59e0b' },
                  { label: 'Unpaid / Arrears', value: 18200, color: '#f43f5e' },
                ]}
                centerValue="80%"
                centerLabel="Collected"
              />
            </CardContent>
          </Card>

          {/* Weekly Attendance Distribution */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-bold">Class Attendance Across Streams</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Present vs Target Enrollment by Year Group
                </CardDescription>
              </div>
              <Link href="/school/attendance">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                  Register
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2">
              <BarChart
                data={[
                  { label: 'Class 1', primary: 28, secondary: 30 },
                  { label: 'Class 2', primary: 31, secondary: 32 },
                  { label: 'Class 3', primary: 29, secondary: 30 },
                  { label: 'Class 4', primary: 33, secondary: 35 },
                  { label: 'Class 5', primary: 30, secondary: 32 },
                  { label: 'Class 6', primary: 34, secondary: 35 },
                  { label: 'JHS 1', primary: 32, secondary: 32 },
                  { label: 'JHS 2', primary: 29, secondary: 30 },
                  { label: 'JHS 3', primary: 28, secondary: 28 },
                ]}
                primaryLabel="Present"
                secondaryLabel="Enrolled"
                height={160}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
          <Link href="/school/students">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Students</span>
              <span className="text-[10px] text-slate-500">Admissions</span>
            </div>
          </Link>

          <Link href="/school/timetable">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Timetable</span>
              <span className="text-[10px] text-slate-500">Schedule</span>
            </div>
          </Link>

          <Link href="/school/assignments">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <ClipboardList className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Assignments</span>
              <span className="text-[10px] text-slate-500">Continuous Ass.</span>
            </div>
          </Link>

          <Link href="/school/announcements">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Notices</span>
              <span className="text-[10px] text-slate-500">Broadcasts</span>
            </div>
          </Link>

          <Link href="/school/calendar">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Calendar</span>
              <span className="text-[10px] text-slate-500">Term Events</span>
            </div>
          </Link>

          <Link href="/school/fees">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 hover:shadow-sm transition-all flex flex-col items-center text-center group">
              <div className="h-9 w-9 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold block">Fees & MoMo</span>
              <span className="text-[10px] text-slate-500">Finance Hub</span>
            </div>
          </Link>
        </div>

        {/* Recent Students Table */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Recent Student Admissions</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Students admitted under {school.name} ({school.schoolCode})
              </CardDescription>
            </div>
            <Link href="/school/students">
              <Button variant="outline" size="sm" className="text-xs">
                View All Students
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentStudents.length === 0 ? (
              <div className="py-10 text-center max-w-sm mx-auto">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  No Student Admissions Yet
                </h4>
                <p className="text-[11px] text-slate-500 mb-4">
                  Enrolled students will appear here in real-time as admissions are recorded.
                </p>
                <Link href="/school/students">
                  <Button size="sm" className="bg-slate-900 hover:bg-slate-850 text-white text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Enroll First Student
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Admission No.</th>
                      <th className="px-4 py-2.5">Student Name</th>
                      <th className="px-4 py-2.5">Current Class</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                          {s.admissionNumber}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {s.firstName} {s.lastName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {s.class?.name || 'Class'} {s.class?.stream ? `(${s.class.stream})` : ''}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success">{s.status || 'ACTIVE'}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/school/students?id=${s.id}`}>
                            <span className="text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white text-xs font-semibold cursor-pointer">
                              View Profile
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

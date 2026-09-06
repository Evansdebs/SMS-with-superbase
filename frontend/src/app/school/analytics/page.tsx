'use client';

import React, { useState, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  Award,
  Target,
  BookOpen,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  Download,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── Demo data ─────────────────────────────────────────────────────────────────

const TERM_OPTIONS = ['Term 1 – 2025/2026', 'Term 3 – 2024/2025', 'Term 2 – 2024/2025', 'Term 1 – 2024/2025'];

const OVERVIEW_STATS = [
  { label: 'Total Enrolment', value: 487, change: +12, icon: Users, color: 'blue' },
  { label: 'Avg. Academic Score', value: '74.3%', change: +2.1, icon: Award, color: 'emerald' },
  { label: 'Attendance Rate', value: '94.7%', change: -0.3, icon: BookOpen, color: 'violet' },
  { label: 'Fee Collection Rate', value: '81.2%', change: +5.8, icon: DollarSign, color: 'amber' },
];

const CLASS_PERFORMANCE = [
  { class: 'JHS 3 (Gold)', students: 38, avgScore: 79.4, passRate: 94.7, topScore: 96, bottomScore: 48 },
  { class: 'JHS 3 (Blue)', students: 36, avgScore: 75.1, passRate: 91.7, topScore: 93, bottomScore: 51 },
  { class: 'JHS 2 (Gold)', students: 41, avgScore: 72.8, passRate: 87.8, topScore: 91, bottomScore: 44 },
  { class: 'JHS 1 (Gold)', students: 44, avgScore: 70.6, passRate: 84.1, topScore: 89, bottomScore: 42 },
  { class: 'Class 6 (A)', students: 39, avgScore: 77.2, passRate: 92.3, topScore: 95, bottomScore: 53 },
  { class: 'Class 5 (A)', students: 42, avgScore: 73.5, passRate: 88.1, topScore: 90, bottomScore: 47 },
  { class: 'Class 4 (A)', students: 40, avgScore: 71.0, passRate: 85.0, topScore: 88, bottomScore: 45 },
  { class: 'Class 3 (A)', students: 43, avgScore: 69.4, passRate: 83.7, topScore: 87, bottomScore: 43 },
];

const SUBJECT_PERFORMANCE = [
  { subject: 'ICT & STEM', code: 'ICT', avgScore: 83.2, highestAvgClass: 'JHS 3 (Gold)', trend: 'up' },
  { subject: 'English Language', code: 'ENG', avgScore: 79.1, highestAvgClass: 'Class 6 (A)', trend: 'up' },
  { subject: 'Mathematics', code: 'MATH', avgScore: 76.4, highestAvgClass: 'JHS 3 (Gold)', trend: 'stable' },
  { subject: 'Integrated Science', code: 'SCI', avgScore: 73.8, highestAvgClass: 'JHS 2 (Gold)', trend: 'up' },
  { subject: 'Social Studies', code: 'SOC', avgScore: 71.2, highestAvgClass: 'JHS 1 (Gold)', trend: 'down' },
  { subject: 'Ghanaian Language', code: 'GHL', avgScore: 68.9, highestAvgClass: 'Class 5 (A)', trend: 'stable' },
  { subject: 'RME', code: 'RME', avgScore: 66.3, highestAvgClass: 'Class 4 (A)', trend: 'down' },
  { subject: 'Basic Design & Tech', code: 'BDT', avgScore: 64.1, highestAvgClass: 'JHS 2 (Gold)', trend: 'stable' },
];

const TOP_STUDENTS = [
  { rank: 1, name: 'Kwame Mensah', admNum: 'TLS-2025-001', class: 'JHS 3 (Gold)', avg: 91.4, grade: 'Grade 1' },
  { rank: 2, name: 'Efua Asante', admNum: 'TLS-2025-022', class: 'Class 6 (A)', avg: 90.2, grade: 'Grade 1' },
  { rank: 3, name: 'Nana Yaw Darko', admNum: 'TLS-2025-015', class: 'JHS 3 (Gold)', avg: 89.7, grade: 'Grade 1' },
  { rank: 4, name: 'Adwoa Asante', admNum: 'TLS-2025-033', class: 'JHS 2 (Gold)', avg: 88.9, grade: 'Grade 1' },
  { rank: 5, name: 'Kwabena Ofori', admNum: 'TLS-2025-041', class: 'Class 6 (A)', avg: 88.1, grade: 'Grade 1' },
];

const AT_RISK_STUDENTS = [
  { name: 'Emmanuel Tetteh', admNum: 'TLS-2025-087', class: 'JHS 1 (Gold)', avg: 38.2, absences: 9 },
  { name: 'Akua Mensah', admNum: 'TLS-2025-113', class: 'Class 4 (A)', avg: 42.5, absences: 7 },
  { name: 'Yaw Asante', admNum: 'TLS-2025-055', class: 'JHS 2 (Gold)', avg: 44.1, absences: 6 },
];

const ATTENDANCE_BY_WEEK = [68, 72, 78, 81, 75, 83, 88, 85, 90, 87, 92, 94];
const SCORE_DISTRIBUTION = [
  { range: '0–39 (F)', count: 14, color: '#ef4444' },
  { range: '40–49 (D)', count: 28, color: '#f97316' },
  { range: '50–59 (C)', count: 67, color: '#eab308' },
  { range: '60–74 (B)', count: 142, color: '#3b82f6' },
  { range: '75–89 (A)', count: 168, color: '#10b981' },
  { range: '90–100 (A+)', count: 68, color: '#8b5cf6' },
];

// ── Simple inline SVG charts ──────────────────────────────────────────────────

function MiniBarChart({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 12} 40`} className="w-full h-10" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * 36;
        return (
          <rect
            key={i}
            x={i * 12 + 1}
            y={40 - h}
            width={10}
            height={h}
            rx={2}
            fill={color}
            opacity={0.7 + (i / data.length) * 0.3}
          />
        );
      })}
    </svg>
  );
}

function ScoreDistributionBar() {
  const total = SCORE_DISTRIBUTION.reduce((s, d) => s + d.count, 0);
  return (
    <div className="space-y-2.5">
      {SCORE_DISTRIBUTION.map((d) => {
        const pct = (d.count / total) * 100;
        return (
          <div key={d.range} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 w-28 shrink-0">{d.range}</span>
            <div className="flex-1 h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: d.color }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
              {d.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function colorBadge(avg: number) {
  if (avg >= 80) return 'success';
  if (avg >= 65) return 'info';
  if (avg >= 50) return 'warning';
  return 'destructive';
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === 'down') return <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[0]);
  const [activeSection, setActiveSection] = useState<'overview' | 'classes' | 'subjects' | 'students'>('overview');

  const handleExportCSV = useCallback(() => {
    const rows = [
      ['Class', 'Students', 'Avg Score', 'Pass Rate', 'Top Score', 'Bottom Score'],
      ...CLASS_PERFORMANCE.map((c) => [c.class, c.students, c.avgScore, `${c.passRate}%`, c.topScore, c.bottomScore]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms-analytics-${selectedTerm.replace(/\s/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-blue-600" />
              Performance Analytics
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              School-wide academic insights, attendance trends, and at-risk student alerts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {OVERVIEW_STATS.map((stat) => {
            const Icon = stat.icon;
            const isUp = stat.change > 0;
            const isZero = stat.change === 0;
            return (
              <Card key={stat.label} className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950/40`}>
                      <Icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <span className={`flex items-center text-xs font-semibold ${
                      isZero ? 'text-slate-400' : isUp ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isUp ? <ArrowUpRight className="h-3 w-3" /> : isZero ? <Minus className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(stat.change)}{typeof stat.change === 'number' && stat.change % 1 !== 0 ? '' : ''}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section tabs */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 w-fit">
          {(['overview', 'classes', 'subjects', 'students'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                activeSection === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'classes' ? 'By Class' : tab === 'subjects' ? 'By Subject' : 'Students'}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance sparkline */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly Attendance Trend</CardTitle>
                <CardDescription>Last 12 school weeks — percentage present</CardDescription>
              </CardHeader>
              <CardContent>
                <MiniBarChart data={ATTENDANCE_BY_WEEK} color="#8b5cf6" />
                <div className="flex justify-between mt-2">
                  {ATTENDANCE_BY_WEEK.map((v, i) => (
                    <span key={i} className="text-[9px] text-slate-400">{v}%</span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score distribution */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Score Distribution</CardTitle>
                <CardDescription>Grade bands across all subjects this term</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreDistributionBar />
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-right">
                  Total: {SCORE_DISTRIBUTION.reduce((s, d) => s + d.count, 0)} student-subject entries
                </p>
              </CardContent>
            </Card>

            {/* At-Risk */}
            <Card className="border-slate-200 dark:border-slate-800 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  At-Risk Students
                </CardTitle>
                <CardDescription>Students scoring below 45% or with 6+ absences this term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {AT_RISK_STUDENTS.map((s) => (
                    <div key={s.admNum} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{s.admNum} · {s.class}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-rose-600">{s.avg}%</p>
                          <p className="text-xs text-slate-500">avg score</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-600">{s.absences}</p>
                          <p className="text-xs text-slate-500">absences</p>
                        </div>
                        <Badge variant="destructive" className="text-xs">At Risk</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* BY CLASS */}
        {activeSection === 'classes' && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Class Performance Breakdown</CardTitle>
              <CardDescription>Average score, pass rate, and score range per class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Rate</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {CLASS_PERFORMANCE.map((c) => (
                      <tr key={c.class} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">{c.class}</td>
                        <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">{c.students}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={colorBadge(c.avgScore)} className="font-mono text-xs">
                            {c.avgScore}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{c.passRate}%</span>
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.passRate}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="text-rose-600 font-medium">{c.bottomScore}</span>
                            <div className="flex-1 min-w-[80px] relative h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className="absolute h-full rounded-full bg-gradient-to-r from-rose-400 to-emerald-400"
                                style={{ left: `${c.bottomScore}%`, width: `${c.topScore - c.bottomScore}%` }}
                              />
                            </div>
                            <span className="text-emerald-600 font-medium">{c.topScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BY SUBJECT */}
        {activeSection === 'subjects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SUBJECT_PERFORMANCE.map((s) => (
              <Card key={s.code} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{s.subject}</p>
                      <p className="text-[10px] font-mono text-slate-400">{s.code}</p>
                    </div>
                    <TrendIcon trend={s.trend} />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{s.avgScore}%</p>
                  <div className="mt-2 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${s.avgScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Best class: <span className="font-semibold text-slate-700 dark:text-slate-300">{s.highestAvgClass}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TOP STUDENTS */}
        {activeSection === 'students' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Top 5 Students This Term
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TOP_STUDENTS.map((s) => (
                    <div key={s.admNum} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        s.rank === 1 ? 'bg-amber-100 text-amber-700' :
                        s.rank === 2 ? 'bg-slate-200 text-slate-600' :
                        s.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {s.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{s.class} · {s.admNum}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{s.avg}%</p>
                        <Badge variant="success" className="text-[10px]">{s.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Academic Improvement Index
                </CardTitle>
                <CardDescription>Term-over-term average score change by class level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { level: 'JHS 3', prev: 71.2, curr: 77.3, delta: +6.1 },
                  { level: 'JHS 2', prev: 68.5, curr: 72.8, delta: +4.3 },
                  { level: 'JHS 1', prev: 67.8, curr: 70.6, delta: +2.8 },
                  { level: 'Primary 6', prev: 73.1, curr: 77.2, delta: +4.1 },
                  { level: 'Primary 5', prev: 70.4, curr: 73.5, delta: +3.1 },
                  { level: 'Primary 4', prev: 68.2, curr: 71.0, delta: +2.8 },
                ].map((row) => (
                  <div key={row.level} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-20 shrink-0">{row.level}</span>
                    <div className="flex-1 relative h-6 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-60"
                        style={{ width: `${row.prev}%` }}
                      />
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${row.curr}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 w-12 text-right">+{row.delta}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

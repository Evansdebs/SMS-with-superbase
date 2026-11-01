'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Download,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { apiRequest, getStoredSession } from '@/lib/api';

export default function ParentAcademicsPage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');
  const [reportCard, setReportCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadResults(activeChildId);
  }, [activeChildId]);

  const child = mockChildren.find((c) => c.id === activeChildId) || mockChildren[0];

  const loadResults = async (childId: string) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/results/report-card/${childId}`);
      setReportCard(data);
    } catch (e) {
      // Child-specific fallback results
      if (childId === 'std-002') {
        setReportCard({
          performance: {
            totalScore: 437,
            average: '87.4',
            beceAggregate: { aggregate: 6, interpretation: 'Primary Division One (Excellent Distinction)' },
            subjects: [
              { subjectName: 'English & Creative Reading', score: 90, grade: 'Grade 1', remarks: 'Fluent speech and reading' },
              { subjectName: 'Primary Mathematics', score: 86, grade: 'Grade 1', remarks: 'Mastered multiplication and division' },
              { subjectName: 'Natural Science', score: 88, grade: 'Grade 1', remarks: 'Curious about nature & plant life' },
              { subjectName: 'Creative Arts & Music', score: 92, grade: 'Grade 1', remarks: 'Exceptional artistic expression' },
              { subjectName: 'Our World Our People', score: 81, grade: 'Grade 1', remarks: 'Well-mannered & attentive' },
            ],
          },
          remarks: {
            classTeacherRemarks: 'Akua is a delightful, hardworking student. Outstanding conduct.',
            headteacherRemarks: 'Superb results. Commended by the school council.',
          },
        });
      } else {
        setReportCard({
          performance: {
            totalScore: 419,
            average: '83.8',
            beceAggregate: { aggregate: 7, interpretation: 'BECE Aggregate 7 — Division One (Distinction)' },
            subjects: [
              { subjectName: 'Core Mathematics', score: 88, grade: 'Grade 1', remarks: 'High proficiency & analytical speed' },
              { subjectName: 'Integrated Science', score: 82, grade: 'Grade 1', remarks: 'Very inquisitive in laboratory experiments' },
              { subjectName: 'English Language', score: 76, grade: 'Grade 2', remarks: 'Good creative and essay expression' },
              { subjectName: 'Social Studies', score: 79, grade: 'Grade 2', remarks: 'Active in class debates' },
              { subjectName: 'Computing / ICT', score: 94, grade: 'Grade 1', remarks: 'Exceptional coding aptitude' },
            ],
          },
          remarks: {
            classTeacherRemarks: 'An outstanding academic term. Keep up this momentum.',
            headteacherRemarks: 'Excellent performance. Approved for commendation roll.',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const perf = reportCard?.performance;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Viewing Academic Record for: {child.name} ({child.class})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Results & Terminal Report Cards</h1>
          <p className="text-slate-600 text-sm mt-1">
            Official terminal results calculated on the GES Stanine 9-point scale with headmaster's endorsement.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Print Official Report Card PDF
          </Button>
        </div>
      </div>

      {/* Distinction Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">Terminal Performance Summary</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              {perf?.beceAggregate?.interpretation || 'Division One (Distinction)'}
            </h2>
            <p className="text-xs text-teal-100 mt-1">
              Terminal Score Average: <strong>{perf?.average}%</strong> • Academic Rank: <strong>Top 5% of Class</strong>
            </p>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-teal-500/40 sm:pl-6">
            <span className="text-xs text-teal-200">Term Attendance</span>
            <div className="text-3xl font-extrabold mt-0.5">{child.attendanceRate}</div>
            <span className="text-[11px] text-teal-100">Consistent on-time arrival</span>
          </div>
        </div>
      </div>

      {/* Terminal Marksheet */}
      <Card className="bg-white border-slate-200 shadow-xs mb-8">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Terminal Mark Breakdown: {child.name}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Continuous Assessment (50%) + Terminal Examination (50%)
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 font-mono text-xs">
            Term 1 Final
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Final Score (100)</th>
                <th className="py-3 px-4 text-center">Stanine Grade</th>
                <th className="py-3 px-4">Subject Master Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {perf?.subjects?.map((sub: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.subjectName}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800 text-sm">
                    {sub.score}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono font-bold ${
                        sub.grade === 'Grade 1'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-teal-50 text-teal-700 border-teal-300'
                      }`}
                    >
                      {sub.grade}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Endorsements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Master Appraisal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              "{reportCard?.remarks?.classTeacherRemarks}"
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Headmaster's Endorsement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              "{reportCard?.remarks?.headteacherRemarks}"
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


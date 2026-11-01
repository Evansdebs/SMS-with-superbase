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
import { apiRequest, getStoredSession } from '@/lib/api';

export default function StudentGradesPage() {
  const [session, setSession] = useState<any>(null);
  const [reportCard, setReportCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getStoredSession());
    loadGrades();
  }, []);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/results/report-card/std-001');
      setReportCard(data);
    } catch (e) {
      // Fallback
      setReportCard({
        school: {
          name: 'Demo International School',
          schoolCode: 'SCH001',
          academicYear: '2025/2026',
          currentTerm: 'Term 1',
        },
        student: {
          fullName: 'Kofi Ansah',
          admissionNumber: 'STD2026001',
          class: 'JHS 1 (Gold)',
        },
        attendance: {
          totalDays: 60,
          daysPresent: 58,
          attendanceRate: '97%',
        },
        performance: {
          totalScore: 419,
          average: '83.8',
          beceAggregate: {
            aggregate: 7,
            interpretation: 'Aggregate 7 — Division One (Distinction)',
          },
          subjects: [
            { subjectName: 'Core Mathematics', score: 88, grade: 'Grade 1', remarks: 'High proficiency & analytical speed' },
            { subjectName: 'Integrated Science', score: 82, grade: 'Grade 1', remarks: 'Very inquisitive in laboratory experiments' },
            { subjectName: 'English Language', score: 76, grade: 'Grade 2', remarks: 'Good creative and essay expression' },
            { subjectName: 'Social Studies', score: 79, grade: 'Grade 2', remarks: 'Active in class debates' },
            { subjectName: 'Computing / ICT', score: 94, grade: 'Grade 1', remarks: 'Exceptional coding and spreadsheet aptitude' },
          ],
        },
        remarks: {
          classTeacherRemarks: 'An outstanding academic term. Keep up this momentum.',
          headteacherRemarks: 'Excellent performance. Approved for commendation roll.',
        },
      });
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
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Terminal Examination & Continuous Assessment Results</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Results & Report Card</h1>
          <p className="text-slate-600 text-sm mt-1">
            Certified results calculated using the GES / WAEC Stanine 9-point grading scale (CA 50% / Exam 50%).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Print / Download PDF Report Slip
          </Button>
        </div>
      </div>

      {/* Distinction & Stanine Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Overall Performance</span>
            <h2 className="text-2xl font-bold mt-1">
              {perf?.beceAggregate?.interpretation || 'Division One (Distinction)'}
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              Terminal Score Average: <strong>{perf?.average}%</strong> • Best 6 Subjects Aggregate: <strong>{perf?.beceAggregate?.aggregate || 7}</strong>
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-emerald-500/40 sm:pl-6">
            <span className="text-xs text-emerald-100">Term Attendance</span>
            <div className="text-3xl font-extrabold mt-0.5">{reportCard?.attendance?.attendanceRate || '97%'}</div>
            <span className="text-[11px] text-emerald-100">58 of 60 sessions attended</span>
          </div>
        </div>
      </div>

      {/* Terminal Marksheet Table */}
      <Card className="bg-white border-slate-200 shadow-xs mb-8">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Terminal Mark Breakdown</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Score breakdown for Term 1 (Academic Year 2025/2026)
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-mono text-xs">
            Term 1 Final
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Final Score (100)</th>
                <th className="py-3 px-4 text-center">Stanine Scale</th>
                <th className="py-3 px-4">Subject Teacher Remarks</th>
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
                        sub.grade === 'Grade 1' || sub.grade === 'Grade 2'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
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

      {/* Official Teacher & Headmaster Sign-Off */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Teacher Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              "{reportCard?.remarks?.classTeacherRemarks}"
            </p>
            <div className="mt-3 text-[11px] text-slate-400">
              Signed: <strong>Mr. Kwame Mensah</strong> (Class Master)
            </div>
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
            <div className="mt-3 text-[11px] text-slate-400">
              Signed: <strong>Dr. David Mensah</strong> (Principal & Headmaster)
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


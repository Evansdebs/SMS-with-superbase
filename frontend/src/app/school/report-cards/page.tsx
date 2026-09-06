'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  FileDown,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function ReportCardsPage() {
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/students?limit=50')
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          const list = res.data.map((s: any) => ({
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            admissionNumber: s.admissionNumber,
            class: s.class?.name || 'Class',
          }));
          setStudentsList(list);
          setSelectedStudentId(list[0].id);
        } else {
          setStudentsList([]);
          setLoading(false);
        }
      })
      .catch(() => {
        setStudentsList([]);
        setLoading(false);
      });
  }, []);

  const loadReport = async (studentId: string) => {
    if (!studentId) {
      setReportData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest(`/results/report-card/${studentId}`);
      setReportData(data);
    } catch {
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      loadReport(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    loadReport(selectedStudentId);
  }, [selectedStudentId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Navigation - hidden during print */}
      <div className="print:hidden">
        <SchoolNav />
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Controls Header - hidden during print */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Report Cards</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Official Terminal Report Card</h1>
            <p className="text-xs text-slate-500">
              One-Page print & PDF certified student evaluation report.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
            >
              {studentsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class})
                </option>
              ))}
            </select>

            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 font-bold text-xs h-9 shadow-sm"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* ONE-PAGE PRINTABLE REPORT CARD CONTAINER */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Generating report card preview...</div>
        ) : !reportData ? (
          <Card className="max-w-md mx-auto p-12 text-center border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              No Terminal Report Cards Available
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Official student terminal report cards will appear once student enrollments and examination scores are recorded.
            </p>
            <Link href="/school/results">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm">
                Enter Examination Scores
              </Button>
            </Link>
          </Card>
        ) : (
          <div
            id="printable-report-card"
            className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-2 print:m-0 print:rounded-none max-w-[800px] mx-auto text-[11px] leading-tight"
          >
            {/* Header / Crest */}
            <div className="border-b-2 border-slate-900 pb-3 mb-3 text-center relative">
              <div className="flex items-center justify-center space-x-3 mb-1">
                <div className="h-12 w-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-serif font-black text-xl shadow-sm">
                  {reportData.school.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 font-serif">
                    {reportData.school.name}
                  </h2>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {reportData.school.address} • Tel: {reportData.school.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center space-x-2 mt-1">
                <span className="font-mono text-[9px] font-bold bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                  SCHOOL CODE: {reportData.school.schoolCode}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-900">
                  Terminal Academic Performance Report
                </span>
              </div>
            </div>

            {/* Student & Session Information Grid */}
            <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-3 text-[10px]">
              <div>
                <span className="text-slate-500 font-semibold block uppercase">Student Name</span>
                <span className="font-bold text-slate-900 text-[11px]">{reportData.student.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">Admission No.</span>
                <span className="font-mono font-bold text-blue-900 text-[11px]">{reportData.student.admissionNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">Class & Stream</span>
                <span className="font-bold text-slate-900">{reportData.student.class}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase">Academic Period</span>
                <span className="font-bold text-slate-900">{reportData.school.academicYear} • {reportData.school.currentTerm}</span>
              </div>
            </div>

            {/* Academic Results Table */}
            <div className="border border-slate-900 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-slate-900 text-white uppercase text-[9px] font-bold tracking-wider">
                  <tr>
                    <th className="px-2.5 py-1.5">Subject</th>
                    <th className="px-2 py-1.5 text-center">CA (50%)</th>
                    <th className="px-2 py-1.5 text-center">Exam (50%)</th>
                    <th className="px-2 py-1.5 text-center font-extrabold">Total (100%)</th>
                    <th className="px-2 py-1.5 text-center">Grade</th>
                    <th className="px-2.5 py-1.5">Teacher's Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportData.performance.subjects.map((s: any, i: number) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-2.5 py-1.5 font-semibold text-slate-900">
                        {s.subjectName} {s.isCore && <span className="text-[8px] text-blue-800 font-mono font-bold ml-1">(CORE)</span>}
                      </td>
                      <td className="px-2 py-1.5 text-center">{s.ca || Math.round(s.score * 0.45)}</td>
                      <td className="px-2 py-1.5 text-center">{s.exam || Math.round(s.score * 0.55)}</td>
                      <td className="px-2 py-1.5 text-center font-bold text-slate-950">{s.score}</td>
                      <td className="px-2 py-1.5 text-center font-mono font-black text-blue-900">{s.grade}</td>
                      <td className="px-2.5 py-1.5 text-slate-600 italic text-[9.5px]">{s.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Aggregate & Performance Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* BECE Aggregate or Performance Metrics */}
              <div className="border border-slate-300 rounded-lg p-2.5 bg-blue-50/40 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-extrabold text-blue-950 uppercase tracking-wider block">
                    {reportData.performance.beceAggregate ? 'Ghana BECE Stanine Aggregate (Best 6)' : 'Terminal Academic Summary'}
                  </span>
                  {reportData.performance.beceAggregate ? (
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className="text-2xl font-black font-mono text-blue-900">
                        AGGREGATE {reportData.performance.beceAggregate.aggregate}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800">
                        ({reportData.performance.beceAggregate.remark})
                      </span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-baseline space-x-3">
                      <div>
                        <span className="text-slate-500 text-[9px] block">Overall Total:</span>
                        <span className="font-bold text-base">{reportData.performance.totalScore}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[9px] block">Terminal Average:</span>
                        <span className="font-bold text-base text-blue-900">{reportData.performance.average}</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[8.5px] text-slate-500 mt-1">
                  * Computed based on 4 Core Subjects (English, Maths, Science, Social) + Best 2 Electives.
                </p>
              </div>

              {/* Attendance & Character */}
              <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-[10px] space-y-1">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-600 font-semibold">Attendance:</span>
                  <span className="font-bold">{reportData.attendance.daysPresent} / {reportData.attendance.totalDays} Days ({reportData.attendance.attendanceRate})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Conduct:</span>
                  <span className="font-medium text-slate-900">{reportData.remarks.conduct}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Attitude:</span>
                  <span className="font-medium text-slate-900">{reportData.remarks.attitude}</span>
                </div>
              </div>
            </div>

            {/* Remarks & Signatures Block */}
            <div className="border border-slate-300 rounded-lg p-2.5 bg-white space-y-2 mb-3 text-[10px]">
              <div>
                <span className="font-bold text-slate-900 block">Class Teacher's Remarks:</span>
                <p className="text-slate-700 italic">{reportData.remarks.classTeacherRemarks}</p>
              </div>
              <div className="pt-1.5 border-t border-slate-200">
                <span className="font-bold text-slate-900 block">Headteacher's Final Recommendation:</span>
                <p className="text-slate-700 italic">{reportData.remarks.headteacherRemarks}</p>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-300 text-center text-[9px]">
              <div>
                <div className="h-7 border-b border-slate-400 mb-1" />
                <span className="text-slate-600 font-medium">Class Teacher's Signature</span>
              </div>
              <div>
                <div className="h-7 border-b border-slate-400 mb-1" />
                <span className="text-slate-600 font-medium">Headteacher's Signature</span>
              </div>
              <div>
                <div className="h-7 border-b border-slate-400 mb-1" />
                <span className="text-slate-600 font-medium">Official School Seal</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Print CSS to guarantee 1 single page without scrollbars or multi-page spill */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 10px !important;
          }
          #printable-report-card {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

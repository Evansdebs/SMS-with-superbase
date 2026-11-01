'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Download,
  Users,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Award,
  Stethoscope,
  Bus,
  Library,
  Package,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportTemplate {
  id: string;
  category: 'STUDENT' | 'ACADEMIC' | 'FINANCE' | 'STAFF' | 'OPERATIONS';
  title: string;
  description: string;
  fields: string[];
  recordsCount: number;
  sampleData: Record<string, any>[];
}

export default function SchoolReportsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'STUDENT' | 'ACADEMIC' | 'FINANCE' | 'STAFF' | 'OPERATIONS'>('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reports: ReportTemplate[] = [
    {
      id: 'rep-stu-census',
      category: 'STUDENT',
      title: 'Active Students Census & Gender Distribution',
      description: 'Complete institutional roster with admission IDs, classes, gender balance, and house memberships.',
      fields: ['AdmissionNumber', 'FullName', 'Gender', 'Class', 'House', 'GuardianName', 'GuardianPhone', 'Status'],
      recordsCount: 148,
      sampleData: [
        { AdmissionNumber: 'TLS-2025-001', FullName: 'Kwame Mensah', Gender: 'Male', Class: 'JHS 1 (Gold)', House: 'Aggrey House', GuardianName: 'Kofi Mensah', GuardianPhone: '+233 24 999 8888', Status: 'ACTIVE' },
        { AdmissionNumber: 'TLS-2025-002', FullName: 'Akosua Osei', Gender: 'Female', Class: 'JHS 2 (Gold)', House: 'Guggisberg House', GuardianName: 'Ama Osei', GuardianPhone: '+233 20 777 6666', Status: 'ACTIVE' },
        { AdmissionNumber: 'TLS-2025-003', FullName: 'Emmanuel Appiah', Gender: 'Male', Class: 'Class 5 (Stream A)', House: 'Casely Hayford', GuardianName: 'Samuel Appiah', GuardianPhone: '+233 27 123 4567', Status: 'ACTIVE' },
      ],
    },
    {
      id: 'rep-acad-stanine',
      category: 'ACADEMIC',
      title: 'BECE Stanine Aggregate Summary (4-Core + 2-Best)',
      description: 'Continuous assessment (50%) + Exam (50%) raw score breakdown and official Stanine aggregates.',
      fields: ['AdmissionNo', 'StudentName', 'Class', 'English_Score', 'Math_Score', 'Science_Score', 'Social_Score', 'Stanine_Aggregate'],
      recordsCount: 42,
      sampleData: [
        { AdmissionNo: 'TLS-2025-001', StudentName: 'Kwame Mensah', Class: 'JHS 1 (Gold)', English_Score: '86% (Grade 2)', Math_Score: '92% (Grade 1)', Science_Score: '84% (Grade 2)', Social_Score: '88% (Grade 2)', Stanine_Aggregate: '07' },
        { AdmissionNo: 'TLS-2025-002', StudentName: 'Akosua Osei', Class: 'JHS 2 (Gold)', English_Score: '94% (Grade 1)', Math_Score: '88% (Grade 2)', Science_Score: '90% (Grade 1)', Social_Score: '92% (Grade 1)', Stanine_Aggregate: '06' },
      ],
    },
    {
      id: 'rep-fin-debtors',
      category: 'FINANCE',
      title: 'Fee Collection Audit & Outstanding Debtor Ledger',
      description: 'Termly tuition fee schedules, student balances, payment history, and collection percentages.',
      fields: ['AdmissionNumber', 'StudentName', 'Class', 'Term', 'TotalFee', 'PaidAmount', 'OutstandingBalance', 'Status'],
      recordsCount: 38,
      sampleData: [
        { AdmissionNumber: 'TLS-2025-002', StudentName: 'Akosua Osei', Class: 'JHS 2 (Gold)', Term: 'Term 1', TotalFee: 1950, PaidAmount: 1000, OutstandingBalance: 950, Status: 'PARTIAL' },
        { AdmissionNumber: 'TLS-2025-003', StudentName: 'Emmanuel Appiah', Class: 'Class 5 (Stream A)', Term: 'Term 1', TotalFee: 1450, PaidAmount: 0, OutstandingBalance: 1450, Status: 'UNPAID' },
      ],
    },
    {
      id: 'rep-stf-faculty',
      category: 'STAFF',
      title: 'Faculty & Non-Teaching Staff Qualifications Registry',
      description: 'Verified academic credentials, teaching subject allocations, contract statuses, and attendance logs.',
      fields: ['StaffId', 'FullName', 'RoleCategory', 'Designation', 'Department', 'Qualifications', 'Contact', 'AttendanceRate'],
      recordsCount: 24,
      sampleData: [
        { StaffId: 'EMP-TCH-001', FullName: 'David Mensah', RoleCategory: 'TEACHING', Designation: 'Senior Mathematics Tutor', Department: 'Mathematics & Computing', Qualifications: 'B.Ed Mathematics (UCC)', Contact: '+233 24 555 1111', AttendanceRate: '98%' },
        { StaffId: 'EMP-TCH-002', FullName: 'Cynthia Addo', RoleCategory: 'TEACHING', Designation: 'Head of Languages', Department: 'Languages Department', Qualifications: 'B.A English (UG), PGDE', Contact: '+233 20 444 2222', AttendanceRate: '96%' },
      ],
    },
    {
      id: 'rep-ops-visitors',
      category: 'OPERATIONS',
      title: 'Campus Front Office Security & Visitor Manifest',
      description: 'Daily visitor desk logs, badge tags, check-in timestamps, and departure records.',
      fields: ['TagNumber', 'VisitorName', 'Contact', 'Purpose', 'MeetingWith', 'CheckInTime', 'Status'],
      recordsCount: 86,
      sampleData: [
        { TagNumber: 'VIS-08', VisitorName: 'Patrick Ansah', Contact: '+233 24 456 7890', Purpose: 'Fee Payment Inquiry', MeetingWith: 'Bursar', CheckInTime: '08:30 AM', Status: 'CHECKED_IN' },
        { TagNumber: 'VIS-12', VisitorName: 'Rebecca Kwarteng', Contact: '+233 20 890 1234', Purpose: 'Parent Consultation', MeetingWith: 'JHS 1 Teacher', CheckInTime: '09:15 AM', Status: 'DEPARTED' },
      ],
    },
  ];

  const handleExportCSV = (report: ReportTemplate) => {
    if (!report.sampleData || report.sampleData.length === 0) return;
    const headers = report.fields;
    const csvContent = [
      headers.join(','),
      ...report.sampleData.map((row) =>
        headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`Downloaded ${report.title} (.csv)`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const filteredReports = reports.filter(
    (r) => selectedCategory === 'ALL' || r.category === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Cross-Module Reporting</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              <span>School Reporting &amp; Data Export Hub</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive institutional exports for Ministry of Education audits, parent statements, finance ledgers, and academic aggregates.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3.5 rounded-lg text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
            <button onClick={() => setDownloadSuccess(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'ALL', label: 'All Report Categories' },
            { id: 'STUDENT', label: 'Student Census' },
            { id: 'ACADEMIC', label: 'Academic & Stanine' },
            { id: 'FINANCE', label: 'Finance & Fee Debtors' },
            { id: 'STAFF', label: 'Staff & HR Credentials' },
            { id: 'OPERATIONS', label: 'Campus Operations & Security' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((rep) => (
            <Card key={rep.id} className="bg-white border-slate-200 shadow-sm flex flex-col justify-between p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {rep.category} REPORT
                  </span>
                  <Badge variant="success">READY FOR EXPORT</Badge>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-2">{rep.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.description}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Columns Included:</span>
                    <span className="font-semibold text-slate-900">{rep.fields.length} Data Attributes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Dataset Size:</span>
                    <span className="font-semibold text-slate-900">{rep.recordsCount} Records</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button
                  onClick={() => handleExportCSV(rep)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Download CSV Statement
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9"
                >
                  <Printer className="h-4 w-4 mr-1.5" />
                  Print View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}


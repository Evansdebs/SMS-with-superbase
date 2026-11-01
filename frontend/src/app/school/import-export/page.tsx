'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  GraduationCap,
  CreditCard,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ImportExportCenterPage() {
  const [selectedEntity, setSelectedEntity] = useState('STUDENTS');
  const [importSuccess, setImportSuccess] = useState(false);

  const importTemplates = [
    { name: 'Bulk Student Enrollment Template', entity: 'STUDENTS', file: 'students_import_template.xlsx', desc: 'Admission No, First Name, Last Name, Class, Gender, House, Guardian Phone' },
    { name: 'Bulk Parent & Guardian Directory', entity: 'PARENTS', file: 'parents_import_template.xlsx', desc: 'Full Name, Relationship, Phone Number, Email, Student Admission Link' },
    { name: 'Bulk Continuous Assessment Scores', entity: 'RESULTS', file: 'results_import_template.xlsx', desc: 'Student ID, Subject Code, Classwork (30), Test (20), Exam (50)' },
    { name: 'Faculty Staff & HR Master', entity: 'STAFF', file: 'staff_import_template.xlsx', desc: 'Staff ID, Name, Role, Department, Qualification, Basic Salary' },
    { name: 'Student Fee Invoicing Ledger', entity: 'FEES', file: 'fee_invoices_template.xlsx', desc: 'Student ID, Fee Structure Code, Amount Billed, Waiver Concession' },
  ];

  const handleSimulateImport = () => {
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 15 — Bulk Data Management & Interoperability</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bulk Import & Export Centre</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Batch import students, parents, teachers, CA results, and fees from Excel/CSV files, or export institutional archives.
          </p>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Batch import processed! 45 records validated, mapped, and synchronized into school database.
            </span>
          </div>
          <span>Status: COMPLETED</span>
        </div>
      )}

      {/* Main Grid: Upload & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload Box (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Upload Spreadsheet</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Supports Excel (.xlsx) and Comma-Separated Values (.csv)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Entity Module</label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                >
                  <option value="STUDENTS">Students & Admissions</option>
                  <option value="PARENTS">Parents & Guardians</option>
                  <option value="RESULTS">Continuous Assessment Scores</option>
                  <option value="STAFF">Faculty Staff & HR</option>
                  <option value="FEES">Fee Invoices & Payments</option>
                </select>
              </div>

              <div
                onClick={handleSimulateImport}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">Click to choose file or drag & drop</p>
                <p className="text-slate-400 text-[11px] mt-1">.xlsx or .csv up to 25 MB</p>
              </div>

              <Button
                onClick={handleSimulateImport}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
              >
                Validate & Import Records
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pre-formatted Downloadable Templates (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Download Excel Import Templates</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Pre-configured column headers ensuring zero mapping errors
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {importTemplates.map((t, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{t.desc}</p>
                    <span className="font-mono text-emerald-700 text-[10px] block mt-1">{t.file}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Downloading ${t.file} to your computer...`)}
                      className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> Download .XLSX
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


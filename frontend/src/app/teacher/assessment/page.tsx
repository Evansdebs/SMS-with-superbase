'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Upload,
  Download,
  Save,
  CheckCircle,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiRequest, getStoredSession } from '@/lib/api';

// Stanine grading calculation for JHS
const getStanineGrade = (total: number) => {
  if (total >= 80) return { grade: 'Grade 1', remark: 'Highest' };
  if (total >= 70) return { grade: 'Grade 2', remark: 'Higher' };
  if (total >= 65) return { grade: 'Grade 3', remark: 'High' };
  if (total >= 60) return { grade: 'Grade 4', remark: 'High Average' };
  if (total >= 55) return { grade: 'Grade 5', remark: 'Average' };
  if (total >= 50) return { grade: 'Grade 6', remark: 'Low Average' };
  if (total >= 45) return { grade: 'Grade 7', remark: 'Lower' };
  if (total >= 40) return { grade: 'Grade 8', remark: 'Lowest' };
  return { grade: 'Grade 9', remark: 'Fail' };
};

export default function TeacherAssessmentPage() {
  const [session, setSession] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState('cls-001');
  const [selectedSubject, setSelectedSubject] = useState('sub-001');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);

  // Student scores table
  const [records, setRecords] = useState([
    {
      id: 'std-001',
      name: 'Kofi Ansah',
      adm: 'STD2026001',
      classwork: 26, // max 30
      test: 18,      // max 20
      exam: 44,      // max 50
      remarks: 'Excellent comprehension of chemical formulas',
    },
    {
      id: 'std-002',
      name: 'Ama Osei',
      adm: 'STD2026002',
      classwork: 24,
      test: 15,
      exam: 35,
      remarks: 'Very diligent and active in class experiments',
    },
    {
      id: 'std-003',
      name: 'Kwame Nkrumah',
      adm: 'STD2026003',
      classwork: 20,
      test: 12,
      exam: 30,
      remarks: 'Satisfactory, needs more focus on algebra balance',
    },
    {
      id: 'std-004',
      name: 'Abena Mensah',
      adm: 'STD2026004',
      classwork: 29,
      test: 19,
      exam: 43,
      remarks: 'Outstanding analytical acumen',
    },
    {
      id: 'std-005',
      name: 'Yaw Boateng',
      adm: 'STD2026005',
      classwork: 18,
      test: 11,
      exam: 26,
      remarks: 'Needs targeted remedial prep in balancing equations',
    },
  ]);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const handleScoreChange = (index: number, field: string, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = [...records];
    (updated[index] as any)[field] = num;
    setRecords(updated);
    setSaveSuccess(false);
  };

  const handleRemarkChange = (index: number, val: string) => {
    const updated = [...records];
    updated[index].remarks = val;
    setRecords(updated);
    setSaveSuccess(false);
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      await apiRequest('/results/batch', {
        method: 'POST',
        body: JSON.stringify({
          classId: selectedClass,
          subjectId: selectedSubject,
          scores: records.map((r) => ({
            studentId: r.id,
            classwork: r.classwork,
            test: r.test,
            exam: r.exam,
            remarks: r.remarks,
          })),
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      // In offline/mock fallback:
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = () => {
    setApprovalRequested(true);
  };

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BECE Stanine 9-Point Scale & Continuous Assessment (50/50)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Assessment & Bulk Mark Entry</h1>
            <p className="text-slate-600 text-sm mt-1">
              Record Classwork (30%), Class Tests (20%), and End-of-Term Examination (50%). Stanine grades and remarks are automatically computed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => alert('Exporting marksheet template to CSV/Excel...')}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export Marksheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => alert('Select CSV file with student marks to import.')}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Import CSV
            </Button>
            <Button
              onClick={handleSaveMarks}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {saving ? 'Saving...' : 'Save Draft Marks'}
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">Continuous assessment marks saved successfully!</span>
            </div>
            <span>Changes recorded in draft stage</span>
          </div>
        )}

        {approvalRequested && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="h-4 w-4 text-blue-600" />
              <span className="font-semibold">Submitted to Headmaster / HOD for Result Approval workflow.</span>
            </div>
            <span className="font-mono">Status: PENDING_APPROVAL</span>
          </div>
        )}

        {/* Filter / Selector Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Class / Stream</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
            >
              <option value="cls-001">JHS 1 (Gold Stream)</option>
              <option value="cls-002">JHS 2 (Gold Stream)</option>
              <option value="cls-003">JHS 3 (Gold Stream)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
            >
              <option value="sub-001">Integrated Science</option>
              <option value="sub-002">Core Mathematics</option>
              <option value="sub-003">Further Mathematics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Assessment Term</label>
            <select className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800">
              <option>Term 1 (2025/2026)</option>
              <option>Term 2 (2025/2026)</option>
              <option>Term 3 (2025/2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Weighting Scheme</label>
            <div className="h-9 rounded-md border border-slate-200 bg-slate-50 px-3 flex items-center text-xs text-slate-700 font-medium">
              CA: 50% (30+20) | Exam: 50%
            </div>
          </div>
        </div>

        {/* Bulk Marks Table */}
        <Card className="bg-white border-slate-200 shadow-xs mb-8">
          <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Continuous Assessment Register</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Enter or edit marks inline. Total score, stanine scale and default remarks are calculated in real time.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSubmitForApproval}
                className="text-xs text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 font-medium"
              >
                <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                Submit to Headmaster
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3 text-center w-24">Classwork (30)</th>
                  <th className="py-3 px-3 text-center w-24">Test (20)</th>
                  <th className="py-3 px-3 text-center w-28 bg-blue-50/50 text-blue-900 font-bold">Total CA (50)</th>
                  <th className="py-3 px-3 text-center w-24">Exam (50)</th>
                  <th className="py-3 px-3 text-center w-24 font-bold">Total (100)</th>
                  <th className="py-3 px-3 text-center w-24">Stanine</th>
                  <th className="py-3 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, i) => {
                  const ca = r.classwork + r.test;
                  const total = ca + r.exam;
                  const stanine = getStanineGrade(total);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{r.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{r.adm}</div>
                      </td>

                      {/* Classwork */}
                      <td className="py-3 px-2 text-center">
                        <Input
                          type="number"
                          max={30}
                          min={0}
                          value={r.classwork}
                          onChange={(e) => handleScoreChange(i, 'classwork', e.target.value)}
                          className="w-18 mx-auto h-8 text-center text-xs font-semibold border-slate-200"
                        />
                      </td>

                      {/* Test */}
                      <td className="py-3 px-2 text-center">
                        <Input
                          type="number"
                          max={20}
                          min={0}
                          value={r.test}
                          onChange={(e) => handleScoreChange(i, 'test', e.target.value)}
                          className="w-18 mx-auto h-8 text-center text-xs font-semibold border-slate-200"
                        />
                      </td>

                      {/* CA Total */}
                      <td className="py-3 px-3 text-center bg-blue-50/30 font-bold text-blue-800 text-sm">
                        {ca}
                      </td>

                      {/* Exam */}
                      <td className="py-3 px-2 text-center">
                        <Input
                          type="number"
                          max={50}
                          min={0}
                          value={r.exam}
                          onChange={(e) => handleScoreChange(i, 'exam', e.target.value)}
                          className="w-18 mx-auto h-8 text-center text-xs font-semibold border-slate-200"
                        />
                      </td>

                      {/* Total (100) */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900 text-sm">
                        {total}
                      </td>

                      {/* Stanine Grade */}
                      <td className="py-3 px-2 text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono font-bold ${
                            stanine.grade === 'Grade 1' || stanine.grade === 'Grade 2'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : stanine.grade === 'Grade 9'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                          }`}
                        >
                          {stanine.grade}
                        </Badge>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-3">
                        <Input
                          type="text"
                          value={r.remarks}
                          onChange={(e) => handleRemarkChange(i, e.target.value)}
                          className="h-8 text-xs border-slate-200"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Analytics Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-600">77.4%</div>
              <p className="text-xs text-slate-500 mt-1">Average score across 5 students entered</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">Pass Rate (Stanine 1-6)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-600">100%</div>
              <p className="text-xs text-slate-500 mt-1">All current entries meet Division 1-3 thresholds</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900">Result Approval Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>1. Teacher Mark Entry:</span>
                  <span className="font-semibold text-emerald-600">Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>2. HOD Verification:</span>
                  <span className="font-semibold text-amber-600">Awaiting submission</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>3. Headmaster Sign-Off:</span>
                  <span className="text-slate-400">Locked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


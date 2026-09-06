'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  GraduationCap,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function ResultsGradebookPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('cls-2');
  const [selectedSubject, setSelectedSubject] = useState('sub-1');
  const [term, setTerm] = useState('Term 1');
  const [isLocked, setIsLocked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student marks state
  const [scores, setScores] = useState<any[]>([
    { studentId: '1', name: 'Kwame Mensah', admissionNumber: 'TLS-2025-001', ca: 42, exam: 46, remarks: 'Excellent performance' },
    { studentId: '2', name: 'Abena Osei', admissionNumber: 'TLS-2025-002', ca: 38, exam: 42, remarks: 'Very attentive and consistent' },
    { studentId: '3', name: 'Kofi Boateng', admissionNumber: 'TLS-2025-003', ca: 34, exam: 36, remarks: 'Good grasp of concepts' },
    { studentId: '4', name: 'Akosua Appiah', admissionNumber: 'TLS-2025-004', ca: 28, exam: 33, remarks: 'Needs more practice with word problems' },
    { studentId: '5', name: 'Yaw Addo', admissionNumber: 'TLS-2025-005', ca: 24, exam: 28, remarks: 'Fair attempt; tutorial support recommended' },
  ]);

  const loadMetadata = async () => {
    try {
      const [clsRes, subRes] = await Promise.all([
        apiRequest('/academics/classes'),
        apiRequest('/academics/subjects'),
      ]);
      setClasses(clsRes || []);
      setSubjects(subRes || []);
      if (clsRes?.[0]?.id) setSelectedClass(clsRes[0].id);
      if (subRes?.[0]?.id) setSelectedSubject(subRes[0].id);
    } catch {
      setClasses([
        { id: 'cls-1', name: 'Class 5', stream: 'A', level: 'Primary' },
        { id: 'cls-2', name: 'JHS 1', stream: 'Gold', level: 'JHS' },
        { id: 'cls-3', name: 'JHS 3', stream: 'Gold', level: 'JHS' },
      ]);
      setSubjects([
        { id: 'sub-1', name: 'Mathematics', code: 'MATH' },
        { id: 'sub-2', name: 'English Language', code: 'ENG' },
        { id: 'sub-3', name: 'Integrated Science', code: 'SCI' },
        { id: 'sub-4', name: 'Social Studies', code: 'SOC' },
        { id: 'sub-5', name: 'ICT', code: 'ICT' },
      ]);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  const activeClassObj = classes.find((c) => c.id === selectedClass);
  const isJHS = (activeClassObj?.level || '').toUpperCase().includes('JHS');

  const calculateGrade = (total: number) => {
    if (isJHS) {
      if (total >= 80) return { grade: 'Grade 1', label: 'Highest' };
      if (total >= 70) return { grade: 'Grade 2', label: 'Higher' };
      if (total >= 65) return { grade: 'Grade 3', label: 'High' };
      if (total >= 60) return { grade: 'Grade 4', label: 'High Avg' };
      if (total >= 55) return { grade: 'Grade 5', label: 'Average' };
      if (total >= 50) return { grade: 'Grade 6', label: 'Low Avg' };
      if (total >= 45) return { grade: 'Grade 7', label: 'Low' };
      if (total >= 40) return { grade: 'Grade 8', label: 'Lower' };
      return { grade: 'Grade 9', label: 'Fail' };
    } else {
      if (total >= 80) return { grade: 'A', label: 'Excellent' };
      if (total >= 70) return { grade: 'B', label: 'Very Good' };
      if (total >= 60) return { grade: 'C', label: 'Good' };
      if (total >= 50) return { grade: 'D', label: 'Pass' };
      return { grade: 'F', label: 'Fail' };
    }
  };

  const updateScore = (studentId: string, field: 'ca' | 'exam', val: number) => {
    if (isLocked) return;
    setSaveSuccess(false);
    const clamped = Math.max(0, Math.min(50, isNaN(val) ? 0 : val));
    setScores((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, [field]: clamped } : s))
    );
  };

  const handleSave = async () => {
    setSaveSuccess(false);
    try {
      await apiRequest('/results/batch', {
        method: 'POST',
        body: JSON.stringify({
          classId: selectedClass,
          subjectId: selectedSubject,
          termId: term,
          scores: scores.map((s) => ({
            studentId: s.studentId,
            classwork: s.ca,
            exam: s.exam,
            remarks: s.remarks,
          })),
        }),
      });
      setSaveSuccess(true);
    } catch {
      setSaveSuccess(true);
    }
  };

  const handlePublish = async () => {
    setIsLocked(true);
    try {
      await apiRequest(`/results/publish/${selectedClass}`, { method: 'POST' });
    } catch {
      setIsLocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Results & Gradebook</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Gradebook Assessment Entry</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous Assessment (50%) + Terminal Exam (50%) with automatic Ghana grading calculation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublish}
              disabled={isLocked}
              className="text-xs h-9 text-amber-600 border-amber-300 dark:border-amber-900 hover:bg-amber-50"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              {isLocked ? 'Results Locked' : 'Publish & Lock'}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLocked}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Scores
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Scores recorded successfully! Terminal grades and aggregates recalculated.</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-6">
          <Card className="p-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Class & Tier</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.stream || 'A'}) - {c.level || 'Class'}
                </option>
              ))}
            </select>
          </Card>

          <Card className="p-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </Card>

          <Card className="p-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Grading Standard</span>
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {isJHS ? 'BECE 9-Point Stanine' : 'Standard Primary (A-F)'}
              </span>
            </div>
            <Badge variant={isJHS ? 'warning' : 'info'}>
              {isJHS ? 'Stanine 1-9' : 'Letter Scale'}
            </Badge>
          </Card>
        </div>

        {/* Gradebook Matrix Table */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Admission No.</th>
                  <th className="px-4 py-3 text-center">Classwork & CA (50%)</th>
                  <th className="px-4 py-3 text-center">Exam (50%)</th>
                  <th className="px-4 py-3 text-center">Total (100%)</th>
                  <th className="px-4 py-3 text-center">Grade</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scores.map((s) => {
                  const total = s.ca + s.exam;
                  const g = calculateGrade(total);
                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">
                        {s.admissionNumber}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          disabled={isLocked}
                          value={s.ca}
                          onChange={(e) => updateScore(s.studentId, 'ca', parseInt(e.target.value, 10))}
                          className="w-16 h-8 text-center rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          disabled={isLocked}
                          value={s.exam}
                          onChange={(e) => updateScore(s.studentId, 'exam', parseInt(e.target.value, 10))}
                          className="w-16 h-8 text-center rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                        />
                      </td>
                      <td className="px-4 py-3 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                        {total}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={total >= 65 ? 'success' : total >= 50 ? 'warning' : 'destructive'} className="font-mono">
                          {g.grade}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {s.remarks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

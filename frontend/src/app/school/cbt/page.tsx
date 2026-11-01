'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Play,
  RotateCcw,
  ShieldAlert,
  BarChart3,
  FileCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Exam {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  durationMins: number;
  totalQuestions: number;
  totalMarks: number;
  scheduledDate: string;
  autoMarking: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function OnlineCbtExamsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'questionBank' | 'results'>('exams');
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);

  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'cbt-01',
      title: 'BECE Diagnostic Mock: Integrated Science Paper 1 (MCQ)',
      subject: 'Integrated Science',
      targetClass: 'JHS 3 (Gold)',
      durationMins: 45,
      totalQuestions: 40,
      totalMarks: 40,
      scheduledDate: 'Nov 16, 2026 • 09:00 AM',
      autoMarking: true,
      status: 'SCHEDULED',
    },
    {
      id: 'cbt-02',
      title: 'Term 1 Mid-Term Test: Core Mathematics Paper 1',
      subject: 'Core Mathematics',
      targetClass: 'JHS 1 (Gold)',
      durationMins: 30,
      totalQuestions: 25,
      totalMarks: 25,
      scheduledDate: 'Nov 18, 2026 • 10:30 AM',
      autoMarking: true,
      status: 'SCHEDULED',
    },
  ]);

  const [questionBank, setQuestionBank] = useState([
    {
      id: 'q-01',
      subject: 'Integrated Science',
      strand: 'Matter & Chemistry',
      text: 'Which of the following processes represents a chemical change?',
      options: ['A) Dissolving salt in water', 'B) Rusting of an iron nail', 'C) Melting of ice into liquid', 'D) Boiling ethanol'],
      correctAnswer: 'B) Rusting of an iron nail',
      difficulty: 'MEDIUM',
    },
    {
      id: 'q-02',
      subject: 'Core Mathematics',
      strand: 'Algebra',
      text: 'If 3x + 7 = 22, calculate the value of x.',
      options: ['A) 3', 'B) 5', 'C) 7', 'D) 15'],
      correctAnswer: 'B) 5',
      difficulty: 'EASY',
    },
    {
      id: 'q-03',
      subject: 'English Language',
      strand: 'Grammar',
      text: 'Select the sentence with correct subject-verb agreement.',
      options: ['A) The team of teachers are arriving.', 'B) The team of teachers is arriving.', 'C) Teachers is arriving.', 'D) The team were arriving.'],
      correctAnswer: 'B) The team of teachers is arriving.',
      difficulty: 'HARD',
    },
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 15 — Computer-Based Test (CBT) & Question Bank</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Online Examination & CBT Engine</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Create randomized question banks, timed auto-marked CBT papers, anti-cheating browser locks, and exam attempts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => alert('Launching question authoring wizard...')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Create CBT Paper
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Banked Questions</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">450 MCQs</div>
            <span className="text-[11px] text-slate-400">Across 8 subjects</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Scheduled CBT Tests</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">2 Active</div>
            <span className="text-[11px] text-indigo-600 font-medium">Auto-marking enabled</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Anti-Cheating Mode</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">Active</div>
            <span className="text-[11px] text-emerald-600 font-medium">Tab-switch detector</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Instant Grading</span>
            <div className="text-2xl font-extrabold text-teal-800 mt-1">100%</div>
            <span className="text-[11px] text-slate-400">Direct Stanine sync</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('exams')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'exams' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Scheduled CBT Exams ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questionBank')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'questionBank' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Curriculum Question Bank ({questionBank.length})</span>
        </button>
      </div>

      {/* Tab: Scheduled CBT Papers */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {exams.map((ex) => (
            <Card key={ex.id} className="bg-white border-slate-200 shadow-xs hover:border-indigo-200 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                      {ex.subject}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">{ex.targetClass}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600">{ex.durationMins} Mins Duration</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{ex.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {ex.totalQuestions} Questions • {ex.totalMarks} Total Marks • Schedule: <strong>{ex.scheduledDate}</strong>
                  </div>

                  <div className="mt-2 flex items-center space-x-3 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Auto-marking on submission & random question shuffling enabled</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => alert(`Previewing ${ex.title} in student testing environment...`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Play className="h-3.5 w-3.5 mr-1" /> Test Exam Simulator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Question Bank */}
      {activeTab === 'questionBank' && (
        <div className="space-y-4">
          {questionBank.map((q) => (
            <Card key={q.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono text-[10px]">
                      {q.id.toUpperCase()}
                    </Badge>
                    <span className="font-bold text-indigo-700">{q.subject}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{q.strand}</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    {q.difficulty}
                  </Badge>
                </div>

                <p className="font-bold text-slate-900 text-sm mt-1">{q.text}</p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-600">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-2 rounded-lg border text-xs ${
                      opt === q.correctAnswer
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      {opt} {opt === q.correctAnswer && <span className="text-[10px] text-emerald-600 ml-1">(Correct)</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


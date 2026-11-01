'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  FileText,
  Upload,
  Calendar,
  Download,
  Share2,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function TeacherLessonsPage() {
  const [session, setSession] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState('Integrated Science');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('JHS 2');
  const [newWeek, setNewWeek] = useState('Week 8');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [lessonPlans, setLessonPlans] = useState([
    {
      id: 'lp-01',
      title: 'Photosynthesis & Light-Dependent Reactions',
      subject: 'Integrated Science',
      class: 'JHS 2 (Gold)',
      week: 'Week 7',
      strand: 'Diversity of Matter & Life Processes',
      status: 'APPROVED',
      hodRemarks: 'Approved by Mr. Emmanuel Ofori (HOD) on Monday',
      filesCount: 3,
      homeworkSet: true,
      quizAvailable: true,
    },
    {
      id: 'lp-02',
      title: 'Acids, Bases & Neutralization Reactions',
      subject: 'Integrated Science',
      class: 'JHS 3 (Gold)',
      week: 'Week 7',
      strand: 'Chemical Substances & Practical Labs',
      status: 'APPROVED',
      hodRemarks: 'Approved with note: check glassware safety before titration',
      filesCount: 2,
      homeworkSet: true,
      quizAvailable: false,
    },
    {
      id: 'lp-03',
      title: 'Linear Equations & Coordinate Systems',
      subject: 'Core Mathematics',
      class: 'JHS 1 (Gold)',
      week: 'Week 7',
      strand: 'Algebra & Patterns',
      status: 'APPROVED',
      hodRemarks: 'Good breakdown of variables and balancing techniques',
      filesCount: 4,
      homeworkSet: true,
      quizAvailable: true,
    },
    {
      id: 'lp-04',
      title: 'Redox Reactions & Rust Prevention Mechanics',
      subject: 'Integrated Science',
      class: 'JHS 3 (Gold)',
      week: 'Week 8',
      strand: 'Chemical Substances',
      status: 'PENDING_REVIEW',
      hodRemarks: 'Submitted to HOD for sign-off',
      filesCount: 1,
      homeworkSet: false,
      quizAvailable: false,
    },
  ]);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newPlan = {
      id: `lp-0${lessonPlans.length + 1}`,
      title: newTitle,
      subject: selectedSubject,
      class: `${newClass} (Gold)`,
      week: newWeek,
      strand: 'General Sciences & Mathematics',
      status: 'PENDING_REVIEW',
      hodRemarks: 'Newly submitted for curriculum department approval',
      filesCount: 1,
      homeworkSet: false,
      quizAvailable: false,
    };

    setLessonPlans([newPlan, ...lessonPlans]);
    setNewTitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lesson Plans & Teaching Resources</h1>
            <p className="text-slate-600 text-sm mt-1">
              Organize weekly lesson notes, NaCCA-aligned learning materials, downloadable slides, and classroom homework.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create Lesson Plan
            </Button>
          </div>
        </div>

        {/* Modal for Creating Lesson Plan */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">New Lesson Plan Submission</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlan} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Topic / Title</label>
                  <Input
                    placeholder="e.g., Photosynthesis & Light-Dependent Reactions"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                    >
                      <option>Integrated Science</option>
                      <option>Core Mathematics</option>
                      <option>Further Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                    >
                      <option>JHS 1</option>
                      <option>JHS 2</option>
                      <option>JHS 3</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Week</label>
                    <select
                      value={newWeek}
                      onChange={(e) => setNewWeek(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                    >
                      <option>Week 7</option>
                      <option>Week 8</option>
                      <option>Week 9</option>
                      <option>Week 10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Notes / Slide</label>
                    <div className="h-9 border border-dashed border-slate-300 rounded-md flex items-center justify-center text-xs text-slate-500 cursor-pointer hover:bg-slate-50">
                      <Upload className="h-3.5 w-3.5 mr-1" /> Choose .pdf, .docx
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Submit to HOD
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lesson Plans List */}
        <div className="space-y-4">
          {lessonPlans.map((lp) => (
            <Card key={lp.id} className="bg-white border-slate-200 shadow-xs hover:border-blue-200 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-mono">
                          {lp.week}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                          {lp.class}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500">• {lp.subject}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{lp.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Strand: {lp.strand}</p>
                      <div className="mt-2 text-xs flex items-center space-x-2 text-slate-600">
                        <span className="font-medium text-slate-700">HOD Status:</span>
                        <span className="text-[11px] text-slate-500">{lp.hodRemarks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Badges */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                    <div className="flex items-center space-x-2">
                      {lp.status === 'APPROVED' ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="h-3 w-3 mr-1" /> Under Review
                        </span>
                      )}
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {lp.filesCount} Material Files
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs border-slate-200 text-slate-700 hover:text-slate-900">
                        <Download className="h-3.5 w-3.5 mr-1" /> Download Slides
                      </Button>
                      <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                        <Share2 className="h-3.5 w-3.5 mr-1" /> Share to Class
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sub-bar: Homework & Quizzes */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <FileCheck className="h-3.5 w-3.5 mr-1 text-blue-600" />
                      Homework Assigned: <strong className="ml-1 text-slate-800">{lp.homeworkSet ? 'Yes (Due Friday)' : 'None'}</strong>
                    </span>
                    <span className="flex items-center">
                      <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                      CBT Quiz: <strong className="ml-1 text-slate-800">{lp.quizAvailable ? 'Active (15 MCQs)' : 'Not Created'}</strong>
                    </span>
                  </div>
                  <Link href="/school/assignments" className="text-blue-600 hover:underline font-medium text-[11px] mt-1 sm:mt-0">
                    Manage Online Quizzes & Submissions →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}


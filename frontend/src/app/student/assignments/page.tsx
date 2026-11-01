'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Download,
  Calendar,
  Sparkles,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function StudentAssignmentsPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'homework' | 'quizzes' | 'submitted'>('homework');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const homeworkList = [
    {
      id: 'hw-01',
      title: 'Mathematics Homework 4: Linear Equations',
      subject: 'Core Mathematics',
      teacher: 'Mr. Kwame Mensah',
      dueDate: 'Friday, Nov 07 • 05:00 PM',
      totalMarks: 25,
      description: 'Solve questions 1 through 15 on page 84 of the textbook. Show all intermediate balancing steps.',
      hasAttachment: true,
      status: 'PENDING',
    },
    {
      id: 'hw-02',
      title: 'Science Practical Lab Write-Up: Acid-Base Neutralization',
      subject: 'Integrated Science',
      teacher: 'Mr. Kwame Mensah',
      dueDate: 'Monday, Nov 10 • 08:00 AM',
      totalMarks: 20,
      description: 'Document observations, chemical equation balancing, and titration graph based on Wednesday\'s lab session.',
      hasAttachment: true,
      status: 'PENDING',
    },
    {
      id: 'hw-03',
      title: 'English Essay: The Importance of Digital Literacy in Modern Ghana',
      subject: 'English Language',
      teacher: 'Ms. Cynthia Addo',
      dueDate: 'Wednesday, Nov 12 • 02:00 PM',
      totalMarks: 30,
      description: 'A 350-word descriptive essay following formal letter/essay conventions.',
      hasAttachment: false,
      status: 'PENDING',
    },
  ];

  const quizzesList = [
    {
      id: 'qz-01',
      title: 'CBT Quiz 2: Photosynthesis & Chloroplast Organelles',
      subject: 'Integrated Science',
      duration: '20 Minutes',
      questionsCount: 15,
      type: 'Computer-Based Test (MCQ)',
      deadline: 'Open until Sunday midnight',
      status: 'AVAILABLE',
    },
    {
      id: 'qz-02',
      title: 'Speed Drill: Algebra & Factorization',
      subject: 'Core Mathematics',
      duration: '15 Minutes',
      questionsCount: 10,
      type: 'Timed Drill',
      deadline: 'Open until Friday 6:00 PM',
      status: 'AVAILABLE',
    },
  ];

  const submittedList = [
    {
      id: 'sub-01',
      title: 'Homework 3: Integers and Rational Numbers',
      subject: 'Core Mathematics',
      submittedOn: 'Oct 25, 2026',
      score: '24 / 25',
      grade: 'Grade 1 (96%)',
      feedback: 'Excellent step-by-step logic. Keep up the neat handwriting.',
      status: 'GRADED',
    },
    {
      id: 'sub-02',
      title: 'Science Unit 2: Living Things Classification',
      subject: 'Integrated Science',
      submittedOn: 'Oct 21, 2026',
      score: '19 / 20',
      grade: 'Grade 1 (95%)',
      feedback: 'Very thorough taxonomy chart. Well executed.',
      status: 'GRADED',
    },
  ];

  const handleOpenSubmit = (task: any) => {
    setSelectedTask(task);
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSuccess(true);
    setShowSubmitModal(false);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homework, Assignments & CBT Quizzes</h1>
          <p className="text-slate-600 text-sm mt-1">
            Submit your completed homework files, take online timed tests, and view teacher feedback and grades.
          </p>
        </div>
      </div>

      {submittedSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Assignment submitted successfully to teacher's grading inbox!</span>
          </div>
          <span>Marked as SUBMITTED</span>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Submit Assignment</h3>
                <p className="text-xs text-slate-500">{selectedTask.title}</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Homework File</label>
                <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer">
                  <Upload className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Click to upload document or photos</p>
                  <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX, JPG, PNG (Max 15 MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Student Note to Teacher</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Please check question 12 as I tried both method A and B..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Submit Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('homework')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'homework'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Active Homework ({homeworkList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'quizzes'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Online CBT Quizzes ({quizzesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submitted')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'submitted'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Graded Work & Feedback ({submittedList.length})</span>
        </button>
      </div>

      {/* Tab: Homework */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          {homeworkList.map((hw) => (
            <Card key={hw.id} className="bg-white border-slate-200 shadow-xs hover:border-indigo-200 transition-all">
              <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                        {hw.subject}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-600">Assigned by {hw.teacher}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-700">{hw.totalMarks} Marks</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">{hw.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">{hw.description}</p>

                    <div className="flex items-center space-x-3 text-xs text-amber-700 font-semibold mt-2.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Due: {hw.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleOpenSubmit(hw)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" /> Submit Homework
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizzesList.map((qz) => (
            <Card key={qz.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                        {qz.subject}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-600">{qz.duration}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600">{qz.questionsCount} Multiple Choice Questions</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">{qz.title}</h3>
                    <div className="text-xs text-slate-500 mt-1">Status: {qz.deadline}</div>
                  </div>
                </div>

                <div>
                  <Button
                    size="sm"
                    onClick={() => alert(`Launching ${qz.title} examination simulator environment...`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Start Test Simulator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Submitted & Graded */}
      {activeTab === 'submitted' && (
        <div className="space-y-4">
          {submittedList.map((sub) => (
            <Card key={sub.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {sub.subject}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Submitted on {sub.submittedOn}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{sub.title}</h3>

                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-700">Teacher's Feedback:</span>
                    <p className="text-slate-600 mt-0.5">{sub.feedback}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl font-extrabold text-emerald-700">{sub.score}</div>
                  <div className="text-xs font-semibold text-emerald-600">{sub.grade}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}


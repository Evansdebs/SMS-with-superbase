'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Users,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
  submittedCount: number;
  totalStudents: number;
  teacher: string;
  status: 'ACTIVE' | 'DUE_SOON' | 'CLOSED';
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSubmissionsModal, setActiveSubmissionsModal] = useState<AssignmentItem | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // New assignment form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    className: 'JHS 1 (Gold)',
    subject: 'Mathematics',
    dueDate: '2025-09-25',
    totalMarks: 30,
  });

  const filtered = assignments.filter((asg) => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asg.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asg.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'ALL' || asg.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newAsg: AssignmentItem = {
      id: `asg-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      className: formData.className,
      subject: formData.subject,
      dueDate: formData.dueDate,
      totalMarks: Number(formData.totalMarks),
      submittedCount: 0,
      totalStudents: 32,
      teacher: 'Current Teacher',
      status: 'ACTIVE',
    };

    setAssignments([newAsg, ...assignments]);
    setFormData({
      title: '',
      description: '',
      className: 'JHS 1 (Gold)',
      subject: 'Mathematics',
      dueDate: '2025-09-25',
      totalMarks: 30,
    });
    setIsCreateModalOpen(false);
  };

  const handleScoreChange = (id: string, newScore: number) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score: newScore, graded: true } : s))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Academics & Continuous Assessment
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Homework & Tasks</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Class Assignments & Homework
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create homework tasks, monitor student submission rates, and record marks into the gradebook.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Assignments</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {assignments.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Active Tasks</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {assignments.filter((a) => a.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Due This Week</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {assignments.filter((a) => a.status === 'DUE_SOON').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Avg Submission Rate</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">87%</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search assignments, classes, teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Integrated Science">Integrated Science</option>
              <option value="English Language">English Language</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
        </div>

        {/* Assignment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((asg) => {
            const submissionPercent = Math.round((asg.submittedCount / asg.totalStudents) * 100);

            return (
              <Card
                key={asg.id}
                className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {asg.className}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {asg.subject}
                        </Badge>
                        <Badge
                          variant={
                            asg.status === 'ACTIVE'
                              ? 'info'
                              : asg.status === 'DUE_SOON'
                              ? 'warning'
                              : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {asg.status === 'DUE_SOON' ? 'Due Soon' : asg.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                        {asg.title}
                      </CardTitle>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {asg.totalMarks}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Marks</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  {/* Submission Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Submissions
                      </span>
                      <span className="text-slate-900 dark:text-white font-semibold">
                        {asg.submittedCount} / {asg.totalStudents} ({submissionPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                        style={{ width: `${submissionPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Due: {asg.dueDate}</span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveSubmissionsModal(asg)}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Submissions & Marks</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        description="Publish homework or assessment task for class students"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assignment Title *
            </label>
            <Input
              required
              placeholder="e.g. End of Unit Problem Set"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Class *
              </label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="JHS 1 (Gold)">JHS 1 (Gold)</option>
                <option value="JHS 2 (Silver)">JHS 2 (Silver)</option>
                <option value="JHS 3 (Bronze)">JHS 3 (Bronze)</option>
                <option value="Class 6 (Alpha)">Class 6 (Alpha)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Integrated Science">Integrated Science</option>
                <option value="English Language">English Language</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due Date *
              </label>
              <Input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Total Marks
              </label>
              <Input
                type="number"
                required
                min={5}
                max={100}
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instructions & Questions
            </label>
            <textarea
              rows={3}
              placeholder="Detail the task objectives, textbook pages, submission format..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submissions & Grading Modal */}
      {activeSubmissionsModal && (
        <Modal
          isOpen={!!activeSubmissionsModal}
          onClose={() => setActiveSubmissionsModal(null)}
          title={`Submissions — ${activeSubmissionsModal.title}`}
          description={`${activeSubmissionsModal.className} • Total Marks: ${activeSubmissionsModal.totalMarks}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Admission No</th>
                    <th className="p-3">Submission</th>
                    <th className="p-3 text-right">Score / {activeSubmissionsModal.totalMarks}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {sub.studentName}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{sub.admissionNumber}</td>
                      <td className="p-3">
                        {sub.submittedAt === 'Pending Submission' ? (
                          <Badge variant="outline" className="text-[10px]">
                            Pending
                          </Badge>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            {sub.submittedAt}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          min={0}
                          max={activeSubmissionsModal.totalMarks}
                          value={sub.score ?? ''}
                          placeholder="Score"
                          onChange={(e) => handleScoreChange(sub.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 text-right text-xs font-mono font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Grades save automatically to the continuous assessment register.
              </span>
              <Button
                onClick={() => setActiveSubmissionsModal(null)}
                className="text-xs font-semibold"
              >
                Close Gradebook
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

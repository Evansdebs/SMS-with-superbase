'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Layers,
  GraduationCap,
  Calendar,
  Sparkles,
  Home,
  CheckCircle2,
  Sliders,
  Award,
  Clock,
  UserCheck,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'classes' | 'departments' | 'subjects' | 'houses' | 'calendar' | 'grading'>('classes');
  const [classes, setClasses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal forms
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);

  // New Class Form
  const [newClass, setNewClass] = useState({ name: '', stream: 'Gold', level: 'JHS', departmentId: '' });
  // New Department Form
  const [newDept, setNewDept] = useState({ name: '', description: '', headOfDepartment: '' });
  // New Subject Form
  const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '' });
  // New House Form
  const [newHouse, setNewHouse] = useState({ name: '', color: 'Yellow', motto: '', master: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [clsRes, deptsRes, subsRes, hseRes, ayRes] = await Promise.all([
        apiRequest('/academics/classes'),
        apiRequest('/academics/departments'),
        apiRequest('/academics/subjects'),
        apiRequest('/academics/houses'),
        apiRequest('/academics/academic-years'),
      ]);
      setClasses(Array.isArray(clsRes) ? clsRes : clsRes?.data || []);
      setDepartments(Array.isArray(deptsRes) ? deptsRes : deptsRes?.data || []);
      setSubjects(Array.isArray(subsRes) ? subsRes : subsRes?.data || []);
      setHouses(Array.isArray(hseRes) ? hseRes : hseRes?.data || []);
      setAcademicYears(Array.isArray(ayRes) ? ayRes : ayRes?.data || []);
    } catch {
      // Offline fallback Ghanaian defaults
      setClasses([
        { id: '1', name: 'KG 1', stream: 'A', level: 'KG' },
        { id: '2', name: 'KG 2', stream: 'A', level: 'KG' },
        { id: '3', name: 'Class 1', stream: 'A', level: 'Primary' },
        { id: '4', name: 'Class 2', stream: 'A', level: 'Primary' },
        { id: '5', name: 'Class 3', stream: 'A', level: 'Primary' },
        { id: '6', name: 'Class 4', stream: 'A', level: 'Primary' },
        { id: '7', name: 'Class 5', stream: 'A', level: 'Primary' },
        { id: '8', name: 'Class 6', stream: 'A', level: 'Primary' },
        { id: '9', name: 'JHS 1', stream: 'Gold', level: 'JHS' },
        { id: '10', name: 'JHS 2', stream: 'Gold', level: 'JHS' },
        { id: '11', name: 'JHS 3', stream: 'Gold', level: 'JHS' },
      ]);
      setDepartments([
        { id: '1', name: 'Kindergarten', description: 'Early childhood foundation', headOfDepartment: 'Mrs. Cynthia Addo', _count: { classes: 2 } },
        { id: '2', name: 'Primary School', description: 'Lower and upper primary (Class 1-6)', headOfDepartment: 'Mr. David Mensah', _count: { classes: 6 } },
        { id: '3', name: 'Junior High School', description: 'BECE preparation tier (JHS 1-3)', headOfDepartment: 'Mr. Emmanuel Ofori', _count: { classes: 3 } },
      ]);
      setSubjects([
        { id: '1', name: 'English Language', code: 'ENG', description: 'Grammar, Reading & Composition' },
        { id: '2', name: 'Mathematics', code: 'MATH', description: 'Arithmetic, Geometry & Algebra' },
        { id: '3', name: 'Integrated Science', code: 'SCI', description: 'Biology, Physics & Chemistry' },
        { id: '4', name: 'Social Studies', code: 'SOC', description: 'Ghanaian History & Environment' },
        { id: '5', name: 'Information & Communication Tech (ICT)', code: 'ICT', description: 'Computer Applications' },
        { id: '6', name: 'Ghanaian Language & Culture', code: 'GHL', description: 'Twi & Indigenous Culture' },
        { id: '7', name: 'Religious & Moral Education (RME)', code: 'RME', description: 'Morals and Ethics' },
        { id: '8', name: 'Basic Design & Technology (BDT)', code: 'BDT', description: 'Pre-technical Skills' },
      ]);
      setHouses([
        { id: '1', name: 'Aggrey House', color: 'Yellow', motto: 'Only the Best', master: 'Mr. David Mensah', studentsCount: 42 },
        { id: '2', name: 'Guggisberg House', color: 'Blue', motto: 'Perseverance Overcomes', master: 'Mrs. Cynthia Addo', studentsCount: 39 },
        { id: '3', name: 'Casely Hayford House', color: 'Green', motto: 'Leadership and Vision', master: 'Mr. Emmanuel Ofori', studentsCount: 45 },
        { id: '4', name: 'Yaa Asantewaa House', color: 'Red', motto: 'Bravery and Honor', master: 'Ms. Grace Darko', studentsCount: 40 },
      ]);
      setAcademicYears([
        { id: 'ay-1', name: '2025/2026', startDate: '2025-09-08', endDate: '2026-07-24', isActive: true, currentTerm: 'Term 1' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/classes', { method: 'POST', body: JSON.stringify(newClass) });
      setIsClassModalOpen(false);
      loadData();
    } catch {
      setClasses([...classes, { id: `cls-${Date.now()}`, ...newClass }]);
      setIsClassModalOpen(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/departments', { method: 'POST', body: JSON.stringify(newDept) });
      setIsDeptModalOpen(false);
      loadData();
    } catch {
      setDepartments([...departments, { id: `dept-${Date.now()}`, ...newDept, _count: { classes: 0 } }]);
      setIsDeptModalOpen(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/subjects', { method: 'POST', body: JSON.stringify(newSubject) });
      setIsSubjectModalOpen(false);
      loadData();
    } catch {
      setSubjects([...subjects, { id: `sub-${Date.now()}`, ...newSubject }]);
      setIsSubjectModalOpen(false);
    }
  };

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/houses', { method: 'POST', body: JSON.stringify(newHouse) });
      setIsHouseModalOpen(false);
      loadData();
    } catch {
      setHouses([...houses, { id: `hse-${Date.now()}`, ...newHouse, studentsCount: 0 }]);
      setIsHouseModalOpen(false);
    }
  };

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
              <span>School Administration</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span>Academic Architecture &amp; Settings</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure school curriculum, departments, classes, streams, houses, academic terms, and grading scales.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'classes' && (
              <Button
                onClick={() => setIsClassModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add New Class
              </Button>
            )}
            {activeTab === 'departments' && (
              <Button
                onClick={() => setIsDeptModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Department
              </Button>
            )}
            {activeTab === 'subjects' && (
              <Button
                onClick={() => setIsSubjectModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Subject
              </Button>
            )}
            {activeTab === 'houses' && (
              <Button
                onClick={() => setIsHouseModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add School House
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex flex-wrap gap-4 text-xs">
          <button
            onClick={() => setActiveTab('classes')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'classes'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Classes &amp; Streams ({classes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'departments'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Departments ({departments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'subjects'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Curriculum &amp; Subjects ({subjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'houses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Houses ({houses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'calendar'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Academic Year &amp; Terms</span>
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'grading'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Grading Rules &amp; Stanine</span>
          </button>
        </div>

        {/* Tab 1: Classes & Streams */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="bg-white border-slate-200 shadow-sm hover:border-slate-300 transition-all p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Level: {cls.level || 'Primary'}
                    </span>
                    <Badge variant="secondary">Stream {cls.stream || 'A'}</Badge>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-1">{cls.name}</h3>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span>Enrolled: <b>{cls._count?.students || 35} Students</b></span>
                    <Link href={`/school/students?class=${encodeURIComponent(cls.name)}`} className="text-blue-600 hover:underline">
                      Roster →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Departments */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="bg-white border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">DEPT_{dept.id}</span>
                  <Badge variant="success">{dept._count?.classes || 0} Classes</Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500">{dept.description || 'Institutional department tier'}</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Head of Department:</span>
                  <span className="font-medium text-slate-900">{dept.headOfDepartment || 'Unassigned'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Subjects & Curriculum */}
        {activeTab === 'subjects' && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">National &amp; Institutional Curriculum Subjects</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Core subjects and electives taught in academic continuous assessments and exams.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Subject Name</th>
                      <th className="px-4 py-3">Description &amp; Syllabus</th>
                      <th className="px-4 py-3">Weighting</th>
                      <th className="px-4 py-3 text-right">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{sub.code || 'ENG'}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="px-4 py-3 text-slate-500">{sub.description || 'GES Syllabus standard'}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">50% CA + 50% Exam</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant="secondary">Core</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Houses */}
        {activeTab === 'houses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {houses.map((h) => (
              <Card key={h.id} className="bg-white border-slate-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: h.color?.toLowerCase() || 'yellow' }} />
                  <Badge variant="secondary">{h.studentsCount || 0} Members</Badge>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{h.name}</h3>
                <div className="text-xs italic text-slate-500">&quot;{h.motto || 'Excellence'}&quot;</div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">House Master:</span>
                  <span className="font-medium text-slate-900">{h.master || 'Staff Member'}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 5: Academic Calendar & Sessions */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900">Current Academic Session Configuration</h3>
              <p className="text-xs text-slate-500 mt-0.5">Define active term dates, school reopening, midterm break, and vacation.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Academic Year</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">2025 / 2026</div>
                  <Badge variant="success" className="mt-2">ACTIVE SESSION</Badge>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Term</span>
                  <div className="text-xl font-bold text-blue-600 mt-1">Term 1 (First Term)</div>
                  <div className="text-xs text-slate-500 mt-1">Sep 8, 2025 – Dec 19, 2025</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Next Vacation Period</span>
                  <div className="text-xl font-bold text-amber-600 mt-1">3 Weeks</div>
                  <div className="text-xs text-slate-500 mt-1">Dec 20, 2025 – Jan 12, 2026</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 6: Grading Rules & Stanine Configuration */}
        {activeTab === 'grading' && (
          <Card className="bg-white border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Ghana BECE 9-Point Stanine Grading Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation bands mapped to CA (50%) + Exam (50%) totals for Junior High School and general standards.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Stanine Grade</th>
                    <th className="px-4 py-2.5">Score Range (%)</th>
                    <th className="px-4 py-2.5">Performance Remark</th>
                    <th className="px-4 py-2.5">Equivalent Letter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { grade: '1', range: '90 - 100', desc: 'Highest (Distinction)', letter: 'A+' },
                    { grade: '2', range: '80 - 89', desc: 'Higher (Distinction)', letter: 'A' },
                    { grade: '3', range: '70 - 79', desc: 'High Average (Very Good)', letter: 'B+' },
                    { grade: '4', range: '60 - 69', desc: 'Average (Good)', letter: 'B' },
                    { grade: '5', range: '55 - 59', desc: 'Average (Credit)', letter: 'C+' },
                    { grade: '6', range: '50 - 54', desc: 'Low Average (Credit)', letter: 'C' },
                    { grade: '7', range: '45 - 49', desc: 'Low (Pass)', letter: 'D' },
                    { grade: '8', range: '40 - 44', desc: 'Lower (Pass)', letter: 'E' },
                    { grade: '9', range: '0 - 39', desc: 'Lowest (Fail)', letter: 'F' },
                  ].map((g) => (
                    <tr key={g.grade} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono font-bold text-amber-700">Grade {g.grade}</td>
                      <td className="px-4 py-2 font-semibold text-slate-900">{g.range}%</td>
                      <td className="px-4 py-2 text-slate-700">{g.desc}</td>
                      <td className="px-4 py-2 font-bold text-blue-600">{g.letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Modal: Add Class */}
        <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Create New Class">
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Class Name *</label>
              <Input
                required
                placeholder="e.g. JHS 1 or Class 4"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Stream / Section</label>
                <Input
                  placeholder="e.g. Gold or Stream A"
                  value={newClass.stream}
                  onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Level</label>
                <select
                  value={newClass.level}
                  onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="KG">Kindergarten</option>
                  <option value="Primary">Primary School</option>
                  <option value="JHS">Junior High School</option>
                </select>
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsClassModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Create Class
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Add Department */}
        <Modal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title="Create Academic Department">
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Department Name *</label>
              <Input
                required
                placeholder="e.g. Senior High School or Nursery"
                value={newDept.name}
                onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <Input
                placeholder="Operational purpose or grade span..."
                value={newDept.description}
                onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Head of Department</label>
              <Input
                placeholder="e.g. Mrs. Cynthia Addo"
                value={newDept.headOfDepartment}
                onChange={(e) => setNewDept({ ...newDept, headOfDepartment: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDeptModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Create Department
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Add Subject */}
        <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Add Curriculum Subject">
          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Subject Name *</label>
                <Input
                  required
                  placeholder="e.g. Creative Arts"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Subject Code *</label>
                <Input
                  required
                  placeholder="e.g. CRA"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <Input
                placeholder="Curriculum overview..."
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsSubjectModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Add Subject
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Add House */}
        <Modal isOpen={isHouseModalOpen} onClose={() => setIsHouseModalOpen(false)} title="Create School House">
          <form onSubmit={handleCreateHouse} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">House Name *</label>
                <Input
                  required
                  placeholder="e.g. Kwame Nkrumah House"
                  value={newHouse.name}
                  onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">House Color</label>
                <select
                  value={newHouse.color}
                  onChange={(e) => setNewHouse({ ...newHouse, color: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="Yellow">Yellow</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Red">Red</option>
                  <option value="Purple">Purple</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">House Motto</label>
              <Input
                placeholder="e.g. In God We Trust"
                value={newHouse.motto}
                onChange={(e) => setNewHouse({ ...newHouse, motto: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">House Master / Mistress</label>
              <Input
                placeholder="e.g. Mr. David Mensah"
                value={newHouse.master}
                onChange={(e) => setNewHouse({ ...newHouse, master: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsHouseModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Create House
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

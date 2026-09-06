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
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'classes' | 'departments' | 'subjects'>('classes');
  const [classes, setClasses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Class Form
  const [newClass, setNewClass] = useState({
    name: '',
    stream: 'A',
    level: 'Primary',
  });

  const loadData = async () => {
    try {
      const [cls, depts, subs] = await Promise.all([
        apiRequest('/academics/classes'),
        apiRequest('/academics/departments'),
        apiRequest('/academics/subjects'),
      ]);
      setClasses(cls || []);
      setDepartments(depts || []);
      setSubjects(subs || []);
    } catch {
      // Fallback Ghanaian defaults
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
        { id: '1', name: 'Kindergarten', description: 'Early childhood foundation' },
        { id: '2', name: 'Primary School', description: 'Lower and upper primary (Class 1-6)' },
        { id: '3', name: 'Junior High School', description: 'BECE preparation tier (JHS 1-3)' },
      ]);
      setSubjects([
        { id: '1', name: 'English Language', code: 'ENG' },
        { id: '2', name: 'Mathematics', code: 'MATH' },
        { id: '3', name: 'Integrated Science', code: 'SCI' },
        { id: '4', name: 'Social Studies', code: 'SOC' },
        { id: '5', name: 'Information & Communication Tech (ICT)', code: 'ICT' },
        { id: '6', name: 'Ghanaian Language & Culture', code: 'GHL' },
        { id: '7', name: 'Religious & Moral Education (RME)', code: 'RME' },
        { id: '8', name: 'Basic Design & Technology (BDT)', code: 'BDT' },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/classes', {
        method: 'POST',
        body: JSON.stringify(newClass),
      });
      loadData();
    } catch {
      setClasses([...classes, { id: `cls-${Date.now()}`, ...newClass }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Academics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Academic Structure</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage classes, streams, academic tiers, and curriculum subjects.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Class
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'classes', label: 'Classes & Streams', icon: GraduationCap },
            { id: 'departments', label: 'Departments', icon: Layers },
            { id: 'subjects', label: 'Subjects Catalog', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Classes */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">{cls.level || 'Class'}</Badge>
                  <span className="text-[10px] font-mono text-slate-400">Stream {cls.stream || 'A'}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enrolled: <b>{cls._count?.students || 24}</b> students
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Departments */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-2">{dept.description}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Subjects */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map((sub) => (
              <Card key={sub.id} className="p-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{sub.name}</h4>
                  <span className="text-[10px] text-slate-400">Core Curriculum</span>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                  {sub.code}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Add Class Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Class & Stream"
          description="Create a new class group under your school's academic tier."
        >
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Class Name *</label>
              <Input
                required
                placeholder="e.g. Class 7 or JHS 1"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stream</label>
                <Input
                  placeholder="e.g. A, B, Gold"
                  value={newClass.stream}
                  onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Level / Tier</label>
                <select
                  value={newClass.level}
                  onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                  className="mt-1 w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="KG">Kindergarten</option>
                  <option value="Primary">Primary</option>
                  <option value="JHS">Junior High School</option>
                  <option value="SHS">Senior High School</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Save Class
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

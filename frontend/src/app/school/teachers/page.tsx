'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    qualifications: '',
    subjects: [] as string[],
  });

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/teachers?search=${encodeURIComponent(search)}`);
      setTeachers(res?.data || []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, [search]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/teachers', {
        method: 'POST',
        body: JSON.stringify(newTeacher),
      });
      setIsModalOpen(false);
      setNewTeacher({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        qualifications: '',
        subjects: [],
      });
      loadTeachers();
    } catch (err: any) {
      alert(err?.message || 'Failed to create teacher record.');
    }
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
              <span>Teachers</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Teaching Faculty</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Assigned subject teachers, class teachers, and employee records.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Teacher
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-3 mt-6 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search teachers by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-slate-900"
            />
          </div>
          <span className="text-xs text-slate-500">
            <b>{teachers.length}</b> teachers listed
          </span>
        </div>

        {/* Teachers Grid / Table */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading teaching faculty...</div>
        ) : teachers.length === 0 ? (
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-12 text-center max-w-sm mx-auto shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              No Faculty Staff Registered Yet
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Your teaching staff roster has zero records. Register teachers and assign subject curricula.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Staff Member
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
                        {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <span className="font-mono text-[11px] font-bold text-slate-500">
                          {teacher.employeeId}
                        </span>
                      </div>
                    </div>
                    <Badge variant="success">{teacher.status || 'ACTIVE'}</Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.email || 'No email registered'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{teacher.phoneNumber || 'No phone'}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Assigned Subjects:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(teacher.subjects || []).length === 0 ? (
                          <span className="text-slate-400 italic text-[11px]">None assigned</span>
                        ) : (
                          (teacher.subjects || []).map((sub: string, i: number) => (
                            <span
                              key={i}
                              className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium"
                            >
                              {sub}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Qualifications: </span>
                  {teacher.qualifications || 'Pending'}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Teacher Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Faculty Teacher"
          description="Register a new teacher and create an associated school user account."
        >
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Employee ID *</label>
                <Input
                  required
                  placeholder="e.g. TCH-010"
                  value={newTeacher.employeeId}
                  onChange={(e) => setNewTeacher({ ...newTeacher, employeeId: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Qualifications</label>
                <Input
                  placeholder="e.g. B.Ed. Mathematics"
                  value={newTeacher.qualifications}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualifications: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">First Name *</label>
                <Input
                  required
                  value={newTeacher.firstName}
                  onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name *</label>
                <Input
                  required
                  value={newTeacher.lastName}
                  onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <Input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <Input
                  value={newTeacher.phoneNumber}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phoneNumber: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Register Teacher
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

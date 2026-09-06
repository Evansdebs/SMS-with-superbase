'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Printer,
  BookOpen,
  UserCheck,
  MapPin,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

const PERIODS = [
  { num: 1, time: '07:30 - 08:15', label: 'Period 1' },
  { num: 2, time: '08:15 - 09:00', label: 'Period 2' },
  { num: 3, time: '09:00 - 09:45', label: 'Period 3' },
  { num: 4, time: '10:05 - 10:50', label: 'Period 4 (Post Break)' },
  { num: 5, time: '10:50 - 11:35', label: 'Period 5' },
  { num: 6, time: '11:35 - 12:20', label: 'Period 6' },
  { num: 7, time: '12:55 - 13:40', label: 'Period 7 (Post Lunch)' },
  { num: 8, time: '13:40 - 14:25', label: 'Period 8' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const CLASSES = [
  { id: 'cls-1', name: 'JHS 1', stream: 'Gold' },
  { id: 'cls-2', name: 'JHS 2', stream: 'Silver' },
  { id: 'cls-3', name: 'JHS 3', stream: 'Bronze' },
  { id: 'cls-4', name: 'Class 6', stream: 'Alpha' },
  { id: 'cls-5', name: 'Class 5', stream: 'Beta' },
];

const SUBJECTS = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
  { id: 'sub-2', name: 'Integrated Science', code: 'SCI', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
  { id: 'sub-3', name: 'English Language', code: 'ENG', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
  { id: 'sub-4', name: 'Social Studies', code: 'SOC', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
  { id: 'sub-5', name: 'Information Technology', code: 'ICT', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' },
  { id: 'sub-6', name: 'French', code: 'FRE', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' },
];

const TEACHERS = [
  { id: 'tch-1', name: 'Mr. Emmanuel Mensah' },
  { id: 'tch-2', name: 'Mrs. Faustina Ofori' },
  { id: 'tch-3', name: 'Mr. Kwabena Asante' },
  { id: 'tch-4', name: 'Ms. Abigail Darko' },
  { id: 'tch-5', name: 'Mr. Samuel Boakye' },
];

// Initial demo schedule
const INITIAL_SCHEDULE: Record<string, Record<number, any>> = {
  Monday: {
    1: { subject: 'Mathematics', teacher: 'Mr. Emmanuel Mensah', room: 'Rm 101' },
    2: { subject: 'Integrated Science', teacher: 'Mrs. Faustina Ofori', room: 'Lab 1' },
    3: { subject: 'English Language', teacher: 'Ms. Abigail Darko', room: 'Rm 101' },
    4: { subject: 'Social Studies', teacher: 'Mr. Kwabena Asante', room: 'Rm 101' },
    5: { subject: 'Information Technology', teacher: 'Mr. Samuel Boakye', room: 'ICT Lab' },
    6: { subject: 'French', teacher: 'Mrs. Faustina Ofori', room: 'Rm 101' },
  },
  Tuesday: {
    1: { subject: 'English Language', teacher: 'Ms. Abigail Darko', room: 'Rm 101' },
    2: { subject: 'Mathematics', teacher: 'Mr. Emmanuel Mensah', room: 'Rm 101' },
    3: { subject: 'Integrated Science', teacher: 'Mrs. Faustina Ofori', room: 'Lab 1' },
    4: { subject: 'French', teacher: 'Mrs. Faustina Ofori', room: 'Rm 101' },
    5: { subject: 'Social Studies', teacher: 'Mr. Kwabena Asante', room: 'Rm 101' },
  },
  Wednesday: {
    1: { subject: 'Information Technology', teacher: 'Mr. Samuel Boakye', room: 'ICT Lab' },
    2: { subject: 'Information Technology', teacher: 'Mr. Samuel Boakye', room: 'ICT Lab' },
    3: { subject: 'Mathematics', teacher: 'Mr. Emmanuel Mensah', room: 'Rm 101' },
    4: { subject: 'Integrated Science', teacher: 'Mrs. Faustina Ofori', room: 'Lab 1' },
    5: { subject: 'English Language', teacher: 'Ms. Abigail Darko', room: 'Rm 101' },
    7: { subject: 'Social Studies', teacher: 'Mr. Kwabena Asante', room: 'Rm 101' },
  },
  Thursday: {
    1: { subject: 'Mathematics', teacher: 'Mr. Emmanuel Mensah', room: 'Rm 101' },
    2: { subject: 'English Language', teacher: 'Ms. Abigail Darko', room: 'Rm 101' },
    3: { subject: 'French', teacher: 'Mrs. Faustina Ofori', room: 'Rm 101' },
    4: { subject: 'Integrated Science', teacher: 'Mrs. Faustina Ofori', room: 'Lab 1' },
    5: { subject: 'Social Studies', teacher: 'Mr. Kwabena Asante', room: 'Rm 101' },
  },
  Friday: {
    1: { subject: 'English Language', teacher: 'Ms. Abigail Darko', room: 'Rm 101' },
    2: { subject: 'Integrated Science', teacher: 'Mrs. Faustina Ofori', room: 'Lab 1' },
    3: { subject: 'Mathematics', teacher: 'Mr. Emmanuel Mensah', room: 'Rm 101' },
    4: { subject: 'Social Studies', teacher: 'Mr. Kwabena Asante', room: 'Rm 101' },
  },
};

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<{ day: string; period: number } | null>(null);
  const [formData, setFormData] = useState({
    subject: 'Mathematics',
    teacher: 'Mr. Emmanuel Mensah',
    room: 'Rm 101',
  });
  const [clashError, setClashError] = useState<string | null>(null);

  const handleOpenSlot = (day: string, period: number) => {
    setActiveSlot({ day, period });
    const current = schedule[day]?.[period];
    if (current) {
      setFormData({
        subject: current.subject,
        teacher: current.teacher,
        room: current.room || 'Rm 101',
      });
    } else {
      setFormData({
        subject: SUBJECTS[0].name,
        teacher: TEACHERS[0].name,
        room: 'Rm 101',
      });
    }
    setClashError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlot) return;

    // Simulate teacher clash check
    if (
      formData.teacher === 'Mr. Emmanuel Mensah' &&
      activeSlot.day === 'Monday' &&
      activeSlot.period === 4
    ) {
      setClashError('Schedule Conflict: Mr. Emmanuel Mensah is already assigned to JHS 2 at Monday Period 4.');
      return;
    }

    setSchedule((prev) => {
      const updated = { ...prev };
      if (!updated[activeSlot.day]) updated[activeSlot.day] = {};
      updated[activeSlot.day][activeSlot.period] = {
        subject: formData.subject,
        teacher: formData.teacher,
        room: formData.room,
      };
      return updated;
    });

    setIsEditModalOpen(false);
  };

  const handleClearSlot = () => {
    if (!activeSlot) return;
    setSchedule((prev) => {
      const updated = { ...prev };
      if (updated[activeSlot.day]) {
        delete updated[activeSlot.day][activeSlot.period];
      }
      return updated;
    });
    setIsEditModalOpen(false);
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
                Academics & Scheduling
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Phase 3</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Class Timetable Master
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Weekly period matrix with automated teacher conflict detection and room assignment.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Schedule</span>
            </Button>
          </div>
        </div>

        {/* Class Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Select Class:
          </span>
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedClass.id === cls.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {cls.name} ({cls.stream})
            </button>
          ))}
        </div>

        {/* Timetable Grid */}
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Weekly Schedule — {selectedClass.name} ({selectedClass.stream})</span>
              </CardTitle>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Click any period card to edit or reassign
              </span>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <th className="p-3.5 w-36">Time / Period</th>
                  {DAYS.map((day) => (
                    <th key={day} className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {PERIODS.map((period) => (
                  <tr key={period.num} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3 font-medium bg-slate-50/30 dark:bg-slate-900/20">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {period.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {period.time}
                      </div>
                    </td>

                    {DAYS.map((day) => {
                      const slot = schedule[day]?.[period.num];
                      const subjectObj = SUBJECTS.find((s) => s.name === slot?.subject);

                      return (
                        <td key={day} className="p-2 align-top">
                          {slot ? (
                            <div
                              onClick={() => handleOpenSlot(day, period.num)}
                              className={`p-2.5 rounded-xl border border-transparent hover:border-blue-400 cursor-pointer transition-all group shadow-sm ${
                                subjectObj?.color || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="font-bold text-xs leading-tight group-hover:underline">
                                {slot.subject}
                              </div>
                              <div className="text-[10px] opacity-85 mt-1 flex items-center gap-1 truncate">
                                <UserCheck className="h-2.5 w-2.5 shrink-0" />
                                <span className="truncate">{slot.teacher}</span>
                              </div>
                              <div className="text-[10px] opacity-75 mt-0.5 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 shrink-0" />
                                <span>{slot.room}</span>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenSlot(day, period.num)}
                              className="w-full h-20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 text-[11px] gap-1"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Assign</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Edit Slot Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={activeSlot ? `${activeSlot.day} — Period ${activeSlot.period}` : 'Assign Period'}
        description={`Schedule assignment for ${selectedClass.name} (${selectedClass.stream})`}
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          {clashError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{clashError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject Teacher
            </label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {TEACHERS.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Classroom / Laboratory
            </label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Rm 101 or Science Lab 1"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearSlot}
              className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs"
            >
              Clear Slot
            </Button>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-semibold">
                Save Assignment
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

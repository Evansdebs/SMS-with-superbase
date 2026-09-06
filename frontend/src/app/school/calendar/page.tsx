'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Tag,
  BookOpen,
  Coffee,
  Users,
  Award,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  type: 'EXAM' | 'HOLIDAY' | 'MEETING' | 'EVENT';
  location?: string;
  time?: string;
}

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '2025-09-15',
    type: 'EVENT' as 'EXAM' | 'HOLIDAY' | 'MEETING' | 'EVENT',
    location: '',
    time: '',
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Calendar math for grid
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newEvt: CalendarEventItem = {
      id: `evt-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      type: formData.type,
      location: formData.location,
      time: formData.time,
    };

    setEvents([...events, newEvt]);
    setFormData({
      title: '',
      description: '',
      date: '2025-09-15',
      type: 'EVENT',
      location: '',
      time: '',
    });
    setIsModalOpen(false);
  };

  const getTypeStyle = (type: CalendarEventItem['type']) => {
    switch (type) {
      case 'EXAM':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'HOLIDAY':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
      case 'MEETING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'EVENT':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
    }
  };

  const getTypeIcon = (type: CalendarEventItem['type']) => {
    switch (type) {
      case 'EXAM':
        return BookOpen;
      case 'HOLIDAY':
        return Coffee;
      case 'MEETING':
        return Users;
      case 'EVENT':
      default:
        return Award;
    }
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
                School Schedule & Events
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Academic Calendar</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Calendar & Term Schedule
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Official school year agenda: examination windows, PTA meetings, holidays, and co-curriculars.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Monthly Calendar (3 Cols) */}
          <div className="lg:col-span-3">
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <CardHeader className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMonth(8);
                      setCurrentYear(2025);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>

              <div className="p-4">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty lead cells */}
                  {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="h-24 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg"
                    />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const dayEvents = events.filter((e) => e.date === dateStr);
                    const isSelected = selectedDay === dayNum;

                    return (
                      <div
                        key={`day-${dayNum}`}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`min-h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                            : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold h-5 w-5 flex items-center justify-center rounded-full ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {dayNum}
                          </span>
                        </div>

                        {/* Events on this day */}
                        <div className="space-y-1 mt-1">
                          {dayEvents.slice(0, 2).map((evt) => (
                            <div
                              key={evt.id}
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate border ${getTypeStyle(
                                evt.type
                              )}`}
                            >
                              {evt.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[9px] text-slate-500 font-semibold block px-1">
                              +{dayEvents.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Agenda & Legend Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Event Type Legend */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Event Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300">Examinations & Tests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="text-slate-700 dark:text-slate-300">Holidays & Mid-Term Breaks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-slate-700 dark:text-slate-300">Meetings & Conferences</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300">Sports & Social Events</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Agenda */}
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Upcoming Agenda</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {events.length} Events
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.map((evt) => {
                  const Icon = getTypeIcon(evt.type);
                  return (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            evt.type === 'EXAM'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                              : evt.type === 'HOLIDAY'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                              : evt.type === 'MEETING'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {evt.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                            <span>{evt.date}</span>
                            {evt.time && (
                              <>
                                <span>•</span>
                                <span>{evt.time}</span>
                              </>
                            )}
                          </div>
                          {evt.location && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              <span>{evt.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Calendar Event"
        description="Add an official school event, exam period, or holiday to the calendar"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Event Title *
            </label>
            <Input
              required
              placeholder="e.g. End of Term Thanksgiving Service"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="EVENT">Co-Curricular / Event</option>
                <option value="EXAM">Examinations & Tests</option>
                <option value="HOLIDAY">Holiday / Break</option>
                <option value="MEETING">PTA / Staff Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date *
              </label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Time / Hours
              </label>
              <Input
                placeholder="e.g. 09:00 - 12:30"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location / Venue
              </label>
              <Input
                placeholder="e.g. School Hall or Pitch"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Additional details regarding dress code, eligibility, or requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  BookOpen,
  MapPin,
  User,
  Sparkles,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentTimetablePage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');
  const [activeDay, setActiveDay] = useState('Wednesday');

  useEffect(() => {
    setSession(getStoredSession());
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected_child_id');
      if (saved) setActiveChildId(saved);

      const handler = (e: any) => {
        if (e.detail?.childId) setActiveChildId(e.detail.childId);
      };
      window.addEventListener('parent_child_changed', handler);
      return () => window.removeEventListener('parent_child_changed', handler);
    }
  }, []);

  const child = mockChildren.find((c) => c.id === activeChildId) || mockChildren[0];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const weeklySchedule: Record<string, any[]> = {
    Wednesday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'Integrated Science', room: 'Science Lab 1', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'English Language', room: 'Block B - Room 12', teacher: 'Ms. Cynthia Addo' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'Core Mathematics', room: 'Block B - Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break & Snack', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Social Studies', room: 'Block B - Room 12', teacher: 'Mr. Emmanuel Ofori' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'ICT Computing', room: 'Computer Lab A', teacher: 'Mr. Mensah' },
    ],
    Thursday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'English Language', room: 'Block B - Room 12', teacher: 'Ms. Cynthia Addo' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'Integrated Science Practicals', room: 'Science Lab 2', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'Social Studies', room: 'Block B - Room 12', teacher: 'Mr. Emmanuel Ofori' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Core Mathematics', room: 'Block B - Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'Physical Education / Sports', room: 'Sports Field', teacher: 'Coach Adams' },
    ],
  };

  const scheduleForDay = weeklySchedule[activeDay] || weeklySchedule['Wednesday'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Class Timetable: {child.name} ({child.class})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Timetable & Teacher Allocations</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track period start times, room venues, and assigned subject teachers throughout the school week.
          </p>
        </div>

        <div>
          <Button
            size="sm"
            onClick={() => alert(`Downloading ${child.name}'s official timetable PDF...`)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs"
          >
            <Download className="h-4 w-4 mr-1.5" /> Download Timetable PDF
          </Button>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto scrollbar-none">
        {days.map((day) => {
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Timetable Schedule Card */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            {activeDay}'s Schedule ({child.class})
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Lessons commence at 08:00 AM promptly. Morning devotion at 07:45 AM.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {scheduleForDay.map((slot, i) => {
            const isBreak = slot.period === 'Break';
            return (
              <div
                key={i}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isBreak ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                } transition-colors`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`mt-0.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-center ${
                    isBreak
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    <div>{slot.period}</div>
                    <div className="text-[10px] font-normal opacity-80">{slot.time}</div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.room}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.teacher}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className={`text-xs ${
                  isBreak
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {isBreak ? 'Snack Recess' : '45 Minutes'}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}


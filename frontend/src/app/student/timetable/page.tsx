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
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function StudentTimetablePage() {
  const [session, setSession] = useState<any>(null);
  const [activeDay, setActiveDay] = useState('Wednesday');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const weeklySchedule: Record<string, any[]> = {
    Monday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'Integrated Science', room: 'Lab 1', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'Core Mathematics', room: 'Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'English Language', room: 'Room 12', teacher: 'Ms. Cynthia Addo' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break & Snack', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Social Studies', room: 'Room 12', teacher: 'Mr. Emmanuel Ofori' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'Information Technology (ICT)', room: 'Computer Lab A', teacher: 'Mr. Mensah' },
    ],
    Tuesday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'Core Mathematics', room: 'Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'Religious & Moral Education', room: 'Room 12', teacher: 'Ms. Darko' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'Ghanaian Language (Twi)', room: 'Room 12', teacher: 'Mr. Boateng' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Integrated Science', room: 'Lab 1', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'French Language', room: 'Language Room', teacher: 'Mme. Claire' },
    ],
    Wednesday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'Integrated Science', room: 'Science Lab 1', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'English Language', room: 'Room 12', teacher: 'Ms. Cynthia Addo' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'Core Mathematics', room: 'Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break & Canteen', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Social Studies', room: 'Room 12', teacher: 'Mr. Emmanuel Ofori' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'Basic Design & Tech (BDT)', room: 'Workshop 1', teacher: 'Mr. Quaye' },
    ],
    Thursday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'English Language', room: 'Room 12', teacher: 'Ms. Cynthia Addo' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'Integrated Science Practicals', room: 'Lab 2', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'Social Studies', room: 'Room 12', teacher: 'Mr. Emmanuel Ofori' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Core Mathematics', room: 'Room 12', teacher: 'Mr. Kwame Mensah' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'Physical Education / Sports', room: 'Sports Field', teacher: 'Coach Adams' },
    ],
    Friday: [
      { period: 'Period 1', time: '08:00 - 08:45 AM', subject: 'Ghanaian Language & Culture', room: 'Room 12', teacher: 'Mr. Boateng' },
      { period: 'Period 2', time: '08:50 - 09:35 AM', subject: 'ICT Computing', room: 'Computer Lab A', teacher: 'Mr. Mensah' },
      { period: 'Period 3', time: '09:40 - 10:25 AM', subject: 'French Language', room: 'Language Room', teacher: 'Mme. Claire' },
      { period: 'Break', time: '10:25 - 11:15 AM', subject: 'Mid-Morning Break', room: 'Campus Quad', teacher: 'Duty Masters' },
      { period: 'Period 4', time: '11:15 - 12:00 PM', subject: 'Library Reading & Prep', room: 'Main Library', teacher: 'Mrs. Adjei' },
      { period: 'Period 5', time: '12:05 - 12:50 PM', subject: 'Club Activities & Societies', room: 'Designated Rooms', teacher: 'Club Patrons' },
    ],
  };

  const scheduleForDay = weeklySchedule[activeDay] || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Class: JHS 1 (Gold Stream) • Term 1 Master Schedule</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Class Timetable & Daily Schedule</h1>
          <p className="text-slate-600 text-sm mt-1">
            View your weekly period distribution, teacher allocations, and lab/classroom venues.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Printing official class timetable PDF...')}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto scrollbar-none">
        {days.map((day) => {
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Timetable Card */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            {activeDay}'s Schedule (JHS 1 Gold)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Classes commence promptly at 08:00 AM. Please arrive at the specified room 5 minutes before bell.
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
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
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

                <div>
                  <Badge variant="outline" className={`text-xs ${
                    isBreak
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {isBreak ? 'Recess' : '45 Minutes'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}


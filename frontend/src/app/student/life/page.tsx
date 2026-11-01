'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Award,
  Bus,
  Home,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStoredSession } from '@/lib/api';

export default function StudentSchoolLifePage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const houseInfo = {
    name: 'Aggrey House (Green)',
    motto: 'Leadership with Character & Service',
    houseMaster: 'Mr. Kwabena Mensah',
    captain: 'Kofi Ansah (You - Junior Prefect)',
    standing: '2nd Place (340 Points)',
    shieldColor: 'bg-emerald-600 text-white',
  };

  const clubs = [
    {
      name: 'Robotics & STEM Innovators Society',
      role: 'Active Member (Hardware Team)',
      meetingTime: 'Tuesdays & Thursdays, 3:30 - 4:45 PM',
      patron: 'Mr. Kwame Mensah',
      venue: 'Computer Lab A',
    },
    {
      name: 'Debating & Literary Club',
      role: 'Junior Speaker',
      meetingTime: 'Wednesdays, 3:30 - 4:30 PM',
      patron: 'Ms. Cynthia Addo',
      venue: 'Language Room',
    },
  ];

  const conductRecords = [
    {
      id: 'c-1',
      date: 'Today, 09:15 AM',
      type: 'MERIT',
      points: '+5 Points',
      title: 'Science Lab Leadership',
      awardedBy: 'Mr. Kwame Mensah',
      desc: 'Helped clean and calibrate titration pipettes safely before the laboratory session.',
    },
    {
      id: 'c-2',
      date: 'Oct 14, 2026',
      type: 'MERIT',
      points: '+5 Points',
      title: 'Campus Environmental Commendation',
      awardedBy: 'Campus Supervisor',
      desc: 'Proactive leadership in classroom cleanliness and recycling drive.',
    },
  ];

  const transportDetails = {
    route: 'Route 4 (Achimota - Dome - West Legon)',
    busNumber: 'BUS-04 (Toyota Coaster 32-Seater)',
    driver: 'Uncle Kwesi (+233 24 999 1122)',
    pickupTime: '06:45 AM (Dome Shell Station)',
    dropoffTime: '04:15 PM (Dome Shell Station)',
    status: 'ACTIVE_SEAT_CONFIRMED',
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Co-Curriculars, House System & Student Life</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Life, Clubs & House System</h1>
          <p className="text-slate-600 text-sm mt-1">
            Track your house standing points, club participation, bus commute routes, and conduct records.
          </p>
        </div>
      </div>

      {/* House System Spotlight */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-2xl border border-white/20 shrink-0">
              AG
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">School House Affiliation</span>
              <h2 className="text-2xl font-extrabold mt-0.5">{houseInfo.name}</h2>
              <p className="text-emerald-100 text-xs mt-1 font-medium italic">"{houseInfo.motto}"</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100 mt-2">
                <span>House Master: <strong>{houseInfo.houseMaster}</strong></span>
                <span>•</span>
                <span>My Role: <strong>{houseInfo.captain}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-white/20 sm:pl-6">
            <span className="text-xs text-emerald-200 font-semibold uppercase tracking-wider">Inter-House Standing</span>
            <div className="text-2xl font-extrabold mt-0.5">{houseInfo.standing}</div>
            <span className="text-[11px] text-emerald-100">+10 merit points added this term</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Clubs & Conduct (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Registered Clubs & Societies */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Registered Clubs & Societies</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Co-curricular activities scheduled weekly after classes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {clubs.map((club, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{club.name}</h4>
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                      {club.role}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-slate-600">
                    <div>Meetings: <strong className="text-slate-800">{club.meetingTime}</strong></div>
                    <div>Venue: <strong className="text-slate-800">{club.venue}</strong></div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Patron: {club.patron}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conduct & Merits Log */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Conduct & Merits Recognition</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Merit commendations recorded by teachers and house staff
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Clean Conduct Record
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {conductRecords.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{c.title}</span>
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded">
                          {c.points}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.desc}</p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Awarded by {c.awardedBy} • {c.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Transport & Boarding (1 col) */}
        <div className="space-y-6">
          {/* Transport Bus Details */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Daily Bus Transport</CardTitle>
                <Bus className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="font-bold text-indigo-900">{transportDetails.route}</div>
                <div className="text-indigo-700 text-[11px] mt-0.5">{transportDetails.busNumber}</div>
              </div>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Morning Pickup:</span>
                  <span className="font-semibold text-slate-800">{transportDetails.pickupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Afternoon Return:</span>
                  <span className="font-semibold text-slate-800">{transportDetails.dropoffTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Contact:</span>
                  <span className="font-semibold text-slate-800">{transportDetails.driver}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boarding Info Card */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Residential Status</CardTitle>
                <Home className="h-4 w-4 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Type:</span>
                <span className="font-bold text-slate-800">Day Student</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locker Allocation:</span>
                <span className="font-bold text-slate-800">Locker #42 (Block B)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campus Exeat Rule:</span>
                <span className="text-slate-600">Required for early departure</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


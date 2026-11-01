'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  FileText,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentWellbeingPage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');

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

  const healthProfile: Record<string, any> = {
    'std-001': {
      bloodGroup: 'O Positive (O+)',
      allergies: 'Mild dust allergy (antihistamine authorized)',
      sickBayVisits: [
        {
          date: 'Oct 18, 2026 • 10:15 AM',
          nurse: 'Nurse Samuel Quaye',
          reason: 'Headache after physical education class',
          treatment: 'Administered 500mg Paracetamol, 30 min bed rest. Returned to class at 11:00 AM.',
        },
      ],
      conductLogs: [
        {
          date: 'Nov 01, 2026',
          type: 'MERIT',
          points: '+5 Points',
          title: 'Science Lab Leadership',
          awardedBy: 'Mr. Kwame Mensah',
          details: 'Assisted classmates with safe handling of titration glassware and burettes.',
        },
        {
          date: 'Oct 14, 2026',
          type: 'MERIT',
          points: '+5 Points',
          title: 'Environmental Sanitation Commendation',
          awardedBy: 'Campus Supervisor',
          details: 'Took initiative to organize recycling bins in Block B.',
        },
      ],
    },
    'std-002': {
      bloodGroup: 'A Positive (A+)',
      allergies: 'No known drug or food allergies',
      sickBayVisits: [],
      conductLogs: [
        {
          date: 'Oct 22, 2026',
          type: 'MERIT',
          points: '+5 Points',
          title: 'Reading & Penmanship Star',
          awardedBy: 'Madam Beatrice Osei',
          details: 'Exceptional handwriting and reading presentation in class.',
        },
      ],
    },
    'std-003': {
      bloodGroup: 'O Positive (O+)',
      allergies: 'Lactose intolerance noted in canteen register',
      sickBayVisits: [],
      conductLogs: [
        {
          date: 'Oct 15, 2026',
          type: 'MERIT',
          points: '+3 Points',
          title: 'Playground Sharing Star',
          awardedBy: 'Mrs. Janet Ansah',
          details: 'Helped younger nursery friends during sensory playtime.',
        },
      ],
    },
  };

  const currentHealth = healthProfile[child.id] || healthProfile['std-001'];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Health & Discipline Register: {child.name} ({child.admissionNumber})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Wellbeing, Health & Conduct</h1>
          <p className="text-slate-600 text-sm mt-1">
            Authorized medical profiles, sick bay consultation records, house merits, and behavioral commendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Authorized Health & Clinic (1 col) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">Health Profile</CardTitle>
                <Stethoscope className="h-4 w-4 text-rose-500" />
              </div>
              <CardDescription className="text-xs text-slate-500">
                Verified with campus clinic
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-3">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Blood Group:</span>
                  <span className="font-bold text-rose-800 text-sm">{currentHealth.bloodGroup}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Known Allergies / Diet:</span>
                <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {currentHealth.allergies}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Emergency Clinic Line: <strong className="text-slate-700">+233 24 000 2222</strong>
              </div>
            </CardContent>
          </Card>

          {/* Sick Bay Visits */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Sick Bay Consultations</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {currentHealth.sickBayVisits.length > 0 ? (
                currentHealth.sickBayVisits.map((v: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{v.reason}</span>
                      <span className="text-[10px] text-slate-400">{v.date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{v.treatment}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      Attending: {v.nurse}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 text-center py-4">
                  No sick bay clinic visits recorded this academic term.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Merits, Conduct & Behaviour (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Conduct & Merits Recognition: {child.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Points contributed towards house standings
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Exemplary Behaviour
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {currentHealth.conductLogs.map((c: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                          {c.points}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{c.details}</p>
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
      </div>
    </main>
  );
}


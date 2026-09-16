'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function ParentsPage() {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const loadParents = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await apiRequest(`/parents?search=${encodeURIComponent(search)}`);
      setParents(res?.data || res || []);
    } catch (err: any) {
      setApiError(err?.message || 'Could not load parents from the server. Showing demo data.');
      setParents([
        {
          id: '1',
          firstName: 'Kofi',
          lastName: 'Mensah',
          phoneNumber: '+233 24 555 1234',
          email: 'kofi.mensah@gmail.com',
          occupation: 'Civil Engineer',
          children: [
            { student: { firstName: 'Kwame', lastName: 'Mensah', class: { name: 'Class 5' } } },
          ],
        },
        {
          id: '2',
          firstName: 'Akua',
          lastName: 'Osei',
          phoneNumber: '+233 20 444 9876',
          email: 'akua.osei@yahoo.com',
          occupation: 'Pharmacist',
          children: [
            { student: { firstName: 'Abena', lastName: 'Osei', class: { name: 'JHS 1' } } },
          ],
        },
        {
          id: '3',
          firstName: 'Yaw',
          lastName: 'Boateng',
          phoneNumber: '+233 26 333 4455',
          email: 'yaw.boateng@gmail.com',
          occupation: 'Lecturer',
          children: [
            { student: { firstName: 'Kofi', lastName: 'Boateng', class: { name: 'Class 3' } } },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParents();
  }, [search]);

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
              <span>Parents</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Parent & Guardian Directory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact information and linked children for parental communication.
            </p>
          </div>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Demo Mode — Live API Unavailable</p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-amber-400 hover:text-amber-600 transition-colors text-xs shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center justify-between gap-3 mt-6 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search parent by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-slate-900"
            />
          </div>
          <span className="text-xs text-slate-500">
            <b>{parents.length}</b> parent contacts
          </span>
        </div>

        {/* Parents Table */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Parent Name</th>
                  <th className="px-4 py-3">Contact Phone</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Linked Children</th>
                  <th className="px-4 py-3">Occupation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {parent.firstName} {parent.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {parent.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {parent.email || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {(parent.children || []).map((ch: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium"
                          >
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {ch.student?.firstName} {ch.student?.lastName} ({ch.student?.class?.name || 'Class 5'})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {parent.occupation || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

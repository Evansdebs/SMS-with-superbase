'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  ClipboardCheck,
  Award,
  Users,
  MessageSquare,
  FileCheck2,
  FolderOpen,
  LogOut,
  X,
  Menu,
  GraduationCap,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TeacherNavProps {
  session?: AuthSession | null;
}

const navItems = [
  {
    name: 'Teaching Cockpit',
    href: '/teacher/dashboard',
    icon: LayoutDashboard,
    description: "Today's schedule, classes & urgent tasks",
  },
  {
    name: 'My Classes & Roster',
    href: '/teacher/classes',
    icon: Users,
    description: 'Enrolled students, profiles & streams',
  },
  {
    name: 'Lesson Plans & Prep',
    href: '/teacher/lessons',
    icon: BookOpen,
    description: 'Curriculum notes, files & homework',
  },
  {
    name: 'Continuous Assessment',
    href: '/teacher/assessment',
    icon: Award,
    description: 'CA 50% / Exam 50%, Stanine & approvals',
  },
  {
    name: 'Classroom Roll Call',
    href: '/teacher/attendance',
    icon: ClipboardCheck,
    description: 'Period-by-period & daily attendance',
  },
  {
    name: 'Conduct & Interventions',
    href: '/teacher/classroom',
    icon: MessageSquare,
    description: 'Behavior logs, merits & parent notes',
  },
  {
    name: 'Teacher Administration',
    href: '/teacher/admin',
    icon: FileCheck2,
    description: 'Leave requests, documents & profile',
  },
];

export function TeacherNav({ session }: TeacherNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const teacher = session?.user;
  const school = session?.user?.school || {
    name: 'Demo International School',
    schoolCode: 'SCH001',
  };

  const handleLogout = () => {
    clearStoredSession();
    router.push('/school/login');
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base">Teacher Portal</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-mono">
                  {school.schoolCode}
                </Badge>
                <span className="text-xs text-slate-400 hidden sm:inline">• {school.name}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Daily Classroom Workflow & Academic Management
              </p>
            </div>
          </div>

          {/* Desktop Right Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900">
                {teacher?.profile ? `${teacher.profile.firstName} ${teacher.profile.lastName}` : 'Kwame Mensah'}
              </div>
              <div className="text-[11px] text-slate-500">
                Senior Teacher • Science & Mathematics
              </div>
            </div>

            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
              {teacher?.profile?.firstName?.[0] || 'K'}{teacher?.profile?.lastName?.[0] || 'M'}
            </div>

            <Link href="/school/dashboard">
              <Button variant="outline" size="sm" className="text-xs border-slate-200 text-slate-600 hover:text-slate-900">
                School Admin Switch
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <div className="hidden md:flex space-x-1 border-t border-slate-100 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <div className="p-2 mb-2 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-900">
              {teacher?.profile ? `${teacher.profile.firstName} ${teacher.profile.lastName}` : 'Kwame Mensah'}
            </p>
            <p className="text-[11px] text-slate-500">Teacher • {school.name}</p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link href="/school/dashboard" className="text-xs text-blue-600 hover:underline">
              Switch to School Admin
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


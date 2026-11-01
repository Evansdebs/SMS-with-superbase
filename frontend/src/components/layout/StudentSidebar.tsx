'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Users,
  Building2,
  Clock,
  Sparkles,
  GraduationCap,
  LogOut,
  X,
  CreditCard,
  Bell,
  HeartHandshake,
  Compass,
  FileCheck2,
  Bus,
  Library,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';

interface StudentSidebarProps {
  session: AuthSession | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavGroup {
  label: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Student Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Today\'s Timetable', href: '/student/timetable', icon: Clock },
    ],
  },
  {
    label: 'Academics & Study',
    items: [
      { name: 'My Subjects & Notes', href: '/student/academics', icon: BookOpen },
      { name: 'Homework & Quizzes', href: '/student/assignments', icon: FileText, badge: '2 Due' },
      { name: 'Grades & Report Card', href: '/student/grades', icon: Award },
    ],
  },
  {
    label: 'School Life & Campus',
    items: [
      { name: 'Campus Life & Houses', href: '/student/life', icon: Compass },
      { name: 'Library & Textbooks', href: '/student/library', icon: Library },
      { name: 'Fee Statements', href: '/student/fees', icon: CreditCard },
    ],
  },
  {
    label: 'Student Services',
    items: [
      { name: 'Exeat & Service Requests', href: '/student/services', icon: FileCheck2 },
      { name: 'Notices & Messages', href: '/student/messages', icon: Bell },
    ],
  },
];

export function StudentSidebar({ session, mobileOpen, onMobileClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const school = session?.user?.school || {
    name: 'Demo International School',
    schoolCode: 'SCH001',
  };
  const user = session?.user;

  const handleLogout = () => {
    clearStoredSession();
    router.push('/school/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-xs">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Student Portal</span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {school.schoolCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{school.name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Student Badge Card */}
      <div className="p-3 mx-3 my-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            KA
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              Kofi Ansah
            </div>
            <div className="text-[10px] text-indigo-700 font-medium truncate flex items-center space-x-1">
              <span>STD2026001</span>
              <span>•</span>
              <span>JHS 1 (Gold)</span>
            </div>
            <div className="text-[9px] text-slate-500 truncate mt-0.5">
              Aggrey House • Class Prefect
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}


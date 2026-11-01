'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  CreditCard,
  FileCheck2,
  HeartHandshake,
  Bell,
  Clock,
  Sparkles,
  BookOpen,
  LogOut,
  X,
  Building2,
  ShieldCheck,
  ChevronDown,
  Stethoscope,
  MessageSquare,
  Bus,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';

export interface Child {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  house: string;
  gender: string;
  avatar: string;
  attendanceRate: string;
  averageGrade: string;
  feeBalance: string;
}

export const mockChildren: Child[] = [
  {
    id: 'std-001',
    name: 'Kofi Ansah',
    admissionNumber: 'STD2026001',
    class: 'JHS 1 (Gold)',
    house: 'Aggrey House (Green)',
    gender: 'MALE',
    avatar: 'KA',
    attendanceRate: '98%',
    averageGrade: '83.8% (Grade 1)',
    feeBalance: 'GH₵ 0.00',
  },
  {
    id: 'std-002',
    name: 'Akua Ansah',
    admissionNumber: 'STD2026048',
    class: 'Primary 5 (Emerald)',
    house: 'Aggrey House (Green)',
    gender: 'FEMALE',
    avatar: 'AA',
    attendanceRate: '96%',
    averageGrade: '87.5% (Grade 1)',
    feeBalance: 'GH₵ 350.00',
  },
  {
    id: 'std-003',
    name: 'Kwabena Ansah',
    admissionNumber: 'STD2026092',
    class: 'Kindergarten 2 (Blue)',
    house: 'Guggisberg House (Yellow)',
    gender: 'MALE',
    avatar: 'KW',
    attendanceRate: '94%',
    averageGrade: 'Proficient',
    feeBalance: 'GH₵ 0.00',
  },
];

interface ParentSidebarProps {
  session: AuthSession | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
  selectedChildId?: string;
  onSelectChild?: (childId: string) => void;
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
      { name: 'Family Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Academic Progress',
    items: [
      { name: 'Results & Stanine Reports', href: '/parent/academics', icon: Award },
      { name: 'Daily Timetable & Schedule', href: '/parent/timetable', icon: Clock },
      { name: 'Attendance Register', href: '/parent/attendance', icon: Calendar },
    ],
  },
  {
    label: 'Finance & Payments',
    items: [
      { name: 'Fee Ledger & Online Pay', href: '/parent/fees', icon: CreditCard },
    ],
  },
  {
    label: 'Wellbeing & Pastoral',
    items: [
      { name: 'Discipline & Sick Bay Clinic', href: '/parent/wellbeing', icon: Stethoscope },
    ],
  },
  {
    label: 'Requests & Messages',
    items: [
      { name: 'Exeat & Permission Requests', href: '/parent/requests', icon: FileCheck2 },
      { name: 'Teacher Messages & Notices', href: '/parent/messages', icon: MessageSquare, badge: 'New' },
    ],
  },
];

export function ParentSidebar({
  session,
  mobileOpen,
  onMobileClose,
  selectedChildId = 'std-001',
  onSelectChild,
}: ParentSidebarProps) {
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

  const selectedChild = mockChildren.find((c) => c.id === selectedChildId) || mockChildren[0];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-xs">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Parent Portal</span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200">
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

      {/* Child Switcher Component */}
      <div className="p-3 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active Child Context</span>
          <span className="text-[10px] font-mono text-teal-600 font-semibold">{mockChildren.length} Registered</span>
        </div>

        <div className="space-y-1.5">
          {mockChildren.map((ch) => {
            const isSelected = ch.id === selectedChild.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  if (onSelectChild) onSelectChild(ch.id);
                  // also store in localStorage for multi-page persistence
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('selected_child_id', ch.id);
                  }
                }}
                className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-white text-teal-900 border border-teal-300 shadow-xs ring-1 ring-teal-200'
                    : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div
                    className={`h-7 w-7 rounded-md font-bold text-[11px] flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {ch.avatar}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate leading-tight">{ch.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{ch.class}</div>
                  </div>
                </div>

                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/parent/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
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
        <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-[11px] text-slate-600">
          <div className="font-semibold text-slate-800">Mr. Kwame Ansah Snr</div>
          <div className="text-[10px] text-slate-500 font-mono">+233 24 111 2233</div>
        </div>
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


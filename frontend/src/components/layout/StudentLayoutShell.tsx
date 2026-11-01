'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, GraduationCap, Bell, LogOut, ChevronRight, BookOpen } from 'lucide-react';
import { StudentSidebar } from './StudentSidebar';
import { getStoredSession, AuthSession } from '@/lib/api';

export function StudentLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const school = session?.user?.school;
  const user = session?.user;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Student Sidebar */}
      <StudentSidebar
        session={session}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Open student menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                Student Self-Service Portal
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline truncate">
                {school?.name || 'Demo International School'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[150px]">
                  Kofi Ansah
                </div>
                <div className="text-[10px] text-indigo-600 font-medium">
                  STD2026001 • JHS 1
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                KA
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}


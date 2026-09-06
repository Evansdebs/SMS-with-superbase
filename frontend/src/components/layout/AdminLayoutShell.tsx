'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ShieldAlert } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { getStoredSession, AuthSession } from '@/lib/api';

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, [pathname]);

  // Close mobile sidebar whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Bypasses layout on authentication routes
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  const user = session?.user;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* ── Responsive Admin Sidebar for PC and Mobile ── */}
      <AdminSidebar
        session={session}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main App Content Column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-14 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 truncate">
              <span className="font-semibold text-xs sm:text-sm text-slate-200 truncate">
                EduSphere Platform Control
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SUPER_ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <div className="hidden sm:flex items-center space-x-2 border-l border-slate-800 pl-3">
              <div className="text-right">
                <div className="text-xs font-medium text-slate-300 truncate max-w-[160px]">
                  {user?.email || 'admin@platform.com'}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-medium">
                  Platform Root
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

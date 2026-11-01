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
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* ── Responsive Admin Sidebar for PC and Mobile ── */}
      <AdminSidebar
        session={session}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main App Content Column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                EduSphere Platform Control
              </span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                SUPER_ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <div className="hidden sm:flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[160px]">
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
        <div className="flex-1 bg-slate-50">
          {children}
        </div>
      </div>
    </div>
  );
}

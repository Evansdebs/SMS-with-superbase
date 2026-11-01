'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, HeartHandshake, Bell, LogOut, ChevronDown, Check } from 'lucide-react';
import { ParentSidebar, mockChildren, Child } from './ParentSidebar';
import { getStoredSession, AuthSession } from '@/lib/api';

export function ParentLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState('std-001');

  useEffect(() => {
    setSession(getStoredSession());
    if (typeof window !== 'undefined') {
      const savedChild = localStorage.getItem('selected_child_id');
      if (savedChild) setSelectedChildId(savedChild);
    }
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_child_id', id);
      window.dispatchEvent(new CustomEvent('parent_child_changed', { detail: { childId: id } }));
    }
  };

  const selectedChild = mockChildren.find((c) => c.id === selectedChildId) || mockChildren[0];
  const school = session?.user?.school;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Parent Sidebar */}
      <ParentSidebar
        session={session}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        selectedChildId={selectedChildId}
        onSelectChild={handleSelectChild}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Open parent menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Child Switcher Pills (Top Header Fast Switcher) */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 hidden md:inline">Viewing:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none">
                {mockChildren.map((ch) => {
                  const isActive = ch.id === selectedChild.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectChild(ch.id)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <span>{ch.name}</span>
                      <span className={`text-[10px] font-normal opacity-85`}>({ch.class.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                  Mr. Kwame Ansah Snr
                </div>
                <div className="text-[10px] text-teal-700 font-semibold">
                  Guardian / Father
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs border border-teal-200">
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


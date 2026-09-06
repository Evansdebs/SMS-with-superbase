'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Building2,
  PlusCircle,
  Users,
  ScrollText,
  LogOut,
  LayoutDashboard,
  ExternalLink,
  X,
  ShieldCheck,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';

interface AdminSidebarProps {
  session: AuthSession | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const adminNavItems = [
  { name: 'Platform Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'School Tenants', href: '/admin/schools', icon: Building2 },
  { name: 'Register School', href: '/admin/schools/new', icon: PlusCircle },
  { name: 'Platform Users', href: '/admin/users', icon: Users },
  { name: 'System Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
];

export function AdminSidebar({ session, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;

  const handleLogout = () => {
    clearStoredSession();
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Platform Super Admin Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-100">
              <ShieldAlert className="h-5 w-5 text-slate-200" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-white tracking-tight truncate">
                EduSphere Admin
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ROOT
                </span>
                <span className="text-[10px] text-slate-400">Multi-Tenant Engine</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Super Admin Console
        </div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            External Links
          </div>
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span>Platform Landing Page</span>
          </Link>
          <Link
            href="/school/login"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>School Tenant Portal</span>
          </Link>
        </div>
      </nav>

      {/* User Session & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="px-2 py-1.5 mb-2">
          <div className="text-xs font-semibold text-white truncate">
            {user?.email || 'admin@platform.com'}
          </div>
          <div className="text-[10px] text-slate-400 uppercase font-medium">
            Super Administrator
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar (Permanent left rail) ── */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Drawer & Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

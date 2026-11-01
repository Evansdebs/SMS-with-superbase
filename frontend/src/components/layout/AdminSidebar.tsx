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
  CreditCard,
  BarChart3,
  Headphones,
  Bell,
  Settings,
  FileSpreadsheet,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';

interface AdminSidebarProps {
  session: AuthSession | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const adminNavSections: NavSection[] = [
  {
    title: 'Tenants & SaaS',
    items: [
      { name: 'Platform Overview', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'School Tenants', href: '/admin/schools', icon: Building2 },
      { name: 'Register School', href: '/admin/schools/new', icon: PlusCircle },
      { name: 'Subscriptions & Billing', href: '/admin/subscriptions', icon: CreditCard },
    ],
  },
  {
    title: 'Access & Analytics',
    items: [
      { name: 'Platform Users', href: '/admin/users', icon: Users },
      { name: 'System Analytics & Health', href: '/admin/analytics', icon: BarChart3 },
      { name: 'System Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
    ],
  },
  {
    title: 'Operations & Comms',
    items: [
      { name: 'Support Tickets', href: '/admin/support', icon: Headphones },
      { name: 'System Announcements', href: '/admin/announcements', icon: Bell },
    ],
  },
  {
    title: 'Governance & Exports',
    items: [
      { name: 'Global Settings & Security', href: '/admin/settings', icon: Settings },
      { name: 'Platform Reports', href: '/admin/reports', icon: FileSpreadsheet },
    ],
  },
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
    <div className="flex flex-col h-full bg-white text-slate-700 border-r border-slate-200">
      {/* Platform Super Admin Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight truncate">
                EduSphere Admin
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  SUPER_ADMIN
                </span>
                <span className="text-[10px] text-slate-500">Platform Control</span>
              </div>
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

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {adminNavSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 font-semibold shadow-2xs border border-amber-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-slate-200">
          <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            External Portals
          </div>
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <span>Platform Landing Page</span>
          </Link>
          <Link
            href="/school/login"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Building2 className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <span>School Tenant Portal</span>
          </Link>
        </div>
      </nav>

      {/* User Session & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="px-2 py-1.5 mb-2">
          <div className="text-xs font-semibold text-slate-900 truncate">
            {user?.email || 'admin@platform.com'}
          </div>
          <div className="text-[10px] text-slate-500 uppercase font-medium">
            Super Administrator
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-medium transition-colors border border-slate-200 shadow-2xs"
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
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

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  UserCheck,
  BookOpen,
  Clock,
  FileText,
  ClipboardCheck,
  Award,
  FileSpreadsheet,
  HeartHandshake,
  AlertTriangle,
  Stethoscope,
  Library,
  Package,
  Bus,
  UserCog,
  DollarSign,
  CreditCard,
  FolderOpen,
  Bell,
  Calendar,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Building2,
  ClipboardList,
  Banknote,
  BedDouble,
  DoorOpen,
  MessageSquare,
  Receipt,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AuthSession, clearStoredSession } from '@/lib/api';

interface SchoolSidebarProps {
  session: AuthSession | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  requiredPermission?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/school/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/school/analytics', icon: BarChart3, requiredPermission: 'students.view' },
    ],
  },
  {
    label: 'Admissions',
    items: [
      { name: 'Applications', href: '/school/admissions', icon: ClipboardList, requiredPermission: 'admissions.view' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { name: 'Students', href: '/school/students', icon: GraduationCap, requiredPermission: 'students.view' },
      { name: 'Teachers & Staff', href: '/school/teachers', icon: UserCheck, requiredPermission: 'teachers.view' },
      { name: 'Classes & Subjects', href: '/school/academics', icon: BookOpen, requiredPermission: 'academics.view' },
      { name: 'Timetable', href: '/school/timetable', icon: Clock, requiredPermission: 'timetable.view' },
      { name: 'Assignments', href: '/school/assignments', icon: FileText, requiredPermission: 'assignments.view' },
      { name: 'Attendance Register', href: '/school/attendance', icon: ClipboardCheck, requiredPermission: 'attendance.view' },
      { name: 'Results & Stanine', href: '/school/results', icon: Award, requiredPermission: 'results.view' },
      { name: 'Report Cards', href: '/school/report-cards', icon: FileSpreadsheet, requiredPermission: 'results.view' },
    ],
  },
  {
    label: 'Boarding & Welfare',
    items: [
      { name: 'Boarding / Dormitories', href: '/school/boarding', icon: BedDouble, requiredPermission: 'boarding.view' },
      { name: 'Exeat Requests', href: '/school/exeats', icon: DoorOpen, requiredPermission: 'exeats.view' },
      { name: 'Health / Sick Bay', href: '/school/health', icon: Stethoscope, requiredPermission: 'health.view' },
      { name: 'Discipline / Conduct', href: '/school/discipline', icon: AlertTriangle, requiredPermission: 'discipline.view' },
    ],
  },
  {
    label: 'Operations & Services',
    items: [
      { name: 'Parent Directory', href: '/school/parents', icon: HeartHandshake, requiredPermission: 'parents.view' },
      { name: 'Library System', href: '/school/library', icon: Library, requiredPermission: 'library.view' },
      { name: 'Inventory & Assets', href: '/school/inventory', icon: Package, requiredPermission: 'inventory.view' },
      { name: 'Transport Fleet', href: '/school/transport', icon: Bus, requiredPermission: 'transport.view' },
      { name: 'Communication', href: '/school/communication', icon: MessageSquare, requiredPermission: 'communication.view' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Fee Collections', href: '/school/fees', icon: DollarSign, requiredPermission: 'fees.view' },
      { name: 'Billing & Debtors', href: '/school/billing', icon: Receipt, requiredPermission: 'fees.view' },
      { name: 'School Billing', href: '/school/billing', icon: CreditCard, requiredPermission: 'billing.manage' },
    ],
  },
  {
    label: 'HR & Payroll',
    items: [
      { name: 'HR & Staff Leave', href: '/school/hr', icon: UserCog, requiredPermission: 'hr.apply' },
      { name: 'Payroll (PAYE/SSNIT)', href: '/school/payroll', icon: Banknote, requiredPermission: 'hr.payroll.view' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { name: 'Documents Vault', href: '/school/documents', icon: FolderOpen, requiredPermission: 'documents.view' },
      { name: 'Notice Board', href: '/school/announcements', icon: Bell, requiredPermission: 'announcements.view' },
      { name: 'Term Calendar', href: '/school/calendar', icon: Calendar, requiredPermission: 'calendar.view' },
      { name: 'Staff & Users', href: '/school/users', icon: Users, requiredPermission: 'roles.manage' },
      { name: 'Roles & Permissions', href: '/school/roles', icon: ShieldCheck, requiredPermission: 'roles.manage' },
      { name: 'School Settings', href: '/school/settings', icon: Settings, requiredPermission: 'settings.manage' },
    ],
  },
];

export function SchoolSidebar({ session, mobileOpen, onMobileClose }: SchoolSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const school = session?.user?.school;
  const user = session?.user;

  const userPermissions: string[] = Array.isArray(user?.membership?.permissions)
    ? user.membership.permissions
    : [];
  const isSuperAdmin = user?.accountType === 'SUPER_ADMIN';
  const isSchoolAdmin = user?.membership?.profile === 'SCHOOL_ADMIN' || userPermissions.includes('*');

  const hasAccess = (requiredPermission?: string) => {
    if (!requiredPermission) return true;
    if (isSuperAdmin || isSchoolAdmin) return true;
    return userPermissions.includes(requiredPermission);
  };

  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasAccess(item.requiredPermission)),
    }))
    .filter((group) => group.items.length > 0);

  const handleLogout = () => {
    clearStoredSession();
    router.push('/school/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Institutional Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-100">
              <Building2 className="h-5 w-5 text-slate-200" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-white truncate">
                {school?.name || 'School Management'}
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {school?.schoolCode || 'PORTAL'}
                </span>
                <span className="text-[10px] text-slate-400">Isolated Tenant</span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
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

      {/* Navigation Groups (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
        {visibleNavGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
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

      {/* User Session & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center justify-between px-2 py-1.5 mb-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {user?.email || 'Logged In'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">
              {user?.membership?.profile || 'Staff'}
            </div>
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
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Slide-in drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

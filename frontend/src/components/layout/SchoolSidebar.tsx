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
  DollarSign,
  CreditCard,
  FolderOpen,
  Bell,
  Calendar,
  Settings,
  LogOut,
  X,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AuthSession, clearStoredSession } from '@/lib/api';
import { usePermissions } from '@/lib/permissions-context';

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
      { name: 'Dashboard', href: '/school/dashboard', icon: LayoutDashboard, requiredPermission: 'dashboard.overview.view' },
      { name: 'Analytics', href: '/school/analytics', icon: BarChart3, requiredPermission: 'dashboard.analytics.view' },
    ],
  },
  {
    label: 'Academics & Students',
    items: [
      { name: 'Student Lifecycle', href: '/school/students', icon: GraduationCap, requiredPermission: 'students.student.view' },
      { name: 'Faculty & Staff HR', href: '/school/teachers', icon: UserCheck, requiredPermission: 'teachers.teacher.view' },
      { name: 'Curriculum & Classes', href: '/school/academics', icon: BookOpen, requiredPermission: 'academics.class.manage' },
      { name: 'Timetable Schedules', href: '/school/timetable', icon: Clock, requiredPermission: 'timetable.schedule.view' },
      { name: 'Assignments & Prep', href: '/school/assignments', icon: FileText, requiredPermission: 'assignments.assignment.view' },
      { name: 'Attendance Register', href: '/school/attendance', icon: ClipboardCheck, requiredPermission: 'attendance.record.view' },
      { name: 'Results & Stanine', href: '/school/results', icon: Award, requiredPermission: 'examinations.score.enter' },
      { name: 'Report Cards & Slips', href: '/school/report-cards', icon: FileSpreadsheet, requiredPermission: 'reports.reportcard.view' },
    ],
  },
  {
    label: 'Campus Operations',
    items: [
      { name: 'Front Desk & Reception', href: '/school/reception', icon: Building2, requiredPermission: 'exeat.gatepass.manage' },
      { name: 'Boarding & Hostels', href: '/school/boarding', icon: Building2, requiredPermission: 'boarding.hostel.view' },
      { name: 'Parent Directory', href: '/school/parents', icon: HeartHandshake, requiredPermission: 'parents.parent.view' },
      { name: 'Discipline / Conduct', href: '/school/discipline', icon: AlertTriangle, requiredPermission: 'discipline.incident.view' },
      { name: 'Health / Sick Bay', href: '/school/health', icon: Stethoscope, requiredPermission: 'health.record.view' },
      { name: 'Library System', href: '/school/library', icon: Library, requiredPermission: 'library.book.view' },
      { name: 'Inventory & Assets', href: '/school/inventory', icon: Package, requiredPermission: 'inventory.asset.view' },
      { name: 'Transport Fleet', href: '/school/transport', icon: Bus, requiredPermission: 'transport.vehicle.view' },
    ],
  },
  {
    label: 'Advanced SMS Systems',
    items: [
      { name: 'Online CBT & Exams', href: '/school/cbt', icon: Award, requiredPermission: 'examinations.exam.create' },
      { name: 'Communication Hub', href: '/school/communication', icon: Bell, requiredPermission: 'communication.message.view' },
      { name: 'Approval Workflows', href: '/school/workflows', icon: FileSpreadsheet, requiredPermission: 'examinations.score.approve' },
      { name: 'Import / Export Centre', href: '/school/import-export', icon: FileSpreadsheet, requiredPermission: 'students.student.export' },
    ],
  },
  {
    label: 'Finance & Governance',
    items: [
      { name: 'Fee Collections & Debt', href: '/school/fees', icon: DollarSign, requiredPermission: 'fees.structure.view' },
      { name: 'School Billing & SaaS', href: '/school/billing', icon: CreditCard, requiredPermission: 'fees.structure.view' },
      { name: 'Institutional Reports', href: '/school/reports', icon: FileSpreadsheet, requiredPermission: 'reports.report.view' },
      { name: 'Roles & Permissions', href: '/school/roles', icon: ShieldCheck, badge: 'RBAC', requiredPermission: 'roles.role.view' },
      { name: 'Documents Vault', href: '/school/documents', icon: FolderOpen, requiredPermission: 'documents.document.view' },
      { name: 'Notice Board', href: '/school/announcements', icon: Bell, requiredPermission: 'communication.message.view' },
      { name: 'Term Calendar', href: '/school/calendar', icon: Calendar, requiredPermission: 'academics.term.manage' },
      { name: 'School Settings', href: '/school/settings', icon: Settings, requiredPermission: 'settings.settings.view' },
    ],
  },
];

export function SchoolSidebar({ session, mobileOpen, onMobileClose }: SchoolSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { can, isSchoolAdmin } = usePermissions();

  const school = session?.user?.school;
  const user = session?.user;

  const handleLogout = () => {
    clearStoredSession();
    router.push('/school/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 shadow-sm">
      {/* Institutional Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {school?.name || 'School Management'}
              </h2>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {school?.schoolCode || 'SCH001'}
                </span>
                <span className="text-[10px] text-slate-400">Institutional Portal</span>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
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

      {/* Navigation Groups (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {navGroups.map((group) => {
          // Filter items based on permissions
          const accessibleItems = group.items.filter((item) => {
            if (!item.requiredPermission) return true;
            return can(item.requiredPermission);
          });

          // Do not render empty groups for non-admin users
          if (accessibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {accessibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs border border-blue-200/60'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            item.badge === 'RBAC'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile / Quick Actions */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {(user?.profile?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : user?.email || 'User'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {user?.membership?.profile || 'Staff'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Spacer for desktop sidebar offset */}
      <div className="hidden lg:block lg:w-64 flex-shrink-0" />

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

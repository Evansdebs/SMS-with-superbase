'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Copy,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Building,
  HeartHandshake,
  Stethoscope,
  Library,
  Bus,
  FileSpreadsheet,
  Sliders,
  ChevronRight,
  Eye,
  Lock,
  Unlock,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest, getStoredSession, setStoredSession } from '@/lib/api';

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  domain: 'academics' | 'operations' | 'finance' | 'admin';
  module: string;
}

interface RoleItem {
  id: string;
  label: string;
  description: string;
  color: string;
  isSystemRole?: boolean;
}

const DOMAIN_METADATA = {
  academics: {
    label: 'Academics & Instruction',
    icon: GraduationCap,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
  },
  operations: {
    label: 'Operations & Welfare',
    icon: Stethoscope,
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
  },
  finance: {
    label: 'Finance & Collections',
    icon: CreditCard,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
  },
  admin: {
    label: 'Administration & HR',
    icon: Building,
    color: 'text-indigo-500 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900',
  },
};

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [catalog, setCatalog] = useState<PermissionItem[]>([]);
  const [matrix, setMatrix] = useState<Record<string, string[]>>({});
  const [activeRole, setActiveRole] = useState<string>('TEACHER');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | 'academics' | 'operations' | 'finance' | 'admin'>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Load initial role matrix and catalog
  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiRequest('/roles/matrix');
      if (res?.roles) setRoles(res.roles);
      if (res?.catalog) setCatalog(res.catalog);
      if (res?.matrix) setMatrix(res.matrix);
      if (res?.roles?.length && !roles.some((r) => r.id === activeRole)) {
        setActiveRole(res.roles[1]?.id || res.roles[0]?.id || 'TEACHER');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load role permissions matrix');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeRoleData = roles.find((r) => r.id === activeRole);
  const currentPermissions = useMemo(() => {
    return matrix[activeRole] || [];
  }, [matrix, activeRole]);

  // Toggle single permission
  const handleTogglePermission = (permId: string) => {
    setMatrix((prev) => {
      const existing = prev[activeRole] || [];
      const updated = existing.includes(permId)
        ? existing.filter((p) => p !== permId)
        : [...existing, permId];
      return {
        ...prev,
        [activeRole]: updated,
      };
    });
  };

  // Toggle all permissions in a domain
  const handleToggleDomain = (domain: string, enable: boolean) => {
    const domainPermIds = catalog.filter((p) => p.domain === domain).map((p) => p.id);
    setMatrix((prev) => {
      const existing = new Set(prev[activeRole] || []);
      domainPermIds.forEach((id) => {
        if (enable) existing.add(id);
        else existing.delete(id);
      });
      return {
        ...prev,
        [activeRole]: Array.from(existing),
      };
    });
  };

  // Select all / Deselect all currently filtered items
  const handleSelectAllFiltered = (enable: boolean) => {
    setMatrix((prev) => {
      const existing = new Set(prev[activeRole] || []);
      filteredCatalog.forEach((p) => {
        if (enable) existing.add(p.id);
        else existing.delete(p.id);
      });
      return {
        ...prev,
        [activeRole]: Array.from(existing),
      };
    });
  };

  // Reset current role to default presets
  const handleResetDefaults = async () => {
    try {
      setIsSaving(true);
      const res = await apiRequest(`/roles/reset/${activeRole}`, {
        method: 'POST',
      });
      if (res) {
        setMatrix(res);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset role defaults');
    } finally {
      setIsSaving(false);
    }
  };

  // Save the role permissions
  const handleSavePermissions = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await apiRequest(`/roles/${activeRole}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({
          permissions: currentPermissions,
        }),
      });

      // Update current session if the logged-in user belongs to this role
      const session = getStoredSession();
      if (session?.user?.membership?.profile === activeRole) {
        session.user.membership.permissions = currentPermissions;
        setStoredSession(session);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save role permissions');
    } finally {
      setIsSaving(false);
    }
  };

  // Clone from another role
  const handleCloneFromRole = (sourceRoleId: string) => {
    if (!sourceRoleId || sourceRoleId === activeRole) return;
    const sourcePerms = matrix[sourceRoleId] || [];
    setMatrix((prev) => ({
      ...prev,
      [activeRole]: [...sourcePerms],
    }));
  };

  // Filter catalog by search query and domain
  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = domainFilter === 'all' || item.domain === domainFilter;
      return matchesSearch && matchesDomain;
    });
  }, [catalog, searchQuery, domainFilter]);

  // Group filtered catalog by domain
  const groupedCatalog = useMemo(() => {
    const groups: Record<string, PermissionItem[]> = {
      academics: [],
      operations: [],
      finance: [],
      admin: [],
    };
    filteredCatalog.forEach((p) => {
      if (groups[p.domain]) {
        groups[p.domain].push(p);
      }
    });
    return groups;
  }, [filteredCatalog]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/school/users" className="hover:text-blue-600 transition-colors">
                Staff & Users
              </Link>
              <span>/</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Roles & Functionalities</span>
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Role Functionality & RBAC Manager</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure feature permissions, module visibility, and operational powers across institutional roles.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              disabled={isSaving || isLoading}
              className="text-xs h-9 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
              Reset Role Defaults
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSavePermissions}
              disabled={isSaving || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4 shadow-sm shadow-blue-500/20"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSaving ? 'Saving...' : 'Save Role Functionalities'}
            </Button>
          </div>
        </div>

        {/* Status Alerts */}
        {saveSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center space-x-3 text-emerald-800 dark:text-emerald-300 text-xs shadow-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              Functionalities for <b>{activeRoleData?.label}</b> successfully updated! Changes are live across the school portal.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center space-x-3 text-rose-800 dark:text-rose-300 text-xs shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: Left Roles Rail, Right Capabilities Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* ── Left Rail: Roles List (col-span-4) ── */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Roles ({roles.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Select to edit</span>
            </div>

            <div className="space-y-2">
              {roles.map((role) => {
                const isActive = activeRole === role.id;
                const assignedCount = matrix[role.id]?.length || 0;
                const totalCount = catalog.length;
                const percentage = totalCount > 0 ? Math.round((assignedCount / totalCount) * 100) : 0;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRole(role.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 border-blue-600 shadow-md ring-1 ring-blue-500/20'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${
                              isActive ? 'bg-blue-600' : 'bg-slate-400'
                            }`}
                          />
                          <h3
                            className={`text-xs font-bold truncate ${
                              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {role.label}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 pl-4">
                          {role.description}
                        </p>
                      </div>

                      <Badge
                        variant={assignedCount > 0 ? (isActive ? 'default' : 'secondary') : 'outline'}
                        className="text-[10px] shrink-0 font-mono font-medium"
                      >
                        {assignedCount} / {totalCount}
                      </Badge>
                    </div>

                    {/* Mini progress bar */}
                    <div className="mt-2.5 pl-4 flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentage > 75
                              ? 'bg-emerald-500'
                              : percentage > 35
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right Content: Functionality Matrix (col-span-8) ── */}
          <div className="lg:col-span-8 space-y-5">
            {/* Active Role Banner */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-transparent">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Configuring Role
                    </span>
                    <span className="text-xs font-mono text-slate-500">ID: {activeRole}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {activeRoleData?.label}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {activeRoleData?.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                  {/* Copy from role selector */}
                  <select
                    onChange={(e) => {
                      handleCloneFromRole(e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="h-8 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <option value="" disabled>
                      Clone from role...
                    </option>
                    {roles
                      .filter((r) => r.id !== activeRole)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          Copy {r.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Filtering Toolbar */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Filter functionalities by name or module..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setDomainFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      domainFilter === 'all'
                        ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    All ({catalog.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainFilter('academics')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      domainFilter === 'academics'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Academics
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainFilter('operations')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      domainFilter === 'operations'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Operations
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainFilter('finance')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      domainFilter === 'finance'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Finance
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainFilter('admin')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                      domainFilter === 'admin'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    Admin & HR
                  </button>
                </div>
              </div>

              {/* Batch Actions row */}
              <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <span className="font-medium">
                  Showing <b>{filteredCatalog.length}</b> functionalities
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleSelectAllFiltered(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Enable All Filtered
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAllFiltered(false)}
                    className="text-slate-600 hover:text-slate-800 dark:text-slate-400 font-semibold hover:underline"
                  >
                    Disable All Filtered
                  </button>
                </div>
              </div>

              {/* Categorized Checklists */}
              <div className="p-4 sm:p-5 space-y-6">
                {(['academics', 'operations', 'finance', 'admin'] as const).map((domainKey) => {
                  const items = groupedCatalog[domainKey];
                  if (!items || items.length === 0) return null;

                  const meta = DOMAIN_METADATA[domainKey];
                  const DomainIcon = meta.icon;
                  const allDomainIds = items.map((i) => i.id);
                  const enabledInDomain = allDomainIds.filter((id) => currentPermissions.includes(id)).length;
                  const isAllDomainEnabled = enabledInDomain === allDomainIds.length;

                  return (
                    <div
                      key={domainKey}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900"
                    >
                      {/* Domain Category Header */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-1.5 rounded-lg ${meta.bgColor}`}>
                            <DomainIcon className={`h-4 w-4 ${meta.color}`} />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                              {meta.label}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {enabledInDomain} of {allDomainIds.length} capabilities active
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleDomain(domainKey, !isAllDomainEnabled)}
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60"
                          >
                            {isAllDomainEnabled ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {/* Capabilities Items Grid */}
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {items.map((item) => {
                          const isChecked = currentPermissions.includes(item.id);

                          return (
                            <label
                              key={item.id}
                              className={`flex items-start space-x-3.5 p-3.5 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-blue-50/30 dark:bg-blue-950/15'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                              }`}
                            >
                              <div className="pt-0.5 shrink-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(item.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:checked:bg-blue-600"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    {item.id}
                                  </span>
                                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                                    {item.module}
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {item.description}
                                </p>
                              </div>

                              <div className="shrink-0 pt-0.5">
                                {isChecked ? (
                                  <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <Unlock className="h-3 w-3" />
                                    <span>Granted</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center space-x-1 text-[10px] text-slate-400">
                                    <Lock className="h-3 w-3" />
                                    <span>Restricted</span>
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer with Save button */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Total enabled for <b>{activeRoleData?.label}</b>: <b>{currentPermissions.length}</b> /{' '}
                  {catalog.length} functionalities
                </div>

                <Button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  {isSaving ? 'Saving Changes...' : 'Save Role Functionalities'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

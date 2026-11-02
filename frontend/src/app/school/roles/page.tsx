'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Shield,
  Users,
  KeyRound,
  History,
  Plus,
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Check,
  X,
  RefreshCw,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import {
  ALL_PERMISSIONS,
  PERMISSION_MODULES,
  PREDEFINED_ROLE_TEMPLATES,
  PermissionDefinition,
} from '@/lib/permissions';
import { usePermissions, Can } from '@/lib/permissions-context';
import { apiGet, apiPost, apiPut, apiDelete, getStoredSession } from '@/lib/api';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  userCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserAssignment {
  userId: string;
  fullName: string;
  email: string;
  designation?: string;
  primaryRole: string;
  additionalRoles: string[];
  directPermissions: string[];
  inheritedPermissions: string[];
  effectivePermissions: string[];
  updatedAt: string;
}

interface AuditLog {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: 'ROLE' | 'USER_ASSIGNMENT';
  targetName: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export default function RolesAndPermissionsPage() {
  const { can, isSchoolAdmin } = usePermissions();

  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'catalog' | 'audit'>('roles');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data states
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Search & Filter
  const [roleSearch, setRoleSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogFilterModule, setCatalogFilterModule] = useState<string>('all');

  // Role Editor Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleStatus, setRoleStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [permSearchQuery, setPermSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['dashboard', 'students']));

  // User Assignment Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<UserAssignment | null>(null);
  const [primaryRoleInput, setPrimaryRoleInput] = useState('');
  const [additionalRolesInput, setAdditionalRolesInput] = useState<string[]>([]);
  const [directPermsInput, setDirectPermsInput] = useState<string[]>([]);
  const [directPermSearch, setDirectPermSearch] = useState('');

  // Delete Guard Modal state
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rolesRes, usersRes, auditRes] = await Promise.all([
        apiGet<any>('/roles'),
        apiGet<any>('/roles/users'),
        apiGet<any>('/roles/audit-logs'),
      ]);

      if (rolesRes) setRoles(Array.isArray(rolesRes) ? rolesRes : rolesRes.data || []);
      if (usersRes) setUsers(Array.isArray(usersRes) ? usersRes : usersRes.data || []);
      if (auditRes) setAuditLogs(Array.isArray(auditRes) ? auditRes : auditRes.data || []);
    } catch (err: any) {
      console.error('Failed to load roles data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Open Create Role Modal
  const handleOpenCreateModal = (presetTemplate?: typeof PREDEFINED_ROLE_TEMPLATES[0]) => {
    setEditingRole(null);
    if (presetTemplate) {
      setRoleName(presetTemplate.name);
      setRoleDesc(presetTemplate.description);
      setSelectedPermissions(new Set(presetTemplate.permissionKeys));
    } else {
      setRoleName('');
      setRoleDesc('');
      setSelectedPermissions(new Set(['dashboard.overview.view']));
    }
    setRoleStatus('ACTIVE');
    setPermSearchQuery('');
    setExpandedModules(new Set(['dashboard', 'students', 'academics']));
    setIsEditorOpen(true);
  };

  // Open Edit Role Modal
  const handleOpenEditModal = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setRoleStatus(role.status);
    setSelectedPermissions(new Set(role.permissions));
    setPermSearchQuery('');
    setExpandedModules(new Set(['dashboard', 'students', 'academics', 'examinations', 'fees']));
    setIsEditorOpen(true);
  };

  // Duplicate Role
  const handleDuplicateRole = async (role: Role) => {
    try {
      const res = await apiPost<any>(`/roles/${role.id}/duplicate`, {
        name: `${role.name} (Copy)`,
        description: `Cloned from ${role.name}. ${role.description}`,
      });
      if (res.data) {
        showFeedback('success', `Role "${role.name}" successfully duplicated.`);
        fetchAllData();
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to duplicate role.');
    }
  };

  // Toggle Active/Inactive
  const handleToggleStatus = async (role: Role) => {
    try {
      const res = await apiPut<any>(`/roles/${role.id}/toggle-status`, {});
      if (res.data) {
        showFeedback('success', `Role "${role.name}" status updated to ${res.data.status}.`);
        fetchAllData();
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle status.');
    }
  };

  // Save Role (Create or Edit)
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      showFeedback('error', 'Role name cannot be empty.');
      return;
    }

    const permsArray = Array.from(selectedPermissions);

    try {
      if (editingRole) {
        await apiPut(`/roles/${editingRole.id}`, {
          name: roleName.trim(),
          description: roleDesc.trim(),
          status: roleStatus,
          permissions: permsArray,
        });
        showFeedback('success', `Role "${roleName}" successfully updated with ${permsArray.length} permissions.`);
      } else {
        await apiPost('/roles', {
          name: roleName.trim(),
          description: roleDesc.trim(),
          status: roleStatus,
          permissions: permsArray,
        });
        showFeedback('success', `New role "${roleName}" successfully created.`);
      }
      setIsEditorOpen(false);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to save role.');
    }
  };

  // Confirm Delete Role with User Protection
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.isSystem) {
      showFeedback('error', 'System roles are permanently protected and cannot be deleted.');
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget.userCount > 0) {
      showFeedback(
        'error',
        `Role is assigned to ${deleteTarget.userCount} active staff user(s). Reassign all users before deleting.`,
      );
      setDeleteTarget(null);
      return;
    }

    try {
      await apiDelete(`/roles/${deleteTarget.id}`);
      showFeedback('success', `Role "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete role.');
    }
  };

  // Open User Assignment Drawer
  const handleOpenAssignModal = (user: UserAssignment) => {
    setAssigningUser(user);
    setPrimaryRoleInput(user.primaryRole);
    setAdditionalRolesInput([...user.additionalRoles]);
    setDirectPermsInput([...user.directPermissions]);
    setDirectPermSearch('');
    setIsAssignModalOpen(true);
  };

  // Save User Role Assignment
  const handleSaveUserAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningUser) return;

    try {
      await apiPost('/roles/users/assign', {
        userId: assigningUser.userId,
        primaryRole: primaryRoleInput,
        additionalRoles: additionalRolesInput,
        directPermissions: directPermsInput,
      });
      showFeedback('success', `Roles and permissions for ${assigningUser.fullName} updated.`);
      setIsAssignModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update user assignments.');
    }
  };

  // Permissions selection helpers
  const togglePermission = (key: string) => {
    const next = new Set(selectedPermissions);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedPermissions(next);
  };

  const toggleModulePermissions = (modulePerms: PermissionDefinition[]) => {
    const keys = modulePerms.map((p) => p.key);
    const allSelected = keys.every((k) => selectedPermissions.has(k));

    const next = new Set(selectedPermissions);
    if (allSelected) {
      keys.forEach((k) => next.delete(k));
    } else {
      keys.forEach((k) => next.add(k));
    }
    setSelectedPermissions(next);
  };

  const selectAllPermissions = () => {
    setSelectedPermissions(new Set(ALL_PERMISSIONS.map((p) => p.key)));
  };

  const clearAllPermissions = () => {
    setSelectedPermissions(new Set());
  };

  // Filtered Roles list
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(roleSearch.toLowerCase()) ||
        r.code.toLowerCase().includes(roleSearch.toLowerCase()),
    );
  }, [roles, roleSearch]);

  // Filtered Users list
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.primaryRole.toLowerCase().includes(userSearch.toLowerCase()),
    );
  }, [users, userSearch]);

  // Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return ALL_PERMISSIONS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.key.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesModule = catalogFilterModule === 'all' || p.module === catalogFilterModule;
      return matchesSearch && matchesModule;
    });
  }, [catalogSearch, catalogFilterModule]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* ── Page Header ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Security Governance & Access Control</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Roles & Permissions Engine
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Configure granular permissions (<span className="font-mono text-xs font-semibold text-slate-700">MODULE → SUBMODULE → ACTION</span>),
                manage staff multi-role appointments, and enforce zero-trust security across all endpoints.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={fetchAllData}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <Can permission="roles.role.create">
                <button
                  type="button"
                  onClick={() => handleOpenCreateModal()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Custom Role</span>
                </button>
              </Can>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`mt-4 p-3.5 rounded-lg flex items-center justify-between text-xs font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                )}
                <span>{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('roles')}
              className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Roles Directory</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {roles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Staff Assignments</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'catalog'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="h-4 w-4" />
              <span>Permissions Catalog</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {ALL_PERMISSIONS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'audit'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Security Audit Trail</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                {auditLogs.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ════════════════════ TAB 1: ROLES DIRECTORY ════════════════════ */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Template Presets Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Predefined Institutional Templates (19 Ghanaian Profiles)</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Click any template to quickly clone and customize
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_ROLE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.code}
                    type="button"
                    onClick={() => handleOpenCreateModal(tmpl)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-md transition-all flex items-center space-x-1"
                  >
                    <span>{tmpl.name}</span>
                    <span className="text-[9px] text-slate-400">({tmpl.permissionKeys.length} perms)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role name, description, code..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>Showing <strong>{filteredRoles.length}</strong> defined roles</span>
              </div>
            </div>

            {/* Roles Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Role Name & System Tag</th>
                      <th className="px-5 py-3.5">Description</th>
                      <th className="px-5 py-3.5 text-center">Assigned Users</th>
                      <th className="px-5 py-3.5 text-center">Granted Perms</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredRoles.map((role) => (
                      <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-2.5">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              role.isSystem
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {role.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center space-x-2">
                                <span>{role.name}</span>
                                {role.isSystem && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                                    System Core
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                                {role.code}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 max-w-sm">
                          <p className="text-slate-600 line-clamp-2 text-xs">
                            {role.description || 'No description provided.'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <Users className="h-3 w-3 text-slate-400" />
                            <span>{role.userCount}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <KeyRound className="h-3 w-3 text-blue-500" />
                            <span>
                              {role.permissions.includes('*') ? 'All (*)' : role.permissions.length}
                            </span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(role)}
                            disabled={role.isSystem}
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                              role.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                            }`}
                            title={role.isSystem ? 'System roles cannot be deactivated' : 'Click to toggle status'}
                          >
                            {role.status === 'ACTIVE' ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 text-slate-400" />
                                <span>Inactive</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleDuplicateRole(role)}
                              title="Duplicate Role"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(role)}
                              title="Edit Role & Permissions"
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(role)}
                              title={
                                role.isSystem
                                  ? 'System core role cannot be deleted'
                                  : role.userCount > 0
                                  ? 'Users must be reassigned before deletion'
                                  : 'Delete Role'
                              }
                              className={`p-1.5 rounded-md transition-colors ${
                                role.isSystem || role.userCount > 0
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB 2: STAFF ASSIGNMENTS ════════════════════ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-xs text-slate-500">
                <span>Multi-role support: Effective permissions represent union of all assigned roles.</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Staff Member</th>
                      <th className="px-5 py-3.5">Primary Role</th>
                      <th className="px-5 py-3.5">Additional Roles</th>
                      <th className="px-5 py-3.5">Direct User Overrides</th>
                      <th className="px-5 py-3.5 text-center">Effective Scope</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredUsers.map((user) => (
                      <tr key={user.userId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{user.fullName}</div>
                              <div className="text-[11px] text-slate-500">{user.email}</div>
                              {user.designation && (
                                <div className="text-[10px] text-blue-600 font-medium">{user.designation}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            {user.primaryRole}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {user.additionalRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.additionalRoles.map((r) => (
                                <span
                                  key={r}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">None</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {user.directPermissions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.directPermissions.map((dp) => (
                                <span
                                  key={dp}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200"
                                >
                                  +{dp}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">None (Role only)</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <KeyRound className="h-3 w-3 text-emerald-600" />
                            <span>
                              {user.effectivePermissions.includes('*')
                                ? 'Wildcard (*)'
                                : `${user.effectivePermissions.length} Grants`}
                            </span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(user)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Edit Assignments</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════ TAB 3: PERMISSIONS CATALOG ════════════════════ */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 max-w-md relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search key (e.g. results.result.approve), action, or name..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-medium">Filter Module:</span>
                <select
                  value={catalogFilterModule}
                  onChange={(e) => setCatalogFilterModule(e.target.value)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Modules ({ALL_PERMISSIONS.length})</option>
                  {PERMISSION_MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.permissions.length})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((perm) => (
                <div
                  key={perm.key}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {perm.module}
                      </span>
                      {perm.isSensitive ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider flex items-center space-x-1">
                          <Lock className="h-2.5 w-2.5" />
                          <span>High Risk</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400 uppercase">
                          Standard
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{perm.name}</h3>
                    <div className="font-mono text-[11px] text-blue-600 font-medium mt-0.5 break-all">
                      {perm.key}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      {perm.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Action: <strong>{perm.action}</strong></span>
                    <span>Submodule: <strong>{perm.submodule}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════ TAB 4: AUDIT TRAIL ════════════════════ */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Immutable Permission Modification Log
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chronological tamper-evident audit record of all role creations, delegations, revocations, and overrides.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-200 text-slate-700">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start space-x-3 text-xs">
                  <div className="mt-0.5 h-7 w-7 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <History className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="font-semibold text-slate-900 flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                          {log.action}
                        </span>
                        <span className="text-slate-700">{log.targetName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="text-slate-600 mt-1 text-[11px]">{log.details}</p>

                    <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-400">
                      <span>Actor: <strong className="text-slate-600">{log.actorEmail}</strong> ({log.actorRole})</span>
                      {log.previousValue && (
                        <span>Prev: <strong className="text-slate-600">{log.previousValue}</strong></span>
                      )}
                      {log.newValue && (
                        <span>New: <strong className="text-slate-600">{log.newValue}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════ MODAL: CREATE / EDIT ROLE ════════════════════ */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingRole ? `Edit Role: ${editingRole.name}` : 'Create Custom Staff Role'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Select granular permissions to determine exactly what this role can see and execute.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRole} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Role Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Examination Officer"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Status</label>
                    <select
                      value={roleStatus}
                      onChange={(e) => setRoleStatus(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <input
                    type="text"
                    placeholder="Briefly state duties and access boundaries for this role..."
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Permissions Selector Matrix */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                  {/* Permissions Controls Header */}
                  <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Granular Permissions ({selectedPermissions.size} selected)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Filter permissions..."
                          value={permSearchQuery}
                          onChange={(e) => setPermSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1 text-[11px] bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={selectAllPermissions}
                        className="px-2.5 py-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={clearAllPermissions}
                        className="px-2.5 py-1 text-[10px] font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded border border-slate-200"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Modules Expandable Accordion */}
                  <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
                    {PERMISSION_MODULES.map((mod) => {
                      const modPerms = mod.permissions.filter(
                        (p) =>
                          p.name.toLowerCase().includes(permSearchQuery.toLowerCase()) ||
                          p.key.toLowerCase().includes(permSearchQuery.toLowerCase()),
                      );

                      if (modPerms.length === 0) return null;

                      const isExpanded = expandedModules.has(mod.id);
                      const modKeys = modPerms.map((p) => p.key);
                      const selectedInMod = modKeys.filter((k) => selectedPermissions.has(k)).length;
                      const allInModSelected = selectedInMod === modKeys.length;

                      return (
                        <div key={mod.id} className="bg-white">
                          <div className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <button
                              type="button"
                              onClick={() => {
                                const next = new Set(expandedModules);
                                if (next.has(mod.id)) next.delete(mod.id);
                                else next.add(mod.id);
                                setExpandedModules(next);
                              }}
                              className="flex items-center space-x-2 text-left text-xs font-semibold text-slate-900 flex-1"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              )}
                              <span>{mod.name}</span>
                              <span className="text-[10px] font-normal text-slate-500">
                                ({selectedInMod}/{modKeys.length})
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleModulePermissions(modPerms)}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              {allInModSelected ? 'Uncheck All' : 'Check All'}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="px-6 py-3 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 border-t border-slate-100">
                              {modPerms.map((p) => {
                                const isChecked = selectedPermissions.has(p.key);
                                return (
                                  <label
                                    key={p.key}
                                    className={`flex items-start space-x-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                      isChecked
                                        ? 'bg-blue-50/70 border-blue-300 text-blue-900'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => togglePermission(p.key)}
                                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-semibold text-[11px] truncate">{p.name}</div>
                                      <div className="text-[9px] font-mono text-slate-400 truncate">{p.key}</div>
                                    </div>
                                    {p.isSensitive && (
                                      <Lock className="h-3 w-3 text-rose-500 flex-shrink-0 mt-0.5" />
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total Permissions Granted: <strong>{selectedPermissions.size}</strong>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    {editingRole ? 'Update Role' : 'Save New Role'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════ MODAL: USER MULTI-ROLE ASSIGNMENT ════════════════════ */}
      {isAssignModalOpen && assigningUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Assign Roles: {assigningUser.fullName}
                  </h2>
                  <p className="text-[11px] text-slate-500">{assigningUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserAssignment} className="p-6 space-y-4">
              {/* Primary Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Role *</label>
                <select
                  required
                  value={primaryRoleInput}
                  onChange={(e) => setPrimaryRoleInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.permissions.length} perms)
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Roles Multi-Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Additional Roles (User inherits permissions from all checked roles)
                </label>
                <div className="border border-slate-200 rounded-lg p-3 max-h-36 overflow-y-auto space-y-1.5 bg-slate-50/50">
                  {roles
                    .filter((r) => r.name !== primaryRoleInput)
                    .map((r) => {
                      const isChecked = additionalRolesInput.includes(r.name);
                      return (
                        <label
                          key={r.id}
                          className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setAdditionalRolesInput(additionalRolesInput.filter((name) => name !== r.name));
                              } else {
                                setAdditionalRolesInput([...additionalRolesInput, r.name]);
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{r.name}</span>
                          <span className="text-[10px] text-slate-400">({r.permissions.length} perms)</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Direct User Permission Overrides */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Direct User Permission Overrides</span>
                  <span className="text-[10px] font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Discretionary Grants
                  </span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Grant specific permissions to this user without changing their role assignment.
                </p>

                <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2 bg-slate-50/50">
                  <div className="relative mb-2">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search override permission..."
                      value={directPermSearch}
                      onChange={(e) => setDirectPermSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1 text-[11px] bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                  {ALL_PERMISSIONS.filter(
                    (p) =>
                      p.name.toLowerCase().includes(directPermSearch.toLowerCase()) ||
                      p.key.toLowerCase().includes(directPermSearch.toLowerCase()),
                  ).map((p) => {
                    const isChecked = directPermsInput.includes(p.key);
                    return (
                      <label
                        key={p.key}
                        className="flex items-center space-x-2 text-[11px] text-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setDirectPermsInput(directPermsInput.filter((k) => k !== p.key));
                            } else {
                              setDirectPermsInput([...directPermsInput, p.key]);
                            }
                          }}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-medium">{p.name}</span>
                        <span className="font-mono text-[9px] text-slate-400">({p.key})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Save User Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════ MODAL: ROLE DELETION PROTECTION ════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Role?</h3>
                <p className="text-xs text-slate-500">Security check & reassignment protection</p>
              </div>
            </div>

            {deleteTarget.isSystem ? (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs leading-relaxed">
                <strong>Protected System Role:</strong> "{deleteTarget.name}" is a core institutional role and cannot be deleted.
              </div>
            ) : deleteTarget.userCount > 0 ? (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs leading-relaxed space-y-1">
                <div className="font-bold">Role In Use ({deleteTarget.userCount} active users):</div>
                <p>
                  This role is currently assigned to active staff members. You must reassign all users to another role before deleting.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete the role <strong>"{deleteTarget.name}"</strong>? This action will be recorded in the security audit log.
              </p>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg"
              >
                Cancel
              </button>
              {!deleteTarget.isSystem && deleteTarget.userCount === 0 && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirm Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


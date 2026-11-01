'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'SUPER_ADMIN' | 'SCHOOL_ADMIN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const roleParam = roleFilter !== 'ALL' ? `&role=${roleFilter}` : '';
      const res = await apiRequest(`/admin/users?limit=50${roleParam}`);
      if (res?.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      console.warn('Could not load live users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      showNotification('success', `User account status updated to ${newStatus}`);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user status');
    }
  };

  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await apiRequest('/admin/users/super-admin', {
        method: 'POST',
        body: JSON.stringify(newAdmin),
      });
      showNotification('success', `Platform Super Admin created for ${newAdmin.email}`);
      setIsInviteModalOpen(false);
      setNewAdmin({ email: '', firstName: '', lastName: '', phoneNumber: '' });
      fetchUsers();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create Super Admin');
    } finally {
      setInviting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Users className="h-6 w-6 text-amber-500" />
              <span>Platform-Wide User Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Govern platform root Super Administrators and cross-tenant School Administrators.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start">
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 shadow-sm"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Create Super Admin
            </Button>
            <Button
              onClick={fetchUsers}
              variant="outline"
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {notification && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 ml-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'ALL'
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('SUPER_ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'SUPER_ADMIN'
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              Super Administrators
            </button>
            <button
              onClick={() => setRoleFilter('SCHOOL_ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                roleFilter === 'SCHOOL_ADMIN'
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              School Administrators
            </button>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-slate-200 text-slate-900 text-xs h-9"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Account Scope</th>
                    <th className="py-3 px-4">Associated Tenant</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSuperAdmin = u.accountType === 'SUPER_ADMIN';
                    const membership = u.memberships?.[0];

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">
                            {u.profile?.firstName} {u.profile?.lastName || '(No name set)'}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          {isSuperAdmin ? (
                            <span className="inline-flex items-center space-x-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              <ShieldAlert className="h-3 w-3" />
                              <span>SUPER_ADMIN</span>
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {membership?.profile || 'USER'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {isSuperAdmin ? (
                            <span className="text-slate-400 text-[11px]">Platform Root (All Schools)</span>
                          ) : membership?.school ? (
                            <div>
                              <div className="font-medium text-slate-900">{membership.school.name}</div>
                              <div className="font-mono text-[10px] text-slate-500">
                                {membership.school.schoolCode}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never logged in'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`text-xs font-medium transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'text-rose-600 hover:text-rose-700'
                                : 'text-emerald-600 hover:text-emerald-700'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal: Create Super Admin */}
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title="Create Platform Super Administrator"
        >
          <form onSubmit={handleCreateSuperAdmin} className="space-y-4">
            <p className="text-xs text-slate-500">
              Super Administrators have unrestricted platform-wide visibility, school tenant control, and configuration permissions.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">First Name</label>
                <Input
                  required
                  placeholder="e.g. John"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Last Name</label>
                <Input
                  required
                  placeholder="e.g. Doe"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Admin Email Address</label>
              <Input
                type="email"
                required
                placeholder="admin@platform.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Phone Number (Optional)</label>
              <Input
                placeholder="+233 24 000 0000"
                value={newAdmin.phoneNumber}
                onChange={(e) => setNewAdmin({ ...newAdmin, phoneNumber: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 text-xs h-9"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteModalOpen(false)}
                className="border-slate-200 text-slate-600 text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={inviting}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
              >
                {inviting ? 'Creating...' : 'Create Super Admin'}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

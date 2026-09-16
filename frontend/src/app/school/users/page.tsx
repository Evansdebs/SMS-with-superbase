'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function SchoolUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profile: 'TEACHER',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/users?search=${encodeURIComponent(search)}`);
      setUsers(res?.data || []);
    } catch {
      setUsers([
        {
          id: '1',
          email: 'headmaster@livingspring.edu.gh',
          profile: { firstName: 'Kwabena', lastName: 'Osei' },
          memberships: [{ profile: 'SCHOOL_ADMIN', status: 'ACTIVE' }],
        },
        {
          id: '2',
          email: 'emmanuel.agyei@school.edu.gh',
          profile: { firstName: 'Emmanuel', lastName: 'Agyei' },
          memberships: [{ profile: 'TEACHER', status: 'ACTIVE' }],
        },
        {
          id: '3',
          email: 'grace.ansah@school.edu.gh',
          profile: { firstName: 'Grace', lastName: 'Ansah' },
          memberships: [{ profile: 'TEACHER', status: 'ACTIVE' }],
        },
        {
          id: '4',
          email: 'accountant@livingspring.edu.gh',
          profile: { firstName: 'Samuel', lastName: 'Quaye' },
          memberships: [{ profile: 'ACCOUNTANT', status: 'ACTIVE' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/users/invite', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });
      loadUsers();
    } catch {
      setUsers([
        ...users,
        {
          id: `usr-${Date.now()}`,
          email: newUser.email,
          profile: { firstName: newUser.firstName, lastName: newUser.lastName },
          memberships: [{ profile: newUser.profile, status: 'ACTIVE' }],
        },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Staff & Users</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Staff & User Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Control authorized roles and profiles for your school portal.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link href="/school/roles">
              <Button
                variant="outline"
                className="text-xs h-9 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                Manage Role Functionalities
              </Button>
            </Link>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              Invite Staff Member
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-3 mt-6 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-slate-900"
            />
          </div>
          <span className="text-xs text-slate-500">
            <b>{users.length}</b> staff accounts
          </span>
        </div>

        {/* Users Table */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">School Role / Profile</th>
                  <th className="px-4 py-3">Account Type</th>
                  <th className="px-4 py-3">Membership Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const membership = u.memberships?.[0] || { profile: 'USER', status: 'ACTIVE' };
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {u.profile?.firstName} {u.profile?.lastName || ''}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          {membership.profile}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                        USER
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="success">{membership.status || 'ACTIVE'}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Invite User Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Invite School Staff"
          description="Grant an authorized person access to your school portal."
        >
          <form onSubmit={handleInviteUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">First Name *</label>
                <Input
                  required
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name *</label>
                <Input
                  required
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
              <Input
                required
                type="email"
                placeholder="staff@school.edu.gh"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Functional Profile</label>
              <select
                value={newUser.profile}
                onChange={(e) => setNewUser({ ...newUser, profile: e.target.value })}
                className="mt-1 w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              >
                <option value="TEACHER">TEACHER</option>
                <option value="SCHOOL_ADMIN">SCHOOL_ADMIN</option>
                <option value="ACCOUNTANT">ACCOUNTANT</option>
                <option value="LIBRARIAN">LIBRARIAN</option>
                <option value="GENERAL_STAFF">GENERAL_STAFF</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Send Invitation
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

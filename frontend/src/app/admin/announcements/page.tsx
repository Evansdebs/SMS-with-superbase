'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  PlusCircle,
  Trash2,
  AlertTriangle,
  Info,
  Wrench,
  RefreshCw,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: '',
    content: '',
    type: 'INFO',
    target: 'ALL',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/admin/announcements');
      setAnnouncements(res || []);
    } catch (err: any) {
      console.warn('Could not load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiRequest('/admin/announcements', {
        method: 'POST',
        body: JSON.stringify(newAnn),
      });
      showNotification('success', 'System broadcast announcement published to school portals');
      setIsCreateModalOpen(false);
      setNewAnn({ title: '', content: '', type: 'INFO', target: 'ALL' });
      fetchAnnouncements();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create announcement');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/admin/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showNotification('success', 'Announcement removed');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to remove announcement');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MAINTENANCE':
        return <Wrench className="h-4 w-4 text-amber-600" />;
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-rose-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Bell className="h-6 w-6 text-amber-500" />
              <span>Platform System Announcements</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Broadcast critical service banners, maintenance notices, and updates across all school tenant dashboards.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 shadow-sm"
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Broadcast Notice
            </Button>
            <Button
              onClick={fetchAnnouncements}
              variant="outline"
              className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 shadow-xs"
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

        {/* Announcements List */}
        <div className="space-y-3">
          {announcements.map((ann) => (
            <Card key={ann.id} className="bg-white border-slate-200 hover:border-slate-300 shadow-sm transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getTypeIcon(ann.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-amber-700 font-bold">{ann.id}</span>
                      <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                      <Badge
                        variant={
                          ann.type === 'MAINTENANCE'
                            ? 'warning'
                            : ann.type === 'CRITICAL'
                            ? 'danger'
                            : 'secondary'
                        }
                      >
                        {ann.type}
                      </Badge>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Target: {ann.target}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                      {ann.content}
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Published: {new Date(ann.createdAt).toLocaleString()} • Valid until:{' '}
                      {new Date(ann.activeTo).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
                  <Button
                    onClick={() => handleDelete(ann.id)}
                    variant="outline"
                    className="border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs h-8"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal: Broadcast Notice */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Compose Platform Broadcast Notice"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-xs text-slate-500">
              This message will be rendered as a prominent banner across dashboards of schools matching the target.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Notice Headline</label>
              <Input
                required
                placeholder="e.g. Scheduled System Upgrade Notification"
                value={newAnn.title}
                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Notice Type</label>
                <select
                  value={newAnn.type}
                  onChange={(e) => setNewAnn({ ...newAnn, type: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                >
                  <option value="INFO">INFO (General announcement)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Scheduled window)</option>
                  <option value="CRITICAL">CRITICAL (Action required)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Target Audience</label>
                <select
                  value={newAnn.target}
                  onChange={(e) => setNewAnn({ ...newAnn, target: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                >
                  <option value="ALL">All School Tenants</option>
                  <option value="BASIC">BASIC Plan Schools Only</option>
                  <option value="PRO">PRO Plan Schools Only</option>
                  <option value="ENTERPRISE">ENTERPRISE Schools Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Notice Content / Instructions</label>
              <textarea
                required
                rows={4}
                placeholder="Provide detailed instructions or explanation..."
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs p-3 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="border-slate-200 text-slate-600 text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
              >
                {creating ? 'Publishing...' : 'Publish Announcement'}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

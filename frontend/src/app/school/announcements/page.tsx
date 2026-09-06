'use client';

import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Megaphone,
  CheckCircle2,
  Calendar,
  Users,
  Pin,
  Trash2,
  Send,
  Eye,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetType: 'SCHOOL' | 'TEACHERS' | 'PARENTS' | 'STUDENTS';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  isPinned?: boolean;
  publishedAt: string;
  author: string;
  views: number;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterTarget, setFilterTarget] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New notice form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetType: 'SCHOOL' as 'SCHOOL' | 'TEACHERS' | 'PARENTS' | 'STUDENTS',
    priority: 'NORMAL' as 'URGENT' | 'HIGH' | 'NORMAL',
    isPinned: false,
  });

  const filtered = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || item.priority === filterPriority;
    const matchesTarget = filterTarget === 'ALL' || item.targetType === filterTarget;
    return matchesSearch && matchesPriority && matchesTarget;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      targetType: formData.targetType,
      priority: formData.priority,
      isPinned: formData.isPinned,
      publishedAt: new Date().toISOString(),
      author: 'Administration',
      views: 1,
    };

    setAnnouncements([newItem, ...announcements]);
    setFormData({
      title: '',
      content: '',
      targetType: 'SCHOOL',
      priority: 'NORMAL',
      isPinned: false,
    });
    setIsCreateModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Communications & Broadcasts
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Notice Board</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Announcements & Circulars
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Publish school-wide circulars and targeted communications to teachers, parents, and students.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>New Announcement</span>
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {announcements.length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Active Notices
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {announcements.filter((a) => a.priority === 'URGENT').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Urgent Priority Notices
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Community Views
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="ALL">All Audiences</option>
              <option value="SCHOOL">Entire School</option>
              <option value="TEACHERS">Teachers Only</option>
              <option value="PARENTS">Parents Only</option>
              <option value="STUDENTS">Students Only</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>
        </div>

        {/* Announcement List */}
        <div className="space-y-4">
          {filtered.map((item) => {
            const isUrgent = item.priority === 'URGENT';
            const isHigh = item.priority === 'HIGH';

            return (
              <Card
                key={item.id}
                className={`overflow-hidden border transition-all ${
                  item.isPinned
                    ? 'border-blue-300 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isUrgent
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-950'
                            : isHigh
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-950'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-950'
                        }`}
                      >
                        <Megaphone className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.isPinned && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-[10px]">
                              <Pin className="h-2.5 w-2.5 fill-current" /> Pinned
                            </Badge>
                          )}
                          <Badge
                            variant={
                              isUrgent
                                ? 'destructive'
                                : isHigh
                                ? 'warning'
                                : 'info'
                            }
                            className="text-[10px]"
                          >
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {item.targetType}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>By {item.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {item.views} views
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleTogglePin(item.id)}
                        title={item.isPinned ? 'Unpin' : 'Pin to top'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.isPinned
                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete Notice"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                    {item.content}
                  </p>
                </div>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No announcements found
              </p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast New Announcement"
        description="Publish circular or notice to selected school stakeholders"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notice Title *
            </label>
            <Input
              required
              placeholder="e.g. End of Term Examination Schedule"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audience
              </label>
              <select
                value={formData.targetType}
                onChange={(e) =>
                  setFormData({ ...formData, targetType: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="SCHOOL">Entire School Community</option>
                <option value="TEACHERS">Teaching Staff Only</option>
                <option value="PARENTS">Parents & Guardians</option>
                <option value="STUDENTS">Students Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Content / Notice Body *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Write the announcement details here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pinNotice"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="pinNotice" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Pin this notice to top of the dashboard & notice board
            </label>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold flex items-center space-x-1.5">
              <Send className="h-3.5 w-3.5" />
              <span>Publish Notice</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

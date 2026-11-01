'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bell,
  Search,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentMessagesPage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');
  const [activeTab, setActiveTab] = useState<'notices' | 'teachers'>('teachers');
  const [targetTeacher, setTargetTeacher] = useState('Mr. Kwame Mensah (Class Master & Science Tutor)');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selected_child_id');
      if (saved) setActiveChildId(saved);

      const handler = (e: any) => {
        if (e.detail?.childId) setActiveChildId(e.detail.childId);
      };
      window.addEventListener('parent_child_changed', handler);
      return () => window.removeEventListener('parent_child_changed', handler);
    }
  }, []);

  const child = mockChildren.find((c) => c.id === activeChildId) || mockChildren[0];

  const teacherConversations = [
    {
      id: 'tc-01',
      teacher: 'Mr. Kwame Mensah',
      role: 'Class Master & Senior Science Tutor',
      date: 'Yesterday, 04:30 PM',
      preview: 'Good afternoon Mr. Ansah. Kofi participated excellently in today\'s chemical reactions lab. His leadership was commendable.',
      isRead: true,
    },
    {
      id: 'tc-02',
      teacher: 'Ms. Cynthia Addo',
      role: 'Head of Languages (English)',
      date: 'Oct 28, 02:15 PM',
      preview: 'Please note that our upcoming literature drama presentation requires the reading text by Friday. Kofi is well prepared.',
      isRead: true,
    },
  ];

  const schoolBroadcasts = [
    {
      id: 'bc-01',
      title: 'Parent-Teacher Association (PTA) Term 1 General Assembly',
      sender: 'PTA Executive Council & Headmaster',
      date: 'Oct 30, 2026',
      content: 'The PTA General Meeting is scheduled for Saturday, Nov 21 at 09:30 AM in the Main Assembly Hall. Agenda includes security upgrades and the new Science STEM lab.',
    },
    {
      id: 'bc-02',
      title: 'Speech and Prize-Giving Day Preparations',
      sender: 'School Administration',
      date: 'Oct 24, 2026',
      content: 'Parents of honor roll and distinction students will receive personalized seating invitations by next Monday.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgContent) return;
    setMsgSent(true);
    setNewMsgContent('');
    setTimeout(() => setMsgSent(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Communication Regarding: {child.name} ({child.class})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Direct Teacher Messaging & School Notices</h1>
          <p className="text-slate-600 text-sm mt-1">
            Converse directly with your child's class master, subject tutors, and receive administrative broadcasts.
          </p>
        </div>
      </div>

      {msgSent && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Message dispatched to {targetTeacher}! Copy sent to guardian registered phone number.
            </span>
          </div>
          <span>Status: SENT</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'teachers'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Teacher Communications ({teacherConversations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'notices'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>School Broadcasts & PTA ({schoolBroadcasts.length})</span>
        </button>
      </div>

      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages list (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base font-bold text-slate-900">
                  Conversation History for {child.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Verified communications with subject instructors and class master
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {teacherConversations.map((m) => (
                  <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="font-bold text-slate-900 flex items-center space-x-2">
                        <span>{m.teacher}</span>
                        <span className="text-slate-400 font-normal">({m.role})</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{m.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.preview}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Send message form (1 col) */}
          <div>
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Send Teacher an Inquiry</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Regarding {child.name} ({child.class})
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Recipient Teacher</label>
                    <select
                      value={targetTeacher}
                      onChange={(e) => setTargetTeacher(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                    >
                      <option>Mr. Kwame Mensah (Class Master & Science Tutor)</option>
                      <option>Ms. Cynthia Addo (Languages Tutor)</option>
                      <option>Mr. Emmanuel Ofori (Social Studies Tutor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message Content</label>
                    <textarea
                      rows={4}
                      value={newMsgContent}
                      onChange={(e) => setNewMsgContent(e.target.value)}
                      placeholder="Dear Mr. Mensah, I would like to inquire regarding Kofi's progress..."
                      required
                      className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-teal-600"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs">
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="space-y-4">
          {schoolBroadcasts.map((b) => (
            <Card key={b.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-teal-800">{b.sender}</span>
                  <span className="text-slate-400">{b.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{b.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}


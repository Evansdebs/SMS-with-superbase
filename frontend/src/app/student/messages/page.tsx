'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  MessageSquare,
  Search,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function StudentMessagesPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'notices' | 'messages'>('notices');
  const [newMsgContent, setNewMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [targetTeacher, setTargetTeacher] = useState('Mr. Kwame Mensah (Science & Math)');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const notices = [
    {
      id: 'not-01',
      title: 'BECE Diagnostic Mock Examinations Timetable',
      sender: 'Academic Directorate',
      date: 'Today at 08:30 AM',
      category: 'EXAMINATIONS',
      content: 'The master diagnostic examination schedule for JHS 1, 2, and 3 has been posted. Revision clinics in Mathematics and Science start next Monday.',
    },
    {
      id: 'not-02',
      title: 'Inter-House Sports Competitions & Relay Trials',
      sender: 'Sports Directorate',
      date: 'Yesterday',
      category: 'SPORTS',
      content: 'All house track athletes (Aggrey, Nkrumah, Guggisberg, Aggrey) are required to attend training at 3:30 PM on the main sports field.',
    },
    {
      id: 'not-03',
      title: 'Science Laboratory Safety Protocol Updates',
      sender: 'Science Department (Mr. Kwame Mensah)',
      date: 'Oct 29, 2026',
      category: 'ACADEMICS',
      content: 'All students taking chemistry practicals must wear safety goggles and lab coats. Loose glassware is strictly prohibited outside work bays.',
    },
  ];

  const messages = [
    {
      id: 'msg-01',
      sender: 'Mr. Kwame Mensah',
      role: 'Integrated Science Teacher',
      date: 'Oct 30, 2026',
      preview: 'Great work on the titration setup in yesterday\'s practical session, Kofi. Keep up the high standard.',
      isRead: true,
    },
    {
      id: 'msg-02',
      sender: 'Ms. Cynthia Addo',
      role: 'English Literature Teacher',
      date: 'Oct 26, 2026',
      preview: 'Please remember to bring your copy of "The Cockcrow" to tomorrow\'s period 2 session.',
      isRead: true,
    },
  ];

  const handleSend = (e: React.FormEvent) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Notices, Broadcasts & Teacher Messages</h1>
          <p className="text-slate-600 text-sm mt-1">
            Stay updated with school-wide announcements and message your subject masters.
          </p>
        </div>
      </div>

      {msgSent && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Message delivered to teacher's portal inbox!</span>
          </div>
          <span>Status: SENT</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('notices')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'notices'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>School Announcements ({notices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'messages'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Teacher Communications ({messages.length})</span>
        </button>
      </div>

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {notices.map((n) => (
            <Card key={n.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                      {n.category}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-700">{n.sender}</span>
                  </div>
                  <span className="text-xs text-slate-400">{n.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inbox List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-base font-bold text-slate-900">Direct Teacher Messages</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Private academic communication with your tutors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {messages.map((m) => (
                  <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="font-bold text-slate-900 flex items-center space-x-2">
                        <span>{m.sender}</span>
                        <span className="text-slate-400 font-normal">({m.role})</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{m.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{m.preview}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Compose Box (1 col) */}
          <div>
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Ask Teacher a Question</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Send an academic or homework inquiry
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">To Teacher</label>
                    <select
                      value={targetTeacher}
                      onChange={(e) => setTargetTeacher(e.target.value)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                    >
                      <option>Mr. Kwame Mensah (Science & Math)</option>
                      <option>Ms. Cynthia Addo (English Language)</option>
                      <option>Mr. Emmanuel Ofori (Social Studies)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Message</label>
                    <textarea
                      rows={4}
                      placeholder="Type your academic question..."
                      value={newMsgContent}
                      onChange={(e) => setNewMsgContent(e.target.value)}
                      required
                      className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-indigo-500"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send Question
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}


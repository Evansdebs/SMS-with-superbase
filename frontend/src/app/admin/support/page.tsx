'use client';

import React, { useState, useEffect } from 'react';
import {
  Headphones,
  RefreshCw,
  Send,
  User,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
      const res = await apiRequest(`/admin/support/tickets${statusParam}`);
      setTickets(res || []);
      if (selectedTicket) {
        const updated = res?.find((t: any) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err: any) {
      console.warn('Could not load support tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      await apiRequest(`/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTickets();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await apiRequest(`/admin/support/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ replyMessage, status: 'IN_PROGRESS' }),
      });
      setReplyMessage('');
      fetchTickets();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSending(false);
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
              <Headphones className="h-6 w-6 text-amber-500" />
              <span>Platform Support &amp; Tenant Desk</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cross-tenant support ticketing, issue triage, and direct communication with school administrators.
            </p>
          </div>

          <Button
            onClick={fetchTickets}
            variant="outline"
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 self-start shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Desk
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex space-x-2 border-b border-slate-200 pb-4">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Ticket List and Detail Cockpit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 space-y-3">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/50 border-amber-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-amber-600">{t.id}</span>
                    <Badge
                      variant={
                        t.priority === 'URGENT'
                          ? 'danger'
                          : t.priority === 'HIGH'
                          ? 'danger'
                          : 'secondary'
                      }
                    >
                      {t.priority}
                    </Badge>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">{t.subject}</h3>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{t.schoolName}</span>
                    <span className="font-mono text-slate-400">{t.schoolCode}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-semibold ${
                        t.status === 'OPEN'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Conversation & Actions */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card className="bg-white border-slate-200 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-amber-600 font-bold">
                            {selectedTicket.id}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-700">{selectedTicket.schoolName}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {selectedTicket.schoolCode}
                          </span>
                        </div>
                        <CardTitle className="text-base text-slate-900">{selectedTicket.subject}</CardTitle>
                      </div>

                      {/* Status changer */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                          className="bg-white border border-slate-200 text-slate-900 text-xs h-8 px-2 rounded-md focus:border-slate-400"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedTicket.messages?.map((msg: any, i: number) => {
                      const isSuperAdmin = msg.sender === 'admin@platform.com';
                      return (
                        <div
                          key={i}
                          className={`p-3.5 rounded-lg text-xs ${
                            isSuperAdmin
                              ? 'bg-amber-50 border border-amber-200 text-slate-900 ml-6'
                              : 'bg-slate-50 border border-slate-200 text-slate-900 mr-6'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5 text-[10px]">
                            <span className="font-bold flex items-center space-x-1 text-slate-800">
                              <User className="h-3 w-3 text-slate-500" />
                              <span>{isSuperAdmin ? 'EduSphere Platform Support' : selectedTicket.requesterName}</span>
                            </span>
                            <span className="text-slate-400">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="leading-relaxed text-slate-700">{msg.message}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </div>

                {/* Reply Form */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <form onSubmit={handleSendReply} className="flex space-x-2">
                    <Input
                      placeholder="Type response to school administrator..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900 text-xs h-10 flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={sending || !replyMessage.trim()}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-10 px-4 shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5 mr-1" />
                      {sending ? 'Sending...' : 'Reply'}
                    </Button>
                  </form>
                </div>
              </Card>
            ) : (
              <div className="h-full min-h-[300px] rounded-xl border border-dashed border-slate-200 bg-white flex items-center justify-center text-xs text-slate-400">
                Select a support ticket from the list to view conversation history and reply.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

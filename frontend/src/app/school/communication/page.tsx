'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Smartphone,
  CreditCard,
  FileText,
  Mail,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Plus,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'compose' | 'logs' | 'templates'>('compose');
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // SMS Form
  const [smsForm, setSmsForm] = useState({
    recipientType: 'CUSTOM', // CUSTOM, ALL_PARENTS, DEBTORS, TEACHERS
    recipients: '',
    message: '',
    senderId: 'SMS-ALERT',
  });

  // Success Notification state
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logs, tmpls] = await Promise.all([
        apiRequest('/communication/sms/logs'),
        apiRequest('/communication/sms/templates'),
      ]);
      if (logs) setSmsLogs(logs);
      if (tmpls) setTemplates(tmpls);
    } catch {
      // Fallback sample data
      setSmsLogs([
        { id: '1', recipientPhone: '+233 24 123 4567', message: 'Dear Parent, Term 1 report cards for Kwesi Mensah are now ready on the school portal.', senderId: 'ACHIMOTA', creditsUsed: 1, status: 'SENT', createdAt: new Date().toISOString() },
        { id: '2', recipientPhone: '+233 20 987 6543', message: 'Reminder: Outstanding fees of GH₵ 850.00 for Abena Osei are due by Friday.', senderId: 'ACHIMOTA', creditsUsed: 1, status: 'SENT', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
      setTemplates([
        {
          id: '1',
          templateKey: 'FEE_REMINDER',
          title: 'Fee Arrears Notice',
          content: 'Dear Parent, this is a reminder that your ward {student_name} has outstanding fees of GH₵ {amount}. Kindly make payment promptly. Thank you.',
        },
        {
          id: '2',
          templateKey: 'ABSENT_ALERT',
          title: 'Absence Alert',
          content: 'Dear Parent, your ward {student_name} was marked ABSENT today, {date}. Please contact the school office if you have any questions.',
        },
        {
          id: '3',
          templateKey: 'RESULT_READY',
          title: 'Report Cards Ready',
          content: 'Dear Parent, the Term {term} academic report card for {student_name} is now published and available on the school portal.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const phones = smsForm.recipients
        .split(/[\n,]/)
        .map((p) => p.trim())
        .filter((p) => p.length > 5);

      if (phones.length === 0) {
        alert('Please enter at least one valid phone number');
        setSending(false);
        return;
      }

      await apiRequest('/communication/sms/send', {
        method: 'POST',
        body: JSON.stringify({
          recipientPhones: phones,
          message: smsForm.message,
          senderId: smsForm.senderId,
        }),
      });

      setSuccessNotice(`SMS sent successfully to ${phones.length} recipient(s) via Arkesel Gateway!`);
      setSmsForm({ ...smsForm, message: '', recipients: '' });
      setTimeout(() => setSuccessNotice(null), 5000);
      loadData();
    } catch {
      alert('Error sending SMS broadcast');
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (content: string) => {
    setSmsForm({ ...smsForm, message: content });
    setActiveTab('compose');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-50 dark:bg-violet-950/50 rounded-xl text-violet-600 dark:text-violet-400">
                <MessageSquare className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Bulk SMS & Parent Communications
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Broadcast instant SMS notices, emergency alerts, fee reminders, and report card releases to Ghana telcos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-violet-50/50 dark:bg-violet-950/30 px-4 py-2.5 rounded-xl border border-violet-100 dark:border-violet-900/50">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">SMS Credit Balance</p>
              <p className="text-xl font-black text-violet-600 dark:text-violet-400">1,840 Units</p>
            </div>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs">
              Top Up
            </Button>
          </div>
        </div>

        {/* Notice alert */}
        {successNotice && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'compose'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Compose Broadcast
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'logs'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Delivery Logs ({smsLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'templates'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Message Templates ({templates.length})
          </button>
        </div>

        {/* TAB 1: COMPOSE SMS */}
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Compose SMS Message</CardTitle>
                  <CardDescription>
                    Standard GSM characters (160 characters per SMS credit unit)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendSms} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Sender ID (Alpha-numeric)</label>
                        <Input
                          value={smsForm.senderId}
                          maxLength={11}
                          onChange={(e) => setSmsForm({ ...smsForm, senderId: e.target.value.toUpperCase() })}
                          placeholder="e.g. SCHOOL_NAME"
                          className="font-mono uppercase font-bold"
                        />
                        <span className="text-xs text-slate-400">Max 11 characters registered with NCA</span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-slate-500">Target Audience</label>
                        <select
                          value={smsForm.recipientType}
                          onChange={(e) => setSmsForm({ ...smsForm, recipientType: e.target.value })}
                          className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                        >
                          <option value="CUSTOM">Custom Phone Number(s)</option>
                          <option value="ALL_PARENTS">All Registered Parents</option>
                          <option value="DEBTORS">Fee Debtors Only (Outstanding &gt; 0)</option>
                          <option value="TEACHERS">All Teachers & Staff</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-slate-500">
                        Recipient Numbers (Comma or newline separated)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={smsForm.recipients}
                        onChange={(e) => setSmsForm({ ...smsForm, recipients: e.target.value })}
                        placeholder="e.g. 0244123456, 0501234567, +233200000000"
                        className="w-full mt-1.5 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold uppercase text-slate-500">SMS Body Content</label>
                        <span className="text-xs font-mono text-slate-400">
                          {smsForm.message.length} chars • {Math.max(1, Math.ceil(smsForm.message.length / 160))} Unit(s)
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        required
                        value={smsForm.message}
                        onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                        placeholder="Type your announcement or message here..."
                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={sending}
                        className="bg-violet-600 hover:bg-violet-700 text-white gap-2 px-6"
                      >
                        <Send className="h-4 w-4" />
                        {sending ? 'Broadcasting...' : 'Broadcast SMS'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Quick Templates Drawer */}
            <div className="space-y-4">
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    Quick Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => applyTemplate(tmpl.content)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-500 cursor-pointer transition group"
                    >
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-violet-600">
                        {tmpl.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {tmpl.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: SMS LOGS */}
        {activeTab === 'logs' && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">SMS Delivery Audit Log</CardTitle>
              <CardDescription>Live dispatch records sent through telecommunications gateway</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-5 py-3.5">Recipient Phone</th>
                      <th className="px-5 py-3.5">Sender ID</th>
                      <th className="px-5 py-3.5">Message Content</th>
                      <th className="px-5 py-3.5">Credits</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Dispatched At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {smsLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {log.recipientPhone}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs uppercase text-slate-600 dark:text-slate-400">
                          {log.senderId}
                        </td>
                        <td className="px-5 py-3.5 max-w-sm">
                          <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">{log.message}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-slate-600">
                          {log.creditsUsed} unit
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs">
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">
                          {new Date(log.createdAt).toLocaleString('en-GB')}
                        </td>
                      </tr>
                    ))}
                    {smsLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-500">
                          No SMS messages logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => (
              <Card key={t.id} className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs font-mono">{t.templateKey}</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{t.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono">
                    {t.content}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyTemplate(t.content)}
                    className="w-full text-xs gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" /> Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  Radio,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function CommunicationEnginePage() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'templates' | 'automated' | 'logs'>('broadcast');
  const [targetGroup, setTargetGroup] = useState('ALL_PARENTS');
  const [channel, setChannel] = useState('SMS_AND_INAPP');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const [messageLogs, setMessageLogs] = useState([
    {
      id: 'msg-991',
      date: 'Today, 08:05 AM',
      channel: 'SMS & PUSH',
      recipientGroup: 'JHS 1 Parents (42 recipients)',
      title: 'Roll Call Alert: Student Check-in Confirmation',
      status: 'DELIVERED (100%)',
    },
    {
      id: 'msg-990',
      date: 'Yesterday, 04:30 PM',
      channel: 'SMS',
      recipientGroup: 'All School Parents (345 recipients)',
      title: 'Term 1 Mid-Term Examination Dates Released',
      status: 'DELIVERED (98.8%)',
    },
    {
      id: 'msg-989',
      date: 'Oct 28, 2026',
      channel: 'IN-APP & EMAIL',
      recipientGroup: 'Faculty & Teaching Staff (24 recipients)',
      title: 'Continuous Assessment 50% Marks Submission Deadline',
      status: 'READ (100%)',
    },
  ]);

  const automatedTriggers = [
    { trigger: 'Student Marked Absent Today', channel: 'SMS to Parent', autoAction: 'Dispatched at 09:00 AM automatically if unexcused' },
    { trigger: 'Fee Payment Received', channel: 'SMS & Push Notification', autoAction: 'Instant electronic receipt reference sent upon MoMo or Bank confirmation' },
    { trigger: 'Fee Invoice Overdue', channel: 'SMS & Email Notice', autoAction: 'Automated 7-day reminder before terminal exam clearance window' },
    { trigger: 'New Assignment / Homework Posted', channel: 'Student & Parent Push Notification', autoAction: 'Sent upon teacher assignment creation' },
    { trigger: 'Terminal Result Published', channel: 'In-App & SMS Link', autoAction: 'Dispatched once Headmaster formally publishes class results' },
    { trigger: 'Exeat Slip Approved by House Master', channel: 'SMS with QR Security Pass', autoAction: 'Pushed to parent phone and school gate turnstile' },
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) return;

    const newLog = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      channel: channel.replace('_', ' '),
      recipientGroup: targetGroup.replace('_', ' '),
      title: broadcastTitle,
      status: 'DELIVERING...',
    };

    setMessageLogs([newLog, ...messageLogs]);
    setSentSuccess(true);
    setBroadcastTitle('');
    setBroadcastBody('');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 13 — Omnichannel Communication Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Central Communication & Messaging Hub</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Coordinate multi-channel SMS broadcasts, push notifications, automated absence alerts, and delivery receipts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-1 px-3">
            SMS Balance: 8,420 Credits
          </Badge>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Broadcast queued! Dispatched to SMS gateway & push notification servers.</span>
          </div>
          <span>Status: BROADCAST_DISPATCHED</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'broadcast' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Radio className="h-4 w-4" />
          <span>Compose Bulk Broadcast</span>
        </button>

        <button
          onClick={() => setActiveTab('automated')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'automated' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Automated Triggers ({automatedTriggers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'logs' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Delivery History & Logs</span>
        </button>
      </div>

      {/* Compose Tab */}
      {activeTab === 'broadcast' && (
        <Card className="bg-white border-slate-200 shadow-xs max-w-3xl">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">Broadcast Dispatcher</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Send instant emergency broadcasts or announcements to segmented groups
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                  >
                    <option value="ALL_PARENTS">All School Parents & Guardians (345)</option>
                    <option value="JHS_PARENTS">JHS Department Parents Only (115)</option>
                    <option value="PRIMARY_PARENTS">Primary School Parents Only (160)</option>
                    <option value="ALL_STAFF">Faculty Teachers & HR Staff (24)</option>
                    <option value="BOARDERS_PARENTS">Boarding Hostel Guardians (45)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Channels</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                  >
                    <option value="SMS_AND_INAPP">SMS & In-App Portal Broadcast</option>
                    <option value="SMS_ONLY">SMS Direct Text Only</option>
                    <option value="IN_APP_PUSH">Mobile App Push Notification</option>
                    <option value="EMAIL">Email Dispatch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Broadcast Subject / Headline</label>
                <Input
                  placeholder="e.g. PTA General Meeting / Mid-Term Break Advisory"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Text</label>
                <textarea
                  rows={4}
                  placeholder="Type message text. Variables like [Student Name] will be auto-personalized..."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-indigo-500"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                  <span>Characters: {broadcastBody.length} (Estimated 1 SMS page per recipient)</span>
                  <span>Sender ID: <strong>SCH001</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                  <Send className="h-3.5 w-3.5 mr-1.5" /> Dispatch Broadcast Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Automated Triggers */}
      {activeTab === 'automated' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Event-Driven Automated Notification Rules</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              System events that automatically fire real-time SMS and in-app alerts to parents and teachers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Event Trigger</th>
                  <th className="py-3 px-4">Notification Channel</th>
                  <th className="py-3 px-4">Automation Rule</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {automatedTriggers.map((trig, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{trig.trigger}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]">
                        {trig.channel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{trig.autoAction}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Dispatched Communication Master Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messageLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.id}</td>
                    <td className="py-3 px-4 text-slate-500">{l.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{l.recipientGroup}</td>
                    <td className="py-3 px-4 text-slate-700">{l.title}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


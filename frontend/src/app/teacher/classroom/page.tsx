'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Award,
  AlertTriangle,
  Plus,
  Send,
  UserCheck,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  Heart,
  Flag,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function TeacherClassroomPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'behavior' | 'parentMsg' | 'interventions'>('behavior');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('Kofi Ansah');
  const [logType, setLogType] = useState<'MERIT' | 'DEMERIT'>('MERIT');
  const [points, setPoints] = useState('5');
  const [incidentTitle, setIncidentTitle] = useState('');
  const [notes, setNotes] = useState('');

  // Parent Message Form
  const [msgParentName, setMsgParentName] = useState('Kwame Ansah (Father of Kofi Ansah)');
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [behaviorLogs, setBehaviorLogs] = useState([
    {
      id: 'beh-1',
      studentName: 'Kofi Ansah',
      class: 'JHS 1 (Gold)',
      type: 'MERIT',
      points: 5,
      title: 'Science Lab Leadership & Peer Assistance',
      description: 'Helped clean and calibrate titration pipettes safely before the laboratory session.',
      date: 'Today, 09:15 AM',
      teacher: 'Mr. Kwame Mensah',
    },
    {
      id: 'beh-2',
      studentName: 'Yaw Boateng',
      class: 'JHS 1 (Gold)',
      type: 'DEMERIT',
      points: -2,
      title: 'Repeated Tardy Arrival without Note',
      description: 'Arrived 20 minutes late to period 1 mathematics session without an exeat slip.',
      date: 'Yesterday, 08:35 AM',
      teacher: 'Mr. Kwame Mensah',
    },
    {
      id: 'beh-3',
      studentName: 'Abena Mensah',
      class: 'JHS 2 (Gold)',
      type: 'MERIT',
      points: 10,
      title: 'Excellence in National Math Olympiad Prep',
      description: 'Solved all complex quadratic problem sets and presented solutions on the board.',
      date: 'Oct 28, 2026',
      teacher: 'Ms. Cynthia Addo',
    },
  ]);

  const [interventions, setInterventions] = useState([
    {
      id: 'int-1',
      studentName: 'Yaw Boateng',
      class: 'JHS 1 (Gold)',
      subject: 'Core Mathematics',
      issue: 'Struggling with linear equations balancing',
      actionPlan: 'Enrolled in Tuesday after-school peer tutoring with Kofi Ansah',
      status: 'IN_PROGRESS',
      reviewDate: 'Nov 15, 2026',
    },
    {
      id: 'int-2',
      studentName: 'Ama Osei',
      class: 'JHS 2 (Gold)',
      subject: 'Integrated Science',
      issue: 'Exam anxiety during timed lab practicals',
      actionPlan: 'Guidance & Counseling session scheduled with Madam Grace',
      status: 'MONITORING',
      reviewDate: 'Nov 10, 2026',
    },
  ]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle) return;

    const newEntry = {
      id: `beh-${Date.now()}`,
      studentName: selectedStudent,
      class: 'JHS 1 (Gold)',
      type: logType,
      points: logType === 'MERIT' ? Math.abs(parseInt(points, 10)) : -Math.abs(parseInt(points, 10)),
      title: incidentTitle,
      description: notes || 'Logged by class teacher.',
      date: 'Just now',
      teacher: 'Mr. Kwame Mensah',
    };

    setBehaviorLogs([newEntry, ...behaviorLogs]);
    setIncidentTitle('');
    setNotes('');
    setShowLogModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgContent) return;
    setMsgSent(true);
    setTimeout(() => {
      setMsgSent(false);
      setMsgContent('');
    }, 4000);
  };

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Classroom Management & Student Support</h1>
            <p className="text-slate-600 text-sm mt-1">
              Track student merits and demerits, record academic interventions, and communicate directly with parents.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowLogModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Log Merit / Demerit
            </Button>
          </div>
        </div>

        {/* Modal for Log */}
        {showLogModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Log Student Conduct Record</h3>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddLog} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                  >
                    <option>Kofi Ansah (JHS 1)</option>
                    <option>Ama Osei (JHS 1)</option>
                    <option>Kwame Nkrumah (JHS 1)</option>
                    <option>Abena Mensah (JHS 2)</option>
                    <option>Yaw Boateng (JHS 1)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Record Type</label>
                    <select
                      value={logType}
                      onChange={(e) => setLogType(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                    >
                      <option value="MERIT">Merit (+ Points)</option>
                      <option value="DEMERIT">Demerit (- Points)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">House / Conduct Points</label>
                    <Input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      className="h-9 text-xs"
                      min={1}
                      max={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Headline</label>
                  <Input
                    placeholder="e.g., Cleanliness & Good Leadership, Tardy arrival..."
                    value={incidentTitle}
                    onChange={(e) => setIncidentTitle(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Provide context regarding the observation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLogModal(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Save Conduct Record
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 space-x-4">
          <button
            onClick={() => setActiveTab('behavior')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'behavior'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Merits & Demerits Log</span>
          </button>

          <button
            onClick={() => setActiveTab('interventions')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'interventions'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Academic Interventions</span>
          </button>

          <button
            onClick={() => setActiveTab('parentMsg')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'parentMsg'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Parent Communication (SMS / In-App)</span>
          </button>
        </div>

        {/* Behavior Log Tab */}
        {activeTab === 'behavior' && (
          <div className="space-y-4">
            {behaviorLogs.map((log) => (
              <Card key={log.id} className="bg-white border-slate-200 shadow-xs">
                <CardContent className="p-4 flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        log.type === 'MERIT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.points > 0 ? `+${log.points}` : log.points}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{log.studentName}</span>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                          {log.class}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            log.type === 'MERIT'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {log.type}
                        </Badge>
                      </div>

                      <h4 className="font-semibold text-xs text-slate-800 mt-1">{log.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{log.description}</p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2">
                        <span>Logged by {log.teacher}</span>
                        <span>•</span>
                        <span>{log.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Interventions Tab */}
        {activeTab === 'interventions' && (
          <div className="space-y-4">
            {interventions.map((item) => (
              <Card key={item.id} className="bg-white border-slate-200 shadow-xs">
                <CardContent className="p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{item.studentName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-blue-600 font-medium">{item.subject}</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold mt-1.5">
                      Issue Observed: <span className="font-normal text-slate-600">{item.issue}</span>
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Action Plan: <span className="font-normal text-slate-600">{item.actionPlan}</span>
                    </p>

                    <div className="text-[11px] text-slate-400 mt-2">Next Review Date: {item.reviewDate}</div>
                  </div>

                  <Button size="sm" variant="outline" className="text-xs border-slate-200 text-slate-700">
                    Update Progress
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Parent Communication Tab */}
        {activeTab === 'parentMsg' && (
          <Card className="bg-white border-slate-200 shadow-xs max-w-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Direct Parent SMS / In-App Note</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Send a personalized academic update or conduct inquiry to a student's verified parent/guardian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {msgSent && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Message dispatched to parent's phone (+233 24 111 2233) and mobile app notification!</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Parent / Guardian</label>
                  <select
                    value={msgParentName}
                    onChange={(e) => setMsgParentName(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                  >
                    <option>Kwame Ansah (Father of Kofi Ansah - +233 24 111 2233)</option>
                    <option>Nana Osei (Mother of Ama Osei - +233 20 222 3344)</option>
                    <option>Francis Nkrumah (Father of Kwame Nkrumah - +233 55 333 4455)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    placeholder="Dear Mr. Ansah, this is Mr. Kwame Mensah regarding Kofi's excellent participation in science..."
                    className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    SMS credits will be billed to the school's communication wallet.
                  </span>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Send Dispatch
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}


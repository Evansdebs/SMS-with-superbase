'use client';

import React, { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  Award,
  FileCheck2,
  Send,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WorkflowsApprovalPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'schemes'>('pending');

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 'wf-01',
      title: 'Term 1 Continuous Assessment Results Sign-Off (JHS 1 Gold)',
      initiator: 'Mr. Kwame Mensah (Science & Math Tutor)',
      department: 'Academic Directorate',
      stage: 'Step 3 of 4: Headmaster Final Lock & Publishing',
      status: 'AWAITING_HEADMASTER',
      submittedDate: 'Today, 10:30 AM',
      summary: '42 student marks recorded (CA 50% + Exam 50%). HOD review completed with Stanine aggregates calculated.',
    },
    {
      id: 'wf-02',
      title: 'Student Medical Exeat Request: Kofi Ansah (JHS 1)',
      initiator: 'Mr. Kwame Ansah (Guardian / Father)',
      department: 'Hostel & Boarding Administration',
      stage: 'Step 2 of 3: House Master Gate Pass Clearance',
      status: 'AWAITING_HOUSE_MASTER',
      submittedDate: 'Today, 08:30 AM',
      summary: 'Dental clinic visit to Nyaho Medical Centre. Accompanying person verified via registered guardian phone.',
    },
    {
      id: 'wf-03',
      title: 'Staff Casual Leave Application: Ms. Cynthia Addo (Languages)',
      initiator: 'Ms. Cynthia Addo (Head of Languages)',
      department: 'Human Resources',
      stage: 'Step 2 of 2: Principal Approval & Relief Teacher Assignment',
      status: 'AWAITING_PRINCIPAL',
      submittedDate: 'Yesterday, 03:00 PM',
      summary: '2 days casual leave (Nov 05 - Nov 06). Class coverage confirmed by Mr. Emmanuel Ofori.',
    },
  ]);

  const approvalSchemes = [
    {
      workflowName: 'Academic Result Publishing Workflow',
      stages: ['1. Teacher enters marks', '2. HOD verifies marks', '3. Principal signs off', '4. Parents notified automatically'],
      status: 'ACTIVE_ENFORCED',
    },
    {
      workflowName: 'Campus Exeat & Permission Workflow',
      stages: ['1. Parent/Student requests exeat', '2. House Master approves', '3. Security gate QR pass active', '4. Parent SMS on exit'],
      status: 'ACTIVE_ENFORCED',
    },
    {
      workflowName: 'New Student Enrollment Workflow',
      stages: ['1. Admissions application', '2. Verification & interview', '3. Bursary payment', '4. Auto class & dormitory allocation'],
      status: 'ACTIVE_ENFORCED',
    },
  ];

  const handleApprove = (id: string) => {
    setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    alert('Workflow step approved and advanced to next stage!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 15 — Multi-Tier Approval Workflows</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Approval Workflows</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Manage strict sequential sign-offs: Teacher Results → HOD Review → Principal Approval → Automated Parent Notification.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'pending' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Pending Approvals ({pendingApprovals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'schemes' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Active Workflow Pipelines ({approvalSchemes.length})</span>
        </button>
      </div>

      {/* Pending Items */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingApprovals.map((item) => (
            <Card key={item.id} className="bg-white border-slate-200 shadow-xs hover:border-purple-200 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                      {item.department}
                    </Badge>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{item.submittedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
                  <div className="text-purple-700 font-semibold mt-1">
                    Current Stage: <span className="text-slate-800 font-normal">{item.stage}</span>
                  </div>
                  <p className="text-slate-600 mt-1 max-w-2xl leading-relaxed">{item.summary}</p>

                  <div className="text-[11px] text-slate-400 mt-2">
                    Initiated by: <strong>{item.initiator}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert(`Reviewing complete metadata dossier for ${item.title}...`)}
                    className="text-xs"
                  >
                    Inspect Dossier
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Authorize & Sign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schemes */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          {approvalSchemes.map((s, i) => (
            <Card key={i} className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">{s.workflowName}</CardTitle>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                  {s.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  {s.stages.map((stg, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                      {stg}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


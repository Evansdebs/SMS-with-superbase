'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Clock,
  Send,
  Plus,
  CheckCircle2,
  FileText,
  Bus,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockChildren } from '@/components/layout/ParentSidebar';
import { getStoredSession } from '@/lib/api';

export default function ParentRequestsPage() {
  const [session, setSession] = useState<any>(null);
  const [activeChildId, setActiveChildId] = useState('std-001');
  const [activeTab, setActiveTab] = useState<'exeat' | 'transport' | 'contacts'>('exeat');
  const [showExModal, setShowExModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Form State
  const [reqType, setReqType] = useState('MEDICAL_EXEAT');
  const [destination, setDestination] = useState('');
  const [pickupTime, setPickupTime] = useState('2026-11-04 10:00');
  const [returnTime, setReturnTime] = useState('2026-11-04 15:00');
  const [reason, setReason] = useState('');

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

  const [parentRequests, setParentRequests] = useState([
    {
      id: 'preq-01',
      child: 'Kofi Ansah (JHS 1)',
      type: 'Medical Exeat / Clinic Visit',
      destination: 'Nyaho Medical Centre, Airport',
      time: 'Oct 18, 09:00 AM - 02:00 PM',
      status: 'APPROVED',
      approvedBy: 'House Master & Campus Security Gate',
    },
    {
      id: 'preq-02',
      child: 'Akua Ansah (Primary 5)',
      type: 'Early Campus Pickup Permission',
      destination: 'Family Dental Appointment (Osu)',
      time: 'Oct 24, 01:30 PM',
      status: 'APPROVED',
      approvedBy: 'Primary Headmistress',
    },
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason) return;

    const newReq = {
      id: `preq-${Date.now()}`,
      child: `${child.name} (${child.class})`,
      type: reqType.replace('_', ' '),
      destination,
      time: `${pickupTime} to ${returnTime}`,
      status: 'PENDING_APPROVAL',
      approvedBy: 'Routed to House Master / Principal for instant sign-off',
    };

    setParentRequests([newReq, ...parentRequests]);
    setRequestSubmitted(true);
    setShowExModal(false);
    setDestination('');
    setReason('');
    setTimeout(() => setRequestSubmitted(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Guardian Formal Petitions & Permissions</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Parent Requests & Digital Exeat Slips</h1>
          <p className="text-slate-600 text-sm mt-1">
            Submit early departure permissions, medical exeats, school bus route changes, and update emergency phone contacts.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setShowExModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Request Permission / Exeat
          </Button>
        </div>
      </div>

      {requestSubmitted && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">
              Guardian request registered and dispatched to the Dean of Students & Security Gate!
            </span>
          </div>
          <span>Status: PENDING_APPROVAL</span>
        </div>
      )}

      {/* Modal: New Exeat */}
      {showExModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Request Permission / Exeat Slip</h3>
                <p className="text-xs text-slate-500">For child: <strong>{child.name}</strong> ({child.class})</p>
              </div>
              <button
                onClick={() => setShowExModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Request Category</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800"
                >
                  <option value="MEDICAL_EXEAT">Medical Appointment / Clinic Exeat</option>
                  <option value="FAMILY_PERMISSION">Family Emergency / Bereavement Leave</option>
                  <option value="EARLY_PICKUP">Early Campus Pickup Permission</option>
                  <option value="WEEKEND_LEAVE">Weekend Boarding Exeat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Address / Clinic</label>
                <Input
                  placeholder="e.g. Korle Bu Teaching Hospital or Home Address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departure Time</label>
                  <Input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Return Time</label>
                  <Input
                    type="text"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Reason & Accompanying Person</label>
                <textarea
                  rows={2}
                  placeholder="State who will accompany or pick up the student..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 p-2 text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowExModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Send Formal Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('exeat')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'exeat'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Exeat & Permission Requests ({parentRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'transport'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bus className="h-4 w-4" />
          <span>School Bus Route Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'contacts'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Emergency Contacts On File</span>
        </button>
      </div>

      {/* Content: Exeats */}
      {activeTab === 'exeat' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Active & Historical Guardian Requests</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Approved exeats automatically sync with the campus main security gate turnstile
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {parentRequests.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{r.type}</span>
                    <Badge variant="outline" className={`text-[10px] ${
                      r.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {r.status}
                    </Badge>
                  </div>
                  <div className="text-slate-600 font-medium mt-1">Ward: <strong className="text-teal-800">{r.child}</strong></div>
                  <div className="text-slate-500 text-[11px]">Destination: {r.destination} • Window: {r.time}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{r.approvedBy}</div>
                </div>

                <div>
                  {r.status === 'APPROVED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Showing digital authorization QR for ${r.child}`)}
                      className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold"
                    >
                      Security Gate Pass (QR)
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Content: Bus */}
      {activeTab === 'transport' && (
        <Card className="bg-white border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">School Bus Allocation & Stop Request</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Manage morning pickup and afternoon dropoff locations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-4">
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
              <div className="font-bold text-teal-900 text-sm">Active Commute: Route 4 (Dome - Achimota)</div>
              <div className="text-teal-700 mt-0.5">Assigned Bus: BUS-04 • Driver: Uncle Kwesi (+233 24 999 1122)</div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Request Stop Change for Next Month</label>
              <select className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-slate-800">
                <option>Current: Dome Shell Station (06:45 AM / 04:15 PM)</option>
                <option>West Legon Police Barrier (06:55 AM / 04:05 PM)</option>
                <option>Achimota New Transport Terminal (07:10 AM / 03:50 PM)</option>
              </select>
            </div>

            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs">
              Save Transport Preference
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content: Contacts */}
      {activeTab === 'contacts' && (
        <Card className="bg-white border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">Verified Emergency Guardian Contacts</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Numbers used for instant SMS attendance and emergency sick bay alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Primary Contact: Mr. Kwame Ansah Snr (Father)</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Verified SMS</Badge>
              </div>
              <div className="text-slate-600 font-mono text-xs">+233 24 111 2233</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900">Secondary Contact: Mrs. Akosua Ansah (Mother)</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Active</Badge>
              </div>
              <div className="text-slate-600 font-mono text-xs">+233 20 222 4455</div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}


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
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function StudentServicesPage() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'exeat' | 'documents'>('exeat');
  const [showExeatModal, setShowExeatModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Exeat Form
  const [exeatType, setExeatType] = useState('MEDICAL');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-11-04');
  const [returnDate, setReturnDate] = useState('2026-11-04');
  const [reason, setReason] = useState('');

  // Doc Form
  const [docType, setDocType] = useState('OFFICIAL_TRANSCRIPT');
  const [docPurpose, setDocPurpose] = useState('');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const [exeatHistory, setExeatHistory] = useState([
    {
      id: 'ex-01',
      type: 'MEDICAL / CLINIC',
      destination: 'Nyaho Medical Centre, Airport',
      departure: 'Oct 18, 09:00 AM',
      return: 'Oct 18, 02:00 PM',
      status: 'APPROVED',
      approvedBy: 'House Master (Mr. Kwabena Mensah)',
    },
  ]);

  const [documentRequests, setDocumentRequests] = useState([
    {
      id: 'doc-01',
      title: 'Official Academic Transcript (JHS 1 Term 1)',
      purpose: 'High School scholarship screening application',
      submittedDate: 'Oct 26, 2026',
      status: 'READY_FOR_COLLECTION',
      signedBy: 'Administration Records Office',
    },
    {
      id: 'doc-02',
      title: 'Certificate of School Enrollment & Attestation',
      purpose: 'Passport / Travel documentation',
      submittedDate: 'Oct 10, 2026',
      status: 'COMPLETED',
      signedBy: 'Registrar Desk',
    },
  ]);

  const handleCreateExeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !reason) return;

    const newEx = {
      id: `ex-0${exeatHistory.length + 1}`,
      type: exeatType.replace('_', ' '),
      destination,
      departure: `${departureDate} 08:30 AM`,
      return: `${returnDate} 04:00 PM`,
      status: 'PENDING_APPROVAL',
      approvedBy: 'Forwarded to House Master & Parent SMS verification',
    };

    setExeatHistory([newEx, ...exeatHistory]);
    setRequestSubmitted(true);
    setShowExeatModal(false);
    setDestination('');
    setReason('');
    setTimeout(() => setRequestSubmitted(false), 4000);
  };

  const handleCreateDocRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docPurpose) return;

    const newDoc = {
      id: `doc-0${documentRequests.length + 1}`,
      title: docType.replace('_', ' '),
      purpose: docPurpose,
      submittedDate: 'Today',
      status: 'PROCESSING',
      signedBy: 'Under review by Academic Records Office',
    };

    setDocumentRequests([newDoc, ...documentRequests]);
    setRequestSubmitted(true);
    setShowDocModal(false);
    setDocPurpose('');
    setTimeout(() => setRequestSubmitted(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Services & Request Center</h1>
          <p className="text-slate-600 text-sm mt-1">
            Submit formal campus exit exeats, request transcripts, attestation letters, and certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowExeatModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Request Exeat Slip
          </Button>
          <Button
            onClick={() => setShowDocModal(true)}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Request Documents
          </Button>
        </div>
      </div>

      {requestSubmitted && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Your request has been successfully registered and routed to administration!</span>
          </div>
          <span>Status: SUBMITTED</span>
        </div>
      )}

      {/* Modal: Exeat */}
      {showExeatModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">New Permission / Exeat Request</h3>
              <button
                onClick={() => setShowExeatModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExeat} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exeat Category</label>
                <select
                  value={exeatType}
                  onChange={(e) => setExeatType(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                >
                  <option value="MEDICAL">Medical Clinic / Doctor Appointment</option>
                  <option value="FAMILY">Family Engagement / Emergency</option>
                  <option value="WEEKEND">Weekend Home Leave</option>
                  <option value="EXTERNAL_EXAM">External Competition / Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Address / Clinic</label>
                <Input
                  placeholder="e.g. Nyaho Medical Centre, Airport Residential"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Departure Date</label>
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date</label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Reason</label>
                <textarea
                  rows={2}
                  placeholder="Provide full description of appointment..."
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
                  onClick={() => setShowExeatModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Submit to House Master
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Document Request */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Request Official Document</h3>
              <button
                onClick={() => setShowDocModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocRequest} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white text-slate-800"
                >
                  <option value="OFFICIAL_TRANSCRIPT">Certified Academic Transcript</option>
                  <option value="ENROLLMENT_ATTESTATION">Certificate of Enrollment & Attestation</option>
                  <option value="RECOMMENDATION_LETTER">Headmaster's Recommendation Letter</option>
                  <option value="CHARACTER_CERTIFICATE">Conduct & Character Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Recipient Organization</label>
                <Input
                  placeholder="e.g. Visa Embassy Application, Scholarship Board, Transfer..."
                  value={docPurpose}
                  onChange={(e) => setDocPurpose(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDocModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Submit Application
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
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Campus Exeat Slips ({exeatHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'documents'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Certificates & Transcripts ({documentRequests.length})</span>
        </button>
      </div>

      {/* Exeat Tab Content */}
      {activeTab === 'exeat' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Exeat Requests History</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live status of student permission slips and approval tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {exeatHistory.map((ex) => (
              <div key={ex.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{ex.type}</span>
                    <Badge variant="outline" className={`text-[10px] ${
                      ex.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {ex.status}
                    </Badge>
                  </div>
                  <div className="text-slate-600 mt-1">Destination: <strong className="text-slate-800">{ex.destination}</strong></div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Departure: {ex.departure} • Return: {ex.return}
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1">{ex.approvedBy}</div>
                </div>

                <div>
                  {ex.status === 'APPROVED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Showing digital QR Exeat Pass for ${ex.destination}`)}
                      className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    >
                      Show Gate Pass (QR)
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Documents Tab Content */}
      {activeTab === 'documents' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Requested Official Documents</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Tracking academic records, certificates, and attestation processing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {documentRequests.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{doc.title}</span>
                    <Badge variant="outline" className={`text-[10px] ${
                      doc.status === 'READY_FOR_COLLECTION' || doc.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {doc.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="text-slate-600 mt-1">Purpose: {doc.purpose}</div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Submitted: {doc.submittedDate} • Desk: {doc.signedBy}
                  </div>
                </div>

                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert('Downloading official stamped PDF copy...')}
                    className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Download Digital Copy
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}


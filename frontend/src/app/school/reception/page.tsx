'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  FileText,
  Package,
  Calendar,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Visitor {
  id: string;
  fullName: string;
  phone: string;
  purpose: string;
  personToSee: string;
  tagNumber: string;
  checkIn: string;
  checkOut?: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
}

export default function ReceptionPage() {
  const [activeTab, setActiveTab] = useState<'visitors' | 'pickups' | 'lostFound' | 'calls'>('visitors');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [personToSee, setPersonToSee] = useState('');

  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: 'vis-01',
      fullName: 'Mr. Kwame Ansah Snr',
      phone: '+233 24 111 2233',
      purpose: 'Parent Inquiry / Fee Clearance Receipt Pickup',
      personToSee: 'Grace Darko (Accounts/Bursary)',
      tagNumber: 'VISITOR-TAG-014',
      checkIn: 'Today, 08:45 AM',
      status: 'CHECKED_IN',
    },
    {
      id: 'vis-02',
      fullName: 'Dr. Evans Mensah (WAEC Inspection Team)',
      phone: '+233 20 888 4444',
      purpose: 'Accreditation & BECE Examination Hall Inspection',
      personToSee: 'Dr. David Mensah (Principal/Headmaster)',
      tagNumber: 'VISITOR-TAG-001',
      checkIn: 'Today, 09:30 AM',
      status: 'CHECKED_IN',
    },
    {
      id: 'vis-03',
      fullName: 'Madam Sarah Quaye',
      phone: '+233 55 999 1122',
      purpose: 'Prospective Student Admissions Tour',
      personToSee: 'Admissions Officer',
      tagNumber: 'VISITOR-TAG-022',
      checkIn: 'Today, 07:45 AM',
      checkOut: '09:00 AM',
      status: 'CHECKED_OUT',
    },
  ]);

  const [pickups, setPickups] = useState([
    {
      id: 'p-01',
      student: 'Kofi Ansah (JHS 1)',
      authorizedPerson: 'Mr. Kwame Ansah (Father)',
      verifiedPhone: '+233 24 111 2233',
      reason: 'Approved Medical Exeat (Nyaho Medical Centre)',
      gatePassNo: 'GATE-PASS-8842',
      status: 'CLEARED_TO_EXIT',
    },
  ]);

  const [lostFound, setLostFound] = useState([
    { id: 'lf-01', item: 'Casio Scientific Calculator fx-991ES', location: 'Science Lab 1', date: 'Oct 30', status: 'UNCLAIMED' },
    { id: 'lf-02', item: 'Navy Blue School Blazer (Size 14)', location: 'Assembly Hall', date: 'Oct 28', status: 'CLAIMED_BY_STUDENT' },
  ]);

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newVis: Visitor = {
      id: `vis-${Date.now()}`,
      fullName: name,
      phone,
      purpose: purpose || 'Official School Business',
      personToSee: personToSee || 'General Administration',
      tagNumber: `VISITOR-TAG-${Math.floor(10 + Math.random() * 90)}`,
      checkIn: 'Just now',
      status: 'CHECKED_IN',
    };

    setVisitors([newVis, ...visitors]);
    setName('');
    setPhone('');
    setPurpose('');
    setPersonToSee('');
    setShowCheckInModal(false);
  };

  const handleCheckOut = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, status: 'CHECKED_OUT', checkOut: 'Just now' } : v));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 12 — Reception & Campus Front Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reception & Front Office Management</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Log visitor badges, verify student early pickup authorizations, issue gate passes, and track lost-and-found.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowCheckInModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Register Visitor Check-In
          </Button>
        </div>
      </div>

      {/* Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Register Campus Visitor</h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRegisterVisitor} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Visitor Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-9 text-xs" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-9 text-xs font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose of Visit</label>
                <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} required className="h-9 text-xs" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Host Staff / Person to See</label>
                <Input value={personToSee} onChange={(e) => setPersonToSee(e.target.value)} required className="h-9 text-xs" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCheckInModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Issue Badge Tag</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('visitors')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'visitors' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Visitor Badge Register ({visitors.filter(v => v.status === 'CHECKED_IN').length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('pickups')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'pickups' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Student Pickup & Gate Passes</span>
        </button>

        <button
          onClick={() => setActiveTab('lostFound')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'lostFound' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Lost & Found Custody</span>
        </button>
      </div>

      {/* Visitors List */}
      {activeTab === 'visitors' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Today's Campus Visitors Log</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Badge numbers issued at the security gate & front reception
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Visitor Tag</th>
                  <th className="py-3 px-4">Full Name & Phone</th>
                  <th className="py-3 px-4">Purpose of Visit</th>
                  <th className="py-3 px-4">Host Staff</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{v.tagNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{v.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{v.purpose}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{v.personToSee}</td>
                    <td className="py-3 px-4 text-slate-500">{v.checkIn}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className={`text-[10px] ${
                        v.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {v.status === 'CHECKED_IN' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckOut(v.id)}
                          className="h-7 text-xs border-rose-200 text-rose-700 hover:bg-rose-50"
                        >
                          Check Out
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Pickups List */}
      {activeTab === 'pickups' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Verified Student Pickup Authorizations</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Only authorized parents/guardians with valid exeat passes can clear students through security
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Gate Pass #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Authorized Guardian</th>
                  <th className="py-3 px-4">Authorized Reason</th>
                  <th className="py-3 px-4 text-center">Security Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.gatePassNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.student}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.authorizedPerson}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.verifiedPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Lost & Found */}
      {activeTab === 'lostFound' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lostFound.map((lf) => (
            <Card key={lf.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-4 text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lf.item}</h4>
                  <div className="text-slate-500 mt-1">Found in: {lf.location} • {lf.date}</div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${lf.status === 'UNCLAIMED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700'}`}>
                  {lf.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


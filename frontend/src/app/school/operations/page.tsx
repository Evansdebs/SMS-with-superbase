'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  FileText,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  Bed,
  MapPin,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  LogOut,
  LogIn,
  Package,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface Visitor {
  id: string;
  fullName: string;
  phoneNumber: string;
  purpose: string;
  personToSee: string;
  tagNumber: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT';
}

interface Exeat {
  id: string;
  studentName: string;
  admissionNumber: string;
  class: string;
  house: string;
  reason: string;
  issuedBy: string;
  departureTime: string;
  expectedReturn: string;
  actualReturn?: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

interface HostelRoom {
  id: string;
  houseName: string;
  roomNumber: string;
  capacity: number;
  occupancy: number;
  prefect: string;
}

interface LostItem {
  id: string;
  itemName: string;
  category: string;
  foundLocation: string;
  dateFound: string;
  status: 'UNCLAIMED' | 'CLAIMED';
  claimedBy?: string;
}

export default function SchoolOperationsPage() {
  const [activeTab, setActiveTab] = useState<'visitors' | 'exeats' | 'boarding' | 'lost_found'>('visitors');

  // Visitors State
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: 'vis-001',
      fullName: 'Mr. Patrick Ansah',
      phoneNumber: '+233 24 456 7890',
      purpose: 'School Fees Inquiry',
      personToSee: 'Accountant (Grace Darko)',
      tagNumber: 'VIS-08',
      checkInTime: '08:30 AM',
      status: 'CHECKED_IN',
    },
    {
      id: 'vis-002',
      fullName: 'Mrs. Rebecca Kwarteng',
      phoneNumber: '+233 20 890 1234',
      purpose: 'Student Parent Consultation',
      personToSee: 'JHS 1 Class Teacher',
      tagNumber: 'VIS-12',
      checkInTime: '09:15 AM',
      checkOutTime: '10:05 AM',
      status: 'CHECKED_OUT',
    },
    {
      id: 'vis-003',
      fullName: 'Eng. Francis Botchwey',
      phoneNumber: '+233 27 654 3210',
      purpose: 'ICT Lab Solar Maintenance Inspection',
      personToSee: 'Estate Officer',
      tagNumber: 'VIS-03',
      checkInTime: '10:00 AM',
      status: 'CHECKED_IN',
    },
  ]);

  // Exeats State
  const [exeats, setExeats] = useState<Exeat[]>([
    {
      id: 'ex-001',
      studentName: 'Kwame Mensah',
      admissionNumber: 'TLS-2025-001',
      class: 'JHS 1 (Gold)',
      house: 'Aggrey House',
      reason: 'Specialist Dental Appointment (Ridge Hospital)',
      issuedBy: 'House Master (Mr. David Mensah)',
      departureTime: '2026-03-24 09:00',
      expectedReturn: '2026-03-24 16:00',
      status: 'ACTIVE',
    },
    {
      id: 'ex-002',
      studentName: 'Akosua Osei',
      admissionNumber: 'TLS-2025-002',
      class: 'JHS 2 (Gold)',
      house: 'Guggisberg House',
      reason: 'Family Event (Weekend Pass)',
      issuedBy: 'Senior Housemaster',
      departureTime: '2026-03-20 15:00',
      expectedReturn: '2026-03-22 17:00',
      actualReturn: '2026-03-22 16:30',
      status: 'RETURNED',
    },
  ]);

  // Boarding & Hostels State
  const [rooms, setRooms] = useState<HostelRoom[]>([
    { id: 'rm-101', houseName: 'Aggrey House (Boys)', roomNumber: 'Room B1', capacity: 12, occupancy: 12, prefect: 'Kofi Mensah' },
    { id: 'rm-102', houseName: 'Aggrey House (Boys)', roomNumber: 'Room B2', capacity: 12, occupancy: 10, prefect: 'Yaw Boateng' },
    { id: 'rm-201', houseName: 'Yaa Asantewaa (Girls)', roomNumber: 'Room G1', capacity: 10, occupancy: 10, prefect: 'Abena Darko' },
    { id: 'rm-202', houseName: 'Yaa Asantewaa (Girls)', roomNumber: 'Room G2', capacity: 10, occupancy: 8, prefect: 'Serwaa Osei' },
  ]);

  // Lost & Found State
  const [lostItems, setLostItems] = useState<LostItem[]>([
    { id: 'lf-001', itemName: 'Scientific Calculator (Casio fx-991)', category: 'Electronics', foundLocation: 'ICT Lab Desk 4', dateFound: '2026-03-22', status: 'UNCLAIMED' },
    { id: 'lf-002', itemName: 'Green School Cardigan (Size M)', category: 'Uniform', foundLocation: 'Assembly Hall', dateFound: '2026-03-20', status: 'CLAIMED', claimedBy: 'Kwame Mensah (JHS 1)' },
    { id: 'lf-003', itemName: 'Water Flask (Blue Hydro)', category: 'Personal', foundLocation: 'Football Field Bench', dateFound: '2026-03-23', status: 'UNCLAIMED' },
  ]);

  // Modal Triggers
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isExeatModalOpen, setIsExeatModalOpen] = useState(false);
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);

  // Form States
  const [newVisitor, setNewVisitor] = useState({ fullName: '', phoneNumber: '', purpose: '', personToSee: '', tagNumber: '' });
  const [newExeat, setNewExeat] = useState({ studentName: '', admissionNumber: '', class: 'JHS 1', house: 'Aggrey House', reason: '', expectedReturn: '' });
  const [newLostItem, setNewLostItem] = useState({ itemName: '', category: 'Stationery', foundLocation: '' });

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const vis: Visitor = {
      id: `vis-${Date.now()}`,
      fullName: newVisitor.fullName,
      phoneNumber: newVisitor.phoneNumber,
      purpose: newVisitor.purpose,
      personToSee: newVisitor.personToSee,
      tagNumber: newVisitor.tagNumber || `VIS-${Math.floor(10 + Math.random() * 90)}`,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'CHECKED_IN',
    };
    setVisitors([vis, ...visitors]);
    setIsVisitorModalOpen(false);
    setNewVisitor({ fullName: '', phoneNumber: '', purpose: '', personToSee: '', tagNumber: '' });
  };

  const handleCheckOutVisitor = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'CHECKED_OUT',
              checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : v,
      ),
    );
  };

  const handleCreateExeat = (e: React.FormEvent) => {
    e.preventDefault();
    const ex: Exeat = {
      id: `ex-${Date.now()}`,
      studentName: newExeat.studentName,
      admissionNumber: newExeat.admissionNumber,
      class: newExeat.class,
      house: newExeat.house,
      reason: newExeat.reason,
      issuedBy: 'Duty Master / House Master',
      departureTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expectedReturn: newExeat.expectedReturn || '2026-03-24 17:00',
      status: 'ACTIVE',
    };
    setExeats([ex, ...exeats]);
    setIsExeatModalOpen(false);
    setNewExeat({ studentName: '', admissionNumber: '', class: 'JHS 1', house: 'Aggrey House', reason: '', expectedReturn: '' });
  };

  const handleMarkReturnedExeat = (id: string) => {
    setExeats((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'RETURNED',
              actualReturn: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : e,
      ),
    );
  };

  const handleCreateLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: LostItem = {
      id: `lf-${Date.now()}`,
      itemName: newLostItem.itemName,
      category: newLostItem.category,
      foundLocation: newLostItem.foundLocation,
      dateFound: new Date().toISOString().split('T')[0],
      status: 'UNCLAIMED',
    };
    setLostItems([item, ...lostItems]);
    setIsLostModalOpen(false);
    setNewLostItem({ itemName: '', category: 'Stationery', foundLocation: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>School Operations</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span>Campus Operations, Front Office &amp; Boarding</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Visitor desk reception, official student exeat passes, hostel boarding allocations, and campus lost &amp; found registry.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'visitors' && (
              <Button onClick={() => setIsVisitorModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm">
                <LogIn className="h-4 w-4 mr-1.5" />
                Sign In Visitor
              </Button>
            )}
            {activeTab === 'exeats' && (
              <Button onClick={() => setIsExeatModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm">
                <FileText className="h-4 w-4 mr-1.5" />
                Issue Exeat Pass
              </Button>
            )}
            {activeTab === 'lost_found' && (
              <Button onClick={() => setIsLostModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Log Recovered Item
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex space-x-6 text-xs">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'visitors' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Front Office &amp; Visitors ({visitors.filter((v) => v.status === 'CHECKED_IN').length} Active)</span>
          </button>
          <button
            onClick={() => setActiveTab('exeats')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'exeats' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Student Exeat System ({exeats.filter((e) => e.status === 'ACTIVE').length} Active)</span>
          </button>
          <button
            onClick={() => setActiveTab('boarding')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'boarding' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bed className="h-4 w-4" />
            <span>Hostel &amp; Boarding Rooms ({rooms.length} Rooms)</span>
          </button>
          <button
            onClick={() => setActiveTab('lost_found')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'lost_found' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Campus Lost &amp; Found ({lostItems.filter((i) => i.status === 'UNCLAIMED').length} Unclaimed)</span>
          </button>
        </div>

        {/* Tab 1: Front Office & Visitor Management */}
        {activeTab === 'visitors' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">Currently On Campus</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {visitors.filter((v) => v.status === 'CHECKED_IN').length} Visitors
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Badges distributed &amp; active</div>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">Total Check-Ins Today</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">{visitors.length} Visitors</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Campus security log synchronized</div>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">Security Gate Status</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">Operational</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Main Gate 1 &amp; Admin Gate 2 open</div>
              </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Badge Tag</th>
                      <th className="px-4 py-3">Visitor Name</th>
                      <th className="px-4 py-3">Phone Number</th>
                      <th className="px-4 py-3">Purpose of Visit</th>
                      <th className="px-4 py-3">Meeting With</th>
                      <th className="px-4 py-3">Check-In Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitors.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{v.tagNumber}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{v.fullName}</td>
                        <td className="px-4 py-3 text-slate-600">{v.phoneNumber}</td>
                        <td className="px-4 py-3 text-slate-800">{v.purpose}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{v.personToSee}</td>
                        <td className="px-4 py-3 text-slate-500">{v.checkInTime}</td>
                        <td className="px-4 py-3">
                          <Badge variant={v.status === 'CHECKED_IN' ? 'success' : 'secondary'}>
                            {v.status === 'CHECKED_IN' ? 'ON CAMPUS' : 'DEPARTED'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {v.status === 'CHECKED_IN' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCheckOutVisitor(v.id)}
                              className="h-7 text-xs border-slate-200 text-rose-600 hover:bg-rose-50"
                            >
                              <LogOut className="h-3 w-3 mr-1" />
                              Check Out
                            </Button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Left at {v.checkOutTime}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Exeat Pass System */}
        {activeTab === 'exeats' && (
          <div className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900">Active &amp; Historical Student Exeat Passes</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Authorized permits for boarding and day students leaving campus grounds during academic hours.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsExeatModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Issue New Exeat
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Exeat ID</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Class &amp; House</th>
                        <th className="px-4 py-3">Reason for Departure</th>
                        <th className="px-4 py-3">Authorized By</th>
                        <th className="px-4 py-3">Expected Return</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {exeats.map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{ex.id}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <div>{ex.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{ex.admissionNumber}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            <div>{ex.class}</div>
                            <div className="text-[10px] text-amber-700 font-medium">{ex.house}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{ex.reason}</td>
                          <td className="px-4 py-3 text-slate-500">{ex.issuedBy}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{ex.expectedReturn}</td>
                          <td className="px-4 py-3">
                            <Badge variant={ex.status === 'ACTIVE' ? 'warning' : 'success'}>{ex.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {ex.status === 'ACTIVE' && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkReturnedExeat(ex.id)}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Mark Returned
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Hostel & Boarding */}
        {activeTab === 'boarding' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {rooms.map((rm) => (
                <Card key={rm.id} className="bg-white border-slate-200 shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">{rm.roomNumber}</span>
                    <Badge variant={rm.occupancy >= rm.capacity ? 'danger' : 'success'}>
                      {rm.occupancy} / {rm.capacity} Beds
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{rm.houseName}</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(rm.occupancy / rm.capacity) * 100}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="block text-[9px] uppercase font-bold text-slate-400">Room Prefect:</span>
                    <span className="font-semibold text-slate-800">{rm.prefect}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Campus Lost & Found */}
        {activeTab === 'lost_found' && (
          <div className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900">Campus Lost &amp; Found Custody Registry</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Logged items found on school grounds awaiting owner identification.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsLostModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Log Found Item
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Item Description</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Location Found</th>
                        <th className="px-4 py-3">Date Found</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lostItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{item.itemName}</td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{item.foundLocation}</td>
                          <td className="px-4 py-3 text-slate-500">{item.dateFound}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.status === 'CLAIMED' ? 'secondary' : 'warning'}>{item.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.status === 'UNCLAIMED' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setLostItems((prev) =>
                                    prev.map((i) => (i.id === item.id ? { ...i, status: 'CLAIMED' } : i)),
                                  );
                                }}
                                className="h-7 text-xs border-slate-200 text-emerald-600 hover:bg-emerald-50"
                              >
                                Mark Claimed
                              </Button>
                            ) : (
                              <span className="text-[10px] text-slate-400">{item.claimedBy || 'Returned to owner'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal: Sign In Visitor */}
        <Modal isOpen={isVisitorModalOpen} onClose={() => setIsVisitorModalOpen(false)} title="Front Desk Visitor Check-In">
          <form onSubmit={handleCreateVisitor} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Visitor Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Mr. Patrick Ansah"
                  value={newVisitor.fullName}
                  onChange={(e) => setNewVisitor({ ...newVisitor, fullName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <Input
                  required
                  placeholder="+233 24 000 0000"
                  value={newVisitor.phoneNumber}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phoneNumber: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Purpose of Visit *</label>
              <Input
                required
                placeholder="e.g. School Fees Inquiry, Student Enrollment..."
                value={newVisitor.purpose}
                onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Official / Person to See</label>
                <Input
                  placeholder="e.g. Headmaster, Accountant, JHS 1 Teacher"
                  value={newVisitor.personToSee}
                  onChange={(e) => setNewVisitor({ ...newVisitor, personToSee: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Visitor Badge Tag #</label>
                <Input
                  placeholder="e.g. VIS-14"
                  value={newVisitor.tagNumber}
                  onChange={(e) => setNewVisitor({ ...newVisitor, tagNumber: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsVisitorModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Complete Check-In
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Issue Exeat */}
        <Modal isOpen={isExeatModalOpen} onClose={() => setIsExeatModalOpen(false)} title="Issue Student Exeat Permit">
          <form onSubmit={handleCreateExeat} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Student Name *</label>
                <Input
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={newExeat.studentName}
                  onChange={(e) => setNewExeat({ ...newExeat, studentName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Admission Number *</label>
                <Input
                  required
                  placeholder="e.g. TLS-2025-001"
                  value={newExeat.admissionNumber}
                  onChange={(e) => setNewExeat({ ...newExeat, admissionNumber: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Class &amp; Stream</label>
                <Input
                  placeholder="e.g. JHS 1 (Gold)"
                  value={newExeat.class}
                  onChange={(e) => setNewExeat({ ...newExeat, class: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">House</label>
                <select
                  value={newExeat.house}
                  onChange={(e) => setNewExeat({ ...newExeat, house: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="Aggrey House">Aggrey House</option>
                  <option value="Guggisberg House">Guggisberg House</option>
                  <option value="Casely Hayford House">Casely Hayford House</option>
                  <option value="Yaa Asantewaa House">Yaa Asantewaa House</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Reason for Exeat *</label>
              <Input
                required
                placeholder="e.g. Hospital Referral, Family Funeral, Weekend Pass"
                value={newExeat.reason}
                onChange={(e) => setNewExeat({ ...newExeat, reason: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Expected Return Date &amp; Time</label>
              <Input
                placeholder="e.g. 2026-03-24 17:00"
                value={newExeat.expectedReturn}
                onChange={(e) => setNewExeat({ ...newExeat, expectedReturn: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsExeatModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Issue Exeat Slip
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal: Log Found Item */}
        <Modal isOpen={isLostModalOpen} onClose={() => setIsLostModalOpen(false)} title="Log Recovered Campus Item">
          <form onSubmit={handleCreateLostItem} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Item Description *</label>
              <Input
                required
                placeholder="e.g. Geometry Set, Water Flask, Watch..."
                value={newLostItem.itemName}
                onChange={(e) => setNewLostItem({ ...newLostItem, itemName: e.target.value })}
                className="mt-1 h-9 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={newLostItem.category}
                  onChange={(e) => setNewLostItem({ ...newLostItem, category: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3"
                >
                  <option value="Stationery">Stationery</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Uniform">Uniform &amp; Apparel</option>
                  <option value="Books">Books &amp; Folders</option>
                  <option value="Personal">Personal Effects</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Location Found *</label>
                <Input
                  required
                  placeholder="e.g. JHS 2 classroom, Cafeteria"
                  value={newLostItem.foundLocation}
                  onChange={(e) => setNewLostItem({ ...newLostItem, foundLocation: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsLostModalOpen(false)} className="border-slate-200 text-xs h-9">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                Save to Registry
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}


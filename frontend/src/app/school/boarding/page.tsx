'use client';

import React, { useState } from 'react';
import {
  Bed,
  Plus,
  Search,
  Users,
  CheckCircle2,
  Clock,
  DoorOpen,
  Calendar,
  Sparkles,
  Home,
  UserCheck,
  AlertTriangle,
  ArrowRightLeft,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface HostelRoom {
  id: string;
  hostelName: string;
  block: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  houseParent: string;
  gender: 'BOYS' | 'GIRLS';
  beds: { bedNo: string; studentName: string; admNo: string; class: string }[];
}

export default function BoardingPage() {
  const [activeTab, setActiveTab] = useState<'dormitories' | 'attendance' | 'incidents'>('dormitories');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>([
    {
      id: 'rm-01',
      hostelName: 'Aggrey Hall (Green House)',
      block: 'Block A - Senior Dorm',
      roomNumber: 'Room A-101',
      capacity: 8,
      occupied: 6,
      houseParent: 'Mr. Kwabena Mensah (+233 24 111 2233)',
      gender: 'BOYS',
      beds: [
        { bedNo: 'Bed 1 (Lower)', studentName: 'Kofi Ansah', admNo: 'STD2026001', class: 'JHS 1' },
        { bedNo: 'Bed 2 (Upper)', studentName: 'Yaw Boateng', admNo: 'STD2026005', class: 'JHS 1' },
        { bedNo: 'Bed 3 (Lower)', studentName: 'Kwame Nkrumah', admNo: 'STD2026003', class: 'JHS 1' },
        { bedNo: 'Bed 4 (Upper)', studentName: 'Samuel Quaye', admNo: 'STD2026012', class: 'JHS 2' },
        { bedNo: 'Bed 5 (Lower)', studentName: 'Emmanuel Darko', admNo: 'STD2026019', class: 'JHS 2' },
        { bedNo: 'Bed 6 (Upper)', studentName: 'David Annan', admNo: 'STD2026024', class: 'JHS 3' },
      ],
    },
    {
      id: 'rm-02',
      hostelName: 'Yaa Asantewaa Hall (Gold House)',
      block: 'Block B - Girls Dorm',
      roomNumber: 'Room B-201',
      capacity: 8,
      occupied: 8,
      houseParent: 'Madam Cynthia Addo (+233 20 444 2222)',
      gender: 'GIRLS',
      beds: [
        { bedNo: 'Bed 1 (Lower)', studentName: 'Ama Osei', admNo: 'STD2026002', class: 'JHS 1' },
        { bedNo: 'Bed 2 (Upper)', studentName: 'Abena Mensah', admNo: 'STD2026004', class: 'JHS 2' },
        { bedNo: 'Bed 3 (Lower)', studentName: 'Efua Sutherland', admNo: 'STD2026006', class: 'JHS 2' },
        { bedNo: 'Bed 4 (Upper)', studentName: 'Akosua Darko', admNo: 'STD2026015', class: 'JHS 3' },
        { bedNo: 'Bed 5 (Lower)', studentName: 'Beatrice Osei', admNo: 'STD2026018', class: 'JHS 3' },
        { bedNo: 'Bed 6 (Upper)', studentName: 'Grace Addo', admNo: 'STD2026022', class: 'JHS 1' },
        { bedNo: 'Bed 7 (Lower)', studentName: 'Mary Quaye', admNo: 'STD2026029', class: 'JHS 2' },
        { bedNo: 'Bed 8 (Upper)', studentName: 'Sarah Boateng', admNo: 'STD2026033', class: 'JHS 3' },
      ],
    },
  ]);

  const [rollCall, setRollCall] = useState([
    { student: 'Kofi Ansah (Room A-101)', status: 'PRESENT', checkIn: '08:45 PM', date: 'Tonight' },
    { student: 'Yaw Boateng (Room A-101)', status: 'PRESENT', checkIn: '08:50 PM', date: 'Tonight' },
    { student: 'Ama Osei (Room B-201)', status: 'PRESENT', checkIn: '08:30 PM', date: 'Tonight' },
    { student: 'David Annan (Room A-101)', status: 'EXEAT_OUT', checkIn: 'On approved weekend leave', date: 'Tonight' },
  ]);

  const [incidents, setIncidents] = useState([
    {
      id: 'inc-01',
      date: 'Oct 28, 2026 • 10:15 PM',
      dorm: 'Aggrey Hall - Room A-101',
      student: 'Yaw Boateng',
      issue: 'Lights-out curfew violation (using mobile device past 10:00 PM)',
      action: 'Verbal warning recorded by House Master Mr. Mensah. Device safely confiscated until weekend.',
    },
  ]);

  const totalCapacity = hostelRooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = hostelRooms.reduce((acc, r) => acc + r.occupied, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 11 — Boarding & Hostel Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Boarding & Dormitory Operations</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Manage dorm allocation, bed occupancy, evening roll-call, house parent logs, and boarding incidents.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowAllocateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Allocate Student to Bed
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Total Bed Capacity</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCapacity} Beds</div>
            <span className="text-[11px] text-slate-400">2 Dormitory Blocks</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Current Boarders</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">{totalOccupied} Students</div>
            <span className="text-[11px] text-emerald-600 font-medium">87.5% Occupancy</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Available Vacant Beds</span>
            <div className="text-2xl font-extrabold text-teal-800 mt-1">{totalCapacity - totalOccupied} Beds</div>
            <span className="text-[11px] text-teal-600">Ready for admissions</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs text-slate-500 font-medium">Night Roll Call Status</span>
            <div className="text-2xl font-extrabold text-indigo-700 mt-1">100%</div>
            <span className="text-[11px] text-slate-400">All rooms verified</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('dormitories')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'dormitories'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="h-4 w-4" />
          <span>Dormitories & Bed Allocation ({hostelRooms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'attendance'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Night Roll Call & Lights Out</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'incidents'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Hostel Welfare & Incident Log</span>
        </button>
      </div>

      {/* Tab: Dormitories */}
      {activeTab === 'dormitories' && (
        <div className="space-y-6">
          {hostelRooms.map((room) => (
            <Card key={room.id} className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`text-[10px] ${room.gender === 'BOYS' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {room.gender} HOSTEL
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{room.block}</span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 mt-1">{room.hostelName} — {room.roomNumber}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    House Parent: <strong>{room.houseParent}</strong>
                  </CardDescription>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Occupancy Rate:</span>
                  <span className="font-mono font-bold text-sm text-emerald-800">{room.occupied} / {room.capacity} Beds Occupied</span>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {room.beds.map((b, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{b.bedNo}</span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px]">
                          OCCUPIED
                        </Badge>
                      </div>
                      <div className="font-semibold text-slate-800">{b.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.admNo} • {b.class}</div>
                    </div>
                  ))}
                  {Array.from({ length: room.capacity - room.occupied }).map((_, i) => (
                    <div key={i} className="p-3 rounded-xl border border-dashed border-slate-300 bg-white text-xs flex flex-col items-center justify-center text-center text-slate-400 py-6">
                      <Bed className="h-5 w-5 mb-1 text-slate-300" />
                      <span className="font-semibold text-slate-600">Bed {room.occupied + i + 1} Vacant</span>
                      <span className="text-[10px] text-emerald-600 mt-0.5">Available for placement</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Attendance */}
      {activeTab === 'attendance' && (
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Dormitory Evening Roll Call</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Taken daily at 08:30 PM by House Masters and Dormitory Prefects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Student & Room</th>
                  <th className="py-3 px-4">Check-In Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rollCall.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{r.student}</td>
                    <td className="py-3 px-4 text-slate-600">{r.checkIn}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        r.status === 'PRESENT'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab: Incidents */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <Card key={inc.id} className="bg-white border-slate-200 shadow-xs">
              <CardContent className="p-5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-bold">
                      WELFARE LOG
                    </Badge>
                    <span className="font-bold text-slate-900">{inc.dorm}</span>
                  </div>
                  <span className="text-slate-400">{inc.date}</span>
                </div>
                <div className="font-semibold text-slate-800">Involved Student: {inc.student}</div>
                <p className="text-slate-600">Incident: <strong>{inc.issue}</strong></p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                  Resolution: {inc.action}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


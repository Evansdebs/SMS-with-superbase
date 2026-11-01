'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  UserCheck,
  Award,
  ChevronRight,
  Sparkles,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { TeacherNav } from '@/components/layout/TeacherNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { apiRequest, getStoredSession } from '@/lib/api';

export default function TeacherClassesPage() {
  const [session, setSession] = useState<any>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // My assigned classes
  const myClasses = [
    {
      id: 'cls-001',
      name: 'JHS 1 (Gold)',
      subject: 'Core Mathematics',
      level: 'JHS 1',
      totalStudents: 42,
      classTeacher: 'Mr. Kwame Mensah (You)',
      room: 'Block B - Room 12',
      repStudent: 'Kofi Ansah (Class Prefect)',
    },
    {
      id: 'cls-002',
      name: 'JHS 2 (Gold)',
      subject: 'Integrated Science',
      level: 'JHS 2',
      totalStudents: 38,
      classTeacher: 'Ms. Cynthia Addo',
      room: 'Science Lab 1',
      repStudent: 'Abena Mensah (Girls Prefect)',
    },
    {
      id: 'cls-003',
      name: 'JHS 3 (Gold)',
      subject: 'Integrated Science & Further Math',
      level: 'JHS 3',
      totalStudents: 35,
      classTeacher: 'Mr. Emmanuel Ofori',
      room: 'Science Lab 2',
      repStudent: 'Yaw Boateng (Head Boy)',
    },
  ];

  useEffect(() => {
    setSession(getStoredSession());
    loadStudents();
  }, [selectedClassId]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/students?limit=50`);
      setStudents(res?.data || []);
    } catch (err) {
      // Fallback roster
      setStudents([
        {
          id: 'std-001',
          admissionNumber: 'STD2026001',
          firstName: 'Kofi',
          lastName: 'Ansah',
          gender: 'MALE',
          guardianName: 'Kwame Ansah (Father)',
          guardianPhone: '+233 24 111 2233',
          academicRank: '1st in Class',
          attendanceRate: '98%',
          status: 'ACTIVE',
        },
        {
          id: 'std-002',
          admissionNumber: 'STD2026002',
          firstName: 'Ama',
          lastName: 'Osei',
          gender: 'FEMALE',
          guardianName: 'Nana Osei (Mother)',
          guardianPhone: '+233 20 222 3344',
          academicRank: '2nd in Class',
          attendanceRate: '95%',
          status: 'ACTIVE',
        },
        {
          id: 'std-003',
          admissionNumber: 'STD2026003',
          firstName: 'Kwame',
          lastName: 'Nkrumah',
          gender: 'MALE',
          guardianName: 'Francis Nkrumah (Father)',
          guardianPhone: '+233 55 333 4455',
          academicRank: '5th in Class',
          attendanceRate: '92%',
          status: 'ACTIVE',
        },
        {
          id: 'std-004',
          admissionNumber: 'STD2026004',
          firstName: 'Abena',
          lastName: 'Mensah',
          gender: 'FEMALE',
          guardianName: 'Akosua Mensah (Mother)',
          guardianPhone: '+233 27 444 5566',
          academicRank: '3rd in Class',
          attendanceRate: '99%',
          status: 'ACTIVE',
        },
        {
          id: 'std-005',
          admissionNumber: 'STD2026005',
          firstName: 'Yaw',
          lastName: 'Boateng',
          gender: 'MALE',
          guardianName: 'Osei Boateng (Uncle)',
          guardianPhone: '+233 24 555 6677',
          academicRank: '8th in Class',
          attendanceRate: '91%',
          status: 'ACTIVE',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentClass = myClasses.find((c) => c.id === selectedClassId) || myClasses[0];

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const adm = (s.admissionNumber || '').toLowerCase();
    return fullName.includes(q) || adm.includes(q);
  });

  return (
    <div className="min-w-full bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Classes & Student Rosters</h1>
            <p className="text-slate-600 text-sm mt-1">
              Select your assigned stream to view enrolled student profiles, attendance history, and parent contacts.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/teacher/assessment">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs">
                <Award className="h-4 w-4 mr-1.5" />
                Score Entry for This Class
              </Button>
            </Link>
          </div>
        </div>

        {/* Class Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {myClasses.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600'}`}>
                    {cls.level}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-700">{cls.totalStudents} Students</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{cls.name}</h3>
                <p className="text-xs text-blue-600 font-medium mt-0.5">{cls.subject}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Classroom:</span>
                    <span className="font-medium text-slate-700">{cls.room}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Class Master:</span>
                    <span className="font-medium text-slate-700">{cls.classTeacher}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Class Student List */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Enrolled Students: {currentClass.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Showing active student records, guardian emergency contacts, and term attendance
                </CardDescription>
              </div>

              {/* Search */}
              <div className="w-full sm:w-72">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by student name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Guardian / Emergency Contact</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Academic Standing</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, i) => (
                  <tr key={st.id || i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {st.admissionNumber || `STD202600${i + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400">Enrolled Student</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600">
                        {st.gender || 'MALE'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        {st.guardianName || 'Kwame Ansah (Father)'}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] flex items-center space-x-1 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{st.guardianPhone || '+233 24 111 2233'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {st.attendanceRate || '96%'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {st.academicRank || 'Good'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link href={`/school/results?studentId=${st.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-slate-200 text-slate-700 hover:text-slate-900">
                          Report Card
                        </Button>
                      </Link>
                      <Link href="/teacher/classroom">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 hover:text-blue-800 font-medium">
                          Note Conduct
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


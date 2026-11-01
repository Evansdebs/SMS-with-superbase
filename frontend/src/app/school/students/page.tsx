'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  IdCard,
  Printer,
  FileText,
  UserCheck,
  UserX,
  Award,
  Layers,
  Home,
  Check,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'admissions' | 'id_cards' | 'promotions'>('directory');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [idCardStudent, setIdCardStudent] = useState<any>(null);
  const [promotionTargetClass, setPromotionTargetClass] = useState('JHS 2');
  const [selectedForPromotion, setSelectedForPromotion] = useState<string[]>([]);
  const [promotionNotification, setPromotionNotification] = useState<string | null>(null);

  // New Student / Admission Form State
  const [newStudent, setNewStudent] = useState({
    admissionNumber: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    email: '',
    classId: 'cls-001',
    house: 'Aggrey House',
    section: 'Gold Stream',
    emergencyContact: '',
    bloodGroup: 'O+',
    guardian: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      relationship: 'FATHER',
    },
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/students?search=${encodeURIComponent(search)}`);
      // Support both pagination wrapper format (res.data) and bare array
      const list = Array.isArray(res) ? res : (res?.data || res?.items || []);
      setStudents(list);
    } catch {
      // Offline fallback Ghanaian sample dataset
      setStudents([
        {
          id: 'stu-001',
          admissionNumber: 'TLS-2025-001',
          firstName: 'Kwame',
          lastName: 'Mensah',
          gender: 'Male',
          dateOfBirth: '2012-05-14',
          class: { name: 'JHS 1', stream: 'Gold' },
          status: 'ACTIVE',
          house: 'Aggrey House',
          guardians: [{ parent: { firstName: 'Kofi', lastName: 'Mensah', phoneNumber: '+233 24 999 8888', email: 'kofi.mensah@gmail.com' }, relationship: 'FATHER' }],
        },
        {
          id: 'stu-002',
          admissionNumber: 'TLS-2025-002',
          firstName: 'Akosua',
          lastName: 'Osei',
          gender: 'Female',
          dateOfBirth: '2011-08-22',
          class: { name: 'JHS 2', stream: 'Gold' },
          status: 'ACTIVE',
          house: 'Guggisberg House',
          guardians: [{ parent: { firstName: 'Ama', lastName: 'Osei', phoneNumber: '+233 20 777 6666', email: 'ama.osei@yahoo.com' }, relationship: 'MOTHER' }],
        },
        {
          id: 'stu-003',
          admissionNumber: 'TLS-2025-003',
          firstName: 'Emmanuel',
          lastName: 'Appiah',
          gender: 'Male',
          dateOfBirth: '2014-02-10',
          class: { name: 'Class 5', stream: 'A' },
          status: 'ACTIVE',
          house: 'Casely Hayford House',
          guardians: [{ parent: { firstName: 'Samuel', lastName: 'Appiah', phoneNumber: '+233 27 123 4567', email: 'samuel.appiah@gmail.com' }, relationship: 'FATHER' }],
        },
        {
          id: 'stu-004',
          admissionNumber: 'TLS-2025-004',
          firstName: 'Abena',
          lastName: 'Agyemang',
          gender: 'Female',
          dateOfBirth: '2010-11-30',
          class: { name: 'JHS 3', stream: 'Gold' },
          status: 'GRADUATED',
          house: 'Yaa Asantewaa House',
          guardians: [{ parent: { firstName: 'Yaw', lastName: 'Agyemang', phoneNumber: '+233 24 555 1234', email: 'yaw.ag@gmail.com' }, relationship: 'FATHER' }],
        },
        {
          id: 'stu-005',
          admissionNumber: 'TLS-2024-089',
          firstName: 'Kojo',
          lastName: 'Boateng',
          gender: 'Male',
          dateOfBirth: '2013-03-19',
          class: { name: 'Class 6', stream: 'B' },
          status: 'TRANSFERRED',
          house: 'Aggrey House',
          guardians: [{ parent: { firstName: 'Mary', lastName: 'Boateng', phoneNumber: '+233 26 444 9876', email: 'mary.b@hotmail.com' }, relationship: 'MOTHER' }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [search]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify(newStudent),
      });
      setIsModalOpen(false);
      loadStudents();
    } catch {
      // Optimistic local add
      const added = {
        id: `mock-${Date.now()}`,
        admissionNumber: newStudent.admissionNumber || `TLS-2026-${Math.floor(100 + Math.random() * 900)}`,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        gender: newStudent.gender,
        dateOfBirth: newStudent.dateOfBirth,
        class: { name: 'JHS 1', stream: 'Gold' },
        status: 'ACTIVE',
        house: newStudent.house,
        guardians: [{ parent: newStudent.guardian, relationship: newStudent.guardian.relationship }],
      };
      setStudents([added, ...students]);
      setIsModalOpen(false);
    }
  };

  const handleStatusChange = (studentId: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s)),
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const handleToggleSelectPromotion = (studentId: string) => {
    setSelectedForPromotion((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  };

  const handleExecutePromotion = () => {
    if (selectedForPromotion.length === 0) return;
    setStudents((prev) =>
      prev.map((s) =>
        selectedForPromotion.includes(s.id)
          ? { ...s, class: { ...s.class, name: promotionTargetClass } }
          : s,
      ),
    );
    setPromotionNotification(
      `Successfully promoted ${selectedForPromotion.length} student(s) to ${promotionTargetClass}!`,
    );
    setSelectedForPromotion([]);
    setTimeout(() => setPromotionNotification(null), 4000);
  };

  const filteredStudents = students.filter((s) => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesClass =
      classFilter === 'ALL' ||
      s.class?.name?.toLowerCase().includes(classFilter.toLowerCase());
    return matchesStatus && matchesClass;
  });

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
              <span>Student Administration</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span>Student Lifecycle &amp; Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive student admissions, enrollment tracking, digital ID generation, promotions, and alumni records.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Admit New Student
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex space-x-6 text-xs">
          <button
            onClick={() => setActiveTab('directory')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'directory'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Student Directory ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'admissions'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Admissions &amp; Applications</span>
          </button>
          <button
            onClick={() => setActiveTab('id_cards')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'id_cards'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <IdCard className="h-4 w-4" />
            <span>Student ID Card Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`pb-3 font-semibold transition-colors flex items-center space-x-1.5 ${
              activeTab === 'promotions'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Promotion &amp; Transfer Desk</span>
          </button>
        </div>

        {/* Tab 1: Student Directory */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, ID or house..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white border-slate-200"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="GRADUATED">GRADUATED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                  <option value="WITHDRAWN">WITHDRAWN</option>
                </select>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-700"
                >
                  <option value="ALL">All Classes</option>
                  <option value="JHS">Junior High (JHS 1-3)</option>
                  <option value="Class">Primary (Class 1-6)</option>
                  <option value="KG">Kindergarten</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-500">Loading student registry...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-12 text-center max-w-sm mx-auto">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No Students Matching Filter</h3>
                  <p className="text-xs text-slate-500 mb-4">Try adjusting your search criteria or enroll a new student.</p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Enroll Student
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Admission No.</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Gender</th>
                        <th className="px-4 py-3">Class &amp; Stream</th>
                        <th className="px-4 py-3">House</th>
                        <th className="px-4 py-3">Primary Guardian</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => {
                        const guardian = student.guardians?.[0]?.parent;
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900">
                              {student.admissionNumber}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {student.firstName} {student.lastName}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{student.gender || 'N/A'}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">
                              {student.class?.name || 'Class'}{' '}
                              {student.class?.stream ? `(${student.class.stream})` : ''}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">
                                <Home className="h-3 w-3 text-slate-400" />
                                <span>{student.house || 'Aggrey'}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {guardian ? (
                                <div>
                                  <span className="font-medium block text-slate-900">
                                    {guardian.firstName} {guardian.lastName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">{guardian.phoneNumber}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">None linked</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  student.status === 'ACTIVE'
                                    ? 'success'
                                    : student.status === 'GRADUATED'
                                    ? 'warning'
                                    : 'secondary'
                                }
                              >
                                {student.status || 'ACTIVE'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                                className="h-7 px-2 text-slate-700 hover:text-slate-950 text-xs"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                Profile
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIdCardStudent(student);
                                  setActiveTab('id_cards');
                                }}
                                className="h-7 px-2 border-slate-200 text-blue-600 hover:bg-blue-50 text-xs"
                              >
                                <IdCard className="h-3.5 w-3.5 mr-1" />
                                ID Card
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab 2: Admissions & Applications Pipeline */}
        {activeTab === 'admissions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">New Applications (Term 1)</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">18 Inquiries</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">6 Verified &amp; Pending Interview</div>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">Approved for Enrollment</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">12 Students</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Admission fees cleared</div>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm p-4">
                <div className="text-xs font-semibold text-slate-500">Available Class Seats</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">45 Seats</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Across KG, Primary &amp; JHS</div>
              </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-900">Recent Admission Inquiries &amp; Registrations</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track incoming student applications from the front desk and admission forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Applicant Name</th>
                        <th className="px-4 py-3">Target Grade</th>
                        <th className="px-4 py-3">Previous School</th>
                        <th className="px-4 py-3">Guardian Contact</th>
                        <th className="px-4 py-3">Application Date</th>
                        <th className="px-4 py-3">Admission Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Kofi Owusu', grade: 'JHS 1', prev: 'Star International Academy', contact: '+233 24 555 7777', date: '2026-03-12', stage: 'INTERVIEW_PASSED' },
                        { name: 'Serwaa Boakye', grade: 'Class 4', prev: 'Crown Royal School', contact: '+233 20 888 1122', date: '2026-03-10', stage: 'FEES_PENDING' },
                        { name: 'David Tetteh', grade: 'KG 2', prev: 'Home Care', contact: '+233 55 444 3322', date: '2026-03-08', stage: 'ENROLLED' },
                      ].map((app, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{app.name}</td>
                          <td className="px-4 py-3 font-medium text-blue-600">{app.grade}</td>
                          <td className="px-4 py-3 text-slate-500">{app.prev}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{app.contact}</td>
                          <td className="px-4 py-3 text-slate-500">{app.date}</td>
                          <td className="px-4 py-3">
                            <Badge variant={app.stage === 'ENROLLED' ? 'success' : 'warning'}>
                              {app.stage}
                            </Badge>
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

        {/* Tab 3: Student ID Card Generator */}
        {activeTab === 'id_cards' && (
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Standard Institutional Student ID Badge</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any student to generate and preview a print-ready school badge with barcode and security stamps.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <select
                    value={idCardStudent?.id || ''}
                    onChange={(e) => {
                      const matched = students.find((s) => s.id === e.target.value);
                      if (matched) setIdCardStudent(matched);
                    }}
                    className="bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-700"
                  >
                    <option value="">Select Student to Preview Badge...</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.admissionNumber})
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9"
                  >
                    <Printer className="h-4 w-4 mr-1.5" />
                    Print ID Badge
                  </Button>
                </div>
              </div>

              {/* ID Badge Preview Card */}
              {idCardStudent ? (
                <div className="mt-8 flex justify-center">
                  <div className="w-80 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-5 shadow-2xl relative overflow-hidden border border-blue-500/30">
                    {/* Background Seal Watermark */}
                    <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                      <GraduationCap className="h-44 w-44 text-white" />
                    </div>

                    {/* School Header */}
                    <div className="flex items-center space-x-2.5 pb-3 border-b border-blue-400/30">
                      <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-amber-300 text-sm">
                        TLS
                      </div>
                      <div>
                        <div className="text-[11px] font-black tracking-wider uppercase">The Living Spring School</div>
                        <div className="text-[9px] text-blue-200">Excellence &amp; Integrity • Ghana</div>
                      </div>
                    </div>

                    {/* Student Photo & Details */}
                    <div className="mt-4 flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-xl bg-slate-100/90 text-slate-700 flex flex-col items-center justify-center border-2 border-white/60 shadow-md flex-shrink-0">
                        <User className="h-10 w-10 text-slate-500" />
                        <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Photo</span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="text-[10px] text-blue-200 uppercase font-semibold">Student Name</div>
                        <div className="font-extrabold text-sm text-white leading-tight">
                          {idCardStudent.firstName} {idCardStudent.lastName}
                        </div>
                        <div className="text-[11px] text-amber-300 font-bold font-mono">
                          {idCardStudent.admissionNumber}
                        </div>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="mt-4 pt-3 border-t border-blue-400/30 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-blue-300 block">Current Class:</span>
                        <span className="font-bold text-white">{idCardStudent.class?.name || 'Class'}</span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">House:</span>
                        <span className="font-bold text-white">{idCardStudent.house || 'Aggrey'}</span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">Valid Academic Year:</span>
                        <span className="font-bold text-white">2025 / 2026</span>
                      </div>
                      <div>
                        <span className="text-blue-300 block">Status:</span>
                        <span className="font-bold text-emerald-300">AUTHORIZED</span>
                      </div>
                    </div>

                    {/* Barcode Mock */}
                    <div className="mt-4 pt-2 border-t border-blue-400/30 flex flex-col items-center justify-center">
                      <div className="font-mono text-center tracking-widest text-[9px] text-blue-200">
                        ||| | ||||| || |||||| | ||||| |||
                      </div>
                      <span className="text-[8px] text-blue-300 font-mono mt-0.5">{idCardStudent.admissionNumber}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Select a student from the dropdown above to render their institutional ID card.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab 4: Student Promotions & Status Transitions */}
        {activeTab === 'promotions' && (
          <div className="space-y-4">
            {promotionNotification && (
              <div className="p-3.5 rounded-lg text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center justify-between">
                <span>{promotionNotification}</span>
                <button onClick={() => setPromotionNotification(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>
            )}

            <Card className="bg-white border-slate-200 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Academic Year Promotion Engine</h3>
                  <p className="text-xs text-slate-500">
                    Bulk-select qualified learners and advance them to their next grade level based on year-end Stanine aggregates.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-medium">Target Class:</span>
                  <select
                    value={promotionTargetClass}
                    onChange={(e) => setPromotionTargetClass(e.target.value)}
                    className="bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-800 font-semibold"
                  >
                    <option value="KG 2">KG 2</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="JHS 1">JHS 1</option>
                    <option value="JHS 2">JHS 2</option>
                    <option value="JHS 3">JHS 3</option>
                    <option value="GRADUATED">Alumni / Graduated</option>
                  </select>

                  <Button
                    onClick={handleExecutePromotion}
                    disabled={selectedForPromotion.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Promote Selected ({selectedForPromotion.length})
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 w-8">Select</th>
                      <th className="px-3 py-2">Admission No.</th>
                      <th className="px-3 py-2">Student Name</th>
                      <th className="px-3 py-2">Current Class</th>
                      <th className="px-3 py-2">Attendance %</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Target Promotion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const isSelected = selectedForPromotion.includes(s.id);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectPromotion(s.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{s.admissionNumber}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-900">{s.firstName} {s.lastName}</td>
                          <td className="px-3 py-2.5 font-medium text-slate-700">{s.class?.name || 'Class'}</td>
                          <td className="px-3 py-2.5 text-emerald-600 font-bold">96%</td>
                          <td className="px-3 py-2.5">
                            <Badge variant={s.status === 'ACTIVE' ? 'success' : 'secondary'}>{s.status}</Badge>
                          </td>
                          <td className="px-3 py-2.5 text-blue-600 font-semibold">{promotionTargetClass}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Modal: Full Student Profile Cockpit */}
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
          maxWidth="2xl"
        >
          {selectedStudent && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                    {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                    <div className="font-mono text-[11px] text-blue-600">{selectedStudent.admissionNumber}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 text-[11px]">Lifecycle Status:</span>
                  <select
                    value={selectedStudent.status}
                    onChange={(e) => handleStatusChange(selectedStudent.id, e.target.value)}
                    className="bg-white border border-slate-200 rounded-md text-xs h-8 px-2 text-slate-800 font-semibold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="GRADUATED">GRADUATED</option>
                    <option value="TRANSFERRED">TRANSFERRED</option>
                    <option value="WITHDRAWN">WITHDRAWN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Class &amp; Stream</span>
                  <div className="font-semibold text-slate-900">{selectedStudent.class?.name || 'Class 5'} (Stream A)</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">House Assignment</span>
                  <div className="font-semibold text-slate-900">{selectedStudent.house || 'Aggrey House'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date of Birth / Gender</span>
                  <div className="font-semibold text-slate-900">
                    {selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'} • {selectedStudent.gender || 'Male'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Campus Residential Address</span>
                  <div className="font-semibold text-slate-900">{selectedStudent.address || 'Accra, Greater Accra'}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Linked Parent / Guardian Records</span>
                {selectedStudent.guardians?.[0] ? (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {selectedStudent.guardians[0].parent?.firstName} {selectedStudent.guardians[0].parent?.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {selectedStudent.guardians[0].relationship || 'FATHER'} • {selectedStudent.guardians[0].parent?.phoneNumber}
                      </div>
                    </div>
                    <Badge variant="secondary">Primary Contact</Badge>
                  </div>
                ) : (
                  <div className="text-slate-400 italic">No parent account linked yet.</div>
                )}
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <Button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Admit New Student Form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Admit New Student"
          description="Register a new student with unique admission number, class assignment, house, and guardian details."
          maxWidth="xl"
        >
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Admission Number *</label>
                <Input
                  required
                  placeholder="e.g. TLS-2025-015"
                  value={newStudent.admissionNumber}
                  onChange={(e) => setNewStudent({ ...newStudent, admissionNumber: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Gender</label>
                <select
                  value={newStudent.gender}
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-900"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">First Name *</label>
                <Input
                  required
                  placeholder="e.g. Kwame"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                <Input
                  required
                  placeholder="e.g. Mensah"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Class Assignment</label>
                <select
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent({ ...newStudent, classId: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-900"
                >
                  <option value="cls-001">JHS 1 (Gold)</option>
                  <option value="cls-002">JHS 2 (Gold)</option>
                  <option value="cls-003">Class 5 (Stream A)</option>
                  <option value="cls-004">Class 6 (Stream A)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">House Assignment</label>
                <select
                  value={newStudent.house}
                  onChange={(e) => setNewStudent({ ...newStudent, house: e.target.value })}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-9 px-3 text-slate-900"
                >
                  <option value="Aggrey House">Aggrey House</option>
                  <option value="Guggisberg House">Guggisberg House</option>
                  <option value="Casely Hayford House">Casely Hayford House</option>
                  <option value="Yaa Asantewaa House">Yaa Asantewaa House</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
                <Input
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                  className="mt-1 h-9 text-xs bg-white border-slate-200"
                />
              </div>
            </div>

            {/* Guardian Information Sub-card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 block">Primary Guardian / Parent Record</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Guardian First Name</label>
                  <Input
                    placeholder="e.g. Kofi"
                    value={newStudent.guardian.firstName}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: { ...newStudent.guardian, firstName: e.target.value },
                      })
                    }
                    className="mt-1 h-8 text-xs bg-white border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Guardian Last Name</label>
                  <Input
                    placeholder="e.g. Mensah"
                    value={newStudent.guardian.lastName}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: { ...newStudent.guardian, lastName: e.target.value },
                      })
                    }
                    className="mt-1 h-8 text-xs bg-white border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Phone Number *</label>
                  <Input
                    required
                    placeholder="+233 24 000 0000"
                    value={newStudent.guardian.phoneNumber}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: { ...newStudent.guardian, phoneNumber: e.target.value },
                      })
                    }
                    className="mt-1 h-8 text-xs bg-white border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600">Relationship</label>
                  <select
                    value={newStudent.guardian.relationship}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: { ...newStudent.guardian, relationship: e.target.value },
                      })
                    }
                    className="w-full mt-1 bg-white border border-slate-200 rounded-md text-xs h-8 px-2 text-slate-900"
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Legal Guardian</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-200 text-slate-600 text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-4 shadow-sm"
              >
                Complete Admission
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

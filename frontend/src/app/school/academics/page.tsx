'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Layers,
  GraduationCap,
  Calendar,
  Sparkles,
  DoorClosed,
  Flag,
  Award,
  Building,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'classes' | 'departments' | 'subjects' | 'rooms' | 'houses' | 'grading'>('classes');
  const [classes, setClasses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);
  const [gradingSystems, setGradingSystems] = useState<any[]>([]);

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);

  // Forms
  const [newClass, setNewClass] = useState({ name: '', stream: 'A', level: 'Primary' });
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 40, roomType: 'CLASSROOM', building: 'Main Block' });
  const [newHouse, setNewHouse] = useState({ name: '', color: '#10b981', masterName: '', motto: '' });

  const loadData = async () => {
    try {
      const [cls, depts, subs, rms, hs, gs] = await Promise.all([
        apiRequest('/academics/classes'),
        apiRequest('/academics/departments'),
        apiRequest('/academics/subjects'),
        apiRequest('/academics/rooms'),
        apiRequest('/academics/houses'),
        apiRequest('/academics/grading-systems'),
      ]);
      setClasses(cls || []);
      setDepartments(depts || []);
      setSubjects(subs || []);
      if (rms) setRooms(rms);
      if (hs) setHouses(hs);
      if (gs) setGradingSystems(gs);
    } catch {
      // Fallback Ghanaian defaults
      setClasses([
        { id: '1', name: 'KG 1', stream: 'A', level: 'KG' },
        { id: '2', name: 'KG 2', stream: 'A', level: 'KG' },
        { id: '3', name: 'Class 1', stream: 'A', level: 'Primary' },
        { id: '4', name: 'Class 2', stream: 'A', level: 'Primary' },
        { id: '5', name: 'Class 3', stream: 'A', level: 'Primary' },
        { id: '6', name: 'Class 4', stream: 'A', level: 'Primary' },
        { id: '7', name: 'Class 5', stream: 'A', level: 'Primary' },
        { id: '8', name: 'Class 6', stream: 'A', level: 'Primary' },
        { id: '9', name: 'JHS 1', stream: 'Gold', level: 'JHS' },
        { id: '10', name: 'JHS 2', stream: 'Gold', level: 'JHS' },
        { id: '11', name: 'JHS 3', stream: 'Gold', level: 'JHS' },
      ]);
      setDepartments([
        { id: '1', name: 'Kindergarten', description: 'Early childhood foundation' },
        { id: '2', name: 'Primary School', description: 'Lower and upper primary (Class 1-6)' },
        { id: '3', name: 'Junior High School', description: 'BECE preparation tier (JHS 1-3)' },
      ]);
      setSubjects([
        { id: '1', name: 'English Language', code: 'ENG' },
        { id: '2', name: 'Mathematics', code: 'MATH' },
        { id: '3', name: 'Integrated Science', code: 'SCI' },
        { id: '4', name: 'Social Studies', code: 'SOC' },
        { id: '5', name: 'Information & Communication Tech (ICT)', code: 'ICT' },
        { id: '6', name: 'Ghanaian Language & Culture', code: 'GHL' },
        { id: '7', name: 'Religious & Moral Education (RME)', code: 'RME' },
        { id: '8', name: 'Basic Design & Technology (BDT)', code: 'BDT' },
      ]);
      setRooms([
        { id: '1', name: 'Room 101', roomType: 'CLASSROOM', capacity: 40, building: 'Block A' },
        { id: '2', name: 'Room 102', roomType: 'CLASSROOM', capacity: 40, building: 'Block A' },
        { id: '3', name: 'Science Laboratory 1', roomType: 'LAB', capacity: 35, building: 'Science Complex' },
        { id: '4', name: 'ICT Computer Lab', roomType: 'LAB', capacity: 45, building: 'Library Block' },
      ]);
      setHouses([
        { id: '1', name: 'Kwame Nkrumah House', color: '#dc2626', masterName: 'Mr. Eric Quaye', motto: 'Forward Ever, Backward Never' },
        { id: '2', name: 'Aggrey House', color: '#2563eb', masterName: 'Mrs. Victoria Mensah', motto: 'Only the Best is Good Enough' },
        { id: '3', name: 'Guggisberg House', color: '#16a34a', masterName: 'Mr. David Annan', motto: 'Service and Integrity' },
        { id: '4', name: 'Yaa Asantewaa House', color: '#ca8a04', masterName: 'Ms. Grace Ofori', motto: 'Courage and Perseverance' },
      ]);
      setGradingSystems([
        {
          id: '1',
          name: 'Ghana WAEC / BECE Stanine (1 - 9)',
          code: 'BECE_STANINE',
          isDefault: true,
          scales: [
            { grade: '1', minScore: 80, maxScore: 100, descriptor: 'HIGHEST', remarks: 'Grade 1 - Highest' },
            { grade: '2', minScore: 75, maxScore: 79.99, descriptor: 'HIGHER', remarks: 'Grade 2 - Higher' },
            { grade: '3', minScore: 70, maxScore: 74.99, descriptor: 'HIGH', remarks: 'Grade 3 - High' },
            { grade: '4', minScore: 65, maxScore: 69.99, descriptor: 'HIGH_AVERAGE', remarks: 'Grade 4 - High Average' },
            { grade: '5', minScore: 60, maxScore: 64.99, descriptor: 'AVERAGE', remarks: 'Grade 5 - Average' },
            { grade: '6', minScore: 55, maxScore: 59.99, descriptor: 'LOW_AVERAGE', remarks: 'Grade 6 - Low Average' },
            { grade: '7', minScore: 50, maxScore: 54.99, descriptor: 'LOWER', remarks: 'Grade 7 - Lower' },
            { grade: '8', minScore: 45, maxScore: 49.99, descriptor: 'LOWEST', remarks: 'Grade 8 - Lowest' },
            { grade: '9', minScore: 0, maxScore: 44.99, descriptor: 'FAIL', remarks: 'Grade 9 - Fail' },
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/classes', {
        method: 'POST',
        body: JSON.stringify(newClass),
      });
      loadData();
    } catch {
      setClasses([...classes, { id: `cls-${Date.now()}`, ...newClass }]);
    }
    setIsClassModalOpen(false);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/rooms', {
        method: 'POST',
        body: JSON.stringify(newRoom),
      });
      loadData();
    } catch {
      setRooms([...rooms, { id: `rm-${Date.now()}`, ...newRoom }]);
    }
    setIsRoomModalOpen(false);
  };

  const handleCreateHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/academics/houses', {
        method: 'POST',
        body: JSON.stringify(newHouse),
      });
      loadData();
    } catch {
      setHouses([...houses, { id: `hs-${Date.now()}`, ...newHouse }]);
    }
    setIsHouseModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <SchoolNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/school/dashboard" className="hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span>Academics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Academic Structure & Setup</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Classes, streams, departments, curriculum subjects, physical rooms, houses & Ghana grading scales.
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === 'classes' && (
              <Button
                onClick={() => setIsClassModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add New Class
              </Button>
            )}
            {activeTab === 'rooms' && (
              <Button
                onClick={() => setIsRoomModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Room
              </Button>
            )}
            {activeTab === 'houses' && (
              <Button
                onClick={() => setIsHouseModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add House
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-6 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'classes', label: 'Classes & Streams', icon: GraduationCap },
            { id: 'departments', label: 'Departments', icon: Layers },
            { id: 'subjects', label: 'Subjects Catalog', icon: BookOpen },
            { id: 'rooms', label: 'Rooms & Labs', icon: DoorClosed },
            { id: 'houses', label: 'Houses', icon: Flag },
            { id: 'grading', label: 'Grading Scales', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Classes */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {classes.map((cls) => (
              <Card key={cls.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">{cls.level || 'Class'}</Badge>
                  <span className="text-[10px] font-mono text-slate-400">Stream {cls.stream || 'A'}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enrolled: <b>{cls._count?.students || 24}</b> students
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 2: Departments */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-2">{dept.description}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 3: Subjects */}
        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map((sub) => (
              <Card key={sub.id} className="p-3.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{sub.name}</h4>
                  <span className="text-[10px] text-slate-400">Core Curriculum</span>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                  {sub.code}
                </Badge>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 4: Rooms & Labs */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {rooms.map((rm) => (
              <Card key={rm.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs font-mono">{rm.roomType}</Badge>
                  <span className="text-xs text-slate-500 font-medium">Cap: {rm.capacity}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{rm.name}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Building className="h-3 w-3" /> {rm.building || 'General Building'}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 5: Houses */}
        {activeTab === 'houses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {houses.map((h) => (
              <Card key={h.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: h.color || '#2563eb' }} />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{h.name}</h3>
                </div>
                <p className="text-xs text-slate-500 italic">&ldquo;{h.motto || 'Excellence in all'}&rdquo;</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  House Master: {h.masterName || 'Unassigned'}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 6: Grading Scales */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            {gradingSystems.map((gs) => (
              <Card key={gs.id} className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      {gs.name}
                    </CardTitle>
                    {gs.isDefault && (
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs">
                        Default Scale
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{gs.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-5 py-3">Grade</th>
                        <th className="px-5 py-3">Score Range</th>
                        <th className="px-5 py-3">WAEC Classification</th>
                        <th className="px-5 py-3">Terminal Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {gs.scales?.map((sc: any) => (
                        <tr key={sc.grade} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-5 py-3 font-bold font-mono text-indigo-600 dark:text-indigo-400">
                            {sc.grade}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">
                            {sc.minScore}% - {sc.maxScore}%
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant="outline" className="text-xs uppercase">
                              {sc.descriptor}
                            </Badge>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400">
                            {sc.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Class Modal */}
        <Modal
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          title="Add Class & Stream"
          description="Create a new class group under your school's academic tier."
        >
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Class Name *</label>
              <Input
                required
                placeholder="e.g. Class 7 or JHS 1"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stream</label>
                <Input
                  placeholder="e.g. A, B, Gold"
                  value={newClass.stream}
                  onChange={(e) => setNewClass({ ...newClass, stream: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Level / Tier</label>
                <select
                  value={newClass.level}
                  onChange={(e) => setNewClass({ ...newClass, level: e.target.value })}
                  className="mt-1 w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                >
                  <option value="KG">Kindergarten</option>
                  <option value="Primary">Primary</option>
                  <option value="JHS">Junior High School</option>
                  <option value="SHS">Senior High School</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsClassModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Save Class
              </Button>
            </div>
          </form>
        </Modal>

        {/* Add Room Modal */}
        <Modal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          title="Add Academic Room / Facility"
        >
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Room Name *</label>
              <Input
                required
                placeholder="e.g. Science Lab 2 or Room 204"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Facility Type</label>
                <select
                  value={newRoom.roomType}
                  onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                  className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="CLASSROOM">Classroom</option>
                  <option value="LAB">Science / Computer Lab</option>
                  <option value="LIBRARY">Library</option>
                  <option value="HALL">Assembly Hall</option>
                  <option value="SICKBAY">Sick Bay</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Capacity</label>
                <Input
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 40 })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Building / Block</label>
              <Input
                placeholder="e.g. Block B, Upper Floor"
                value={newRoom.building}
                onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRoomModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Room
              </Button>
            </div>
          </form>
        </Modal>

        {/* Add House Modal */}
        <Modal
          isOpen={isHouseModalOpen}
          onClose={() => setIsHouseModalOpen(false)}
          title="Add School House"
        >
          <form onSubmit={handleCreateHouse} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">House Name *</label>
              <Input
                required
                placeholder="e.g. Philip Quaque House"
                value={newHouse.name}
                onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">House Color</label>
                <Input
                  type="color"
                  value={newHouse.color}
                  onChange={(e) => setNewHouse({ ...newHouse, color: e.target.value })}
                  className="h-10 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">House Master</label>
                <Input
                  placeholder="e.g. Mr. K. Mensah"
                  value={newHouse.masterName}
                  onChange={(e) => setNewHouse({ ...newHouse, masterName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">House Motto</label>
              <Input
                placeholder="e.g. Strive for Honor"
                value={newHouse.motto}
                onChange={(e) => setNewHouse({ ...newHouse, motto: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsHouseModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save House
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

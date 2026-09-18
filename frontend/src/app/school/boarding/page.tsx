'use client';

import React, { useEffect, useState } from 'react';
import {
  BedDouble,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Home,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function BoardingPage() {
  const [dormitories, setDormitories] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDorm, setSelectedDorm] = useState<any>(null);

  // Modals
  const [isDormModalOpen, setIsDormModalOpen] = useState(false);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  // Forms
  const [dormForm, setDormForm] = useState({
    name: '',
    gender: 'MALE',
    houseMaster: '',
    capacity: 40,
  });

  const [bedForm, setBedForm] = useState({
    count: 10,
    prefix: 'BED',
  });

  const [allocateForm, setAllocateForm] = useState({
    bedId: '',
    studentId: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dorms, stds] = await Promise.all([
        apiRequest('/operations/dormitories'),
        apiRequest('/students'),
      ]);
      if (dorms && dorms.length > 0) {
        setDormitories(dorms);
        setSelectedDorm(dorms[0]);
      } else {
        // Fallback default sample for Ghana Boarding houses
        const sampleDorms = [
          {
            id: '1',
            name: 'Kwame Nkrumah Hall (Block A)',
            gender: 'MALE',
            houseMaster: 'Mr. Kofi Boateng',
            capacity: 60,
            beds: [
              { id: 'b1', bedNumber: 'BED-01-A', isOccupied: true, allocations: [{ id: 'a1', student: { firstName: 'Kwesi', lastName: 'Mensah', admissionNumber: 'STD-012' } }] },
              { id: 'b2', bedNumber: 'BED-02-A', isOccupied: true, allocations: [{ id: 'a2', student: { firstName: 'Yaw', lastName: 'Sarpong', admissionNumber: 'STD-034' } }] },
              { id: 'b3', bedNumber: 'BED-03-A', isOccupied: false, allocations: [] },
              { id: 'b4', bedNumber: 'BED-04-A', isOccupied: false, allocations: [] },
            ],
          },
          {
            id: '2',
            name: 'Yaa Asantewaa Hall (Block B)',
            gender: 'FEMALE',
            houseMaster: 'Mrs. Cynthia Danquah',
            capacity: 60,
            beds: [
              { id: 'b5', bedNumber: 'BED-01-B', isOccupied: true, allocations: [{ id: 'a3', student: { firstName: 'Abena', lastName: 'Osei', admissionNumber: 'STD-045' } }] },
              { id: 'b6', bedNumber: 'BED-02-B', isOccupied: false, allocations: [] },
            ],
          },
        ];
        setDormitories(sampleDorms);
        setSelectedDorm(sampleDorms[0]);
      }
      if (stds) setStudents(stds);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDorm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/operations/dormitories', {
        method: 'POST',
        body: JSON.stringify(dormForm),
      });
      setIsDormModalOpen(false);
      setDormForm({ name: '', gender: 'MALE', houseMaster: '', capacity: 40 });
      loadData();
    } catch {
      alert('Error creating dormitory');
    }
  };

  const handleAddBeds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDorm) return;
    try {
      await apiRequest(`/operations/dormitories/${selectedDorm.id}/beds`, {
        method: 'POST',
        body: JSON.stringify(bedForm),
      });
      setIsBedModalOpen(false);
      loadData();
    } catch {
      alert('Error generating beds');
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/operations/dormitories/allocate', {
        method: 'POST',
        body: JSON.stringify(allocateForm),
      });
      setIsAllocateModalOpen(false);
      setAllocateForm({ bedId: '', studentId: '' });
      loadData();
    } catch {
      alert('Error allocating bed to student');
    }
  };

  const handleVacate = async (allocationId: string) => {
    if (!confirm('Are you sure you want to vacate this student from the bed?')) return;
    try {
      await apiRequest(`/operations/dormitories/vacate/${allocationId}`, {
        method: 'POST',
      });
      loadData();
    } catch {
      alert('Error vacating bed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                <BedDouble className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Boarding Houses & Dormitory Allocations
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hostel blocks, house masters, bed inventory, student occupancy and room tracking
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsDormModalOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Dormitory Block
          </Button>
        </div>

        {/* Dormitory Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dormitories.map((d) => {
            const occupiedBeds = d.beds?.filter((b: any) => b.isOccupied).length || 0;
            const totalBeds = d.beds?.length || 0;
            const isSelected = selectedDorm?.id === d.id;

            return (
              <Card
                key={d.id}
                onClick={() => setSelectedDorm(d)}
                className={`cursor-pointer transition border-2 ${
                  isSelected
                    ? 'border-indigo-600 dark:border-indigo-400 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-xs ${
                        d.gender === 'MALE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                      }`}
                    >
                      {d.gender} HOSTEL
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">
                      {occupiedBeds}/{totalBeds} Occupied
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{d.name}</CardTitle>
                  <CardDescription>Master: {d.houseMaster || 'Unassigned'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Dormitory Beds Grid */}
        {selectedDorm && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-indigo-600" />
                  {selectedDorm.name} — Bed Allocation Matrix
                </CardTitle>
                <CardDescription>
                  Capacity: {selectedDorm.capacity} beds • {selectedDorm.gender} Students
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsBedModalOpen(true)}
                  className="text-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Beds
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAllocateModalOpen(true)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Allocate Student
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedDorm.beds?.map((bed: any) => {
                  const currentAlloc = bed.allocations?.[0];
                  return (
                    <div
                      key={bed.id}
                      className={`p-4 rounded-xl border transition ${
                        bed.isOccupied
                          ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                          {bed.bedNumber}
                        </span>
                        {bed.isOccupied ? (
                          <Badge className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Occupied
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-500">
                            Vacant
                          </Badge>
                        )}
                      </div>

                      {bed.isOccupied && currentAlloc?.student ? (
                        <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/60">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {currentAlloc.student.firstName} {currentAlloc.student.lastName}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            {currentAlloc.student.admissionNumber}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleVacate(currentAlloc.id)}
                            className="w-full mt-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7"
                          >
                            <LogOut className="h-3 w-3 mr-1" /> Vacate Bed
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAllocateForm({ bedId: bed.id, studentId: '' });
                              setIsAllocateModalOpen(true);
                            }}
                            className="w-full text-xs h-7 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          >
                            Assign Bed
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {(!selectedDorm.beds || selectedDorm.beds.length === 0) && (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    No beds created for this dormitory yet. Click &quot;Add Beds&quot; to auto-generate.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODAL: ADD DORMITORY */}
        <Modal
          isOpen={isDormModalOpen}
          onClose={() => setIsDormModalOpen(false)}
          title="Add New Dormitory Block"
        >
          <form onSubmit={handleCreateDorm} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Hall / Block Name</label>
              <Input
                required
                placeholder="e.g. Kwame Nkrumah Hall Block C"
                value={dormForm.name}
                onChange={(e) => setDormForm({ ...dormForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Resident Gender</label>
                <select
                  value={dormForm.gender}
                  onChange={(e) => setDormForm({ ...dormForm, gender: e.target.value })}
                  className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  <option value="MALE">Male (Boys)</option>
                  <option value="FEMALE">Female (Girls)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Capacity</label>
                <Input
                  type="number"
                  required
                  value={dormForm.capacity}
                  onChange={(e) => setDormForm({ ...dormForm, capacity: parseInt(e.target.value) || 40 })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">House Master / Mistress</label>
              <Input
                placeholder="e.g. Mr. K. Mensah"
                value={dormForm.houseMaster}
                onChange={(e) => setDormForm({ ...dormForm, houseMaster: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDormModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Create Block
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: ADD BEDS */}
        <Modal
          isOpen={isBedModalOpen}
          onClose={() => setIsBedModalOpen(false)}
          title={`Generate Beds for ${selectedDorm?.name}`}
        >
          <form onSubmit={handleAddBeds} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Number of Beds</label>
                <Input
                  type="number"
                  required
                  value={bedForm.count}
                  onChange={(e) => setBedForm({ ...bedForm, count: parseInt(e.target.value) || 10 })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Bed Prefix</label>
                <Input
                  required
                  value={bedForm.prefix}
                  onChange={(e) => setBedForm({ ...bedForm, prefix: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              This will generate {bedForm.prefix}-01 through {bedForm.prefix}-{bedForm.count} in this block.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsBedModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Generate Beds
              </Button>
            </div>
          </form>
        </Modal>

        {/* MODAL: ALLOCATE BED */}
        <Modal
          isOpen={isAllocateModalOpen}
          onClose={() => setIsAllocateModalOpen(false)}
          title="Allocate Student to Bed"
        >
          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Select Bed</label>
              <select
                required
                value={allocateForm.bedId}
                onChange={(e) => setAllocateForm({ ...allocateForm, bedId: e.target.value })}
                className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="">-- Choose Vacant Bed --</option>
                {selectedDorm?.beds?.filter((b: any) => !b.isOccupied).map((b: any) => (
                  <option key={b.id} value={b.id}>{b.bedNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Select Student</label>
              <select
                required
                value={allocateForm.studentId}
                onChange={(e) => setAllocateForm({ ...allocateForm, studentId: e.target.value })}
                className="w-full mt-1.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.admissionNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAllocateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Confirm Allocation
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}

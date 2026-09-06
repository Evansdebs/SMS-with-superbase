'use client';

import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Thermometer,
  Pill,
  UserCheck,
  Calendar,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface HealthVisitItem {
  id: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  visitDate: string;
  temperature: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  medicationGiven: string;
  attendedBy: string;
  parentContacted: boolean;
  referredToHospital: boolean;
}

export default function HealthPage() {
  const [visits, setVisits] = useState<HealthVisitItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    className: '',
    temperature: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    medicationGiven: '',
    parentContacted: false,
    referredToHospital: false,
  });

  const filtered = visits.filter(
    (v) =>
      v.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit: HealthVisitItem = {
      id: `hlt-${Date.now()}`,
      studentName: formData.studentName,
      admissionNumber: formData.admissionNumber,
      className: formData.className,
      visitDate: 'Just now',
      temperature: formData.temperature,
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis || 'General Malaise',
      treatment: formData.treatment || 'Rest in sick bay',
      medicationGiven: formData.medicationGiven || 'None',
      attendedBy: 'Nurse Janet Mensah',
      parentContacted: formData.parentContacted,
      referredToHospital: formData.referredToHospital,
    };

    setVisits([newVisit, ...visits]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                School Clinic & Sick Bay
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="success">Health Operations</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Sick Bay Clinic & Health Log
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Record student visits to the school infirmary, vital signs, administered treatments, and emergency escalations.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Log Clinic Visit</span>
          </Button>
        </div>

        {/* Health KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Term Clinic Visits</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {visits.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Fever / Temperature Flags</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {visits.filter((v) => parseFloat(v.temperature) > 37.5).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Parents Contacted</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {visits.filter((v) => v.parentContacted).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Hospital Referrals</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student, symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Visits Cards */}
        <div className="space-y-4">
          {filtered.map((visit) => (
            <Card key={visit.id} className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center font-bold">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {visit.studentName}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {visit.admissionNumber}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {visit.className}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500">Attended by {visit.attendedBy} • {visit.visitDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
                      <Thermometer className="h-3.5 w-3.5" />
                      {visit.temperature}
                    </span>
                    {visit.parentContacted && (
                      <Badge variant="info" className="text-[10px]">
                        Parent Contacted
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold mb-0.5">Reported Symptoms:</span>
                    <p className="text-slate-800 dark:text-slate-200">{visit.symptoms}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold mb-0.5">Preliminary Diagnosis:</span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{visit.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold mb-0.5">Treatment & Medication:</span>
                    <p className="text-slate-800 dark:text-slate-200">
                      {visit.treatment} {visit.medicationGiven !== 'None' ? `(${visit.medicationGiven})` : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Log Visit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Sick Bay Clinic Visit"
        description="Document clinical symptoms, temperature, and treatment administered"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Student *
              </label>
              <select
                value={formData.studentName}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    studentName: name,
                    admissionNumber: name === 'Abena Osei' ? 'TLS-2025-002' : 'TLS-2025-001',
                    className: name === 'Abena Osei' ? 'JHS 1 (Gold)' : 'Class 5 (A)',
                  });
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="Abena Osei">Abena Osei (TLS-2025-002)</option>
                <option value="Kwame Mensah">Kwame Mensah (TLS-2025-001)</option>
                <option value="Kofi Boateng">Kofi Boateng (TLS-2025-003)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Body Temperature (°C) *
              </label>
              <Input
                required
                placeholder="e.g. 37.8 °C"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Symptoms Observed / Reported *
            </label>
            <Input
              required
              placeholder="e.g. Nausea, stomach ache, fever"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Diagnosis
              </label>
              <Input
                placeholder="e.g. Acute Gastroenteritis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Medication Given
              </label>
              <Input
                placeholder="e.g. ORS sachet + Paracetamol"
                value={formData.medicationGiven}
                onChange={(e) => setFormData({ ...formData, medicationGiven: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Treatment / Care Given
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Bed rest, fluids given, observed for 1 hour..."
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="parentCall"
              checked={formData.parentContacted}
              onChange={(e) => setFormData({ ...formData, parentContacted: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="parentCall" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Guardian / Parent informed via telephone call
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white">
              Save Clinic Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

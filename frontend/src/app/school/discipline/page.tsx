'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Eye,
  FileText,
  PhoneCall,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface IncidentItem {
  id: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  incidentDate: string;
  infractionType: string;
  description: string;
  sanction: string;
  reportedBy: string;
  status: 'ACTIVE' | 'RESOLVED' | 'APPEALED';
  parentNotified: boolean;
  actionTaken?: string;
}

export default function DisciplinePage() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    admissionNumber: '',
    className: '',
    infractionType: 'MISCONDUCT',
    description: '',
    sanction: 'DETENTION',
    reportedBy: '',
    parentNotified: false,
  });

  const filtered = incidents.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.infractionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: IncidentItem = {
      id: `inc-${Date.now()}`,
      studentName: formData.studentName,
      admissionNumber: formData.admissionNumber,
      className: formData.className,
      incidentDate: new Date().toISOString().split('T')[0],
      infractionType: formData.infractionType,
      description: formData.description,
      sanction: formData.sanction,
      reportedBy: formData.reportedBy,
      status: 'ACTIVE',
      parentNotified: formData.parentNotified,
      actionTaken: 'Pending review by disciplinary committee',
    };

    setIncidents([newItem, ...incidents]);
    setIsModalOpen(false);
  };

  const handleResolve = (id: string) => {
    setIncidents(
      incidents.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVED' } : inc))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                School Operations & Conduct
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="destructive">Discipline Registry</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Student Conduct & Sanctions
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Log behavioral infractions, record disciplinary committee sanctions, and track guardian notifications.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Log Infraction</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Incidents</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {incidents.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Active Sanctions</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">
                {incidents.filter((i) => i.status === 'ACTIVE').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Resolved Cases</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {incidents.filter((i) => i.status === 'RESOLVED').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Guardian Contacted</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {incidents.filter((i) => i.parentNotified).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student, infraction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="RESOLVED">Resolved</option>
              <option value="APPEALED">Appealed</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                  <th className="p-3.5">Student / Class</th>
                  <th className="p-3.5">Infraction Type</th>
                  <th className="p-3.5">Incident Details</th>
                  <th className="p-3.5">Sanction Imposed</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Parent Informed</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filtered.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {inc.studentName}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {inc.admissionNumber} • {inc.className}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge variant="outline" className="font-semibold text-[10px]">
                        {inc.infractionType}
                      </Badge>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <p className="line-clamp-2 text-slate-700 dark:text-slate-300">
                        {inc.description}
                      </p>
                      {inc.actionTaken && (
                        <span className="block text-[10px] text-blue-600 mt-0.5">
                          Action: {inc.actionTaken}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-semibold text-rose-600">{inc.sanction}</td>

                    <td className="p-3.5 text-slate-500">{inc.incidentDate}</td>

                    <td className="p-3.5">
                      {inc.parentNotified ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="h-3 w-3" /> Informed
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <Badge
                        variant={inc.status === 'ACTIVE' ? 'destructive' : 'success'}
                        className="text-[10px]"
                      >
                        {inc.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 text-right">
                      {inc.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(inc.id)}
                          className="text-xs h-7 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Log Infraction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Disciplinary Incident"
        description="Record a student infraction and specify the sanction imposed"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Student *
            </label>
            <select
              value={formData.studentName}
              onChange={(e) => {
                const sName = e.target.value;
                setFormData({
                  ...formData,
                  studentName: sName,
                  admissionNumber: sName === 'Kwame Mensah' ? 'TLS-2025-001' : 'TLS-2025-003',
                  className: sName === 'Kwame Mensah' ? 'JHS 1 (Gold)' : 'Class 5 (A)',
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              <option value="Kwame Mensah">Kwame Mensah (TLS-2025-001) - JHS 1</option>
              <option value="Kofi Boateng">Kofi Boateng (TLS-2025-003) - Class 5</option>
              <option value="Yaw Addo">Yaw Addo (TLS-2025-005) - Class 5</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Infraction Type *
              </label>
              <select
                value={formData.infractionType}
                onChange={(e) => setFormData({ ...formData, infractionType: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="MISCONDUCT">Classroom Misconduct</option>
                <option value="TRUANCY">Truancy / Skipping Class</option>
                <option value="BULLYING">Bullying / Harassment</option>
                <option value="LATENESS">Chronic Lateness</option>
                <option value="UNIFORM">Uniform Non-Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sanction Assigned *
              </label>
              <select
                value={formData.sanction}
                onChange={(e) => setFormData({ ...formData, sanction: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="VERBAL_WARNING">Verbal Warning</option>
                <option value="WRITTEN_WARNING">Written Reprimand</option>
                <option value="DETENTION">After-School Detention</option>
                <option value="COMMUNITY_SERVICE">Campus Cleaning</option>
                <option value="SUSPENSION">External Suspension (3 Days)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Incident Circumstances *
            </label>
            <textarea
              required
              rows={3}
              placeholder="State what occurred, witnesses, and time of day..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyParent"
              checked={formData.parentNotified}
              onChange={(e) => setFormData({ ...formData, parentNotified: e.target.checked })}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="notifyParent" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Notify parents / guardians via SMS & Parent Portal alert
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
            <Button type="submit" className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white">
              Log Infraction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

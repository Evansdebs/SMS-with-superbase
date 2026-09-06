'use client';

import React, { useState } from 'react';
import {
  Bus,
  Plus,
  Search,
  MapPin,
  Phone,
  User,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface RouteItem {
  id: string;
  name: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedStudents: number;
  pickupPoints: string[];
  feePerTerm: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function TransportPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    capacity: 30,
    pickupPoints: '',
    feePerTerm: 450,
  });

  const filtered = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RouteItem = {
      id: `rt-${Date.now()}`,
      name: formData.name,
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone,
      capacity: Number(formData.capacity),
      assignedStudents: 0,
      pickupPoints: formData.pickupPoints.split(',').map((s) => s.trim()),
      feePerTerm: Number(formData.feePerTerm),
      status: 'ACTIVE',
    };
    setRoutes([...routes, created]);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Logistics & Fleet Operations
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Transport Network</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              School Bus Transport & Routes
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage morning and evening commuter routes, driver contacts, vehicle plate numbers, and passenger capacity.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Route</span>
          </Button>
        </div>

        {/* Fleet KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Active Bus Routes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {routes.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Student Commuters</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {routes.reduce((s, r) => s + r.assignedStudents, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Fleet Capacity</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {routes.reduce((s, r) => s + r.capacity, 0)} Seats
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Fleet Utilization</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {routes.reduce((s, r) => s + r.capacity, 0) > 0
                  ? Math.round(
                      (routes.reduce((s, r) => s + r.assignedStudents, 0) /
                        routes.reduce((s, r) => s + r.capacity, 0)) *
                        100
                    )
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search route, driver, plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Routes Grid */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center max-w-sm mx-auto border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bus className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              No Bus Routes Configured
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Transport management is clean with zero dummy routes. Add vehicles and driver allocations.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create Bus Route
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((route) => {
            const occupancy = Math.round((route.assignedStudents / route.capacity) * 100);

            return (
              <Card
                key={route.id}
                className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="font-mono text-[10px] mb-1">
                        {route.vehicleNumber}
                      </Badge>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                        {route.name}
                      </CardTitle>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {route.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Driver:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {route.driverName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> Contact:
                      </span>
                      <a
                        href={`tel:${route.driverPhone}`}
                        className="font-mono font-semibold text-blue-600 hover:underline"
                      >
                        {route.driverPhone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" /> Term Fee:
                      </span>
                      <span className="font-bold font-mono">GHS {route.feePerTerm}</span>
                    </div>
                  </div>

                  {/* Seat Occupancy Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-500">Seat Capacity</span>
                      <span className="font-mono font-semibold">
                        {route.assignedStudents} / {route.capacity} ({occupancy}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                  </div>

                  {/* Stops */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Designated Pickup Points:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {route.pickupPoints.map((pt, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>

      {/* Add Route Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Bus Transport Route"
        description="Add a new transit route and assign vehicle registration"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Route Name *
            </label>
            <Input
              required
              placeholder="e.g. Route 4 — Spintex & Baatsona"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vehicle Plate Number *
              </label>
              <Input
                required
                placeholder="e.g. GN-5510-23"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Bus Seating Capacity *
              </label>
              <Input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Driver Name *
              </label>
              <Input
                required
                placeholder="e.g. Mr. Peter Kwakye"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Driver Telephone *
              </label>
              <Input
                required
                placeholder="e.g. +233 24 000 0000"
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Designated Stops (comma separated) *
            </label>
            <Input
              required
              placeholder="e.g. Shell Signboard, Kotobabi Junction, Manet Gate"
              value={formData.pickupPoints}
              onChange={(e) => setFormData({ ...formData, pickupPoints: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Term Transport Fee (GHS)
            </label>
            <Input
              type="number"
              value={formData.feePerTerm}
              onChange={(e) => setFormData({ ...formData, feePerTerm: Number(e.target.value) })}
            />
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
            <Button type="submit" className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
              Save Route
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

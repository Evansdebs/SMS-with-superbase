'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Monitor,
  Wrench,
  Building,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Tag,
  DollarSign,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface AssetItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  location: string;
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  quantity: number;
  purchasePrice: number;
  lastMaintenance: string;
}

export default function InventoryPage() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'IT_EQUIPMENT',
    serialNumber: '',
    location: 'Main Block',
    condition: 'NEW' as AssetItem['condition'],
    quantity: 1,
    purchasePrice: 1000,
  });

  const filtered = assets.filter((ast) => {
    const matchesSearch =
      ast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || ast.category === categoryFilter;
    const matchesCondition = conditionFilter === 'ALL' || ast.condition === conditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AssetItem = {
      id: `ast-${Date.now()}`,
      name: newAsset.name,
      category: newAsset.category,
      serialNumber: newAsset.serialNumber || `SN-${String(Date.now()).slice(-6)}`,
      location: newAsset.location,
      condition: newAsset.condition,
      quantity: Number(newAsset.quantity),
      purchasePrice: Number(newAsset.purchasePrice),
      lastMaintenance: new Date().toISOString().split('T')[0],
    };
    setAssets([created, ...assets]);
    setIsModalOpen(false);
  };

  const getConditionStyle = (cond: AssetItem['condition']) => {
    switch (cond) {
      case 'NEW':
      case 'GOOD':
        return 'success';
      case 'FAIR':
        return 'warning';
      case 'POOR':
      case 'DAMAGED':
      default:
        return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Facilities & Fixed Assets
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="warning">Inventory Ledger</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              School Assets & Equipment
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track campus equipment, computers, laboratory apparatus, classroom furniture, and maintenance status.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Register Asset</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Asset Types</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {assets.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Asset Units</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {assets.reduce((s, a) => s + a.quantity, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Book Valuation</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                GHS {assets.reduce((s, a) => s + a.purchasePrice * a.quantity, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Maintenance Needed</div>
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1">
                {assets.filter((a) => a.condition === 'FAIR' || a.condition === 'POOR').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search asset, serial no, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="IT_EQUIPMENT">IT & Computers</option>
              <option value="LAB_APPARATUS">Laboratory Apparatus</option>
              <option value="FURNITURE">Classroom Furniture</option>
              <option value="VEHICLE">Vehicles & Transport</option>
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
            >
              <option value="ALL">All Conditions</option>
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair / Needs Service</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>
        </div>

        {/* Assets Table */}
        <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                  <th className="p-3.5">Asset Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Location</th>
                  <th className="p-3.5">Serial / Tag</th>
                  <th className="p-3.5 text-center">Quantity</th>
                  <th className="p-3.5">Unit Price</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Serviced On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filtered.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {ast.name}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px]">
                        {ast.category}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {ast.location}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {ast.serialNumber}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold">
                      {ast.quantity}
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                      GHS {ast.purchasePrice.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <Badge variant={getConditionStyle(ast.condition)} className="text-[10px]">
                        {ast.condition}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-slate-500">{ast.lastMaintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Register Asset Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Fixed Asset"
        description="Add a new physical asset or apparatus into the school inventory"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Asset Name & Model *
            </label>
            <Input
              required
              placeholder="e.g. HP LaserJet Pro Multifunction Printer"
              value={newAsset.name}
              onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={newAsset.category}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="IT_EQUIPMENT">IT & Computer Lab</option>
                <option value="LAB_APPARATUS">Laboratory Apparatus</option>
                <option value="FURNITURE">Furniture & Desks</option>
                <option value="VEHICLE">Transportation Fleet</option>
                <option value="SPORTS">Athletics & Sports Kits</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Serial / Tag ID
              </label>
              <Input
                placeholder="e.g. SN-HPL-4401"
                value={newAsset.serialNumber}
                onChange={(e) => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location *
              </label>
              <Input
                required
                placeholder="e.g. Admin Office"
                value={newAsset.location}
                onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quantity *
              </label>
              <Input
                type="number"
                min={1}
                required
                value={newAsset.quantity}
                onChange={(e) => setNewAsset({ ...newAsset, quantity: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Unit Cost (GHS)
              </label>
              <Input
                type="number"
                value={newAsset.purchasePrice}
                onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: Number(e.target.value) })}
              />
            </div>
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
            <Button type="submit" className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white">
              Save Asset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

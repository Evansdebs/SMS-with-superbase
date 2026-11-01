'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function AdminReportsPage() {
  const [tenantsReport, setTenantsReport] = useState<any[]>([]);
  const [financeReport, setFinanceReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [tenantsRes, finRes] = await Promise.all([
        apiRequest('/admin/reports/tenants'),
        apiRequest('/admin/reports/finance'),
      ]);
      setTenantsReport(tenantsRes || []);
      setFinanceReport(finRes || []);
    } catch (err: any) {
      console.warn('Could not load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="h-6 w-6 text-amber-500" />
              <span>Platform Reports &amp; Data Export</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Downloadable audit statements, school tenant census reports, and subscription statements.
            </p>
          </div>

          <Button
            onClick={fetchReports}
            variant="outline"
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 self-start shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Reports
          </Button>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tenant Census Export Card */}
          <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">REPORT_01</span>
                <Badge variant="success">READY</Badge>
              </div>
              <CardTitle className="text-base text-slate-900 mt-1">School Tenants Directory Report</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Complete roster of all registered school tenants, code mappings, student counts, teacher counts, and account statuses.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div>Total Records: <span className="font-bold text-slate-900">{tenantsReport.length} Schools</span></div>
                <div>Format: <span className="font-mono text-slate-500">Comma-Separated Values (.csv)</span></div>
              </div>
              <Button
                onClick={() => downloadCSV(tenantsReport, 'edusphere_tenants_report')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 shadow-sm"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Tenants CSV
              </Button>
            </CardContent>
          </Card>

          {/* Financial Statement Export Card */}
          <Card className="bg-white border-slate-200 shadow-sm flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">REPORT_02</span>
                <Badge variant="success">READY</Badge>
              </div>
              <CardTitle className="text-base text-slate-900 mt-1">Platform Revenue &amp; Billing Statement</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Monthly Recurring Revenue summary, YTD collections, and tier subscription counts.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div>Financial Periods: <span className="font-bold text-slate-900">Fiscal Year 2026</span></div>
                <div>Format: <span className="font-mono text-slate-500">Comma-Separated Values (.csv)</span></div>
              </div>
              <Button
                onClick={() => downloadCSV(financeReport, 'edusphere_revenue_statement')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 shadow-sm"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Finance CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview: Tenants Directory Preview */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Preview: School Tenants Data</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live sample of the dataset exported in the report above.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">School Code</th>
                    <th className="py-2.5 px-3">School Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Students</th>
                    <th className="py-2.5 px-3">Teachers</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenantsReport.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{t.schoolCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{t.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.email || 'N/A'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.phone || 'N/A'}</td>
                      <td className="py-2.5 px-3">{t.students}</td>
                      <td className="py-2.5 px-3">{t.teachers}</td>
                      <td className="py-2.5 px-3">
                        <Badge variant={t.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

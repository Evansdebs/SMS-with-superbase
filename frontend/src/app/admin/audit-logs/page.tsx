'use client';

import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const actionParam = actionFilter !== 'ALL' ? `&action=${actionFilter}` : '';
      const res = await apiRequest(`/admin/audit-logs?limit=50${actionParam}`);
      if (res?.data) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.warn('Could not fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const filteredLogs = logs.filter((log) => {
    const action = (log.action || '').toLowerCase();
    const entityType = (log.entityType || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return action.includes(query) || entityType.includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <ScrollText className="h-6 w-6 text-amber-500" />
              <span>System Audit Logs</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tamper-evident system activity log tracking administrative events, tenant configurations, and security actions.
            </p>
          </div>

          <Button
            onClick={fetchLogs}
            variant="outline"
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 self-start shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Logs
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'SUPER_ADMIN_LOGIN', 'CREATE_SCHOOL_WIZARD', 'UPDATE_TENANT_CONFIG', 'UPDATE_SCHOOL_STATUS', 'UPDATE_USER_STATUS'].map((act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  actionFilter === act
                    ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search action or entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-slate-200 text-slate-900 text-xs h-8"
            />
          </div>
        </div>

        {/* Logs Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Entity ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-4 text-amber-700 font-sans font-medium">
                        {log.entityType || 'SYSTEM'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 truncate max-w-[150px]">
                        {log.entityId || 'N/A'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-medium ${
                            log.result === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {log.result === 'SUCCESS' ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{log.result || 'SUCCESS'}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-xs font-sans">Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal: JSON Payload Inspector */}
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event: ${selectedLog?.action || ''}`}
        >
          {selectedLog && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Event ID</span>
                  <span className="font-mono text-slate-900">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
                  <span className="text-slate-900">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Entity</span>
                  <span className="text-slate-900">{selectedLog.entityType} ({selectedLog.entityId || 'N/A'})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Actor User ID</span>
                  <span className="font-mono truncate block text-slate-900">{selectedLog.userId || 'Super Admin Root'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1 font-semibold">Event Payload Details</span>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setSelectedLog(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

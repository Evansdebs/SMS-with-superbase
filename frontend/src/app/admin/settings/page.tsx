'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  AlertTriangle,
  RefreshCw,
  Save,
  PlusCircle,
  Zap,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { apiRequest } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [security, setSecurity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [triggeringBackup, setTriggeringBackup] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const [settingsRes, keysRes, secRes] = await Promise.all([
        apiRequest('/admin/settings'),
        apiRequest('/admin/settings/api-keys'),
        apiRequest('/admin/settings/security'),
      ]);
      setSettings(settingsRes);
      setApiKeys(keysRes || []);
      setSecurity(secRes || null);
    } catch (err: any) {
      console.warn('Could not load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await apiRequest('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      showNotification('success', 'Global platform settings updated');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestIntegration = async (type: string) => {
    setTestingIntegration(type);
    try {
      const res = await apiRequest('/admin/settings/integrations/test', {
        method: 'POST',
        body: JSON.stringify({ type }),
      });
      showNotification('success', res.message || `${type.toUpperCase()} integration ping successful (200 OK)`);
    } catch (err: any) {
      showNotification('error', err.message || `Integration test for ${type} failed`);
    } finally {
      setTestingIntegration(null);
    }
  };

  const handleTriggerBackup = async () => {
    setTriggeringBackup(true);
    try {
      const res = await apiRequest('/admin/settings/backups/trigger', { method: 'POST' });
      showNotification('success', `Platform database snapshot completed: ${res.backupId}`);
      fetchAllSettings();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to trigger backup');
    } finally {
      setTriggeringBackup(false);
    }
  };

  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const res = await apiRequest('/admin/settings/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      setGeneratedKey(res);
      setNewKeyName('');
      fetchAllSettings();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to generate API key');
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    try {
      await apiRequest(`/admin/settings/api-keys/${id}`, { method: 'DELETE' });
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      showNotification('success', 'API key revoked');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to revoke API key');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <Settings className="h-6 w-6 text-amber-500" />
              <span>Global Settings &amp; Platform Governance</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Platform identity, system maintenance mode, API integrations, and security monitoring.
            </p>
          </div>

          <Button
            onClick={fetchAllSettings}
            variant="outline"
            className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs h-9 self-start shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Reload Config
          </Button>
        </div>

        {notification && (
          <div
            className={`p-3.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 ml-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Maintenance Mode Alert Card */}
        <Card className={`border shadow-sm ${settings?.maintenanceMode?.enabled ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
          <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${settings?.maintenanceMode?.enabled ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">System Maintenance Mode</h3>
                  <Badge variant={settings?.maintenanceMode?.enabled ? 'warning' : 'secondary'}>
                    {settings?.maintenanceMode?.enabled ? 'ENABLED' : 'DISABLED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">
                  {settings?.maintenanceMode?.enabled
                    ? 'All school tenant portals are currently blocked with the maintenance screen. Only Super Admins can access.'
                    : 'System is fully operational. When enabled, non-superadmin users are presented with a maintenance banner.'}
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  maintenanceMode: {
                    ...settings?.maintenanceMode,
                    enabled: !settings?.maintenanceMode?.enabled,
                  },
                });
              }}
              variant={settings?.maintenanceMode?.enabled ? 'outline' : 'default'}
              className={`text-xs h-9 px-4 shadow-sm ${settings?.maintenanceMode?.enabled ? 'border-amber-400 text-amber-800 hover:bg-amber-100' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'}`}
            >
              {settings?.maintenanceMode?.enabled ? 'Disable Maintenance' : 'Enable Maintenance Mode'}
            </Button>
          </CardContent>
        </Card>

        {/* Global Platform Identity Settings */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Platform Identity &amp; Localization</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Configure system title, support channel, and default currency parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Platform Brand Name</label>
                  <Input
                    value={settings?.platformName || ''}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Support Desk Email</label>
                  <Input
                    type="email"
                    value={settings?.supportEmail || ''}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Default Currency</label>
                  <select
                    value={settings?.defaultCurrency || 'USD'}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                  >
                    <option value="USD">USD ($ - United States Dollar)</option>
                    <option value="GHS">GHS (GH₵ - Ghana Cedi)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Platform Timezone</label>
                  <select
                    value={settings?.defaultTimezone || 'Africa/Accra'}
                    onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md text-slate-900 text-xs h-9 px-3 focus:border-slate-400"
                  >
                    <option value="Africa/Accra">Africa/Accra (GMT +00:00)</option>
                    <option value="UTC">UTC</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT +01:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Integration Status & Health Checks */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Platform Integrations &amp; Gateways
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SMS Gateway */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">SMS_GATEWAY</span>
                  <Badge variant="success">CONNECTED</Badge>
                </div>
                <CardTitle className="text-sm text-slate-900 mt-1">Arkesel / Hubtel SMS</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Sends automated attendance and fee alert SMS to parents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="text-xs text-slate-700 flex justify-between py-1.5 border-t border-slate-100">
                  <span className="text-slate-500">SMS Balance:</span>
                  <span className="font-bold text-amber-700">3,450 Credits</span>
                </div>
                <Button
                  onClick={() => handleTestIntegration('sms')}
                  disabled={testingIntegration === 'sms'}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-8"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {testingIntegration === 'sms' ? 'Testing Connection...' : 'Test SMS Gateway'}
                </Button>
              </CardContent>
            </Card>

            {/* Email Gateway */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">SMTP_DISPATCH</span>
                  <Badge variant="success">ACTIVE</Badge>
                </div>
                <CardTitle className="text-sm text-slate-900 mt-1">Resend / SMTP Relay</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  System invites, report card emails, and password resets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="text-xs text-slate-700 flex justify-between py-1.5 border-t border-slate-100">
                  <span className="text-slate-500">Daily Quota:</span>
                  <span className="font-bold text-slate-900">1,240 / 50,000</span>
                </div>
                <Button
                  onClick={() => handleTestIntegration('email')}
                  disabled={testingIntegration === 'email'}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-8"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {testingIntegration === 'email' ? 'Testing Connection...' : 'Test Email Dispatch'}
                </Button>
              </CardContent>
            </Card>

            {/* Cloud Storage */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">STORAGE_BUCKETS</span>
                  <Badge variant="success">ONLINE</Badge>
                </div>
                <CardTitle className="text-sm text-slate-900 mt-1">Supabase S3 Buckets</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Secure private buckets for documents, photos, and report PDFs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="text-xs text-slate-700 flex justify-between py-1.5 border-t border-slate-100">
                  <span className="text-slate-500">Storage Used:</span>
                  <span className="font-bold text-slate-900">1.42 GB</span>
                </div>
                <Button
                  onClick={() => handleTestIntegration('storage')}
                  disabled={testingIntegration === 'storage'}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 text-xs h-8"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {testingIntegration === 'storage' ? 'Testing Connection...' : 'Verify Bucket Access'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Management & Security Monitoring Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys Management */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base text-slate-900">Platform API Keys</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Authorized programmatic keys for external integrations and webhooks.
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-8 shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Generate Key
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{k.name}</div>
                      <div className="font-mono text-[10px] text-amber-700 mt-0.5">{k.keyPreview}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Created: {new Date(k.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRevokeApiKey(k.id)}
                      variant="outline"
                      className="border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs h-7"
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Database Backup & Security Metrics */}
          <Card className="bg-white border-slate-200 shadow-sm space-y-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">Database Backup &amp; Security Health</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Snapshot persistence and security rule status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Automated Snapshot Vault</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Last Snapshot: {new Date(settings?.backup?.lastBackupDate || Date.now()).toLocaleString()}
                  </div>
                </div>
                <Button
                  onClick={handleTriggerBackup}
                  disabled={triggeringBackup}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs h-8"
                >
                  <Database className="h-3.5 w-3.5 mr-1 text-amber-400" />
                  {triggeringBackup ? 'Backing Up...' : 'Trigger Backup'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Sessions</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{security?.activeSessions || 18}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Blocked Malicious IPs</div>
                  <div className="text-lg font-bold text-rose-600 mt-0.5">{security?.blockedIps?.length || 1} IPs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal: Generate API Key */}
        <Modal
          isOpen={isApiKeyModalOpen}
          onClose={() => {
            setIsApiKeyModalOpen(false);
            setGeneratedKey(null);
          }}
          title="Generate Platform API Key"
        >
          {generatedKey ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                Key generated successfully. Please copy it now; you will not be able to see it again!
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-slate-500 font-semibold">Your Full Secret Key</label>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-amber-300 break-all select-all">
                  {generatedKey.fullKey}
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => {
                    setIsApiKeyModalOpen(false);
                    setGeneratedKey(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs h-8 font-semibold shadow-sm"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerateApiKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Key Identifier / Name</label>
                <Input
                  required
                  placeholder="e.g. Accounting System Webhook"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="border-slate-200 text-slate-600 text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs h-9 px-4 shadow-sm"
                >
                  Generate Key
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </main>
    </div>
  );
}

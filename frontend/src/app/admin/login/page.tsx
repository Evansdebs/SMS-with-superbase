'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setStoredSession, apiRequest } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your administrator email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res?.access_token) {
        throw new Error(res?.message || 'Authentication failed. Please verify credentials.');
      }

      setStoredSession({
        token: res.access_token,
        user: res.user,
      });

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-xl relative z-10">
        <CardHeader className="space-y-1.5 text-center pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shadow-sm mb-1">
            <ShieldAlert className="h-6 w-6 text-slate-300" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Platform Super Admin
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Multi-Tenant Platform Control • Restricted Access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-300">
                Super Admin Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@platform.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus:border-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-slate-300">
                Master Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white h-10 text-sm focus:border-slate-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-slate-100 hover:bg-white text-slate-950 font-semibold shadow-sm transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In as Super Admin'}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              ← Platform Home
            </Link>
            <Link href="/school/login" className="hover:text-white transition-colors">
              School Portal →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

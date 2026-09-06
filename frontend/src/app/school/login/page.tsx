'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, ArrowRight, Building2, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { setStoredSession, apiRequest } from '@/lib/api';

function SchoolLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schoolCode, setSchoolCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setSchoolCode(code.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const code = schoolCode.trim().toUpperCase();

    if (!code || !email.trim() || !password) {
      setError('Please provide your School Code, email/username, and password.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest('/auth/school/login', {
        method: 'POST',
        body: JSON.stringify({
          schoolCode: code,
          email: email.trim(),
          password,
        }),
      });

      if (!res?.access_token) {
        throw new Error(res?.message || 'Authentication failed. Please verify your credentials.');
      }

      setStoredSession({
        token: res.access_token,
        user: res.user,
      });

      router.push('/school/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid School Code or login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-1">
          <GraduationCap className="h-6 w-6 text-slate-100" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          School Portal Login
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your institutional School Code and verified credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="schoolCode" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                School Code *
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Tenant Identifier</span>
            </div>
            <Input
              id="schoolCode"
              type="text"
              placeholder="e.g. SCH001"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              required
              className="uppercase font-mono font-semibold tracking-wider h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email or Username *
            </label>
            <Input
              id="email"
              type="text"
              placeholder="user@school.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password *
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-slate-900 hover:bg-slate-850 text-white font-semibold shadow-sm transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In to School Portal'}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Platform Home
          </Link>
          <Link href="/admin/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Super Admin Login →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SchoolLogin() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-slate-500 text-xs">Loading portal...</div>}>
        <SchoolLoginForm />
      </Suspense>
    </div>
  );
}

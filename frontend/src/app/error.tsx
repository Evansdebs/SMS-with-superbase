'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Structured client error logging
    console.error('Next.js Page Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-600/10 via-amber-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900/80 border border-rose-500/20 shadow-2xl mb-8 text-rose-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          An Unexpected Error Occurred
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          The application encountered a runtime issue while processing your request. Don't worry, your data has not been lost.
        </p>

        {error.digest && (
          <div className="inline-block px-3 py-1 mb-6 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            Error Digest: <span className="text-slate-200">{error.digest}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Retry Request
          </button>
          <Link
            href="/school/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

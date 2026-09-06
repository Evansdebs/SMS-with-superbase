'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Critical Application Error</h2>
          <p className="text-sm text-slate-400 mb-6">
            A critical system error occurred. Please try reloading the application.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

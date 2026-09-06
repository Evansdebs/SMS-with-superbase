import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl mb-8 relative">
          <span className="text-4xl font-extrabold bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            404
          </span>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-sm -z-10" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The resource or page you are looking for has been moved, archived, or does not exist in this portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/school/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            School Dashboard
          </Link>
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-all"
          >
            Admin Portal
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-semibold transition-all"
          >
            Home
          </Link>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 text-xs text-slate-600">
          EduSuite Cloud • Multi-Tenant School Management Platform
        </div>
      </div>
    </div>
  );
}

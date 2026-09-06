import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: "🏫",
      title: "Multi-School SaaS Platform",
      desc: "Multiple independent schools sharing one secure platform. Each school logs in with its unique School Code.",
      color: "blue",
    },
    {
      icon: "🔒",
      title: "Complete Tenant Isolation",
      desc: "Defense-in-depth: NestJS guards, PostgreSQL RLS, and frontend-level session scoping. Zero cross-tenant data leaks.",
      color: "amber",
    },
    {
      icon: "📚",
      title: "Ghana Education System",
      desc: "Built-in KG → Primary → JHS structure. BECE 9-point stanine grading, automatic aggregate calculation.",
      color: "emerald",
    },
    {
      icon: "📊",
      title: "Gradebook & Report Cards",
      desc: "CA (50%) + Exam (50%) entry per subject. One-click printable official terminal report cards.",
      color: "indigo",
    },
    {
      icon: "✅",
      title: "Attendance Register",
      desc: "Daily class-by-class register with Present, Absent, Late, and Excused status tracking.",
      color: "rose",
    },
    {
      icon: "👨‍👩‍👧",
      title: "Parent & Guardian Link",
      desc: "Parents linked to enrolled children. Full contact directory with child class information.",
      color: "purple",
    },
    {
      icon: "🧑‍🏫",
      title: "Teacher Faculty Management",
      desc: "Employee IDs, qualification records, assigned subjects and class assignments.",
      color: "cyan",
    },
    {
      icon: "🛡️",
      title: "Super Admin Control",
      desc: "Platform-wide visibility. Create schools with 8-step wizard, suspend or activate school accounts.",
      color: "orange",
    },
  ];

  const stats = [
    { number: "∞", label: "Schools Supported" },
    { number: "100%", label: "Tenant Isolation" },
    { number: "15+", label: "Management Modules" },
    { number: "RLS", label: "DB-Level Security" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-slate-800 selection:text-white">
      {/* ── Subdued Architectural Grid Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ── Navbar ── */}
      <nav className="relative z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-sm shadow-sm">
              <span>S</span>
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">EduSphere</span>
              <span className="text-[10px] text-slate-400 block leading-none">Enterprise School Management</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/login"
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Platform Super Admin
            </Link>
            <Link
              href="/school/login"
              className="text-xs font-semibold bg-slate-100 hover:bg-white text-slate-950 px-4 py-1.5 rounded-lg shadow-sm transition-all"
            >
              School Portal →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-20 pb-20 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/80 text-xs text-slate-300 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Production-Ready Multi-Tenant Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
          Unified Platform.
          <span className="block text-slate-300">
            Absolute Tenant Isolation.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          An enterprise-grade School Management System engineered for security, scale, and compliance. 
          Each institution operates in strict isolation enforced at the application, API, and database layers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/school/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-sm shadow-sm transition-all"
          >
            <span>🏫</span>
            <span>Enter School Portal</span>
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-200 font-medium text-sm transition-all"
          >
            <span>🛡️</span>
            <span>Platform Super Admin</span>
          </Link>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-md p-4 sm:p-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{s.number}</div>
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Complete School Management Suite</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Everything a school needs — from student admissions to terminal report cards — in one cohesive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl bg-slate-900/50 border border-slate-800/60 p-5 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/50"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-blue-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture Section ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-2">Multi-Tenant Architecture</h2>
          <p className="text-sm text-slate-400 mb-6">
            Defense-in-depth isolation enforced at every layer of the stack.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Layer 1: Frontend</div>
              <p className="text-xs text-slate-400">Session-scoped API client. School Code + JWT in every request. School-specific data only.</p>
            </div>
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Layer 2: API (NestJS)</div>
              <p className="text-xs text-slate-400">SchoolMembership Guard validates membership on every request. Super Admin isolated to platform routes.</p>
            </div>
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Layer 3: Database (PostgreSQL)</div>
              <p className="text-xs text-slate-400">Row-Level Security (RLS) policies enforce schoolId on every table query.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Enterprise School Administration</h2>
        <p className="text-sm text-slate-400 mb-6">
          Provision, manage, and scale independent school instances with comprehensive academic, financial, and operational isolation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin/login"
            className="px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-sm shadow-sm transition-all"
          >
            🛡️ Access Super Admin Panel
          </Link>
          <Link
            href="/school/login"
            className="px-6 py-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 text-slate-200 font-medium text-sm transition-all"
          >
            School Staff Portal
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2025/2026 EduSphere — Multi-Tenant School Management System</span>
          <span className="font-mono text-[10px] text-slate-700">
            NestJS • Next.js 16 • PostgreSQL • Prisma • Supabase Auth
          </span>
        </div>
      </footer>
    </div>
  );
}

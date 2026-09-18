export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  domain: 'academics' | 'operations' | 'finance' | 'admin';
  module: string;
}

export interface RoleDefinition {
  id: string;
  label: string;
  description: string;
  isSystemRole?: boolean;
  color: string;
}

export const SYSTEM_ROLES: RoleDefinition[] = [
  {
    id: 'SCHOOL_ADMIN',
    label: 'School Administrator',
    description: 'Executive principal, headmaster, or administrator with full institutional authority.',
    color: 'indigo',
    isSystemRole: true,
  },
  {
    id: 'TEACHER',
    label: 'Teacher / Instructor',
    description: 'Class instructors managing subjects, assignments, attendance, and student report card results.',
    color: 'blue',
  },
  {
    id: 'ACCOUNTANT',
    label: 'Accountant / Bursar',
    description: 'Financial staff handling fee collection, student invoices, receipts, and school billing.',
    color: 'emerald',
  },
  {
    id: 'LIBRARIAN',
    label: 'Librarian',
    description: 'Library custodian overseeing book collections, cataloging, lending, and student returns.',
    color: 'amber',
  },
  {
    id: 'HEALTH_OFFICER',
    label: 'Health Officer / Nurse',
    description: 'Medical and sick bay personnel recording student visits, triage, and prescriptions.',
    color: 'rose',
  },
  {
    id: 'TRANSPORT_OFFICER',
    label: 'Transport Officer',
    description: 'Logistics coordinator managing school buses, pickup routes, drivers, and manifests.',
    color: 'cyan',
  },
  {
    id: 'DISCIPLINE_MASTER',
    label: 'Discipline Master / Dean',
    description: 'Disciplinary authority tracking infractions, sanctions, detention, and conduct.',
    color: 'purple',
  },
  {
    id: 'GENERAL_STAFF',
    label: 'General Staff',
    description: 'Administrative assistants and operational staff requiring basic school directory and notice access.',
    color: 'slate',
  },
  {
    id: 'PARENT',
    label: 'Parent / Guardian',
    description: 'Guardians checking ward academic performance, attendance records, and fee payments.',
    color: 'teal',
  },
  {
    id: 'STUDENT',
    label: 'Student',
    description: 'Enrolled students checking homework, class timetables, attendance, and exam grades.',
    color: 'violet',
  },
];

export const PERMISSIONS_CATALOG: PermissionDefinition[] = [
  // ── ACADEMICS & INSTRUCTION ──────────────────────────────────────────────
  {
    id: 'students.view',
    name: 'View Students Directory',
    description: 'Browse enrolled students, admission details, and profile records.',
    domain: 'academics',
    module: 'Students',
  },
  {
    id: 'students.manage',
    name: 'Manage Student Admissions',
    description: 'Create new student enrollments, edit biographical data, and process transfers.',
    domain: 'academics',
    module: 'Students',
  },
  {
    id: 'teachers.view',
    name: 'View Teachers Directory',
    description: 'Access staff teaching lists, contact details, and department allocations.',
    domain: 'academics',
    module: 'Teachers',
  },
  {
    id: 'teachers.manage',
    name: 'Manage Teachers & Allocations',
    description: 'Assign teachers to classes, subjects, and departmental leadership.',
    domain: 'academics',
    module: 'Teachers',
  },
  {
    id: 'academics.view',
    name: 'View Classes & Curriculum',
    description: 'View class rosters, streams, academic departments, and subjects.',
    domain: 'academics',
    module: 'Classes & Subjects',
  },
  {
    id: 'academics.manage',
    name: 'Manage Classes & Subjects',
    description: 'Configure academic departments, class streams, and subject syllabi.',
    domain: 'academics',
    module: 'Classes & Subjects',
  },
  {
    id: 'timetable.view',
    name: 'View Timetable Schedule',
    description: 'View weekly schedules, periods, class timetables, and teacher allocations.',
    domain: 'academics',
    module: 'Timetable',
  },
  {
    id: 'timetable.manage',
    name: 'Manage Timetable',
    description: 'Create, schedule, and update lesson periods, classrooms, and teacher slots.',
    domain: 'academics',
    module: 'Timetable',
  },
  {
    id: 'attendance.view',
    name: 'View Attendance Records',
    description: 'Review daily attendance records, summaries, and absence percentages.',
    domain: 'academics',
    module: 'Attendance',
  },
  {
    id: 'attendance.record',
    name: 'Record Daily Attendance',
    description: 'Mark students as Present, Absent, Late, or Excused for assigned classes.',
    domain: 'academics',
    module: 'Attendance',
  },
  {
    id: 'assignments.view',
    name: 'View Class Assignments',
    description: 'Inspect assigned class homework, past submissions, and due dates.',
    domain: 'academics',
    module: 'Assignments',
  },
  {
    id: 'assignments.manage',
    name: 'Create & Grade Assignments',
    description: 'Issue new homework, collect submissions, and enter feedback and marks.',
    domain: 'academics',
    module: 'Assignments',
  },
  {
    id: 'results.view',
    name: 'View Examination Results',
    description: 'Access academic scores, term averages, and class grade summaries.',
    domain: 'academics',
    module: 'Results & Grading',
  },
  {
    id: 'results.record',
    name: 'Record Scores & Stanine',
    description: 'Input raw assessment and exam marks, calculate Stanine grades and ranks.',
    domain: 'academics',
    module: 'Results & Grading',
  },
  {
    id: 'results.publish',
    name: 'Approve & Publish Report Cards',
    description: 'Certify term results and make official terminal report cards accessible.',
    domain: 'academics',
    module: 'Results & Grading',
  },

  // ── OPERATIONS & WELFARE ─────────────────────────────────────────────────
  {
    id: 'parents.view',
    name: 'View Parent Directory',
    description: 'Access guardian contact information and student-parent relationships.',
    domain: 'operations',
    module: 'Parents',
  },
  {
    id: 'parents.manage',
    name: 'Manage Parent Directory',
    description: 'Link parents to children, register emergency contacts, and edit guardian profiles.',
    domain: 'operations',
    module: 'Parents',
  },
  {
    id: 'discipline.view',
    name: 'View Discipline Records',
    description: 'Review student misconduct incidents, warnings, and sanctions log.',
    domain: 'operations',
    module: 'Discipline',
  },
  {
    id: 'discipline.manage',
    name: 'Manage Conduct & Infractions',
    description: 'Log behavioral incidents, issue detentions or suspensions, and notify parents.',
    domain: 'operations',
    module: 'Discipline',
  },
  {
    id: 'health.view',
    name: 'View Clinic & Health Records',
    description: 'View sick bay visit histories, reported symptoms, and emergency medical notes.',
    domain: 'operations',
    module: 'Health / Sick Bay',
  },
  {
    id: 'health.create',
    name: 'Create Health Records',
    description: 'Log new clinic check-ins, record vitals, and emergency visits.',
    domain: 'operations',
    module: 'Health / Sick Bay',
  },
  {
    id: 'health.update',
    name: 'Update Health Records',
    description: 'Amend symptoms, medical follow-ups, and referral progress.',
    domain: 'operations',
    module: 'Health / Sick Bay',
  },
  {
    id: 'health.export',
    name: 'Export Health Records',
    description: 'Export clinic attendance and medical reports under strict data protection protocols.',
    domain: 'operations',
    module: 'Health / Sick Bay',
  },
  {
    id: 'health.manage',
    name: 'Manage Sick Bay & Care',
    description: 'Full management of clinic protocols, triage rules, and medical supply records.',
    domain: 'operations',
    module: 'Health / Sick Bay',
  },
  {
    id: 'library.view',
    name: 'View Library Catalog',
    description: 'Search physical and digital book archives, shelf locations, and availability.',
    domain: 'operations',
    module: 'Library',
  },
  {
    id: 'library.manage',
    name: 'Manage Books & Loans',
    description: 'Catalog books, check out loans to students/teachers, and record returns/fines.',
    domain: 'operations',
    module: 'Library',
  },
  {
    id: 'inventory.view',
    name: 'View Asset Inventory',
    description: 'Inspect school asset registry, lab apparatus, and classroom furnishings.',
    domain: 'operations',
    module: 'Inventory',
  },
  {
    id: 'inventory.manage',
    name: 'Manage School Assets',
    description: 'Register equipment, update condition status, and record maintenance logs.',
    domain: 'operations',
    module: 'Inventory',
  },
  {
    id: 'transport.view',
    name: 'View Transport Routes',
    description: 'Inspect school bus schedules, stops, passenger manifests, and driver info.',
    domain: 'operations',
    module: 'Transport',
  },
  {
    id: 'transport.manage',
    name: 'Manage Fleet & Bus Routes',
    description: 'Configure routes, assign vehicles and drivers, and manage student bus passes.',
    domain: 'operations',
    module: 'Transport',
  },

  // ── FINANCE & BILLING ────────────────────────────────────────────────────
  {
    id: 'fees.view',
    name: 'View Fee Records & Balances',
    description: 'Inspect fee structures, student ledger balances, and collection totals.',
    domain: 'finance',
    module: 'Fees & Finance',
  },
  {
    id: 'fees.collect',
    name: 'Collect Fees & Issue Receipts',
    description: 'Record cash, bank, or Mobile Money payments and issue official receipts.',
    domain: 'finance',
    module: 'Fees & Finance',
  },
  {
    id: 'fees.manage',
    name: 'Configure Fee Structures',
    description: 'Define term fees, student scholarships, discounts, and payment deadlines.',
    domain: 'finance',
    module: 'Fees & Finance',
  },
  {
    id: 'billing.manage',
    name: 'School Platform Billing',
    description: 'Manage institutional SMS subscription, invoice history, and payments.',
    domain: 'finance',
    module: 'Fees & Finance',
  },

  // ── INSTITUTIONAL ADMIN & HR ─────────────────────────────────────────────
  {
    id: 'hr.view',
    name: 'View Staff Leaves',
    description: 'View faculty and administrative staff leave schedules and status.',
    domain: 'admin',
    module: 'HR & Staff',
  },
  {
    id: 'hr.apply',
    name: 'Apply for Staff Leave',
    description: 'Submit personal sick, annual, maternity, or casual leave requests.',
    domain: 'admin',
    module: 'HR & Staff',
  },
  {
    id: 'hr.manage',
    name: 'Approve / Reject Staff Leaves',
    description: 'Evaluate, approve, or decline employee leave applications.',
    domain: 'admin',
    module: 'HR & Staff',
  },
  {
    id: 'announcements.view',
    name: 'View School Notices',
    description: 'Read campus circulars, emergency alerts, and departmental notices.',
    domain: 'admin',
    module: 'Notice Board',
  },
  {
    id: 'announcements.manage',
    name: 'Publish Notices & Broadcasts',
    description: 'Post institution-wide notices, target specific classes or staff groups.',
    domain: 'admin',
    module: 'Notice Board',
  },
  {
    id: 'calendar.view',
    name: 'View Academic Calendar',
    description: 'Inspect school terms, holiday dates, exam schedules, and events.',
    domain: 'admin',
    module: 'Calendar',
  },
  {
    id: 'calendar.manage',
    name: 'Manage Calendar Events',
    description: 'Schedule campus events, exam periods, PTA meetings, and term holidays.',
    domain: 'admin',
    module: 'Calendar',
  },
  {
    id: 'documents.view',
    name: 'View Documents Vault',
    description: 'Access institutional archive, report templates, and administrative files.',
    domain: 'admin',
    module: 'Documents Vault',
  },
  {
    id: 'documents.manage',
    name: 'Manage Document Archive',
    description: 'Upload official school files, certificates, transcripts, and policies.',
    domain: 'admin',
    module: 'Documents Vault',
  },
  {
    id: 'settings.manage',
    name: 'Manage School Settings',
    description: 'Configure school profile, term parameters, grading rules, and payment gateways.',
    domain: 'admin',
    module: 'Settings & Administration',
  },
  {
    id: 'roles.manage',
    name: 'Manage Roles & Functionalities',
    description: 'Assign or revoke functionalities and permissions for each school role.',
    domain: 'admin',
    module: 'Settings & Administration',
  },
];

/**
 * Standard recommended default permissions for each role.
 * School Admins can customize these defaults on a per-school basis.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SCHOOL_ADMIN: PERMISSIONS_CATALOG.map((p) => p.id),

  TEACHER: [
    'students.view',
    'teachers.view',
    'academics.view',
    'timetable.view',
    'attendance.view',
    'attendance.record',
    'assignments.view',
    'assignments.manage',
    'results.view',
    'results.record',
    'discipline.view',
    'discipline.manage',
    'library.view',
    'hr.apply',
    'announcements.view',
    'calendar.view',
    'documents.view',
  ],

  ACCOUNTANT: [
    'students.view',
    'fees.view',
    'fees.collect',
    'fees.manage',
    'billing.manage',
    'hr.apply',
    'announcements.view',
    'calendar.view',
    'documents.view',
  ],

  LIBRARIAN: [
    'students.view',
    'teachers.view',
    'library.view',
    'library.manage',
    'inventory.view',
    'hr.apply',
    'announcements.view',
    'calendar.view',
  ],

  HEALTH_OFFICER: [
    'students.view',
    'parents.view',
    'health.view',
    'health.create',
    'health.update',
    'health.export',
    'health.manage',
    'hr.apply',
    'announcements.view',
    'calendar.view',
  ],

  TRANSPORT_OFFICER: [
    'students.view',
    'parents.view',
    'transport.view',
    'transport.manage',
    'inventory.view',
    'hr.apply',
    'announcements.view',
    'calendar.view',
  ],

  DISCIPLINE_MASTER: [
    'students.view',
    'parents.view',
    'discipline.view',
    'discipline.manage',
    'attendance.view',
    'hr.apply',
    'announcements.view',
    'calendar.view',
  ],

  GENERAL_STAFF: [
    'hr.apply',
    'announcements.view',
    'calendar.view',
    'documents.view',
  ],

  PARENT: [
    'students.view',
    'assignments.view',
    'results.view',
    'attendance.view',
    'fees.view',
    'announcements.view',
    'calendar.view',
  ],

  STUDENT: [
    'timetable.view',
    'assignments.view',
    'results.view',
    'attendance.view',
    'library.view',
    'announcements.view',
    'calendar.view',
  ],
};

// Comprehensive Granular Permissions Catalog
// Structure: MODULE -> SUBMODULE -> ACTION

export interface PermissionDefinition {
  key: string;
  module: string;
  submodule: string;
  action: string;
  name: string;
  description: string;
  isSensitive?: boolean;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // 1. Dashboard
  { key: 'dashboard.overview.view', module: 'dashboard', submodule: 'overview', action: 'view', name: 'View Dashboard', description: 'Access institutional overview and summary cards' },
  { key: 'dashboard.statistics.view', module: 'dashboard', submodule: 'statistics', action: 'view', name: 'View Statistics', description: 'View aggregate school figures and trends' },
  { key: 'dashboard.analytics.view', module: 'dashboard', submodule: 'analytics', action: 'view', name: 'View Analytics', description: 'Access deep institutional analytics and predictive telemetry' },

  // 2. Students
  { key: 'students.student.view', module: 'students', submodule: 'student', action: 'view', name: 'View Students', description: 'View student directory, bios, and academic enrollment' },
  { key: 'students.student.create', module: 'students', submodule: 'student', action: 'create', name: 'Create Students', description: 'Register and enroll new students' },
  { key: 'students.student.edit', module: 'students', submodule: 'student', action: 'edit', name: 'Edit Students', description: 'Update student demographics and profiles' },
  { key: 'students.student.delete', module: 'students', submodule: 'student', action: 'delete', name: 'Delete Students', description: 'Purge student records from database', isSensitive: true },
  { key: 'students.student.archive', module: 'students', submodule: 'student', action: 'archive', name: 'Archive Students', description: 'Soft-delete or archive past students' },
  { key: 'students.student.transfer', module: 'students', submodule: 'student', action: 'transfer', name: 'Transfer Students', description: 'Process internal transfers between classes or streams' },
  { key: 'students.student.promote', module: 'students', submodule: 'student', action: 'promote', name: 'Promote Students', description: 'Run end-of-year class promotions' },
  { key: 'students.student.export', module: 'students', submodule: 'student', action: 'export', name: 'Export Students', description: 'Download CSV / Excel student registers', isSensitive: true },
  { key: 'students.student.import', module: 'students', submodule: 'student', action: 'import', name: 'Import Students', description: 'Bulk import students from spreadsheets' },
  { key: 'students.document.view', module: 'students', submodule: 'document', action: 'view', name: 'View Student Documents', description: 'Access birth certs, medical clearance and exeat notes' },

  // 3. Parents / Guardians
  { key: 'parents.parent.view', module: 'parents', submodule: 'parent', action: 'view', name: 'View Parents', description: 'Browse directory of legal guardians' },
  { key: 'parents.parent.create', module: 'parents', submodule: 'parent', action: 'create', name: 'Create Parents', description: 'Add new parent/guardian accounts' },
  { key: 'parents.parent.edit', module: 'parents', submodule: 'parent', action: 'edit', name: 'Edit Parents', description: 'Modify contact numbers and addresses' },
  { key: 'parents.parent.delete', module: 'parents', submodule: 'parent', action: 'delete', name: 'Delete Parents', description: 'Remove parent linkages', isSensitive: true },
  { key: 'parents.link.manage', module: 'parents', submodule: 'link', action: 'manage', name: 'Link Parent to Student', description: 'Establish custody linkages and billing responsibility' },
  { key: 'parents.parent.export', module: 'parents', submodule: 'parent', action: 'export', name: 'Export Parents', description: 'Export guardian phone contacts for SMS broadcasts' },

  // 4. Admissions
  { key: 'admissions.application.view', module: 'admissions', submodule: 'application', action: 'view', name: 'View Applications', description: 'Browse incoming student intake applications' },
  { key: 'admissions.application.create', module: 'admissions', submodule: 'application', action: 'create', name: 'Create Applications', description: 'Input walk-in paper applications' },
  { key: 'admissions.application.edit', module: 'admissions', submodule: 'application', action: 'edit', name: 'Edit Applications', description: 'Update applicant scores and records' },
  { key: 'admissions.application.review', module: 'admissions', submodule: 'application', action: 'review', name: 'Review Applications', description: 'Score entry interviews and placement exams' },
  { key: 'admissions.application.approve', module: 'admissions', submodule: 'application', action: 'approve', name: 'Approve Admissions', description: 'Issue formal letters of admission' },
  { key: 'admissions.application.reject', module: 'admissions', submodule: 'application', action: 'reject', name: 'Reject Admissions', description: 'Decline admission applications' },
  { key: 'admissions.student.convert', module: 'admissions', submodule: 'student', action: 'convert', name: 'Convert Applicant to Student', description: 'Provision student ID and invoice upon admission acceptance' },
  { key: 'admissions.application.export', module: 'admissions', submodule: 'application', action: 'export', name: 'Export Applications', description: 'Export admission statistics and reports' },

  // 5. Teachers & Faculty
  { key: 'teachers.teacher.view', module: 'teachers', submodule: 'teacher', action: 'view', name: 'View Teachers', description: 'View staff directory, qualifications, and loads' },
  { key: 'teachers.teacher.create', module: 'teachers', submodule: 'teacher', action: 'create', name: 'Create Teachers', description: 'Onboard new instructional faculty' },
  { key: 'teachers.teacher.edit', module: 'teachers', submodule: 'teacher', action: 'edit', name: 'Edit Teachers', description: 'Update teacher bio and designations' },
  { key: 'teachers.teacher.delete', module: 'teachers', submodule: 'teacher', action: 'delete', name: 'Delete Teachers', description: 'Remove teacher records from system', isSensitive: true },
  { key: 'teachers.subject.assign', module: 'teachers', submodule: 'subject', action: 'assign', name: 'Assign Subjects', description: 'Assign curriculum subjects to faculty members' },
  { key: 'teachers.class.assign', module: 'teachers', submodule: 'class', action: 'assign', name: 'Assign Classes', description: 'Appoint form tutors and class supervisors' },
  { key: 'teachers.performance.view', module: 'teachers', submodule: 'performance', action: 'view', name: 'View Teacher Performance', description: 'Inspect lesson submission metrics and feedback' },

  // 6. HR & Staffing
  { key: 'hr.staff.view', module: 'hr', submodule: 'staff', action: 'view', name: 'View Staff Records', description: 'Browse non-academic and academic employment database' },
  { key: 'hr.staff.create', module: 'hr', submodule: 'staff', action: 'create', name: 'Create Staff', description: 'Create employee service records' },
  { key: 'hr.staff.edit', module: 'hr', submodule: 'staff', action: 'edit', name: 'Edit Staff', description: 'Update SSNIT, Ghana Card, and designation' },
  { key: 'hr.staff.delete', module: 'hr', submodule: 'staff', action: 'delete', name: 'Delete Staff', description: 'Offboard and terminate staff profiles', isSensitive: true },
  { key: 'hr.contract.manage', module: 'hr', submodule: 'contract', action: 'manage', name: 'Manage Contracts', description: 'Renew, amend, or terminate staff contracts' },
  { key: 'hr.leave.manage', module: 'hr', submodule: 'leave', action: 'manage', name: 'Manage Leave', description: 'Approve or reject maternity, annual, and casual leaves' },
  { key: 'hr.document.manage', module: 'hr', submodule: 'document', action: 'manage', name: 'Manage Staff Documents', description: 'Store academic transcripts and police clearance' },
  { key: 'hr.report.view', module: 'hr', submodule: 'report', action: 'view', name: 'View HR Reports', description: 'Staff turnover, headcounts, and attrition analysis' },

  // 7. Academics & Curriculum
  { key: 'academics.year.manage', module: 'academics', submodule: 'year', action: 'manage', name: 'Manage Academic Years', description: 'Configure active academic cycle (e.g. 2026/2027)' },
  { key: 'academics.term.manage', module: 'academics', submodule: 'term', action: 'manage', name: 'Manage Terms', description: 'Configure Term 1, 2, and 3 date windows' },
  { key: 'academics.class.manage', module: 'academics', submodule: 'class', action: 'manage', name: 'Manage Classes', description: 'Create and configure grade levels' },
  { key: 'academics.stream.manage', module: 'academics', submodule: 'stream', action: 'manage', name: 'Manage Streams', description: 'Create sections (Gold, Blue, Diamond)' },
  { key: 'academics.subject.manage', module: 'academics', submodule: 'subject', action: 'manage', name: 'Manage Subjects', description: 'Add curriculum subjects (Core Maths, Science, Twi)' },
  { key: 'academics.department.manage', module: 'academics', submodule: 'department', action: 'manage', name: 'Manage Departments', description: 'Organize subjects into departmental clusters' },
  { key: 'academics.curriculum.manage', module: 'academics', submodule: 'curriculum', action: 'manage', name: 'Manage Curriculum', description: 'Configure syllabus topics and strands' },
  { key: 'academics.grading.configure', module: 'academics', submodule: 'grading', action: 'configure', name: 'Configure Grading', description: 'Configure cut-offs, stanine grades, and GPA' },
  { key: 'academics.promotion.configure', module: 'academics', submodule: 'promotion', action: 'configure', name: 'Configure Promotion Rules', description: 'Set pass marks and repeat criteria' },

  // 8. Timetable
  { key: 'timetable.schedule.view', module: 'timetable', submodule: 'schedule', action: 'view', name: 'View Timetable', description: 'Inspect master timetables' },
  { key: 'timetable.schedule.create', module: 'timetable', submodule: 'schedule', action: 'create', name: 'Create Timetable', description: 'Draft new period schedules and lesson slots' },
  { key: 'timetable.schedule.edit', module: 'timetable', submodule: 'schedule', action: 'edit', name: 'Edit Timetable', description: 'Adjust slot timings and teacher clashes' },
  { key: 'timetable.schedule.delete', module: 'timetable', submodule: 'schedule', action: 'delete', name: 'Delete Timetable', description: 'Clear or reset timetable allocations' },
  { key: 'timetable.schedule.publish', module: 'timetable', submodule: 'schedule', action: 'publish', name: 'Publish Timetable', description: 'Make schedules live for students and parents' },
  { key: 'timetable.room.manage', module: 'timetable', submodule: 'room', action: 'manage', name: 'Manage Rooms', description: 'Allocate science labs, ICT labs, and auditoriums' },
  { key: 'timetable.substitution.manage', module: 'timetable', submodule: 'substitution', action: 'manage', name: 'Manage Substitutions', description: 'Dispatch relief teachers for absent colleagues' },

  // 9. Assignments
  { key: 'assignments.assignment.view', module: 'assignments', submodule: 'assignment', action: 'view', name: 'View Assignments', description: 'Inspect homework, prep, and project briefs' },
  { key: 'assignments.assignment.create', module: 'assignments', submodule: 'assignment', action: 'create', name: 'Create Assignments', description: 'Post new assignments with deadlines and attachments' },
  { key: 'assignments.assignment.edit', module: 'assignments', submodule: 'assignment', action: 'edit', name: 'Edit Assignments', description: 'Modify assignment requirements and dates' },
  { key: 'assignments.assignment.delete', module: 'assignments', submodule: 'assignment', action: 'delete', name: 'Delete Assignments', description: 'Remove assignments from student portal' },
  { key: 'assignments.assignment.grade', module: 'assignments', submodule: 'assignment', action: 'grade', name: 'Grade Assignments', description: 'Award marks, comments, and corrections' },
  { key: 'assignments.assignment.publish', module: 'assignments', submodule: 'assignment', action: 'publish', name: 'Publish Assignments', description: 'Broadcast task to classes' },

  // 10. Examinations & CBT
  { key: 'examinations.exam.create', module: 'examinations', submodule: 'exam', action: 'create', name: 'Create Exams', description: 'Setup Mid-Term, Mock, and Final exam sittings' },
  { key: 'examinations.exam.edit', module: 'examinations', submodule: 'exam', action: 'edit', name: 'Edit Exams', description: 'Update exam papers and instructions' },
  { key: 'examinations.exam.delete', module: 'examinations', submodule: 'exam', action: 'delete', name: 'Delete Exams', description: 'Cancel and delete examination entries' },
  { key: 'examinations.timetable.manage', module: 'examinations', submodule: 'timetable', action: 'manage', name: 'Manage Exam Timetable', description: 'Draft hall seating and exam period allocations' },
  { key: 'examinations.invigilator.assign', module: 'examinations', submodule: 'invigilator', action: 'assign', name: 'Assign Invigilators', description: 'Roster invigilating teachers to exam rooms' },
  { key: 'examinations.score.enter', module: 'examinations', submodule: 'score', action: 'enter', name: 'Enter Scores', description: 'Input Raw CA and Exam marks' },
  { key: 'examinations.score.edit', module: 'examinations', submodule: 'score', action: 'edit', name: 'Edit Scores', description: 'Modify previously keyed score values' },
  { key: 'examinations.score.approve', module: 'examinations', submodule: 'score', action: 'approve', name: 'Approve Scores', description: 'Department Head signoff on broadsheets', isSensitive: true },
  { key: 'examinations.result.publish', module: 'examinations', submodule: 'result', action: 'publish', name: 'Publish Results', description: 'Make scores visible to students & guardians', isSensitive: true },

  // 11. Report Cards
  { key: 'reports.reportcard.view', module: 'report_cards', submodule: 'report_card', action: 'view', name: 'View Report Cards', description: 'Preview terminal assessment sheets' },
  { key: 'reports.reportcard.generate', module: 'report_cards', submodule: 'report_card', action: 'generate', name: 'Generate Report Cards', description: 'Calculate weighted terminal totals and positions' },
  { key: 'reports.reportcard.edit', module: 'report_cards', submodule: 'report_card', action: 'edit', name: 'Edit Report Cards', description: 'Edit remarks and attendance counts' },
  { key: 'reports.reportcard.approve', module: 'report_cards', submodule: 'report_card', action: 'approve', name: 'Approve Report Cards', description: 'Sign off terminal reports for distribution', isSensitive: true },
  { key: 'reports.reportcard.publish', module: 'report_cards', submodule: 'report_card', action: 'publish', name: 'Publish Report Cards', description: 'Release digital report slips to parents', isSensitive: true },
  { key: 'reports.reportcard.download', module: 'report_cards', submodule: 'report_card', action: 'download', name: 'Download Report Cards', description: 'Batch download branded PDF report cards' },
  { key: 'reports.reportcard.print', module: 'report_cards', submodule: 'report_card', action: 'print', name: 'Print Report Cards', description: 'Print term slips on physical stationery' },

  // 12. Attendance
  { key: 'attendance.record.view', module: 'attendance', submodule: 'record', action: 'view', name: 'View Attendance', description: 'Inspect morning, afternoon, and subject attendance logs' },
  { key: 'attendance.record.create', module: 'attendance', submodule: 'record', action: 'create', name: 'Record Attendance', description: 'Take roll call for assigned class or subject' },
  { key: 'attendance.record.edit', module: 'attendance', submodule: 'record', action: 'edit', name: 'Edit Attendance', description: 'Adjust presence, tardiness, and absence tags' },
  { key: 'attendance.correction.approve', module: 'attendance', submodule: 'correction', action: 'approve', name: 'Approve Corrections', description: 'Authorize retrospective changes to past attendance registers' },
  { key: 'attendance.record.export', module: 'attendance', submodule: 'record', action: 'export', name: 'Export Attendance', description: 'Export attendance stats to Excel or CSV' },
  { key: 'attendance.analytics.view', module: 'attendance', submodule: 'analytics', action: 'view', name: 'View Attendance Analytics', description: 'Track chronic absenteeism and punctuality heatmaps' },

  // 13. Discipline & Conduct
  { key: 'discipline.incident.view', module: 'discipline', submodule: 'incident', action: 'view', name: 'View Incidents', description: 'Browse student infractions and conduct log' },
  { key: 'discipline.incident.create', module: 'discipline', submodule: 'incident', action: 'create', name: 'Create Incidents', description: 'Log misconduct, lateness, or dress code violations' },
  { key: 'discipline.incident.edit', module: 'discipline', submodule: 'incident', action: 'edit', name: 'Edit Incidents', description: 'Update case notes and investigation status' },
  { key: 'discipline.incident.delete', module: 'discipline', submodule: 'incident', action: 'delete', name: 'Delete Incidents', description: 'Expunge discipline records', isSensitive: true },
  { key: 'discipline.action.manage', module: 'discipline', submodule: 'action', action: 'manage', name: 'Manage Disciplinary Actions', description: 'Assign detention, suspension, or community service' },
  { key: 'discipline.report.view', module: 'discipline', submodule: 'report', action: 'view', name: 'View Discipline Reports', description: 'Generate conduct summary certificates' },

  // 14. Health & Clinic (Strictly Restricted)
  { key: 'health.record.view', module: 'health', submodule: 'record', action: 'view', name: 'View Health Records', description: 'Access student allergies, blood group, and chronic conditions', isSensitive: true },
  { key: 'health.record.create', module: 'health', submodule: 'record', action: 'create', name: 'Create Health Records', description: 'Record student admission medical forms', isSensitive: true },
  { key: 'health.record.edit', module: 'health', submodule: 'record', action: 'edit', name: 'Edit Health Records', description: 'Update immunizations and doctor recommendations', isSensitive: true },
  { key: 'health.record.delete', module: 'health', submodule: 'record', action: 'delete', name: 'Delete Health Records', description: 'Purge protected medical history', isSensitive: true },
  { key: 'health.clinic.manage', module: 'health', submodule: 'clinic', action: 'manage', name: 'Manage Clinic Visits', description: 'Log triage, vitals, and dispensing' },
  { key: 'health.report.view', module: 'health', submodule: 'report', action: 'view', name: 'View Health Reports', description: 'Track infectious outbreaks and sick bay throughput' },

  // 15. Exeat & Campus Gate
  { key: 'exeat.request.view', module: 'exeat', submodule: 'request', action: 'view', name: 'View Exeat Requests', description: 'Check boarder exit and town exeat requests' },
  { key: 'exeat.request.create', module: 'exeat', submodule: 'request', action: 'create', name: 'Create Exeat Requests', description: 'Submit leave request on behalf of student' },
  { key: 'exeat.request.approve', module: 'exeat', submodule: 'request', action: 'approve', name: 'Approve Exeat Requests', description: 'Housemaster / Senior Housemaster signoff' },
  { key: 'exeat.request.reject', module: 'exeat', submodule: 'request', action: 'reject', name: 'Reject Exeat Requests', description: 'Decline exit permission' },
  { key: 'exeat.gatepass.manage', module: 'exeat', submodule: 'gatepass', action: 'manage', name: 'Manage Gate Passes', description: 'Generate digital barcode gate clearance slips' },
  { key: 'exeat.gatelog.view', module: 'exeat', submodule: 'gatelog', action: 'view', name: 'View Gate Logs', description: 'Security gate clock-in and clock-out time audit' },

  // 16. Fees & Billing
  { key: 'fees.structure.view', module: 'fees', submodule: 'structure', action: 'view', name: 'View Fee Structures', description: 'View tuition, PTA, feeding, and boarding tariffs' },
  { key: 'fees.structure.create', module: 'fees', submodule: 'structure', action: 'create', name: 'Create Fee Structures', description: 'Create termly bill item bundles', isSensitive: true },
  { key: 'fees.structure.edit', module: 'fees', submodule: 'structure', action: 'edit', name: 'Edit Fee Structures', description: 'Adjust fee schedule amounts', isSensitive: true },
  { key: 'fees.structure.delete', module: 'fees', submodule: 'structure', action: 'delete', name: 'Delete Fee Structures', description: 'Remove unused tariff structures', isSensitive: true },
  { key: 'fees.invoice.generate', module: 'fees', submodule: 'invoice', action: 'generate', name: 'Generate Invoices', description: 'Batch generate term fee bills for enrolled students', isSensitive: true },
  { key: 'fees.discount.apply', module: 'fees', submodule: 'discount', action: 'apply', name: 'Apply Discounts', description: 'Grant sibling discounts and fee concessions' },
  { key: 'fees.scholarship.apply', module: 'fees', submodule: 'scholarship', action: 'apply', name: 'Apply Scholarships', description: 'Apply partial or full scholarship waivers' },
  { key: 'fees.balance.view', module: 'fees', submodule: 'balance', action: 'view', name: 'View Balances', description: 'Inspect real-time student arrears and payment status' },
  { key: 'fees.report.export', module: 'fees', submodule: 'report', action: 'export', name: 'Export Fee Reports', description: 'Download debtors lists and collection analysis', isSensitive: true },

  // 17. Payments & Collections
  { key: 'payments.payment.view', module: 'payments', submodule: 'payment', action: 'view', name: 'View Payments', description: 'Review bank transfers, cashbook, and MoMo collections' },
  { key: 'payments.payment.record', module: 'payments', submodule: 'payment', action: 'record', name: 'Record Payments', description: 'Receive cash, bank deposits, and Mobile Money' },
  { key: 'payments.payment.edit', module: 'payments', submodule: 'payment', action: 'edit', name: 'Edit Payments', description: 'Correct receipt reference details' },
  { key: 'payments.payment.reverse', module: 'payments', submodule: 'payment', action: 'reverse', name: 'Reverse Payments', description: 'Void errant receipts with mandatory reason', isSensitive: true },
  { key: 'payments.refund.process', module: 'payments', submodule: 'refund', action: 'process', name: 'Process Refunds', description: 'Authorize and disburse fee refunds to parents', isSensitive: true },
  { key: 'payments.receipt.generate', module: 'payments', submodule: 'receipt', action: 'generate', name: 'Generate Receipts', description: 'Issue official stamped school fee receipts' },
  { key: 'payments.report.export', module: 'payments', submodule: 'report', action: 'export', name: 'Export Payment Reports', description: 'Export daily cash reconciliation logs', isSensitive: true },

  // 18. Accounting & General Ledger
  { key: 'accounting.account.view', module: 'accounting', submodule: 'account', action: 'view', name: 'View Accounts', description: 'Inspect general ledger and bank balances' },
  { key: 'accounting.transaction.create', module: 'accounting', submodule: 'transaction', action: 'create', name: 'Create Transactions', description: 'Post cashbook journals and petty cash disbursements' },
  { key: 'accounting.transaction.edit', module: 'accounting', submodule: 'transaction', action: 'edit', name: 'Edit Transactions', description: 'Modify journal entries before period lock' },
  { key: 'accounting.transaction.delete', module: 'accounting', submodule: 'transaction', action: 'delete', name: 'Delete Transactions', description: 'Purge draft journal vouchers', isSensitive: true },
  { key: 'accounting.chart.manage', module: 'accounting', submodule: 'chart', action: 'manage', name: 'Manage Chart of Accounts', description: 'Setup GL codes and categories' },
  { key: 'accounting.bank.reconcile', module: 'accounting', submodule: 'bank', action: 'reconcile', name: 'Bank Reconciliation', description: 'Reconcile bank statements against school cashbooks' },
  { key: 'accounting.report.view', module: 'accounting', submodule: 'report', action: 'view', name: 'View Financial Reports', description: 'Review Trial Balance, P&L, and Cash Flow' },
  { key: 'accounting.report.export', module: 'accounting', submodule: 'report', action: 'export', name: 'Export Financial Reports', description: 'Export statutory financial statements for audit', isSensitive: true },

  // 19. Payroll (Ghanaian SSNIT & PAYE)
  { key: 'payroll.payroll.view', module: 'payroll', submodule: 'payroll', action: 'view', name: 'View Payroll', description: 'Inspect monthly staff payroll schedules', isSensitive: true },
  { key: 'payroll.payroll.create', module: 'payroll', submodule: 'payroll', action: 'create', name: 'Create Payroll', description: 'Compile monthly gross salaries, SSNIT Tier 1 & 2, and GRA PAYE', isSensitive: true },
  { key: 'payroll.payroll.process', module: 'payroll', submodule: 'payroll', action: 'process', name: 'Process Payroll', description: 'Calculate net pay deductions and staff loans', isSensitive: true },
  { key: 'payroll.payroll.approve', module: 'payroll', submodule: 'payroll', action: 'approve', name: 'Approve Payroll', description: 'Bursar & Head sign-off for bank disbursement', isSensitive: true },
  { key: 'payroll.payslip.generate', module: 'payroll', submodule: 'payslip', action: 'generate', name: 'Generate Payslips', description: 'Dispatch password-protected PDF payslips to staff' },
  { key: 'payroll.payroll.export', module: 'payroll', submodule: 'payroll', action: 'export', name: 'Export Payroll', description: 'Export GRA Tier schedules and Bank ACH salary files', isSensitive: true },

  // 20. Library
  { key: 'library.book.view', module: 'library', submodule: 'book', action: 'view', name: 'View Books', description: 'Browse catalogue, ISBNs, and call numbers' },
  { key: 'library.book.create', module: 'library', submodule: 'book', action: 'create', name: 'Add Books', description: 'Accession new volumes and set shelf locations' },
  { key: 'library.book.edit', module: 'library', submodule: 'book', action: 'edit', name: 'Edit Books', description: 'Update condition, author, and classification' },
  { key: 'library.book.delete', module: 'library', submodule: 'book', action: 'delete', name: 'Delete Books', description: 'De-accession lost or decommissioned books' },
  { key: 'library.book.issue', module: 'library', submodule: 'book', action: 'issue', name: 'Issue Books', description: 'Check out copies to students or faculty' },
  { key: 'library.book.return', module: 'library', submodule: 'book', action: 'return', name: 'Return Books', description: 'Check in returned items and assess damage' },
  { key: 'library.fine.manage', module: 'library', submodule: 'fine', action: 'manage', name: 'Manage Fines', description: 'Assess and collect overdue fines' },
  { key: 'library.report.view', module: 'library', submodule: 'report', action: 'view', name: 'View Library Reports', description: 'Most borrowed titles, overdue books, and circulation audit' },

  // 21. Inventory & Stores
  { key: 'inventory.asset.view', module: 'inventory', submodule: 'asset', action: 'view', name: 'View Inventory', description: 'Browse stock balances, lab equipment, and furniture' },
  { key: 'inventory.asset.create', module: 'inventory', submodule: 'asset', action: 'create', name: 'Add Items', description: 'Register school property and consumable stock items' },
  { key: 'inventory.asset.edit', module: 'inventory', submodule: 'asset', action: 'edit', name: 'Edit Items', description: 'Update unit costs and minimum stock thresholds' },
  { key: 'inventory.asset.delete', module: 'inventory', submodule: 'asset', action: 'delete', name: 'Delete Items', description: 'Write off damaged or obsolete inventory', isSensitive: true },
  { key: 'inventory.stock.in', module: 'inventory', submodule: 'stock', action: 'in', name: 'Stock In', description: 'Receive supplier shipments into school central stores' },
  { key: 'inventory.stock.out', module: 'inventory', submodule: 'stock', action: 'out', name: 'Stock Out', description: 'Issue textbooks, stationery, and chalk to departments' },
  { key: 'inventory.asset.transfer', module: 'inventory', submodule: 'asset', action: 'transfer', name: 'Transfer Assets', description: 'Transfer equipment between classrooms or campuses' },
  { key: 'inventory.supplier.manage', module: 'inventory', submodule: 'supplier', action: 'manage', name: 'Manage Suppliers', description: 'Maintain vendor contracts and price books' },
  { key: 'inventory.report.view', module: 'inventory', submodule: 'report', action: 'view', name: 'View Inventory Reports', description: 'Asset depreciation and annual inventory counts' },

  // 22. Transport Fleet
  { key: 'transport.vehicle.view', module: 'transport', submodule: 'vehicle', action: 'view', name: 'View Vehicles', description: 'Inspect school buses, minivans, and maintenance states' },
  { key: 'transport.vehicle.manage', module: 'transport', submodule: 'vehicle', action: 'manage', name: 'Manage Vehicles', description: 'Add buses, roadworthiness, and insurance details' },
  { key: 'transport.driver.manage', module: 'transport', submodule: 'driver', action: 'manage', name: 'Manage Drivers', description: 'Manage commercial driver licenses and contacts' },
  { key: 'transport.route.manage', module: 'transport', submodule: 'route', action: 'manage', name: 'Manage Routes', description: 'Define pickup stages, timing, and fee zones' },
  { key: 'transport.student.assign', module: 'transport', submodule: 'student', action: 'assign', name: 'Assign Students to Routes', description: 'Allocate students to morning and evening shuttles' },
  { key: 'transport.report.view', module: 'transport', submodule: 'report', action: 'view', name: 'View Transport Reports', description: 'Fuel efficiency, ridership, and bus utilization logs' },

  // 23. Boarding & Hostels
  { key: 'boarding.hostel.view', module: 'boarding', submodule: 'hostel', action: 'view', name: 'View Hostels', description: 'Inspect dormitories, cubicles, and bed capacity' },
  { key: 'boarding.room.manage', module: 'boarding', submodule: 'room', action: 'manage', name: 'Manage Rooms', description: 'Configure dorm blocks, floor allocations, and facilities' },
  { key: 'boarding.student.assign', module: 'boarding', submodule: 'student', action: 'assign', name: 'Assign Students', description: 'Allocate boarders to rooms and bunks' },
  { key: 'boarding.attendance.manage', module: 'boarding', submodule: 'attendance', action: 'manage', name: 'Manage Boarding Attendance', description: 'Conduct evening dorm roll calls and night checks' },
  { key: 'boarding.report.view', module: 'boarding', submodule: 'report', action: 'view', name: 'View Boarding Reports', description: 'Boarder muster rolls and bed occupancy metrics' },

  // 24. Communication Engine
  { key: 'communication.message.view', module: 'communication', submodule: 'message', action: 'view', name: 'View Messages', description: 'Access inbox, outbound delivery queues, and logs' },
  { key: 'communication.message.send', module: 'communication', submodule: 'message', action: 'send', name: 'Send Messages', description: 'Send individual in-app notices' },
  { key: 'communication.bulk.send', module: 'communication', submodule: 'bulk', action: 'send', name: 'Send Bulk Messages', description: 'Dispatch bulk notifications to classes or entire school' },
  { key: 'communication.sms.send', module: 'communication', submodule: 'sms', action: 'send', name: 'Send SMS', description: 'Send SMS alerts via Hubtel / Arkesel gateways', isSensitive: true },
  { key: 'communication.email.send', module: 'communication', submodule: 'email', action: 'send', name: 'Send Email', description: 'Broadcast rich HTML newsletters and term dates' },
  { key: 'communication.announcement.send', module: 'communication', submodule: 'announcement', action: 'send', name: 'Send Announcements', description: 'Post urgent banner notices across student & parent portals' },
  { key: 'communication.template.create', module: 'communication', submodule: 'template', action: 'create', name: 'Create Templates', description: 'Design SMS and email notice templates' },
  { key: 'communication.message.schedule', module: 'communication', submodule: 'message', action: 'schedule', name: 'Schedule Messages', description: 'Queue delayed broadcast announcements' },
  { key: 'communication.delivery.view', module: 'communication', submodule: 'delivery', action: 'view', name: 'View Delivery Reports', description: 'Track SMS credits, bounce rates, and open telemetry' },

  // 25. Documents & Vault
  { key: 'documents.document.view', module: 'documents', submodule: 'document', action: 'view', name: 'View Documents', description: 'Browse institutional policies and past circulars' },
  { key: 'documents.document.upload', module: 'documents', submodule: 'document', action: 'upload', name: 'Upload Documents', description: 'Upload official school PDFs and handbooks' },
  { key: 'documents.document.edit', module: 'documents', submodule: 'document', action: 'edit', name: 'Edit Documents', description: 'Modify metadata, visibility flags, and categories' },
  { key: 'documents.document.delete', module: 'documents', submodule: 'document', action: 'delete', name: 'Delete Documents', description: 'Remove files from documents storage' },
  { key: 'documents.document.download', module: 'documents', submodule: 'document', action: 'download', name: 'Download Documents', description: 'Download sensitive policies and institutional papers' },
  { key: 'documents.category.manage', module: 'documents', submodule: 'category', action: 'manage', name: 'Manage Document Categories', description: 'Organize folder taxonomy for school archive' },

  // 26. Reports & Institutional Analytics
  { key: 'reports.report.view', module: 'reports', submodule: 'report', action: 'view', name: 'View Reports', description: 'Access institutional reporting console' },
  { key: 'reports.report.generate', module: 'reports', submodule: 'report', action: 'generate', name: 'Generate Reports', description: 'Compile EMIS, stanine distributions, and staffing metrics' },
  { key: 'reports.report.export', module: 'reports', submodule: 'report', action: 'export', name: 'Export Reports', description: 'Export official summaries to PDF and Excel' },
  { key: 'reports.report.print', module: 'reports', submodule: 'report', action: 'print', name: 'Print Reports', description: 'Send high-resolution reports to printer' },

  // 27. Settings & Configuration
  { key: 'settings.settings.view', module: 'settings', submodule: 'settings', action: 'view', name: 'View Settings', description: 'Inspect general school settings and profile' },
  { key: 'settings.school.edit', module: 'settings', submodule: 'school', action: 'edit', name: 'Edit School Settings', description: 'Modify crest, school address, motto, and contact details', isSensitive: true },
  { key: 'settings.academic.manage', module: 'settings', submodule: 'academic', action: 'manage', name: 'Manage Academic Settings', description: 'Configure term dates and operational sessions' },
  { key: 'settings.notification.manage', module: 'settings', submodule: 'notification', action: 'manage', name: 'Manage Notification Settings', description: 'Configure SMS sender IDs and email triggers' },
  { key: 'settings.payment.manage', module: 'settings', submodule: 'payment', action: 'manage', name: 'Manage Payment Settings', description: 'Configure Mobile Money keys and Paystack tokens', isSensitive: true },
  { key: 'settings.sms.manage', module: 'settings', submodule: 'sms', action: 'manage', name: 'Manage SMS Settings', description: 'Set up SMS gateway providers and balance alerts' },
  { key: 'settings.integration.manage', module: 'settings', submodule: 'integration', action: 'manage', name: 'Manage Integrations', description: 'Configure third-party biometric and API webhooks' },

  // 28. Roles & Permissions Management (High-Risk Governance)
  { key: 'roles.role.view', module: 'roles', submodule: 'role', action: 'view', name: 'View Roles', description: 'Inspect list of defined staff roles and permission profiles' },
  { key: 'roles.role.create', module: 'roles', submodule: 'role', action: 'create', name: 'Create Roles', description: 'Create customized school staff roles', isSensitive: true },
  { key: 'roles.role.edit', module: 'roles', submodule: 'role', action: 'edit', name: 'Edit Roles', description: 'Update permissions mapped to roles', isSensitive: true },
  { key: 'roles.role.delete', module: 'roles', submodule: 'role', action: 'delete', name: 'Delete Roles', description: 'Remove inactive staff roles with safety checks', isSensitive: true },
  { key: 'roles.permission.assign', module: 'roles', submodule: 'permission', action: 'assign', name: 'Assign Permissions', description: 'Assign granular permissions to roles', isSensitive: true },
  { key: 'roles.user.assign', module: 'roles', submodule: 'user', action: 'assign', name: 'Assign Users to Roles', description: 'Map staff members to primary and supplementary roles', isSensitive: true },
  { key: 'roles.permission.revoke', module: 'roles', submodule: 'permission', action: 'revoke', name: 'Revoke Permissions', description: 'Strip permissions from roles or staff members', isSensitive: true },
  { key: 'roles.role.toggle_status', module: 'roles', submodule: 'role', action: 'toggle_status', name: 'Activate/Deactivate Roles', description: 'Toggle roles active or inactive', isSensitive: true },
];

export function hasPermissionKey(userPermissions: string[] | undefined | null, requiredKey: string): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*') || userPermissions.includes('ADMIN') || userPermissions.includes('ALL')) {
    return true;
  }
  if (userPermissions.includes(requiredKey)) {
    return true;
  }
  const modulePrefix = requiredKey.split('.')[0];
  if (userPermissions.includes(`${modulePrefix}.*`)) {
    return true;
  }
  return false;
}


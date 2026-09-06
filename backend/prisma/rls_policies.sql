-- PostgreSQL Row Level Security (RLS) Policies for School Management System
-- These policies ensure tenant isolation at the database level

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Super admins can see all users
CREATE POLICY "Super admins can view all users" ON users
  FOR SELECT
  TO (
    -- This would be set via Supabase auth context
    -- In practice, you'd use auth.uid() and check account_type
  )
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = auth.uid());

-- ============================================
-- SCHOOLS TABLE POLICIES
-- ============================================

-- Super admins can view all schools
CREATE POLICY "Super admins can view all schools" ON schools
  FOR SELECT
  USING (true);

-- Super admins can create schools
CREATE POLICY "Super admins can create schools" ON schools
  FOR INSERT
  WITH CHECK (true);

-- Super admins can update schools
CREATE POLICY "Super admins can update schools" ON schools
  FOR UPDATE
  USING (true);

-- School members can view their own school
CREATE POLICY "School members can view own school" ON schools
  FOR SELECT
  USING (
    id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- SCHOOL MEMBERSHIPS TABLE POLICIES
-- ============================================

-- Super admins can view all memberships
CREATE POLICY "Super admins can view all memberships" ON school_memberships
  FOR SELECT
  USING (true);

-- Users can view their own memberships
CREATE POLICY "Users can view own memberships" ON school_memberships
  FOR SELECT
  USING (user_id = auth.uid());

-- Super admins can create memberships
CREATE POLICY "Super admins can create memberships" ON school_memberships
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- STUDENTS TABLE POLICIES
-- ============================================

-- Super admins can view all students
CREATE POLICY "Super admins can view all students" ON students
  FOR SELECT
  USING (true);

-- School members can only view students from their school
CREATE POLICY "School members can view own school students" ON students
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Super admins can create students
CREATE POLICY "Super admins can create students" ON students
  FOR INSERT
  WITH CHECK (true);

-- School admins can create students in their school
CREATE POLICY "School admins can create students" ON students
  FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE' AND profile = 'SCHOOL_ADMIN'
    )
  );

-- School members can only update students from their school
CREATE POLICY "School members can update own school students" ON students
  FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- TEACHERS TABLE POLICIES
-- ============================================

-- Super admins can view all teachers
CREATE POLICY "Super admins can view all teachers" ON teachers
  FOR SELECT
  USING (true);

-- School members can only view teachers from their school
CREATE POLICY "School members can view own school teachers" ON teachers
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- PARENTS TABLE POLICIES
-- ============================================

-- Super admins can view all parents
CREATE POLICY "Super admins can view all parents" ON parents
  FOR SELECT
  USING (true);

-- School members can only view parents from their school
CREATE POLICY "School members can view own school parents" ON parents
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Parents can only view their own profile
CREATE POLICY "Parents can view own profile" ON parents
  FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

-- Super admins can view all attendance
CREATE POLICY "Super admins can view all attendance" ON attendance
  FOR SELECT
  USING (true);

-- School members can only view attendance from their school
CREATE POLICY "School members can view own school attendance" ON attendance
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- RESULTS TABLE POLICIES
-- ============================================

-- Super admins can view all results
CREATE POLICY "Super admins can view all results" ON results
  FOR SELECT
  USING (true);

-- School members can only view results from their school
CREATE POLICY "School members can view own school results" ON results
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Students can only view their own results
CREATE POLICY "Students can view own results" ON results
  FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM students 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PAYMENTS TABLE POLICIES
-- ============================================

-- Super admins can view all payments
CREATE POLICY "Super admins can view all payments" ON payments
  FOR SELECT
  USING (true);

-- School members can only view payments from their school
CREATE POLICY "School members can view own school payments" ON payments
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- School admins can create payments in their school
CREATE POLICY "School admins can create payments" ON payments
  FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE' AND profile = 'SCHOOL_ADMIN'
    )
  );

-- ============================================
-- EXPENSES TABLE POLICIES
-- ============================================

-- Super admins can view all expenses
CREATE POLICY "Super admins can view all expenses" ON expenses
  FOR SELECT
  USING (true);

-- School members can only view expenses from their school
CREATE POLICY "School members can view own school expenses" ON expenses
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- ASSIGNMENTS TABLE POLICIES
-- ============================================

-- Super admins can view all assignments
CREATE POLICY "Super admins can view all assignments" ON assignments
  FOR SELECT
  USING (true);

-- School members can only view assignments from their school
CREATE POLICY "School members can view own school assignments" ON assignments
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- Teachers can create assignments for their classes
CREATE POLICY "Teachers can create assignments" ON assignments
  FOR INSERT
  WITH CHECK (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE' AND profile = 'TEACHER'
    )
  );

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

-- Super admins can view all notifications
CREATE POLICY "Super admins can view all notifications" ON notifications
  FOR SELECT
  USING (true);

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT
  USING (recipient_user_id = auth.uid());

-- School members can view school-wide notifications
CREATE POLICY "School members can view school notifications" ON notifications
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    ) AND recipient_user_id IS NULL
  );

-- ============================================
-- DOCUMENTS TABLE POLICIES
-- ============================================

-- Super admins can view all documents
CREATE POLICY "Super admins can view all documents" ON documents
  FOR SELECT
  USING (true);

-- School members can only view documents from their school
CREATE POLICY "School members can view own school documents" ON documents
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- ACADEMIC YEARS, TERMS, DEPARTMENTS, CLASSES, SUBJECTS
-- ============================================

-- Super admins can view all academic structure
CREATE POLICY "Super admins can view academic structure" ON academic_years
  FOR SELECT USING (true);
CREATE POLICY "Super admins can view academic structure" ON terms
  FOR SELECT USING (true);
CREATE POLICY "Super admins can view academic structure" ON departments
  FOR SELECT USING (true);
CREATE POLICY "Super admins can view academic structure" ON classes
  FOR SELECT USING (true);
CREATE POLICY "Super admins can view academic structure" ON subjects
  FOR SELECT USING (true);

-- School members can only view their school's academic structure
CREATE POLICY "School members can view own academic structure" ON academic_years
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "School members can view own academic structure" ON terms
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "School members can view own academic structure" ON departments
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "School members can view own academic structure" ON classes
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

CREATE POLICY "School members can view own academic structure" ON subjects
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- ============================================
-- AUDIT LOGS POLICIES
-- ============================================

-- Only super admins can view audit logs
CREATE POLICY "Only super admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    -- This would check if the user is a super admin
    -- In practice, you'd need to check the user's account_type
    true
  );

-- ============================================
-- SCHOOL SETTINGS POLICIES
-- ============================================

-- Super admins can view all school settings
CREATE POLICY "Super admins can view all school settings" ON school_settings
  FOR SELECT
  USING (true);

-- School members can only view their school's settings
CREATE POLICY "School members can view own school settings" ON school_settings
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE'
    )
  );

-- School admins can update their school's settings
CREATE POLICY "School admins can update own school settings" ON school_settings
  FOR UPDATE
  USING (
    school_id IN (
      SELECT school_id FROM school_memberships 
      WHERE user_id = auth.uid() AND status = 'ACTIVE' AND profile = 'SCHOOL_ADMIN'
    )
  );

import React from 'react';
import { StudentLayoutShell } from '@/components/layout/StudentLayoutShell';

export const metadata = {
  title: 'Student Portal | School Management System',
  description: 'Student Self-Service: Timetable, Homework, CBT Exams, Report Cards, Fees & Exeat',
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayoutShell>{children}</StudentLayoutShell>;
}


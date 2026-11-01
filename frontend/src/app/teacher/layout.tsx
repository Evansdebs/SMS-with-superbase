import React from 'react';
import { TeacherLayoutShell } from '@/components/layout/TeacherLayoutShell';

export const metadata = {
  title: 'Teacher Portal | School Management System',
  description: 'Daily Teaching Cockpit, Classroom Roll Call, Lesson Prep & Continuous Assessment',
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayoutShell>{children}</TeacherLayoutShell>;
}


import React from 'react';
import { ParentLayoutShell } from '@/components/layout/ParentLayoutShell';

export const metadata = {
  title: 'Parent Portal | School Management System',
  description: 'Parent & Guardian Portal: Child Academic Progress, Results, Attendance, Exeat & Online Fees',
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParentLayoutShell>{children}</ParentLayoutShell>;
}


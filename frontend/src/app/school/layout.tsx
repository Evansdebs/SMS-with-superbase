import React from 'react';
import { SchoolLayoutShell } from '@/components/layout/SchoolLayoutShell';

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <SchoolLayoutShell>{children}</SchoolLayoutShell>;
}

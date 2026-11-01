import React from 'react';
import { FinanceLayoutShell } from '@/components/layout/FinanceLayoutShell';

export const metadata = {
  title: 'Finance & Bursary | School Management System',
  description: 'Institutional Accounting, Fee Collections, General Ledger, Payroll & Ghana Statutory Remittances',
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FinanceLayoutShell>{children}</FinanceLayoutShell>;
}


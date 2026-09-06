import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: {
    default: 'EduSuite Cloud — Multi-Tenant School Management Platform',
    template: '%s | EduSuite Cloud',
  },
  description:
    'Comprehensive enterprise multi-tenant school operating system with real-time analytics, finance, academics, examinations, and discipline management.',
  keywords: [
    'school management',
    'education ERP',
    'student attendance',
    'gradebook',
    'fee management',
  ],
  authors: [{ name: 'EduSuite Engineering' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}

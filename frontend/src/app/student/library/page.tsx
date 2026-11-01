'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Library,
  BookOpen,
  Search,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function StudentLibraryPage() {
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const borrowedBooks = [
    {
      id: 'bk-1',
      title: 'Integrated Science for JHS (Pupil\'s Book 1)',
      author: 'Ghana Education Service (GES / Aki-Ola Publications)',
      barcode: 'LIB-JHS-0089',
      issuedDate: 'Oct 02, 2026',
      dueDate: 'Dec 15, 2026',
      status: 'BORROWED',
      fine: 'GH₵ 0.00',
    },
    {
      id: 'bk-2',
      title: 'Approaches to BECE Core Mathematics (Volume 1)',
      author: 'K. A. Mensah & Sons',
      barcode: 'LIB-MTH-0142',
      issuedDate: 'Oct 15, 2026',
      dueDate: 'Nov 18, 2026',
      status: 'BORROWED',
      fine: 'GH₵ 0.00',
    },
  ];

  const libraryCatalog = [
    { title: 'The Cockcrow (Approved Literature for JHS)', author: 'WAEC / GES Curricula', category: 'English Literature', available: true },
    { title: 'New General Mathematics for Junior Secondary Schools', author: 'Channon, Smith & Head', category: 'Mathematics', available: true },
    { title: 'Modern Junior Atlas for Ghana & West Africa', author: 'Macmillan Education', category: 'Social Studies', available: false },
    { title: 'Computer Studies for Beginners (Practical ICT)', author: 'Dr. Evans Osei', category: 'Information Technology', available: true },
  ];

  const filteredCatalog = libraryCatalog.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Library & Textbook Loans</h1>
          <p className="text-slate-600 text-sm mt-1">
            Check your active textbook loans, return due dates, and search the campus digital catalog.
          </p>
        </div>
      </div>

      {/* Active Borrowed Books */}
      <Card className="bg-white border-slate-200 shadow-xs mb-8">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Currently Borrowed Books ({borrowedBooks.length})</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Assigned textbooks under student card STD2026001
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
            No Overdue Fines
          </Badge>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3.5">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{book.title}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{book.author}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">Barcode: {book.barcode}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Due Date:</span>
                  <span className="font-semibold text-slate-800">{book.dueDate}</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  On Loan
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Catalog Search */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Browse School Library Holdings</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Check book availability before visiting the circulation desk
            </CardDescription>
          </div>
          <div className="w-full sm:w-72 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {filteredCatalog.map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                <div className="text-slate-500 mt-0.5">{item.author} • <span className="text-indigo-600 font-medium">{item.category}</span></div>
              </div>
              <div>
                {item.available ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Available on Shelf
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Borrowed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}


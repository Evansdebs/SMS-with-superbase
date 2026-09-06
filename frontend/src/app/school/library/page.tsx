'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookMarked,
  Layers,
  ArrowRightLeft,
  User,
  AlertTriangle,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface BookItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

interface LoanItem {
  id: string;
  bookTitle: string;
  studentName: string;
  admissionNumber: string;
  borrowDate: string;
  dueDate: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'loans'>('catalog');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'LITERATURE',
    totalCopies: 1,
    shelfLocation: '',
  });

  const [newLoan, setNewLoan] = useState({
    bookId: '',
    studentName: '',
    admissionNumber: '',
    dueDate: '',
  });

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BookItem = {
      id: `bk-${Date.now()}`,
      title: newBook.title,
      author: newBook.author,
      isbn: newBook.isbn,
      category: newBook.category,
      totalCopies: Number(newBook.totalCopies),
      availableCopies: Number(newBook.totalCopies),
      shelfLocation: newBook.shelfLocation,
    };
    setBooks([...books, created]);
    setIsBookModalOpen(false);
  };

  const handleIssueLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBook = books.find((b) => b.id === newLoan.bookId);
    if (!targetBook || targetBook.availableCopies <= 0) return;

    const createdLoan: LoanItem = {
      id: `ln-${Date.now()}`,
      bookTitle: targetBook.title,
      studentName: newLoan.studentName,
      admissionNumber: newLoan.admissionNumber,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: newLoan.dueDate,
      status: 'BORROWED',
    };

    setLoans([createdLoan, ...loans]);
    setBooks(
      books.map((b) =>
        b.id === targetBook.id ? { ...b, availableCopies: b.availableCopies - 1 } : b
      )
    );
    setIsLoanModalOpen(false);
  };

  const handleReturnLoan = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return;

    setLoans(
      loans.map((l) => (l.id === loanId ? { ...l, status: 'RETURNED' } : l))
    );
    setBooks(
      books.map((b) =>
        b.title === loan.bookTitle ? { ...b, availableCopies: b.availableCopies + 1 } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Academic Resources & Media Center
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="info">Library System</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              School Library & Book Loans
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage textbook catalog, shelf locations, student borrowing checkout, and overdue return tracking.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsBookModalOpen(true)}
              variant="outline"
              size="sm"
              className="text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Add Book Title</span>
            </Button>
            <Button
              onClick={() => setIsLoanModalOpen(true)}
              size="sm"
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
              <span>Issue Book Loan</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Catalog Titles</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {books.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Total Volumes</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">
                {books.reduce((s, b) => s + b.totalCopies, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Currently Borrowed</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {loans.filter((l) => l.status === 'BORROWED').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-slate-500">Overdue Books</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">
                {loans.filter((l) => l.status === 'OVERDUE').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Book Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'loans'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            <span>Active Loans & Checkout ({loans.filter((l) => l.status !== 'RETURNED').length})</span>
          </button>
        </div>

        {/* Tab 1: Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search title, author, ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="AFRICAN_LITERATURE">African Literature</option>
                <option value="SCIENCE">Science & STEM</option>
                <option value="MATHEMATICS">Mathematics</option>
                <option value="LITERATURE">World Literature</option>
                <option value="REFERENCE">Dictionaries & Reference</option>
              </select>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                      <th className="p-3.5">Book Title</th>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Shelf Location</th>
                      <th className="p-3.5">ISBN</th>
                      <th className="p-3.5 text-center">Available / Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredBooks.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {bk.title}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{bk.author}</td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {bk.category}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {bk.shelfLocation}
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[10px]">{bk.isbn}</td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`font-mono font-bold ${
                              bk.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {bk.availableCopies} / {bk.totalCopies}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Loans */}
        {activeTab === 'loans' && (
          <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 font-semibold text-slate-600 dark:text-slate-400">
                    <th className="p-3.5">Book Title</th>
                    <th className="p-3.5">Borrower Student</th>
                    <th className="p-3.5">Borrow Date</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loans.map((ln) => (
                    <tr key={ln.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {ln.bookTitle}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold block">{ln.studentName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {ln.admissionNumber}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{ln.borrowDate}</td>
                      <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                        {ln.dueDate}
                      </td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            ln.status === 'RETURNED'
                              ? 'success'
                              : ln.status === 'OVERDUE'
                              ? 'destructive'
                              : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {ln.status}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        {ln.status !== 'RETURNED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturnLoan(ln.id)}
                            className="text-xs h-7 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                          >
                            Mark Returned
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Add Book Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Add Book Title to Catalog"
        description="Register a new textbook, novel, or reference material"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Book Title *
            </label>
            <Input
              required
              placeholder="e.g. Government for Senior Secondary Schools"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Author *
              </label>
              <Input
                required
                placeholder="e.g. J. A. Mensah"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ISBN Number
              </label>
              <Input
                placeholder="e.g. 978-0123456789"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
              >
                <option value="LITERATURE">Literature & English</option>
                <option value="SCIENCE">Science & STEM</option>
                <option value="MATHEMATICS">Mathematics</option>
                <option value="SOCIAL_STUDIES">Social Studies & History</option>
                <option value="REFERENCE">Reference Desk</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Copies *
              </label>
              <Input
                type="number"
                min={1}
                required
                value={newBook.totalCopies}
                onChange={(e) => setNewBook({ ...newBook, totalCopies: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Shelf / Storage Location
            </label>
            <Input
              placeholder="e.g. Section B - Shelf 4"
              value={newBook.shelfLocation}
              onChange={(e) => setNewBook({ ...newBook, shelfLocation: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsBookModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Title
            </Button>
          </div>
        </form>
      </Modal>

      {/* Issue Loan Modal */}
      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        title="Issue Book Loan"
        description="Checkout a library volume to an enrolled student"
      >
        <form onSubmit={handleIssueLoan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Book Title *
            </label>
            <select
              value={newLoan.bookId}
              onChange={(e) => setNewLoan({ ...newLoan, bookId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              {books
                .filter((b) => b.availableCopies > 0)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — {b.availableCopies} available ({b.shelfLocation})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Borrower Student *
            </label>
            <select
              value={newLoan.studentName}
              onChange={(e) => {
                const name = e.target.value;
                setNewLoan({
                  ...newLoan,
                  studentName: name,
                  admissionNumber: name === 'Kwame Mensah' ? 'TLS-2025-001' : 'TLS-2025-002',
                });
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            >
              <option value="Kwame Mensah">Kwame Mensah (TLS-2025-001)</option>
              <option value="Abena Osei">Abena Osei (TLS-2025-002)</option>
              <option value="Kofi Boateng">Kofi Boateng (TLS-2025-003)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Expected Return Due Date *
            </label>
            <Input
              type="date"
              required
              value={newLoan.dueDate}
              onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLoanModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
              Confirm Checkout
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

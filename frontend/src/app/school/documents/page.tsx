'use client';

import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  FileText,
  FilePlus,
  Download,
  Trash2,
  Search,
  Upload,
  Image,
  File,
  FileSpreadsheet,
  Shield,
  Clock,
  ChevronDown,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SchoolNav } from '@/components/layout/SchoolNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

// ── Types ─────────────────────────────────────────────────────────────────────

type DocCategory =
  | 'Academic Records'
  | 'Administrative'
  | 'Finance'
  | 'HR & Staff'
  | 'Legal & Compliance'
  | 'Media & Assets';

interface SchoolDocument {
  id: string;
  name: string;
  category: DocCategory;
  fileType: 'pdf' | 'xlsx' | 'docx' | 'png' | 'jpg' | 'csv';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  isConfidential: boolean;
  downloadCount: number;
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const INITIAL_DOCS: SchoolDocument[] = [
  { id: 'd-1', name: 'School Academic Calendar 2025-2026.pdf', category: 'Academic Records', fileType: 'pdf', size: '1.2 MB', uploadedBy: 'Mrs. Adwoa Osei', uploadedAt: '2025-09-01', description: 'Official school calendar including term dates, holidays, and examination periods.', isConfidential: false, downloadCount: 47 },
  { id: 'd-2', name: 'GES School Licence & Accreditation.pdf', category: 'Legal & Compliance', fileType: 'pdf', size: '3.4 MB', uploadedBy: 'Mr. Kwame Acheampong', uploadedAt: '2025-08-15', description: 'Ghana Education Service school operating licence and accreditation documents.', isConfidential: true, downloadCount: 5 },
  { id: 'd-3', name: 'Term 1 Fee Structure 2025-2026.xlsx', category: 'Finance', fileType: 'xlsx', size: '256 KB', uploadedBy: 'Bursar Efua Asante', uploadedAt: '2025-09-02', description: 'Detailed fee schedule for all classes including PTA levy and ICT charges.', isConfidential: false, downloadCount: 128 },
  { id: 'd-4', name: 'Staff Handbook & Code of Conduct.pdf', category: 'HR & Staff', fileType: 'pdf', size: '2.1 MB', uploadedBy: 'Headmaster', uploadedAt: '2025-08-28', description: 'Guidelines, responsibilities, and professional conduct policy for all staff.', isConfidential: false, downloadCount: 23 },
  { id: 'd-5', name: 'JHS 3 Results Terminal Report 2024.pdf', category: 'Academic Records', fileType: 'pdf', size: '4.7 MB', uploadedBy: 'Mr. Yaw Darko', uploadedAt: '2025-04-12', description: 'Compiled JHS 3 terminal examination results and BECE aggregate summary.', isConfidential: true, downloadCount: 2 },
  { id: 'd-6', name: 'School Building Photo Gallery.zip', category: 'Media & Assets', fileType: 'png', size: '48.2 MB', uploadedBy: 'Admin', uploadedAt: '2025-07-20', description: 'Professional photographs of school buildings, classrooms, and facilities.', isConfidential: false, downloadCount: 11 },
  { id: 'd-7', name: 'Parent-Teacher Meeting Minutes – Term 1.docx', category: 'Administrative', fileType: 'docx', size: '340 KB', uploadedBy: 'Mrs. Adwoa Osei', uploadedAt: '2025-10-08', description: 'Minutes from Term 1 PTA meeting including decisions and action items.', isConfidential: false, downloadCount: 34 },
  { id: 'd-8', name: 'Student Enrolment Register 2025.csv', category: 'Academic Records', fileType: 'csv', size: '88 KB', uploadedBy: 'Bursar Efua Asante', uploadedAt: '2025-09-05', description: 'Full student enrolment list with admission numbers, class allocation, and contacts.', isConfidential: true, downloadCount: 3 },
  { id: 'd-9', name: 'Procurement & Supplier Contracts.pdf', category: 'Finance', fileType: 'pdf', size: '5.2 MB', uploadedBy: 'Headmaster', uploadedAt: '2025-06-10', description: 'Vendor contracts for stationery, meals, and maintenance services.', isConfidential: true, downloadCount: 1 },
  { id: 'd-10', name: 'School Logo & Brand Assets.png', category: 'Media & Assets', fileType: 'png', size: '2.4 MB', uploadedBy: 'Admin', uploadedAt: '2025-01-15', description: 'Official school crest, logo in various formats, and approved colour palette.', isConfidential: false, downloadCount: 89 },
];

const CATEGORIES: DocCategory[] = ['Academic Records', 'Administrative', 'Finance', 'HR & Staff', 'Legal & Compliance', 'Media & Assets'];

// ── Helpers ───────────────────────────────────────────────────────────────────

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  docx: FileText,
  png: Image,
  jpg: Image,
};

const FILE_COLORS: Record<string, string> = {
  pdf: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
  xlsx: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
  csv: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40',
  docx: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  png: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
  jpg: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
};

const CATEGORY_COLORS: Record<DocCategory, string> = {
  'Academic Records': 'info',
  'Administrative': 'secondary',
  'Finance': 'warning',
  'HR & Staff': 'success',
  'Legal & Compliance': 'destructive',
  'Media & Assets': 'default',
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [docs, setDocs] = useState<SchoolDocument[]>(INITIAL_DOCS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocCategory | 'All'>('All');
  const [confidentialFilter, setConfidentialFilter] = useState<'all' | 'public' | 'confidential'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<SchoolDocument | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Academic Records' as DocCategory,
    description: '',
    isConfidential: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = docs.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || d.category === categoryFilter;
    const matchConf =
      confidentialFilter === 'all' ||
      (confidentialFilter === 'confidential' && d.isConfidential) ||
      (confidentialFilter === 'public' && !d.isConfidential);
    return matchSearch && matchCat && matchConf;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;
    const newDoc: SchoolDocument = {
      id: `d-${Date.now()}`,
      name: uploadForm.name.endsWith('.pdf') ? uploadForm.name : `${uploadForm.name}.pdf`,
      category: uploadForm.category,
      fileType: 'pdf',
      size: '1.0 MB',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      description: uploadForm.description,
      isConfidential: uploadForm.isConfidential,
      downloadCount: 0,
    };
    setDocs([newDoc, ...docs]);
    setUploadSuccess(true);
    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadSuccess(false);
      setUploadForm({ name: '', category: 'Academic Records', description: '', isConfidential: false });
    }, 1400);
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter((d) => d.id !== id));
    if (previewDoc?.id === id) setPreviewDoc(null);
  };

  const handleDownload = (doc: SchoolDocument) => {
    setDocs(docs.map((d) => d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d));
  };

  const totalSize = docs.length;
  const confidentialCount = docs.filter((d) => d.isConfidential).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SchoolNav />

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="h-7 w-7 text-blue-600" />
              Document Vault
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Secure repository for all official school documents and records.
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Documents', value: totalSize, icon: FileText, color: 'blue' },
            { label: 'Confidential', value: confidentialCount, icon: Shield, color: 'rose' },
            { label: 'Categories', value: CATEGORIES.length, icon: FolderOpen, color: 'violet' },
            { label: 'Most Downloaded', value: '128×', icon: Download, color: 'emerald' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-950/40`}>
                    <Icon className={`h-5 w-5 text-${s.color}-600 dark:text-${s.color}-400`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents, descriptions, or uploader..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as DocCategory | 'All')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              value={confidentialFilter}
              onChange={(e) => setConfidentialFilter(e.target.value as 'all' | 'public' | 'confidential')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Access Levels</option>
              <option value="public">Public Only</option>
              <option value="confidential">Confidential Only</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Document grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((doc) => {
            const FileIcon = FILE_ICONS[doc.fileType] || File;
            const fileColorClass = FILE_COLORS[doc.fileType] || 'text-slate-600 bg-slate-100';
            return (
              <Card
                key={doc.id}
                className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${fileColorClass}`}>
                      <FileIcon className="h-6 w-6" />
                    </div>
                    {doc.isConfidential && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40">
                        <Shield className="h-3 w-3 text-rose-500" />
                        <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">Confidential</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{doc.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant={CATEGORY_COLORS[doc.category] as any} className="text-[10px]">
                      {doc.category}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {doc.fileType.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.uploadedAt}
                    </span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-right">
                    ↓ {doc.downloadCount} downloads · by {doc.uploadedBy.split(' ')[0]}
                  </p>
                </CardContent>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
              <FolderOpen className="h-16 w-16 mb-4 opacity-40" />
              <p className="text-lg font-semibold">No documents found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Document">
        {uploadSuccess ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <p className="text-lg font-semibold text-slate-800 dark:text-white">Document uploaded!</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Document Name / Title *</label>
              <Input
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="e.g., Term 2 Timetable 2025.pdf"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as DocCategory })}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Brief description of this document's contents..."
                rows={3}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Simulated file picker */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click to select file — <span className="text-blue-600 font-semibold">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, CSV, PNG, JPG (max 50 MB)</p>
              <input ref={fileInputRef} type="file" className="hidden" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadForm.isConfidential}
                onChange={(e) => setUploadForm({ ...uploadForm, isConfidential: e.target.checked })}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Confidential</p>
                <p className="text-xs text-slate-500">Restricts visibility to Admins and Headmaster only.</p>
              </div>
            </label>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Preview Modal */}
      {previewDoc && (
        <Modal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} title="Document Details">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              {(() => {
                const FileIcon = FILE_ICONS[previewDoc.fileType] || File;
                const colorClass = FILE_COLORS[previewDoc.fileType] || 'text-slate-600 bg-slate-100';
                return (
                  <div className={`p-3 rounded-xl ${colorClass}`}>
                    <FileIcon className="h-8 w-8" />
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white truncate">{previewDoc.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{previewDoc.size} · {previewDoc.fileType.toUpperCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-0.5">Category</p>
                <p className="font-semibold text-slate-800 dark:text-white">{previewDoc.category}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-0.5">Uploaded By</p>
                <p className="font-semibold text-slate-800 dark:text-white">{previewDoc.uploadedBy}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-0.5">Upload Date</p>
                <p className="font-semibold text-slate-800 dark:text-white">{previewDoc.uploadedAt}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-0.5">Downloads</p>
                <p className="font-semibold text-slate-800 dark:text-white">{previewDoc.downloadCount} times</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{previewDoc.description}</p>
            </div>

            {previewDoc.isConfidential && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                <Shield className="h-4 w-4 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  This document is marked Confidential — restricted to Admin and Headmaster access only.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleDownload(previewDoc)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={() => handleDelete(previewDoc.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

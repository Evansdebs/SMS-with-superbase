'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  FileText,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getStoredSession } from '@/lib/api';

export default function StudentAcademicsPage() {
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  const subjects = [
    {
      id: 'sub-001',
      name: 'Integrated Science',
      code: 'SCI101',
      teacher: 'Mr. Kwame Mensah',
      currentTopic: 'Photosynthesis & Light-Dependent Reactions',
      materialsCount: 4,
      isCore: true,
      resources: [
        { title: 'Unit 3: Photosynthesis Lecture Slides.pdf', type: 'PDF', size: '3.4 MB', date: 'Oct 28' },
        { title: 'Lab Practical Guide: Titration Reaction.docx', type: 'DOCX', size: '1.2 MB', date: 'Oct 24' },
      ],
    },
    {
      id: 'sub-002',
      name: 'Core Mathematics',
      code: 'MTH101',
      teacher: 'Mr. Kwame Mensah',
      currentTopic: 'Linear Equations & Coordinate Geometry',
      materialsCount: 5,
      isCore: true,
      resources: [
        { title: 'Unit 4: Linear Equations Practice Set.pdf', type: 'PDF', size: '2.1 MB', date: 'Oct 29' },
        { title: 'Cartesian Graphing Paper Template.pdf', type: 'PDF', size: '450 KB', date: 'Oct 20' },
      ],
    },
    {
      id: 'sub-003',
      name: 'English Language',
      code: 'ENG101',
      teacher: 'Ms. Cynthia Addo',
      currentTopic: 'Direct & Indirect Speech Rules',
      materialsCount: 3,
      isCore: true,
      resources: [
        { title: 'Reported Speech Grammar Rules Handbook.pdf', type: 'PDF', size: '1.8 MB', date: 'Oct 26' },
      ],
    },
    {
      id: 'sub-004',
      name: 'Social Studies',
      code: 'SOC101',
      teacher: 'Mr. Emmanuel Ofori',
      currentTopic: 'The 1992 Fourth Republican Constitution',
      materialsCount: 3,
      isCore: true,
      resources: [
        { title: 'Civic Responsibilities & The Constitution Summary.pdf', type: 'PDF', size: '2.7 MB', date: 'Oct 22' },
      ],
    },
    {
      id: 'sub-005',
      name: 'Information & Communications Technology (ICT)',
      code: 'ICT101',
      teacher: 'Mr. Mensah',
      currentTopic: 'Spreadsheet Formulas & Data Visualizations',
      materialsCount: 4,
      isCore: false,
      resources: [
        { title: 'Excel Functions & Cell Referencing Cheatsheet.pdf', type: 'PDF', size: '1.5 MB', date: 'Oct 25' },
      ],
    },
  ];

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.currentTopic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedSubject === 'ALL' || (selectedSubject === 'CORE' ? s.isCore : !s.isCore);
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curriculum Syllabi & NaCCA Lesson Notes</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Subjects & Learning Resources</h1>
          <p className="text-slate-600 text-sm mt-1">
            Access teacher lecture slides, revision guides, past exam questions, and course notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search subjects or topic keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={selectedSubject === 'ALL' ? 'default' : 'outline'}
            onClick={() => setSelectedSubject('ALL')}
            className={`text-xs ${selectedSubject === 'ALL' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-200 text-slate-700'}`}
          >
            All Subjects
          </Button>
          <Button
            size="sm"
            variant={selectedSubject === 'CORE' ? 'default' : 'outline'}
            onClick={() => setSelectedSubject('CORE')}
            className={`text-xs ${selectedSubject === 'CORE' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-200 text-slate-700'}`}
          >
            Core Subjects
          </Button>
          <Button
            size="sm"
            variant={selectedSubject === 'ELECTIVE' ? 'default' : 'outline'}
            onClick={() => setSelectedSubject('ELECTIVE')}
            className={`text-xs ${selectedSubject === 'ELECTIVE' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-slate-200 text-slate-700'}`}
          >
            Electives
          </Button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub) => (
          <Card key={sub.id} className="bg-white border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`text-[10px] ${sub.isCore ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600'}`}>
                    {sub.code}
                  </Badge>
                  {sub.isCore && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                      Core BECE
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-2">{sub.name}</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Taught by {sub.teacher}
                </CardDescription>
              </div>

              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="h-5 w-5" />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Topic:</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{sub.currentTopic}</p>
              </div>

              {/* Learning Resources / Attachments */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Teacher Uploaded Materials:</div>
                {sub.resources.map((res, i) => (
                  <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{res.title}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-600 hover:text-indigo-800 shrink-0 font-medium p-0 pl-2">
                      <Download className="h-3.5 w-3.5 mr-1" /> {res.size}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  UserCheck,
  Calendar,
  Layers,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';

export default function NewSchoolWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clean initial form state ready for production input
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    admin: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
    academic: {
      academicYear: '2025/2026',
      currentTerm: 'Term 1',
    },
    departments: ['Kindergarten', 'Primary School', 'Junior High School'],
    classes: [
      { name: 'KG 1', stream: 'A', level: 'KG', departmentName: 'Kindergarten' },
      { name: 'KG 2', stream: 'A', level: 'KG', departmentName: 'Kindergarten' },
      { name: 'Class 1', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'Class 2', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'Class 3', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'Class 4', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'Class 5', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'Class 6', stream: 'A', level: 'Primary', departmentName: 'Primary School' },
      { name: 'JHS 1', stream: 'Gold', level: 'JHS', departmentName: 'Junior High School' },
      { name: 'JHS 2', stream: 'Gold', level: 'JHS', departmentName: 'Junior High School' },
      { name: 'JHS 3', stream: 'Gold', level: 'JHS', departmentName: 'Junior High School' },
    ],
    subjects: [
      { name: 'English Language', code: 'ENG' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Integrated Science', code: 'SCI' },
      { name: 'Social Studies', code: 'SOC' },
      { name: 'Information & Communication Tech (ICT)', code: 'ICT' },
      { name: 'Ghanaian Language', code: 'GHA' },
      { name: 'Religious & Moral Education (RME)', code: 'RME' },
      { name: 'Basic Design & Technology (BDT)', code: 'BDT' },
      { name: 'French', code: 'FRE' },
    ],
    gradingScale: [
      { grade: '1', min: 90, max: 100, desc: 'Grade 1 - Highest Stanine' },
      { grade: '2', min: 80, max: 89, desc: 'Grade 2 - Higher' },
      { grade: '3', min: 70, max: 79, desc: 'Grade 3 - High Average' },
      { grade: '4', min: 60, max: 69, desc: 'Grade 4 - Average' },
      { grade: '5', min: 55, max: 59, desc: 'Grade 5 - Average' },
      { grade: '6', min: 50, max: 54, desc: 'Grade 6 - Low Average' },
      { grade: '7', min: 45, max: 49, desc: 'Grade 7 - Low' },
      { grade: '8', min: 40, max: 44, desc: 'Grade 8 - Lower' },
      { grade: '9', min: 0, max: 39, desc: 'Grade 9 - Lowest' },
    ],
    gradingSystem: 'GHANA_BECE' as 'GHANA_BECE' | 'STANDARD_LETTER',
  });

  const stepsList = [
    { num: 1, label: 'School Info', icon: Building2 },
    { num: 2, label: 'Administrator', icon: UserCheck },
    { num: 3, label: 'Academic Session', icon: Calendar },
    { num: 4, label: 'Departments', icon: Layers },
    { num: 5, label: 'Classes', icon: GraduationCap },
    { num: 6, label: 'Subjects', icon: BookOpen },
    { num: 7, label: 'Grading System', icon: Award },
    { num: 8, label: 'Complete Setup', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !formData.name.trim()) {
      setErrorMsg('School name is required.');
      return;
    }
    if (step === 2 && (!formData.admin.email.trim() || !formData.admin.firstName.trim())) {
      setErrorMsg('Administrator name and email are required.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateSchool = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await apiRequest('/admin/schools/wizard', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccessData(res);
    } catch (e: any) {
      setErrorMsg(e?.message || 'Failed to create school. Please verify your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AdminNav />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Back to Super Admin Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2.5">
              <span>8-Step School Creation Wizard</span>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Onboard a complete new school tenant with academic structure and admin credentials.
            </p>
          </div>
        </div>

        {/* Progress Bar & Steps Tabs */}
        <div className="mt-6 mb-8">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {stepsList.map((s) => {
              const Icon = s.icon;
              const isDone = s.num < step;
              const isCurrent = s.num === step;
              return (
                <div
                  key={s.num}
                  onClick={() => !successData && setStep(s.num)}
                  className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-sm'
                      : isDone
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full mb-1">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold truncate w-full">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Cards */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successData ? (
          <Card className="bg-white border-emerald-200 text-center p-8 shadow-sm">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">School Created Successfully!</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              The school tenant has been isolated and provisioned in the database with full academic structure.
            </p>

            <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">School Name</span>
                <p className="text-base font-bold text-slate-900">{successData.school.name}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unique School Code</span>
                  <p className="font-mono text-xl font-extrabold text-amber-700">
                    {successData.school.schoolCode}
                  </p>
                </div>
                <Badge variant="success">ACTIVE</Badge>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400">Administrator</span>
                <p className="text-xs text-slate-700 font-medium">{successData.admin.name} ({successData.admin.email})</p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                  Return to Dashboard
                </Button>
              </Link>
              <Link href={`/school/login?code=${successData.school.schoolCode}`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm">
                  Go to School Portal ({successData.school.schoolCode})
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="bg-white border-slate-200 p-6 shadow-sm">
            {/* Step 1: School Information */}
            {step === 1 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 1: School Information</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Enter the fundamental details of the institution. A human-readable School Code will be generated automatically.
                  </CardDescription>
                </CardHeader>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">School Name *</label>
                    <Input
                      placeholder="e.g. The Living Spring School"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700">Official Email</label>
                      <Input
                        placeholder="info@school.edu.gh"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700">Phone Number</label>
                      <Input
                        placeholder="+233 ..."
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700">Address / Location</label>
                    <Input
                      placeholder="Street address, City, Region"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Administrator */}
            {step === 2 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 2: School Administrator</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Assign the headmaster or initial school administrator. They will log in using their email and the generated School Code.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">First Name *</label>
                    <Input
                      value={formData.admin.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin: { ...formData.admin, firstName: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Last Name *</label>
                    <Input
                      value={formData.admin.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin: { ...formData.admin, lastName: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Admin Email *</label>
                    <Input
                      type="email"
                      value={formData.admin.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin: { ...formData.admin, email: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Phone Number</label>
                    <Input
                      value={formData.admin.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin: { ...formData.admin, phoneNumber: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Academic Configuration */}
            {step === 3 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 3: Academic Configuration</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Set up the active academic calendar and current session term.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Academic Year</label>
                    <Input
                      value={formData.academic.academicYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          academic: { ...formData.academic, academicYear: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Current Term</label>
                    <Input
                      value={formData.academic.currentTerm}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          academic: { ...formData.academic, currentTerm: e.target.value },
                        })
                      }
                      className="mt-1 bg-white border-slate-200 text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Departments */}
            {step === 4 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 4: School Levels &amp; Departments</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Select the operational tiers for this school.
                  </CardDescription>
                </CardHeader>

                <div className="space-y-2">
                  {['Kindergarten', 'Primary School', 'Junior High School', 'Senior High School'].map((dept) => {
                    const isChecked = formData.departments.includes(dept);
                    return (
                      <div
                        key={dept}
                        onClick={() => {
                          if (isChecked) {
                            setFormData({
                              ...formData,
                              departments: formData.departments.filter((d) => d !== dept),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              departments: [...formData.departments, dept],
                            });
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-amber-300 bg-amber-50 text-slate-900'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{dept}</span>
                        <div className={`h-4 w-4 rounded flex items-center justify-center ${isChecked ? 'bg-amber-500 text-slate-950' : 'border border-slate-300'}`}>
                          {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Classes */}
            {step === 5 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 5: Classes &amp; Streams</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Default classes generated based on Ghana Education Service curriculum.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {formData.classes.map((cls, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-900">{cls.name}</span>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        Stream {cls.stream}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Subjects */}
            {step === 6 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 6: Subjects Catalog</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Core and elective subjects configured for this institution.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {formData.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800">{sub.name}</span>
                      <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                        {sub.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 7: Grading System */}
            {step === 7 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 7: Grading System</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Configure the evaluation standard for report cards and BECE aggregate calculation.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, gradingSystem: 'GHANA_BECE' })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.gradingSystem === 'GHANA_BECE'
                        ? 'border-amber-400 bg-amber-50 text-slate-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Ghana BECE 9-Point Scale</span>
                      <Badge variant="warning">Recommended</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Standard Stanine grading system (Grade 1 - Highest to Grade 9) with automatic 4-core + 2-best electives aggregate.
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, gradingSystem: 'STANDARD_LETTER' })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.gradingSystem === 'STANDARD_LETTER'
                        ? 'border-amber-400 bg-amber-50 text-slate-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Standard Letter Grade</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      A (80-100), B (70-79), C (60-69), D (50-59), F (&lt;50) scale for primary and general levels.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Review & Complete Setup */}
            {step === 8 && (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg text-slate-900">Step 8: Review &amp; Provisioning</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Confirm configuration and initialize the new school tenant.
                  </CardDescription>
                </CardHeader>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">School Name:</span>
                    <span className="font-bold text-slate-900">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Head Administrator:</span>
                    <span className="font-medium text-slate-800">
                      {formData.admin.firstName} {formData.admin.lastName} ({formData.admin.email})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Session:</span>
                    <span className="text-slate-800">
                      {formData.academic.academicYear} • {formData.academic.currentTerm}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Departments:</span>
                    <span className="text-slate-800">{formData.departments.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Classes Provisioned:</span>
                    <span className="text-slate-800">{formData.classes.length} Classes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Grading System:</span>
                    <Badge variant="warning">{formData.gradingSystem}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={step === 1 || submitting}
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Previous
              </Button>

              {step < 8 ? (
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleCreateSchool}
                  disabled={submitting}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  {submitting ? 'Provisioning School...' : 'Complete & Launch School'}
                  <CheckCircle2 className="h-4 w-4 ml-1.5" />
                </Button>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

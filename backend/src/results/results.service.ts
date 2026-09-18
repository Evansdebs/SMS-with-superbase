import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GradingService } from '../academics/grading.service';
import { RecordBatchScoresDto } from './dto/record-scores.dto';

@Injectable()
export class ResultsService {
  constructor(
    private prisma: PrismaService,
    private gradingService: GradingService,
  ) {}

  async recordBatchScores(schoolId: string, dto: RecordBatchScoresDto) {
    // 1. Verify class belongs to this school
    const classRecord = await this.prisma.class.findFirst({
      where: { id: dto.classId, schoolId },
    });

    if (!classRecord) {
      throw new NotFoundException('Class not found in this school');
    }

    // 2. Verify subject belongs to this school
    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, schoolId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found in this school');
    }

    const isJHS = (classRecord.level || '').toUpperCase().includes('JHS');

    return this.prisma.$transaction(async (tx) => {
      const savedResults = [];

      for (const entry of dto.scores) {
        // Verify student belongs to this school
        const student = await tx.student.findFirst({
          where: { id: entry.studentId, schoolId },
        });

        if (!student) continue;

        // Compute total: Continuous Assessment (classwork + test) + Exam
        // Normalize to 100 if entered as 50 + 50 or weighted
        const ca = (entry.classwork || 0) + (entry.test || 0);
        const exam = entry.exam || 0;
        const totalScore = Math.min(100, Math.round(ca + exam));

        // Grade calculation
        let gradeStr: string;
        let defaultRemark: string;

        if (isJHS) {
          const stanine = this.gradingService.calculateStanineGrade(totalScore);
          gradeStr = `Grade ${stanine.grade}`;
          defaultRemark = stanine.remark;
        } else {
          const letter = this.gradingService.calculatePrimaryGrade(totalScore);
          gradeStr = letter.grade;
          defaultRemark = letter.remark;
        }

        // Check if result already exists for student + subject + class
        const existing = await tx.result.findFirst({
          where: {
            schoolId,
            studentId: entry.studentId,
            subjectId: dto.subjectId,
            classId: dto.classId,
          },
        });

        if (existing) {
          if (existing.isPublished) {
            throw new BadRequestException(
              `Results for student ${student.firstName} ${student.lastName} (${student.admissionNumber}) are locked and published. Modification requires an approved correction workflow.`,
            );
          }
          const updated = await tx.result.update({
            where: { id: existing.id },
            data: {
              score: totalScore,
              grade: gradeStr,
              remarks: entry.remarks || defaultRemark,
              assessmentType: 'EXAM_AND_CA',
            },
          });
          savedResults.push(updated);
        } else {
          const created = await tx.result.create({
            data: {
              schoolId,
              studentId: entry.studentId,
              classId: dto.classId,
              subjectId: dto.subjectId,
              termId: dto.termId,
              academicYearId: dto.academicYearId,
              score: totalScore,
              maxScore: 100,
              grade: gradeStr,
              remarks: entry.remarks || defaultRemark,
              assessmentType: 'EXAM_AND_CA',
            },
          });
          savedResults.push(created);
        }
      }

      return {
        success: true,
        count: savedResults.length,
        results: savedResults,
      };
    });
  }

  async getClassResults(schoolId: string, classId: string, subjectId?: string) {
    const where: any = { schoolId, classId };
    if (subjectId) where.subjectId = subjectId;

    return this.prisma.result.findMany({
      where,
      include: {
        student: true,
      },
      orderBy: { score: 'desc' },
    });
  }

  async getStudentReportCard(schoolId: string, studentId: string) {
    // 1. Fetch School Details & Branding
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    // 2. Fetch Student with Class
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId },
      include: {
        class: true,
        guardians: {
          include: { parent: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found in this school');
    }

    // 3. Fetch All Results for Student
    const results = await this.prisma.result.findMany({
      where: { schoolId, studentId },
    });

    // 4. Fetch All Subjects for naming
    const subjects = await this.prisma.subject.findMany({
      where: { schoolId },
    });
    const subjectMap = new Map<string, any>(subjects.map((s) => [s.id, s]));

    // 5. Attendance Summary
    const attendanceRecords = await this.prisma.attendance.findMany({
      where: { schoolId, studentId },
    });

    const totalDays = attendanceRecords.length || 60; // Default term days if early in session
    const daysPresent = attendanceRecords.filter((a) => a.status === 'PRESENT').length || 58;
    const daysAbsent = totalDays - daysPresent;

    // 6. Enrich results with subject names
    const enrichedResults = results.map((r) => {
      const sub = r.subjectId ? subjectMap.get(r.subjectId) : null;
      const subName = sub ? sub.name : 'General Subject';
      const subCode = (sub?.code || '').toUpperCase().trim();
      const isCore =
        ['ENG', 'MATH', 'SCI', 'SOC', 'CORE_ENG', 'CORE_MATH', 'CORE_SCI', 'CORE_SOC'].includes(subCode) ||
        [
          'English Language',
          'Mathematics',
          'Integrated Science',
          'Social Studies',
        ].some((core) => subName.toLowerCase().includes(core.toLowerCase()));

      return {
        id: r.id,
        subjectName: subName,
        subjectCode: sub?.code || 'GEN',
        score: r.score,
        grade: r.grade,
        remarks: r.remarks,
        isCore,
      };
    });

    // 7. BECE Aggregate Calculation if JHS
    const isJHS = (student.class?.level || '').toUpperCase().includes('JHS');
    let beceAggregate: any = null;

    if (isJHS && enrichedResults.length > 0) {
      const aggregateInputs = enrichedResults.map((r) => ({
        subjectName: r.subjectName,
        isCore: r.isCore,
        score: r.score,
      }));
      beceAggregate = this.gradingService.calculateBECEAggregate(aggregateInputs);
    }

    // Calculate Overall Average
    const totalScore = enrichedResults.reduce((acc, r) => acc + r.score, 0);
    const average = enrichedResults.length > 0
      ? (totalScore / enrichedResults.length).toFixed(1)
      : '0.0';

    return {
      school: {
        name: school.name,
        schoolCode: school.schoolCode,
        address: school.address || 'Accra, Ghana',
        phoneNumber: school.phoneNumber || '+233 24 000 0000',
        email: school.email || 'info@school.edu.gh',
        logo: school.logo,
        academicYear: school.academicYear || '2025/2026',
        currentTerm: school.currentTerm || 'Term 1',
      },
      student: {
        id: student.id,
        admissionNumber: student.admissionNumber,
        fullName: `${student.firstName} ${student.lastName}`,
        gender: student.gender || 'N/A',
        class: `${student.class?.name || 'Class'} (${student.class?.stream || 'A'})`,
        level: student.class?.level || 'General',
      },
      attendance: {
        totalDays,
        daysPresent,
        daysAbsent,
        attendanceRate: `${Math.round((daysPresent / totalDays) * 100)}%`,
      },
      performance: {
        subjects: enrichedResults,
        totalScore,
        average,
        beceAggregate,
      },
      remarks: {
        conduct: 'Respectful, hardworking, and attentive in class.',
        attitude: 'Positive attitude toward academic studies and extracurriculars.',
        classTeacherRemarks: 'A very diligent student with consistent academic output.',
        headteacherRemarks: 'Promising results. Keep up the high standard.',
      },
    };
  }

  async publishClassResults(schoolId: string, classId: string, currentUserId?: string) {
    await this.prisma.result.updateMany({
      where: { schoolId, classId },
      data: { isPublished: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: 'PUBLISH_RESULTS',
        entityType: 'CLASS',
        entityId: classId,
        schoolId,
        details: { classId, isPublished: true },
        result: 'SUCCESS',
      },
    });

    return { success: true, message: 'Class results published and locked successfully' };
  }

  // ===================== ASSESSMENTS =====================
  async getAssessments(schoolId: string, classId?: string, subjectId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    if (subjectId) where.subjectId = subjectId;
    return this.prisma.assessment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAssessment(schoolId: string, data: {
    classId: string;
    subjectId: string;
    academicYear: string;
    term: string;
    name: string;
    type: string;
    weightPercentage?: number;
    maxMarks?: number;
    date?: string;
  }) {
    return this.prisma.assessment.create({
      data: {
        schoolId,
        classId: data.classId,
        subjectId: data.subjectId,
        academicYear: data.academicYear,
        term: data.term,
        name: data.name,
        type: data.type,
        weightPercentage: data.weightPercentage ?? 30,
        maxMarks: data.maxMarks ?? 100,
        date: data.date ? new Date(data.date) : null,
      },
    });
  }

  // ===================== PERSISTENT REPORT CARDS =====================
  async generateClassReportCards(schoolId: string, dto: { classId: string; academicYear: string; term: string }) {
    const students = await this.prisma.student.findMany({
      where: { schoolId, classId: dto.classId, status: 'ACTIVE' },
      select: { id: true },
    });

    if (students.length === 0) {
      throw new BadRequestException('No active students found in this class');
    }

    const createdCards = [];
    for (const student of students) {
      const cardData = await this.getStudentReportCard(schoolId, student.id);
      const isJHS = cardData.student.level.toUpperCase().includes('JHS');
      const aggregate = isJHS && cardData.performance.beceAggregate ? cardData.performance.beceAggregate.totalAggregate : null;
      const remark = isJHS && cardData.performance.beceAggregate ? cardData.performance.beceAggregate.division : null;

      const reportCard = await this.prisma.reportCard.upsert({
        where: {
          schoolId_studentId_academicYear_term: {
            schoolId,
            studentId: student.id,
            academicYear: dto.academicYear,
            term: dto.term,
          },
        },
        update: {
          classId: dto.classId,
          totalScore: Number(cardData.performance.totalScore),
          averageScore: parseFloat(cardData.performance.average),
          aggregateScore: aggregate,
          aggregateRemark: remark,
          attendancePresent: cardData.attendance.daysPresent,
          attendanceTotal: cardData.attendance.totalDays,
          conduct: cardData.remarks.conduct,
          attitude: cardData.remarks.attitude,
          classTeacherRemarks: cardData.remarks.classTeacherRemarks,
          headteacherRemarks: cardData.remarks.headteacherRemarks,
        },
        create: {
          schoolId,
          studentId: student.id,
          classId: dto.classId,
          academicYear: dto.academicYear,
          term: dto.term,
          totalScore: Number(cardData.performance.totalScore),
          averageScore: parseFloat(cardData.performance.average),
          aggregateScore: aggregate,
          aggregateRemark: remark,
          attendancePresent: cardData.attendance.daysPresent,
          attendanceTotal: cardData.attendance.totalDays,
          conduct: cardData.remarks.conduct,
          attitude: cardData.remarks.attitude,
          classTeacherRemarks: cardData.remarks.classTeacherRemarks,
          headteacherRemarks: cardData.remarks.headteacherRemarks,
          status: 'DRAFT',
        },
      });
      createdCards.push(reportCard);
    }

    // Assign class rank based on totalScore
    createdCards.sort((a, b) => b.totalScore - a.totalScore);
    for (let i = 0; i < createdCards.length; i++) {
      await this.prisma.reportCard.update({
        where: { id: createdCards[i].id },
        data: { rank: i + 1 },
      });
      createdCards[i].rank = i + 1;
    }

    return {
      success: true,
      generatedCount: createdCards.length,
      reportCards: createdCards,
    };
  }

  async getReportCards(schoolId: string, params: { classId?: string; academicYear?: string; term?: string; studentId?: string }) {
    const where: any = { schoolId };
    if (params.classId) where.classId = params.classId;
    if (params.academicYear) where.academicYear = params.academicYear;
    if (params.term) where.term = params.term;
    if (params.studentId) where.studentId = params.studentId;

    return this.prisma.reportCard.findMany({
      where,
      include: {
        student: {
          include: { class: true },
        },
      },
      orderBy: [{ rank: 'asc' }, { student: { lastName: 'asc' } }],
    });
  }

  async updateReportCard(schoolId: string, id: string, data: {
    conduct?: string;
    attitude?: string;
    interest?: string;
    classTeacherRemarks?: string;
    headteacherRemarks?: string;
    promotedTo?: string;
    status?: string;
  }) {
    const card = await this.prisma.reportCard.findFirst({ where: { id, schoolId } });
    if (!card) throw new NotFoundException('Report card not found');

    const updateData: any = { ...data };
    if (data.status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    return this.prisma.reportCard.update({
      where: { id },
      data: updateData,
    });
  }
}

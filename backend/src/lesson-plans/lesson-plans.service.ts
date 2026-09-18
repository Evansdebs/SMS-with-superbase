import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonPlansService {
  constructor(private prisma: PrismaService) {}

  async getLessonPlans(schoolId: string, params: {
    teacherId?: string;
    classId?: string;
    subjectId?: string;
    status?: string;
  }) {
    const where: any = { schoolId };
    if (params.teacherId) where.teacherId = params.teacherId;
    if (params.classId) where.classId = params.classId;
    if (params.subjectId) where.subjectId = params.subjectId;
    if (params.status) where.status = params.status;

    return this.prisma.lessonPlan.findMany({
      where,
      include: {
        teacher: {
          include: { user: { select: { email: true } } },
        },
      },
      orderBy: { lessonDate: 'desc' },
    });
  }

  async createLessonPlan(schoolId: string, teacherId: string, dto: {
    classId: string;
    subjectId: string;
    weekNumber: number;
    lessonDate: string;
    topic: string;
    objectives: string;
    contentSummary: string;
    activities: string;
    resources?: string;
    assessment?: string;
    evaluation?: string;
    status?: string;
  }) {
    // If teacherId is a user id, resolve teacher record
    let actualTeacherId = teacherId;
    const teacher = await this.prisma.teacher.findFirst({
      where: { schoolId, OR: [{ id: teacherId }, { userId: teacherId }] },
    });
    if (teacher) {
      actualTeacherId = teacher.id;
    } else {
      // Fallback to first teacher in school if none matched for simulated accounts
      const anyTeacher = await this.prisma.teacher.findFirst({ where: { schoolId } });
      if (anyTeacher) actualTeacherId = anyTeacher.id;
      else throw new NotFoundException('Teacher profile not found for this school');
    }

    return this.prisma.lessonPlan.create({
      data: {
        schoolId,
        teacherId: actualTeacherId,
        classId: dto.classId,
        subjectId: dto.subjectId,
        weekNumber: dto.weekNumber,
        lessonDate: new Date(dto.lessonDate),
        topic: dto.topic,
        objectives: dto.objectives,
        contentSummary: dto.contentSummary,
        activities: dto.activities,
        resources: dto.resources,
        assessment: dto.assessment,
        evaluation: dto.evaluation,
        status: dto.status ?? 'SUBMITTED',
      },
    });
  }

  async reviewLessonPlan(schoolId: string, id: string, reviewerId: string, dto: {
    status: 'APPROVED' | 'REVISE' | 'SUBMITTED';
    reviewComments?: string;
  }) {
    const plan = await this.prisma.lessonPlan.findFirst({
      where: { id, schoolId },
    });
    if (!plan) throw new NotFoundException('Lesson plan not found');

    return this.prisma.lessonPlan.update({
      where: { id },
      data: {
        status: dto.status,
        reviewComments: dto.reviewComments,
        approvedBy: reviewerId,
      },
    });
  }
}

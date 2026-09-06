import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getAssignments(schoolId: string, classId?: string, teacherId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;
    if (teacherId) where.teacherId = teacherId;

    return this.prisma.assignment.findMany({
      where,
      include: {
        submissions: { select: { id: true, studentId: true, score: true, submittedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAssignment(
    schoolId: string,
    dto: {
      title: string;
      description?: string;
      classId: string;
      subjectId?: string;
      teacherId?: string;
      dueDate?: string;
      totalMarks?: number;
    },
  ) {
    return this.prisma.assignment.create({
      data: {
        schoolId,
        title: dto.title,
        description: dto.description,
        classId: dto.classId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        totalMarks: dto.totalMarks,
        isPublished: true,
      },
    });
  }

  async updateAssignment(
    schoolId: string,
    id: string,
    dto: { title?: string; description?: string; dueDate?: string; totalMarks?: number },
  ) {
    const existing = await this.prisma.assignment.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Assignment not found');
    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async deleteAssignment(schoolId: string, id: string) {
    const existing = await this.prisma.assignment.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Assignment not found');
    return this.prisma.assignment.delete({ where: { id } });
  }

  async gradeSubmission(
    schoolId: string,
    assignmentId: string,
    studentId: string,
    score: number,
    feedback?: string,
  ) {
    const assignment = await this.prisma.assignment.findFirst({ where: { id: assignmentId, schoolId } });
    if (!assignment) throw new NotFoundException('Assignment not found');

    return this.prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId } },
      create: { assignmentId, studentId, score, feedback, gradedAt: new Date() },
      update: { score, feedback, gradedAt: new Date() },
    });
  }
}

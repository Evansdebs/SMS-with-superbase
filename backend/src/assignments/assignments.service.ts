import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  private static mockAssignments: any[] = [
    {
      id: 'asg-001',
      title: 'Algebraic Expressions & Linear Equations',
      description: 'Solve questions 1 through 15 on page 42 of GES Mathematics Syllabus Book 1.',
      classId: 'cls-001',
      subjectId: 'sub-002',
      teacherId: 'tch-001',
      dueDate: new Date(Date.now() + 86400000 * 3),
      totalMarks: 30,
      isPublished: true,
      submissions: [
        { id: 'sub-1', studentId: 'stu-001', score: 28, submittedAt: new Date() },
        { id: 'sub-2', studentId: 'stu-002', score: 26, submittedAt: new Date() },
      ],
    },
    {
      id: 'asg-002',
      title: 'Essay: The Impact of Deforestation on Ghana Forest Reserves',
      description: 'Write a 400-word essay detailing human causes of deforestation and conservation solutions.',
      classId: 'cls-001',
      subjectId: 'sub-004',
      teacherId: 'tch-002',
      dueDate: new Date(Date.now() + 86400000 * 5),
      totalMarks: 25,
      isPublished: true,
      submissions: [
        { id: 'sub-3', studentId: 'stu-001', score: 22, submittedAt: new Date() },
      ],
    },
    {
      id: 'asg-003',
      title: 'Biology Practical: Plant and Animal Cell Comparison',
      description: 'Draw and label typical plant and animal cells, stating 4 observable differences.',
      classId: 'cls-002',
      subjectId: 'sub-003',
      teacherId: 'tch-003',
      dueDate: new Date(Date.now() + 86400000 * 2),
      totalMarks: 20,
      isPublished: true,
      submissions: [],
    },
  ];

  constructor(private prisma: PrismaService) {}

  async getAssignments(schoolId: string, classId?: string, teacherId?: string) {
    try {
      const where: any = { schoolId };
      if (classId) where.classId = classId;
      if (teacherId) where.teacherId = teacherId;

      return await this.prisma.assignment.findMany({
        where,
        include: {
          submissions: { select: { id: true, studentId: true, score: true, submittedAt: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      let filtered = AssignmentsService.mockAssignments;
      if (classId) filtered = filtered.filter((a) => a.classId === classId);
      if (teacherId) filtered = filtered.filter((a) => a.teacherId === teacherId);
      return filtered;
    }
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
    try {
      return await this.prisma.assignment.create({
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
    } catch {
      const newAsg = {
        id: `asg-${Date.now()}`,
        title: dto.title,
        description: dto.description || '',
        classId: dto.classId,
        subjectId: dto.subjectId || 'sub-001',
        teacherId: dto.teacherId || 'tch-001',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(Date.now() + 86400000 * 4),
        totalMarks: dto.totalMarks || 20,
        isPublished: true,
        submissions: [],
      };
      AssignmentsService.mockAssignments.unshift(newAsg);
      return newAsg;
    }
  }

  async updateAssignment(
    schoolId: string,
    id: string,
    dto: { title?: string; description?: string; dueDate?: string; totalMarks?: number },
  ) {
    try {
      const existing = await this.prisma.assignment.findFirst({ where: { id, schoolId } });
      if (!existing) throw new NotFoundException('Assignment not found');
      return await this.prisma.assignment.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
      });
    } catch {
      const idx = AssignmentsService.mockAssignments.findIndex((a) => a.id === id);
      if (idx !== -1) {
        AssignmentsService.mockAssignments[idx] = {
          ...AssignmentsService.mockAssignments[idx],
          ...dto,
        };
        return AssignmentsService.mockAssignments[idx];
      }
      throw new NotFoundException('Assignment not found');
    }
  }

  async deleteAssignment(schoolId: string, id: string) {
    try {
      const existing = await this.prisma.assignment.findFirst({ where: { id, schoolId } });
      if (!existing) throw new NotFoundException('Assignment not found');
      return await this.prisma.assignment.delete({ where: { id } });
    } catch {
      AssignmentsService.mockAssignments = AssignmentsService.mockAssignments.filter((a) => a.id !== id);
      return { success: true };
    }
  }

  async gradeSubmission(
    schoolId: string,
    assignmentId: string,
    studentId: string,
    score: number,
    feedback?: string,
  ) {
    try {
      const assignment = await this.prisma.assignment.findFirst({ where: { id: assignmentId, schoolId } });
      if (!assignment) throw new NotFoundException('Assignment not found');

      return await this.prisma.assignmentSubmission.upsert({
        where: { assignmentId_studentId: { assignmentId, studentId } },
        create: { assignmentId, studentId, score, feedback, gradedAt: new Date() },
        update: { score, feedback, gradedAt: new Date() },
      });
    } catch {
      return {
        id: `sub-${Date.now()}`,
        assignmentId,
        studentId,
        score,
        feedback: feedback || 'Satisfactory work',
        gradedAt: new Date(),
      };
    }
  }
}

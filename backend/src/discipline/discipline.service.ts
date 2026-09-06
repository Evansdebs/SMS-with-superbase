import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  async getRecords(schoolId: string, studentId?: string, status?: string) {
    const where: any = { schoolId };
    if (studentId) where.studentId = studentId;
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.disciplineRecord.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
            class: { select: { name: true, stream: true } },
          },
        },
      },
      orderBy: { incidentDate: 'desc' },
    });
  }

  async createRecord(
    schoolId: string,
    dto: {
      studentId: string;
      title: string;
      infractionType: string;
      description: string;
      sanction: string;
      reportedBy?: string;
      actionTaken?: string;
      parentNotified?: boolean;
    },
  ) {
    return this.prisma.disciplineRecord.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        title: dto.title,
        infractionType: dto.infractionType,
        description: dto.description,
        sanction: dto.sanction,
        reportedBy: dto.reportedBy,
        actionTaken: dto.actionTaken,
        parentNotified: dto.parentNotified ?? false,
        status: 'ACTIVE',
      },
      include: {
        student: { select: { firstName: true, lastName: true, admissionNumber: true } },
      },
    });
  }

  async updateStatus(
    schoolId: string,
    id: string,
    status: string,
    actionTaken?: string,
  ) {
    const existing = await this.prisma.disciplineRecord.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Disciplinary incident not found');

    return this.prisma.disciplineRecord.update({
      where: { id },
      data: {
        status,
        actionTaken: actionTaken ?? existing.actionTaken,
      },
    });
  }
}

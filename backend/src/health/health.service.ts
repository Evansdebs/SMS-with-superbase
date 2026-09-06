import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getRecords(schoolId: string, studentId?: string) {
    const where: any = { schoolId };
    if (studentId) where.studentId = studentId;

    return this.prisma.healthRecord.findMany({
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
      orderBy: { visitDate: 'desc' },
    });
  }

  async createRecord(
    schoolId: string,
    dto: {
      studentId: string;
      symptoms: string;
      diagnosis?: string;
      treatment?: string;
      medicationGiven?: string;
      temperature?: string;
      attendedBy?: string;
      parentContacted?: boolean;
      referredToHospital?: boolean;
      remarks?: string;
    },
  ) {
    return this.prisma.healthRecord.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        symptoms: dto.symptoms,
        diagnosis: dto.diagnosis,
        treatment: dto.treatment,
        medicationGiven: dto.medicationGiven,
        temperature: dto.temperature,
        attendedBy: dto.attendedBy,
        parentContacted: dto.parentContacted ?? false,
        referredToHospital: dto.referredToHospital ?? false,
        remarks: dto.remarks,
      },
      include: {
        student: { select: { firstName: true, lastName: true, admissionNumber: true } },
      },
    });
  }
}

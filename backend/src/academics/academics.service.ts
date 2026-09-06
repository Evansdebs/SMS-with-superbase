import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  // ===================== DEPARTMENTS =====================
  async getDepartments(schoolId: string) {
    return this.prisma.department.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { classes: true },
        },
      },
    });
  }

  async createDepartment(schoolId: string, data: { name: string; description?: string; headOfDepartment?: string }) {
    const existing = await this.prisma.department.findFirst({
      where: { schoolId, name: data.name },
    });
    if (existing) {
      throw new ConflictException(`Department "${data.name}" already exists in this school`);
    }
    return this.prisma.department.create({
      data: {
        schoolId,
        name: data.name,
        description: data.description,
        headOfDepartment: data.headOfDepartment,
      },
    });
  }

  // ===================== CLASSES =====================
  async getClasses(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        department: true,
        _count: {
          select: { students: true },
        },
      },
    });
  }

  async createClass(schoolId: string, data: { name: string; stream?: string; level?: string; departmentId?: string }) {
    return this.prisma.class.create({
      data: {
        schoolId,
        name: data.name,
        stream: data.stream || 'A',
        level: data.level,
        departmentId: data.departmentId,
      },
    });
  }

  // ===================== SUBJECTS =====================
  async getSubjects(schoolId: string) {
    return this.prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createSubject(schoolId: string, data: { name: string; code?: string; description?: string }) {
    return this.prisma.subject.create({
      data: {
        schoolId,
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });
  }

  // ===================== ACADEMIC YEARS & TERMS =====================
  async getAcademicYears(schoolId: string) {
    return this.prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { name: 'desc' },
      include: {
        terms: true,
      },
    });
  }

  async createAcademicYear(schoolId: string, data: { name: string; startDate: string; endDate: string; isActive?: boolean }) {
    return this.prisma.academicYear.create({
      data: {
        schoolId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive || false,
      },
    });
  }
}

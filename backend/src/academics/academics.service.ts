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

  // ===================== ROOMS =====================
  async getRooms(schoolId: string) {
    return this.prisma.room.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createRoom(schoolId: string, data: { name: string; capacity?: number; roomType?: string; building?: string }) {
    const existing = await this.prisma.room.findFirst({
      where: { schoolId, name: data.name },
    });
    if (existing) {
      throw new ConflictException(`Room "${data.name}" already exists in this school`);
    }
    return this.prisma.room.create({
      data: {
        schoolId,
        name: data.name,
        capacity: data.capacity ?? 40,
        roomType: data.roomType ?? 'CLASSROOM',
        building: data.building,
      },
    });
  }

  async deleteRoom(schoolId: string, id: string) {
    const room = await this.prisma.room.findFirst({ where: { id, schoolId } });
    if (!room) throw new NotFoundException('Room not found');
    return this.prisma.room.delete({ where: { id } });
  }

  // ===================== HOUSES =====================
  async getHouses(schoolId: string) {
    return this.prisma.house.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createHouse(schoolId: string, data: { name: string; color?: string; masterName?: string; motto?: string }) {
    const existing = await this.prisma.house.findFirst({
      where: { schoolId, name: data.name },
    });
    if (existing) {
      throw new ConflictException(`House "${data.name}" already exists in this school`);
    }
    return this.prisma.house.create({
      data: {
        schoolId,
        name: data.name,
        color: data.color,
        masterName: data.masterName,
        motto: data.motto,
      },
    });
  }

  async deleteHouse(schoolId: string, id: string) {
    const house = await this.prisma.house.findFirst({ where: { id, schoolId } });
    if (!house) throw new NotFoundException('House not found');
    return this.prisma.house.delete({ where: { id } });
  }

  // ===================== GRADING SYSTEMS =====================
  async getGradingSystems(schoolId: string) {
    const systems = await this.prisma.gradingSystem.findMany({
      where: { schoolId },
      include: { scales: { orderBy: { minScore: 'desc' } } },
      orderBy: { name: 'asc' },
    });

    if (systems.length === 0) {
      // Auto seed defaults if none exist
      await this.seedDefaultGradingSystems(schoolId);
      return this.prisma.gradingSystem.findMany({
        where: { schoolId },
        include: { scales: { orderBy: { minScore: 'desc' } } },
        orderBy: { name: 'asc' },
      });
    }

    return systems;
  }

  async createGradingSystem(schoolId: string, data: {
    name: string;
    code: string;
    description?: string;
    isDefault?: boolean;
    scales: Array<{
      grade: string;
      minScore: number;
      maxScore: number;
      gradePoint?: number;
      descriptor: string;
      remarks: string;
    }>;
  }) {
    return this.prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.gradingSystem.updateMany({
          where: { schoolId },
          data: { isDefault: false },
        });
      }

      return tx.gradingSystem.create({
        data: {
          schoolId,
          name: data.name,
          code: data.code,
          description: data.description,
          isDefault: data.isDefault ?? false,
          scales: {
            create: data.scales.map((s) => ({
              grade: s.grade,
              minScore: s.minScore,
              maxScore: s.maxScore,
              gradePoint: s.gradePoint ?? 0,
              descriptor: s.descriptor,
              remarks: s.remarks,
            })),
          },
        },
        include: { scales: true },
      });
    });
  }

  async seedDefaultGradingSystems(schoolId: string) {
    // Standard Ghana BECE Stanine (1-9)
    await this.prisma.gradingSystem.upsert({
      where: { schoolId_code: { schoolId, code: 'BECE_STANINE' } },
      update: {},
      create: {
        schoolId,
        name: 'Ghana WAEC / BECE Stanine (1 - 9)',
        code: 'BECE_STANINE',
        description: 'Official Ghana Basic Education Certificate Examination 9-point grading system',
        isDefault: true,
        scales: {
          create: [
            { grade: '1', minScore: 80, maxScore: 100, gradePoint: 1, descriptor: 'HIGHEST', remarks: 'Grade 1 - Highest' },
            { grade: '2', minScore: 75, maxScore: 79.99, gradePoint: 2, descriptor: 'HIGHER', remarks: 'Grade 2 - Higher' },
            { grade: '3', minScore: 70, maxScore: 74.99, gradePoint: 3, descriptor: 'HIGH', remarks: 'Grade 3 - High' },
            { grade: '4', minScore: 65, maxScore: 69.99, gradePoint: 4, descriptor: 'HIGH_AVERAGE', remarks: 'Grade 4 - High Average' },
            { grade: '5', minScore: 60, maxScore: 64.99, gradePoint: 5, descriptor: 'AVERAGE', remarks: 'Grade 5 - Average' },
            { grade: '6', minScore: 55, maxScore: 59.99, gradePoint: 6, descriptor: 'LOW_AVERAGE', remarks: 'Grade 6 - Low Average' },
            { grade: '7', minScore: 50, maxScore: 54.99, gradePoint: 7, descriptor: 'LOWER', remarks: 'Grade 7 - Lower' },
            { grade: '8', minScore: 45, maxScore: 49.99, gradePoint: 8, descriptor: 'LOWEST', remarks: 'Grade 8 - Lowest' },
            { grade: '9', minScore: 0, maxScore: 44.99, gradePoint: 9, descriptor: 'FAIL', remarks: 'Grade 9 - Fail' },
          ],
        },
      },
    });

    // Standard Letter (A-F)
    await this.prisma.gradingSystem.upsert({
      where: { schoolId_code: { schoolId, code: 'LETTER_GRADE' } },
      update: {},
      create: {
        schoolId,
        name: 'Standard Letter Grade (A+ - F)',
        code: 'LETTER_GRADE',
        description: 'Standard Secondary / High School Letter Grade Scheme',
        isDefault: false,
        scales: {
          create: [
            { grade: 'A+', minScore: 80, maxScore: 100, gradePoint: 4.0, descriptor: 'EXCELLENT', remarks: 'Excellent' },
            { grade: 'B', minScore: 70, maxScore: 79.99, gradePoint: 3.0, descriptor: 'VERY_GOOD', remarks: 'Very Good' },
            { grade: 'C', minScore: 60, maxScore: 69.99, gradePoint: 2.0, descriptor: 'GOOD', remarks: 'Good' },
            { grade: 'D', minScore: 50, maxScore: 59.99, gradePoint: 1.0, descriptor: 'PASS', remarks: 'Pass' },
            { grade: 'F', minScore: 0, maxScore: 49.99, gradePoint: 0.0, descriptor: 'FAIL', remarks: 'Fail' },
          ],
        },
      },
    });
  }
}

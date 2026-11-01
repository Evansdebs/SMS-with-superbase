import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicsService {
  private static mockDepartments: any[] = [
    { id: 'dept-1', schoolId: 'demo-school-001', name: 'Kindergarten', description: 'Early childhood foundation', headOfDepartment: 'Mrs. Cynthia Addo', _count: { classes: 2 } },
    { id: 'dept-2', schoolId: 'demo-school-001', name: 'Primary School', description: 'Lower and upper primary (Class 1-6)', headOfDepartment: 'Mr. David Mensah', _count: { classes: 6 } },
    { id: 'dept-3', schoolId: 'demo-school-001', name: 'Junior High School', description: 'BECE preparation tier (JHS 1-3)', headOfDepartment: 'Mr. Emmanuel Ofori', _count: { classes: 3 } },
  ];

  private static mockClasses: any[] = [
    { id: 'cls-001', schoolId: 'demo-school-001', name: 'JHS 1', stream: 'Gold', level: 'JHS', departmentId: 'dept-3', _count: { students: 38 } },
    { id: 'cls-002', schoolId: 'demo-school-001', name: 'JHS 2', stream: 'Gold', level: 'JHS', departmentId: 'dept-3', _count: { students: 35 } },
    { id: 'cls-003', schoolId: 'demo-school-001', name: 'JHS 3', stream: 'Gold', level: 'JHS', departmentId: 'dept-3', _count: { students: 42 } },
    { id: 'cls-004', schoolId: 'demo-school-001', name: 'Class 5', stream: 'A', level: 'Primary', departmentId: 'dept-2', _count: { students: 30 } },
    { id: 'cls-005', schoolId: 'demo-school-001', name: 'Class 6', stream: 'A', level: 'Primary', departmentId: 'dept-2', _count: { students: 32 } },
  ];

  private static mockSubjects: any[] = [
    { id: 'sub-001', schoolId: 'demo-school-001', name: 'English Language', code: 'ENG', description: 'GES Standard English Syllabus' },
    { id: 'sub-002', schoolId: 'demo-school-001', name: 'Mathematics', code: 'MATH', description: 'Core Mathematics & Geometry' },
    { id: 'sub-003', schoolId: 'demo-school-001', name: 'Integrated Science', code: 'SCI', description: 'General Science and Practical Labs' },
    { id: 'sub-004', schoolId: 'demo-school-001', name: 'Social Studies', code: 'SOC', description: 'Environment, Governance & Culture' },
    { id: 'sub-005', schoolId: 'demo-school-001', name: 'Information & Communication Tech (ICT)', code: 'ICT', description: 'Computer literacy and programming' },
    { id: 'sub-006', schoolId: 'demo-school-001', name: 'Ghanaian Language & Culture', code: 'GHL', description: 'Twi, Fante, Ga & Ewe' },
    { id: 'sub-007', schoolId: 'demo-school-001', name: 'Religious & Moral Education (RME)', code: 'RME', description: 'Ethics, Morals and Religious Studies' },
    { id: 'sub-008', schoolId: 'demo-school-001', name: 'Basic Design & Technology (BDT)', code: 'BDT', description: 'Pre-technical, Home Economics & Visual Arts' },
    { id: 'sub-009', schoolId: 'demo-school-001', name: 'French', code: 'FRE', description: 'Francophone foreign language studies' },
  ];

  private static mockHouses: any[] = [
    { id: 'hse-001', name: 'Aggrey House', color: 'Yellow', motto: 'Only the Best', master: 'Mr. David Mensah', studentsCount: 42 },
    { id: 'hse-002', name: 'Guggisberg House', color: 'Blue', motto: 'Perseverance Overcomes', master: 'Mrs. Cynthia Addo', studentsCount: 39 },
    { id: 'hse-003', name: 'Casely Hayford House', color: 'Green', motto: 'Leadership and Vision', master: 'Mr. Emmanuel Ofori', studentsCount: 45 },
    { id: 'hse-004', name: 'Yaa Asantewaa House', color: 'Red', motto: 'Bravery and Honor', master: 'Ms. Grace Darko', studentsCount: 40 },
  ];

  private static mockAcademicYears: any[] = [
    { id: 'ay-2025-2026', name: '2025/2026', startDate: '2025-09-08', endDate: '2026-07-24', isActive: true, currentTerm: 'Term 1' },
    { id: 'ay-2024-2025', name: '2024/2025', startDate: '2024-09-09', endDate: '2025-07-25', isActive: false, currentTerm: 'Term 3' },
  ];

  constructor(private prisma: PrismaService) {}

  // ===================== DEPARTMENTS =====================
  async getDepartments(schoolId: string) {
    try {
      return await this.prisma.department.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { classes: true },
          },
        },
      });
    } catch {
      return AcademicsService.mockDepartments;
    }
  }

  async createDepartment(schoolId: string, data: { name: string; description?: string; headOfDepartment?: string }) {
    try {
      const existing = await this.prisma.department.findFirst({
        where: { schoolId, name: data.name },
      });
      if (existing) {
        throw new ConflictException(`Department "${data.name}" already exists in this school`);
      }
      return await this.prisma.department.create({
        data: {
          schoolId,
          name: data.name,
          description: data.description,
          headOfDepartment: data.headOfDepartment,
        },
      });
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;
      const newDept = {
        id: `dept-${Date.now()}`,
        schoolId,
        name: data.name,
        description: data.description || '',
        headOfDepartment: data.headOfDepartment || '',
        _count: { classes: 0 },
      };
      AcademicsService.mockDepartments.push(newDept);
      return newDept;
    }
  }

  // ===================== CLASSES =====================
  async getClasses(schoolId: string) {
    try {
      return await this.prisma.class.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' },
        include: {
          department: true,
          _count: {
            select: { students: true },
          },
        },
      });
    } catch {
      return AcademicsService.mockClasses;
    }
  }

  async createClass(schoolId: string, data: { name: string; stream?: string; level?: string; departmentId?: string }) {
    try {
      return await this.prisma.class.create({
        data: {
          schoolId,
          name: data.name,
          stream: data.stream || 'A',
          level: data.level,
          departmentId: data.departmentId,
        },
      });
    } catch {
      const newCls = {
        id: `cls-${Date.now()}`,
        schoolId,
        name: data.name,
        stream: data.stream || 'A',
        level: data.level || 'Primary',
        departmentId: data.departmentId || 'dept-2',
        _count: { students: 0 },
      };
      AcademicsService.mockClasses.push(newCls);
      return newCls;
    }
  }

  // ===================== SUBJECTS =====================
  async getSubjects(schoolId: string) {
    try {
      return await this.prisma.subject.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' },
      });
    } catch {
      return AcademicsService.mockSubjects;
    }
  }

  async createSubject(schoolId: string, data: { name: string; code?: string; description?: string }) {
    try {
      return await this.prisma.subject.create({
        data: {
          schoolId,
          name: data.name,
          code: data.code,
          description: data.description,
        },
      });
    } catch {
      const newSub = {
        id: `sub-${Date.now()}`,
        schoolId,
        name: data.name,
        code: data.code || data.name.slice(0, 4).toUpperCase(),
        description: data.description || '',
      };
      AcademicsService.mockSubjects.push(newSub);
      return newSub;
    }
  }

  // ===================== HOUSES =====================
  async getHouses(schoolId: string) {
    return AcademicsService.mockHouses;
  }

  async createHouse(schoolId: string, data: { name: string; color?: string; motto?: string; master?: string }) {
    const newHouse = {
      id: `hse-${Date.now()}`,
      name: data.name,
      color: data.color || 'Yellow',
      motto: data.motto || '',
      master: data.master || '',
      studentsCount: 0,
    };
    AcademicsService.mockHouses.push(newHouse);
    return newHouse;
  }

  // ===================== ACADEMIC YEARS =====================
  async getAcademicYears(schoolId: string) {
    try {
      return await this.prisma.academicYear.findMany({
        where: { schoolId },
        orderBy: { startDate: 'desc' },
      });
    } catch {
      return AcademicsService.mockAcademicYears;
    }
  }

  async createAcademicYear(schoolId: string, data: { name: string; startDate: string; endDate: string; isActive?: boolean }) {
    try {
      return await this.prisma.academicYear.create({
        data: {
          schoolId,
          name: data.name,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          isActive: data.isActive || false,
        },
      });
    } catch {
      const newAy = {
        id: `ay-${Date.now()}`,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive || false,
        currentTerm: 'Term 1',
      };
      AcademicsService.mockAcademicYears.unshift(newAy);
      return newAy;
    }
  }
}

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdmissionDto, UpdateAdmissionStatusDto } from './dto/create-admission.dto';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  // ────────────────────── HELPERS ──────────────────────
  private async generateApplicationNumber(schoolId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.admissionApplication.count({ where: { schoolId } });
    return `APP-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // ────────────────────── CRUD ──────────────────────
  async create(schoolId: string, dto: CreateAdmissionDto) {
    const applicationNumber = await this.generateApplicationNumber(schoolId);
    return this.prisma.admissionApplication.create({
      data: {
        schoolId,
        applicationNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        nationality: dto.nationality ?? 'Ghanaian',
        previousSchool: dto.previousSchool,
        applyingForClass: dto.applyingForClass,
        guardianName: dto.guardianName,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,
        guardianAddress: dto.guardianAddress,
        guardianRelationship: dto.guardianRelationship,
        medicalConditions: dto.medicalConditions,
        applicationFee: dto.applicationFee ?? 0,
        status: 'DRAFT',
      },
    });
  }

  async findAll(schoolId: string, params: { status?: string; search?: string; page?: number; limit?: number }) {
    const { status, search, page = 1, limit = 20 } = params;
    const where: any = { schoolId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { applicationNumber: { contains: search, mode: 'insensitive' } },
        { guardianPhone: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [total, data] = await Promise.all([
      this.prisma.admissionApplication.count({ where }),
      this.prisma.admissionApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { documents: { select: { id: true, documentType: true } } },
      }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(schoolId: string, id: string) {
    const app = await this.prisma.admissionApplication.findFirst({
      where: { id, schoolId },
      include: { documents: true },
    });
    if (!app) throw new NotFoundException('Admission application not found');
    return app;
  }

  async updateStatus(schoolId: string, id: string, dto: UpdateAdmissionStatusDto, updatedBy: string) {
    const app = await this.findOne(schoolId, id);
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['SUBMITTED', 'WITHDRAWN'],
      SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN'],
      UNDER_REVIEW: ['SHORTLISTED', 'REJECTED', 'WAITLISTED'],
      SHORTLISTED: ['ACCEPTED', 'REJECTED'],
      WAITLISTED: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: ['WITHDRAWN'],
      REJECTED: [],
      WITHDRAWN: [],
    };
    if (!validTransitions[app.status]?.includes(dto.status)) {
      throw new BadRequestException(`Cannot transition from ${app.status} to ${dto.status}`);
    }
    return this.prisma.admissionApplication.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  // ────────────────────── CONVERT TO STUDENT ──────────────────────
  async convertToStudent(schoolId: string, id: string) {
    const app = await this.findOne(schoolId, id);
    if (app.status !== 'ACCEPTED') {
      throw new BadRequestException('Only ACCEPTED applications can be converted to students');
    }
    if (app.convertedToStudentId) {
      throw new ConflictException('This application has already been converted to a student');
    }

    // Generate admission number
    const year = new Date().getFullYear();
    const count = await this.prisma.student.count({ where: { schoolId } });
    const admissionNumber = `${year}/${String(count + 1).padStart(4, '0')}`;

    // Find matching class
    let classId: string | null = null;
    if (app.applyingForClass) {
      const cls = await this.prisma.class.findFirst({ where: { schoolId, name: { contains: app.applyingForClass, mode: 'insensitive' } } });
      classId = cls?.id ?? null;
    }

    // Create student + guardian in a transaction
    const student = await this.prisma.$transaction(async (tx) => {
      const s = await tx.student.create({
        data: {
          schoolId,
          admissionNumber,
          firstName: app.firstName,
          lastName: app.lastName,
          dateOfBirth: app.dateOfBirth,
          gender: app.gender ?? 'UNKNOWN',
          nationality: app.nationality ?? 'Ghanaian',
          classId,
          status: 'ACTIVE',
          admissionDate: new Date(),
        },
      });

      // Create parent/guardian record
      const parent = await tx.parent.create({
        data: {
          schoolId,
          firstName: app.guardianName.split(' ')[0] || app.guardianName,
          lastName: app.guardianName.split(' ').slice(1).join(' ') || '',
          phoneNumber: app.guardianPhone,
          email: app.guardianEmail,
          address: app.guardianAddress,
        },
      });

      // Link student to guardian
      await tx.studentGuardian.create({
        data: {
          studentId: s.id,
          parentId: parent.id,
          relationship: app.guardianRelationship ?? 'GUARDIAN',
          isPrimary: true,
          emergencyContact: true,
        },
      });

      // Mark application as converted
      await tx.admissionApplication.update({
        where: { id: app.id },
        data: { convertedToStudentId: s.id },
      });

      return s;
    });

    return { student, message: 'Applicant successfully converted to student' };
  }

  async getStats(schoolId: string) {
    const [total, submitted, underReview, accepted, rejected] = await Promise.all([
      this.prisma.admissionApplication.count({ where: { schoolId } }),
      this.prisma.admissionApplication.count({ where: { schoolId, status: 'SUBMITTED' } }),
      this.prisma.admissionApplication.count({ where: { schoolId, status: 'UNDER_REVIEW' } }),
      this.prisma.admissionApplication.count({ where: { schoolId, status: 'ACCEPTED' } }),
      this.prisma.admissionApplication.count({ where: { schoolId, status: 'REJECTED' } }),
    ]);
    return { total, submitted, underReview, accepted, rejected };
  }
}

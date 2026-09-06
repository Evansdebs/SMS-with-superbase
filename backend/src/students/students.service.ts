import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateStudentDto) {
    // Verify admissionNumber uniqueness within THIS school
    const existing = await this.prisma.student.findFirst({
      where: {
        schoolId,
        admissionNumber: dto.admissionNumber,
      },
    });

    if (existing) {
      throw new ConflictException(`Student with admission number "${dto.admissionNumber}" already exists in this school`);
    }

    return this.prisma.$transaction(async (tx) => {
      let guardianRecord: any = null;

      if (dto.guardian) {
        guardianRecord = await tx.parent.create({
          data: {
            schoolId,
            firstName: dto.guardian.firstName,
            lastName: dto.guardian.lastName,
            phoneNumber: dto.guardian.phoneNumber,
            email: dto.guardian.email,
          },
        });
      }

      const student = await tx.student.create({
        data: {
          schoolId,
          admissionNumber: dto.admissionNumber,
          firstName: dto.firstName,
          lastName: dto.lastName,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          gender: dto.gender,
          address: dto.address,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          classId: dto.classId || null,
          status: 'ACTIVE',
        },
        include: {
          class: true,
        },
      });

      if (guardianRecord) {
        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            parentId: guardianRecord.id,
            relationship: dto.guardian.relationship || 'GUARDIAN',
            isPrimary: true,
            emergencyContact: true,
          },
        });
      }

      return student;
    });
  }

  async findAll(
    schoolId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    classId?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (status) {
      where.status = status;
    }

    if (classId) {
      where.classId = classId;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, students] = await Promise.all([
      this.prisma.student.count({ where }),
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
        include: {
          class: true,
          guardians: {
            include: {
              parent: true,
            },
          },
        },
      }),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: {
        id,
        schoolId, // Strict tenant isolation: never return if student belongs to another school
      },
      include: {
        class: true,
        guardians: {
          include: {
            parent: true,
          },
        },
        attendance: {
          take: 10,
          orderBy: { date: 'desc' },
        },
        results: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found in this school');
    }

    return student;
  }

  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    // Verify student belongs to this school
    await this.findOne(schoolId, id);

    return this.prisma.student.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        address: dto.address,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        classId: dto.classId !== undefined ? dto.classId : undefined,
        status: dto.status,
      },
      include: {
        class: true,
      },
    });
  }

  async remove(schoolId: string, id: string) {
    // Verify student belongs to this school
    await this.findOne(schoolId, id);

    return this.prisma.student.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateTeacherDto) {
    const existing = await this.prisma.teacher.findFirst({
      where: {
        schoolId,
        employeeId: dto.employeeId,
      },
    });

    if (existing) {
      throw new ConflictException(`Teacher with employee ID "${dto.employeeId}" already exists in this school`);
    }

    return this.prisma.$transaction(async (tx) => {
      let userId: string | null = null;

      // If teacher has an email, find or create their USER account with TEACHER profile
      if (dto.email) {
        let user = await tx.user.findUnique({
          where: { email: dto.email },
        });

        if (!user) {
          user = await tx.user.create({
            data: {
              email: dto.email,
              accountType: 'USER',
              status: 'ACTIVE',
              profile: {
                create: {
                  firstName: dto.firstName,
                  lastName: dto.lastName,
                  phoneNumber: dto.phoneNumber,
                },
              },
            },
          });
        }

        // Add membership for this school
        const existingMembership = await tx.schoolMembership.findUnique({
          where: {
            userId_schoolId: {
              userId: user.id,
              schoolId,
            },
          },
        });

        if (!existingMembership) {
          await tx.schoolMembership.create({
            data: {
              userId: user.id,
              schoolId,
              profile: 'TEACHER',
              status: 'ACTIVE',
              permissions: ['students.view', 'attendance.create', 'attendance.view', 'results.enter', 'assignments.create'],
            },
          });
        }

        userId = user.id;
      }

      return tx.teacher.create({
        data: {
          schoolId,
          userId,
          employeeId: dto.employeeId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          qualifications: dto.qualifications,
          departmentId: dto.departmentId,
          subjects: dto.subjects || [],
          classes: dto.classes || [],
          status: 'ACTIVE',
        },
      });
    });
  }

  async findAll(
    schoolId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, teachers] = await Promise.all([
      this.prisma.teacher.count({ where }),
      this.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
    ]);

    return {
      data: teachers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(schoolId: string, id: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, schoolId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found in this school');
    }

    return teacher;
  }

  async update(schoolId: string, id: string, dto: UpdateTeacherDto) {
    await this.findOne(schoolId, id);

    return this.prisma.teacher.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        qualifications: dto.qualifications,
        departmentId: dto.departmentId,
        subjects: dto.subjects,
        classes: dto.classes,
        status: dto.status,
      },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);

    return this.prisma.teacher.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}

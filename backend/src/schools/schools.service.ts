import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createSchoolDto: CreateSchoolDto) {
    // Generate unique school code
    const schoolCode = await this.authService.generateSchoolCode(createSchoolDto.name);

    // Create school
    const school = await this.prisma.school.create({
      data: {
        ...createSchoolDto,
        schoolCode,
      },
    });

    return school;
  }

  async findAll() {
    return this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            parents: true,
            staff: true,
          },
        },
      },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async findBySchoolCode(schoolCode: string) {
    const school = await this.prisma.school.findUnique({
      where: { schoolCode: schoolCode.toUpperCase() },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return this.prisma.school.update({
      where: { id },
      data: updateSchoolDto,
    });
  }

  async updateStatus(id: string, status: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    const validStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    return this.prisma.school.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async remove(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Soft delete by archiving
    return this.prisma.school.update({
      where: { id },
      data: { status: 'ARCHIVED' as any },
    });
  }

  async getStatistics(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException('School not found');
    }

    const [
      totalStudents,
      totalTeachers,
      totalParents,
      totalStaff,
      activeStudents,
    ] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.teacher.count({ where: { schoolId } }),
      this.prisma.parent.count({ where: { schoolId } }),
      this.prisma.staff.count({ where: { schoolId } }),
      this.prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
    ]);

    return {
      schoolId,
      schoolName: school.name,
      schoolCode: school.schoolCode,
      status: school.status,
      totalStudents,
      totalTeachers,
      totalParents,
      totalStaff,
      activeStudents,
    };
  }

  async getSettings(schoolId: string) {
    const settings = await this.prisma.schoolSetting.findMany({
      where: { schoolId },
    });
    return settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async updateSettings(schoolId: string, settings: Record<string, string>) {
    const ops = Object.entries(settings).map(([key, value]) =>
      this.prisma.schoolSetting.upsert({
        where: { schoolId_key: { schoolId, key } },
        create: { schoolId, key, value: String(value) },
        update: { value: String(value) },
      }),
    );
    await this.prisma.$transaction(ops);
    return this.getSettings(schoolId);
  }
}


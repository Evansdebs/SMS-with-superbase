import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  private static mockTeachers: any[] = [
    {
      id: 'tch-001',
      schoolId: 'demo-school-001',
      employeeId: 'EMP-TCH-001',
      firstName: 'David',
      lastName: 'Mensah',
      email: 'david.mensah@school.edu.gh',
      phoneNumber: '+233 24 555 1111',
      roleCategory: 'TEACHING',
      designation: 'Senior Mathematics Tutor',
      department: 'Mathematics & Computing',
      qualifications: 'B.Ed Mathematics (Univ. of Cape Coast)',
      contractType: 'PERMANENT',
      subjects: ['Mathematics', 'Further Mathematics'],
      classes: ['JHS 1 (Gold)', 'JHS 2 (Gold)', 'JHS 3 (Gold)'],
      status: 'ACTIVE',
      attendanceRate: '98%',
      joinedDate: '2021-09-01',
    },
    {
      id: 'tch-002',
      schoolId: 'demo-school-001',
      employeeId: 'EMP-TCH-002',
      firstName: 'Cynthia',
      lastName: 'Addo',
      email: 'cynthia.addo@school.edu.gh',
      phoneNumber: '+233 20 444 2222',
      roleCategory: 'TEACHING',
      designation: 'Head of Languages',
      department: 'Languages Department',
      qualifications: 'B.A English & Linguistics (Univ. of Ghana), PGDE',
      contractType: 'PERMANENT',
      subjects: ['English Language', 'Literature'],
      classes: ['JHS 1 (Gold)', 'JHS 2 (Gold)', 'Class 6 (A)'],
      status: 'ACTIVE',
      attendanceRate: '96%',
      joinedDate: '2020-01-15',
    },
    {
      id: 'tch-003',
      schoolId: 'demo-school-001',
      employeeId: 'EMP-TCH-003',
      firstName: 'Emmanuel',
      lastName: 'Ofori',
      email: 'emmanuel.ofori@school.edu.gh',
      phoneNumber: '+233 27 333 3333',
      roleCategory: 'TEACHING',
      designation: 'Science Laboratory Master',
      department: 'Science & Technology',
      qualifications: 'B.Sc Biochemistry (KNUST)',
      contractType: 'PERMANENT',
      subjects: ['Integrated Science', 'Biology'],
      classes: ['JHS 2 (Gold)', 'JHS 3 (Gold)'],
      status: 'ACTIVE',
      attendanceRate: '94%',
      joinedDate: '2022-03-01',
    },
    {
      id: 'tch-004',
      schoolId: 'demo-school-001',
      employeeId: 'EMP-STAFF-001',
      firstName: 'Grace',
      lastName: 'Darko',
      email: 'grace.darko@school.edu.gh',
      phoneNumber: '+233 55 222 4444',
      roleCategory: 'NON_TEACHING',
      designation: 'Senior Accountant & Bursar',
      department: 'Finance & Administration',
      qualifications: 'Chartered Accountant (ICAG), B.Sc Accounting',
      contractType: 'PERMANENT',
      subjects: [],
      classes: [],
      status: 'ACTIVE',
      attendanceRate: '99%',
      joinedDate: '2019-11-01',
    },
    {
      id: 'tch-005',
      schoolId: 'demo-school-001',
      employeeId: 'EMP-STAFF-002',
      firstName: 'Samuel',
      lastName: 'Quaye',
      email: 'samuel.quaye@school.edu.gh',
      phoneNumber: '+233 26 111 8888',
      roleCategory: 'NON_TEACHING',
      designation: 'Campus Nurse / Health Officer',
      department: 'Health & Sick Bay',
      qualifications: 'Registered General Nurse (NMC Ghana)',
      contractType: 'CONTRACT',
      subjects: [],
      classes: [],
      status: 'ACTIVE',
      attendanceRate: '95%',
      joinedDate: '2023-01-10',
    },
  ];

  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, dto: CreateTeacherDto) {
    try {
      const existing = await this.prisma.teacher.findFirst({
        where: {
          schoolId,
          employeeId: dto.employeeId,
        },
      });

      if (existing) {
        throw new ConflictException(`Staff with employee ID "${dto.employeeId}" already exists in this school`);
      }

      return await this.prisma.$transaction(async (tx) => {
        let userId: string | null = null;

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
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;
      const newStaff: any = {
        id: `tch-${Date.now()}`,
        schoolId,
        employeeId: dto.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        roleCategory: 'TEACHING',
        designation: 'Teacher / Staff Member',
        department: 'Academics',
        qualifications: dto.qualifications || 'B.Ed / Degree',
        contractType: 'PERMANENT',
        subjects: dto.subjects || [],
        classes: dto.classes || [],
        status: 'ACTIVE',
        attendanceRate: '100%',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      TeachersService.mockTeachers.unshift(newStaff);
      return newStaff;
    }
  }

  async findAll(
    schoolId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    try {
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
    } catch {
      let filtered = TeachersService.mockTeachers;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.firstName?.toLowerCase().includes(q) ||
            t.lastName?.toLowerCase().includes(q) ||
            t.employeeId?.toLowerCase().includes(q) ||
            t.department?.toLowerCase().includes(q) ||
            t.designation?.toLowerCase().includes(q),
        );
      }
      return {
        data: filtered,
        meta: {
          total: filtered.length,
          page: 1,
          limit,
          totalPages: 1,
        },
      };
    }
  }

  async findOne(schoolId: string, id: string) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: { id, schoolId },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found in this school');
      }

      return teacher;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      const matched = TeachersService.mockTeachers.find((t) => t.id === id);
      if (!matched) throw new NotFoundException('Teacher not found in this school');
      return matched;
    }
  }

  async update(schoolId: string, id: string, dto: UpdateTeacherDto) {
    try {
      await this.findOne(schoolId, id);

      return await this.prisma.teacher.update({
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
    } catch {
      const idx = TeachersService.mockTeachers.findIndex((t) => t.id === id);
      if (idx !== -1) {
        TeachersService.mockTeachers[idx] = {
          ...TeachersService.mockTeachers[idx],
          ...dto,
        };
        return TeachersService.mockTeachers[idx];
      }
      throw new NotFoundException('Teacher not found');
    }
  }

  async remove(schoolId: string, id: string) {
    try {
      await this.findOne(schoolId, id);

      return await this.prisma.teacher.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });
    } catch {
      const idx = TeachersService.mockTeachers.findIndex((t) => t.id === id);
      if (idx !== -1) {
        TeachersService.mockTeachers[idx].status = 'INACTIVE';
        return TeachersService.mockTeachers[idx];
      }
      throw new NotFoundException('Teacher not found');
    }
  }
}

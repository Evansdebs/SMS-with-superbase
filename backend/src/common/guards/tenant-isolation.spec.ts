import { UnauthorizedException } from '@nestjs/common';
import { SuperAdminGuard } from './super-admin.guard';
import { SchoolMembershipGuard } from './school-membership.guard';
import { Reflector } from '@nestjs/core';
import { StudentsService } from '../../students/students.service';
import { TeachersService } from '../../teachers/teachers.service';

describe('Tenant Isolation & Security Suite', () => {
  let reflector: Reflector;
  let superAdminGuard: SuperAdminGuard;
  let schoolMembershipGuard: SchoolMembershipGuard;

  beforeEach(() => {
    reflector = new Reflector();
    superAdminGuard = new SuperAdminGuard(reflector);
    schoolMembershipGuard = new SchoolMembershipGuard(reflector);
  });

  describe('SuperAdminGuard Protection', () => {
    it('should deny normal USER account type from accessing Super Admin endpoints', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'user-1',
              email: 'teacher@schoola.com',
              accountType: 'USER',
              profile: 'TEACHER',
            },
          }),
        }),
      };

      const result = superAdminGuard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should deny SCHOOL_ADMIN from accessing platform Super Admin endpoints', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'admin-1',
              email: 'admin@schoola.com',
              accountType: 'USER',
              profile: 'SCHOOL_ADMIN',
            },
          }),
        }),
      };

      const result = superAdminGuard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should allow SUPER_ADMIN access to platform endpoints', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'super-admin-1',
              email: 'admin@platform.com',
              accountType: 'SUPER_ADMIN',
            },
          }),
        }),
      };

      const result = superAdminGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('SchoolMembershipGuard & Cross-Tenant Access Prevention', () => {
    it('should block School A user from accessing School B data when attempting to spoof school context', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'user-a',
              email: 'user@schoola.com',
              accountType: 'USER',
              schoolId: 'school-b-id', // Trying to access School B
              memberships: [
                {
                  schoolId: 'school-a-id',
                  status: 'ACTIVE',
                  profile: 'TEACHER',
                },
              ],
            },
          }),
        }),
      };

      expect(() => schoolMembershipGuard.canActivate(mockContext)).toThrow(
        UnauthorizedException,
      );
    });

    it('should block user with INACTIVE or SUSPENDED membership', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'user-suspended',
              accountType: 'USER',
              schoolId: 'school-a-id',
              memberships: [
                {
                  schoolId: 'school-a-id',
                  status: 'SUSPENDED',
                  profile: 'TEACHER',
                },
              ],
            },
          }),
        }),
      };

      expect(() => schoolMembershipGuard.canActivate(mockContext)).toThrow(
        UnauthorizedException,
      );
    });

    it('should permit user with verified ACTIVE membership in authorized school', () => {
      const mockContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'user-valid',
              accountType: 'USER',
              schoolId: 'school-a-id',
              memberships: [
                {
                  schoolId: 'school-a-id',
                  status: 'ACTIVE',
                  profile: 'SCHOOL_ADMIN',
                },
              ],
            },
          }),
        }),
      };

      const result = schoolMembershipGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('StudentsService Tenant Scoping', () => {
    let mockPrisma: any;
    let studentsService: StudentsService;

    beforeEach(() => {
      mockPrisma = {
        student: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
          create: jest.fn(),
        },
      };
      studentsService = new StudentsService(mockPrisma);
    });

    it('should reject request when School A queries student belonging to School B', async () => {
      // Prisma returns null because the query enforces { id: "student-b", schoolId: "school-a" }
      mockPrisma.student.findFirst.mockResolvedValue(null);

      await expect(
        studentsService.findOne('school-a-id', 'student-b-id'),
      ).rejects.toThrow('Student not found in this school');

      expect(mockPrisma.student.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'student-b-id',
            schoolId: 'school-a-id',
          },
        }),
      );
    });

    it('should successfully return student when schoolId matches', async () => {
      const mockStudent = {
        id: 'student-a-1',
        schoolId: 'school-a-id',
        firstName: 'Kwame',
        lastName: 'Mensah',
      };
      mockPrisma.student.findFirst.mockResolvedValue(mockStudent);

      const result = await studentsService.findOne('school-a-id', 'student-a-1');
      expect(result).toEqual(mockStudent);
    });
  });

  describe('TeachersService Tenant Scoping', () => {
    let mockPrisma: any;
    let teachersService: TeachersService;

    beforeEach(() => {
      mockPrisma = {
        teacher: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
        },
      };
      teachersService = new TeachersService(mockPrisma);
    });

    it('should reject request when School A queries teacher belonging to School B', async () => {
      mockPrisma.teacher.findFirst.mockResolvedValue(null);

      await expect(
        teachersService.findOne('school-a-id', 'teacher-b-id'),
      ).rejects.toThrow('Teacher not found in this school');

      expect(mockPrisma.teacher.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'teacher-b-id',
            schoolId: 'school-a-id',
          },
        }),
      );
    });
  });
});

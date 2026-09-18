import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SuperAdminGuard } from './super-admin.guard';
import { SchoolMembershipGuard } from './school-membership.guard';
import { PermissionsGuard } from './permissions.guard';
import { Reflector } from '@nestjs/core';
import { StudentsService } from '../../students/students.service';
import { TeachersService } from '../../teachers/teachers.service';
import { RolesService } from '../../roles/roles.service';
import { ResultsService } from '../../results/results.service';
import { GradingService } from '../../academics/grading.service';
import { ParentsService } from '../../parents/parents.service';
import { FeesService } from '../../fees/fees.service';

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

  describe('PermissionsGuard & Privilege Escalation Hardening', () => {
    let permissionsGuard: PermissionsGuard;
    let mockReflector: any;

    beforeEach(() => {
      mockReflector = {
        getAllAndOverride: jest.fn(),
      };
      permissionsGuard = new PermissionsGuard(mockReflector);
    });

    it('should block user who does not possess required permission', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['fees.manage']);
      const mockContext: any = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'teacher-1',
              accountType: 'USER',
              membershipProfile: 'TEACHER',
              permissions: ['results.record', 'attendance.record'],
            },
          }),
        }),
      };

      expect(() => permissionsGuard.canActivate(mockContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow user with exact required permission', () => {
      mockReflector.getAllAndOverride.mockReturnValue(['attendance.record']);
      const mockContext: any = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            user: {
              id: 'teacher-1',
              accountType: 'USER',
              membershipProfile: 'TEACHER',
              permissions: ['attendance.record'],
            },
          }),
        }),
      };

      const result = permissionsGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('RolesService Wildcard Privilege Prevention', () => {
    let mockPrisma: any;
    let rolesService: RolesService;

    beforeEach(() => {
      mockPrisma = {
        schoolSetting: {
          findUnique: jest.fn().mockResolvedValue(null),
          upsert: jest.fn().mockResolvedValue({}),
        },
      };
      rolesService = new RolesService(mockPrisma);
    });

    it('should strip wildcard * when tenant admin attempts to assign wildcard to a role', async () => {
      const result = await rolesService.updateRolePermissions(
        'school-1',
        'TEACHER',
        ['*', 'students.view', 'nonexistent.fake.perm'],
      );

      // '*' and 'nonexistent.fake.perm' must be stripped; only valid catalog items retained
      expect(result.permissions).not.toContain('*');
      expect(result.permissions).not.toContain('nonexistent.fake.perm');
      expect(result.permissions).toContain('students.view');
    });
  });

  describe('ResultsService Locking Protection', () => {
    let mockPrisma: any;
    let resultsService: ResultsService;
    let gradingService: GradingService;

    beforeEach(() => {
      mockPrisma = {
        class: {
          findFirst: jest.fn().mockResolvedValue({ id: 'class-1', level: 'JHS', schoolId: 'school-1' }),
        },
        subject: {
          findFirst: jest.fn().mockResolvedValue({ id: 'subj-1', name: 'Mathematics', code: 'MATH', schoolId: 'school-1' }),
        },
        $transaction: jest.fn((txFn: any) => txFn(mockPrisma)),
      };
      gradingService = new GradingService();
      resultsService = new ResultsService(mockPrisma, gradingService);
    });

    it('should reject silent overwrite if student result is already published and locked', async () => {
      mockPrisma.student = {
        findFirst: jest.fn().mockResolvedValue({
          id: 'student-1',
          firstName: 'Ama',
          lastName: 'Osei',
          admissionNumber: 'ADM-001',
          schoolId: 'school-1',
        }),
      };
      mockPrisma.result = {
        findFirst: jest.fn().mockResolvedValue({
          id: 'result-1',
          schoolId: 'school-1',
          studentId: 'student-1',
          isPublished: true, // LOCKED / PUBLISHED
          score: 85,
        }),
        update: jest.fn(),
      };

      await expect(
        resultsService.recordBatchScores('school-1', {
          classId: 'class-1',
          subjectId: 'subj-1',
          scores: [{ studentId: 'student-1', classwork: 30, test: 20, exam: 40 }],
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.result.update).not.toHaveBeenCalled();
    });
  });

  describe('Comprehensive Multi-Tenant Cross-School Data Access Protection (School A vs School B)', () => {
    let mockPrisma: any;
    let parentsService: ParentsService;
    let feesService: FeesService;

    beforeEach(() => {
      mockPrisma = {
        parent: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
          count: jest.fn(),
        },
        studentFee: {
          findFirst: jest.fn(),
          findMany: jest.fn(),
        },
        $transaction: jest.fn((txFn: any) => txFn(mockPrisma)),
      };
      parentsService = new ParentsService(mockPrisma);
      feesService = new FeesService(mockPrisma);
    });

    it('should prevent School A user from retrieving parent record belonging to School B', async () => {
      // Prisma query enforces { id: "parent-b", schoolId: "school-a" } which returns null
      mockPrisma.parent.findFirst.mockResolvedValue(null);

      await expect(
        parentsService.findOne('school-a-id', 'parent-b-id'),
      ).rejects.toThrow('Parent not found in this school');

      expect(mockPrisma.parent.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'parent-b-id',
            schoolId: 'school-a-id',
          },
        }),
      );
    });

    it('should prevent School A user from recording payments against fee records of School B', async () => {
      mockPrisma.studentFee.findFirst.mockResolvedValue(null);

      await expect(
        feesService.recordPayment(
          'school-a-id',
          'fee-record-belonging-to-school-b',
          { amountPaid: 500, paymentMethod: 'CASH' },
          'user-a',
        ),
      ).rejects.toThrow('Fee record not found in this school');

      expect(mockPrisma.studentFee.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'fee-record-belonging-to-school-b',
            schoolId: 'school-a-id',
          },
        }),
      );
    });
  });
});

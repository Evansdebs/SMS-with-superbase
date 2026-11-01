import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  Role,
  UserRoleAssignment,
  RoleAuditLog,
  CreateRoleDto,
  UpdateRoleDto,
  DuplicateRoleDto,
  AssignUserRolesDto,
} from './dto/roles.dto';
import { ALL_PERMISSIONS } from '../common/constants/permissions.catalog';

@Injectable()
export class RolesService {
  // In-memory store keyed by schoolId
  private rolesStore: Map<string, Role[]> = new Map();
  private userAssignmentsStore: Map<string, UserRoleAssignment[]> = new Map();
  private auditLogsStore: Map<string, RoleAuditLog[]> = new Map();

  constructor() {
    this.seedDefaultRolesForSchool('demo-school-001');
  }

  private seedDefaultRolesForSchool(schoolId: string) {
    if (this.rolesStore.has(schoolId)) return;

    const defaultRoles: Role[] = [
      {
        id: 'role-1',
        schoolId,
        name: 'School Administrator',
        code: 'SCHOOL_ADMIN',
        description: 'Complete unrestricted governance and operational authority across all modules.',
        isSystem: true,
        status: 'ACTIVE',
        userCount: 2,
        permissions: ['*'],
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
      },
      {
        id: 'role-2',
        schoolId,
        name: 'Principal / Headteacher',
        code: 'PRINCIPAL',
        description: 'Academic and administrative leader with schoolwide signoff and reporting authority.',
        isSystem: true,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'dashboard.statistics.view', 'dashboard.analytics.view',
          'students.*', 'parents.*', 'admissions.*', 'teachers.*', 'hr.*', 'academics.*',
          'timetable.schedule.view', 'timetable.schedule.publish',
          'examinations.score.approve', 'examinations.result.publish',
          'reports.*', 'attendance.*', 'discipline.*', 'exeat.*',
          'fees.balance.view', 'fees.report.export', 'accounting.report.view',
          'communication.*', 'documents.*', 'roles.role.view',
        ],
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
      },
      {
        id: 'role-3',
        schoolId,
        name: 'Vice Principal',
        code: 'VICE_PRINCIPAL',
        description: 'Deputy executive overseeing academic affairs, student discipline, and master schedules.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.*', 'students.*', 'parents.parent.view', 'admissions.*', 'teachers.teacher.view',
          'teachers.performance.view', 'academics.*', 'timetable.*', 'assignments.*',
          'examinations.*', 'reports.*', 'attendance.*', 'discipline.*', 'exeat.*',
          'communication.*', 'documents.*',
        ],
        createdAt: new Date('2026-01-12').toISOString(),
        updatedAt: new Date('2026-01-12').toISOString(),
      },
      {
        id: 'role-4',
        schoolId,
        name: 'Academic Coordinator',
        code: 'ACADEMIC_COORDINATOR',
        description: 'Supervises curriculum alignment, lesson plans, syllabi delivery, and examination pacing.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 3,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'academics.*', 'timetable.*',
          'assignments.assignment.view', 'examinations.*', 'reports.reportcard.view',
          'reports.reportcard.generate', 'reports.reportcard.approve', 'attendance.analytics.view',
          'communication.announcement.send', 'documents.document.view',
        ],
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'role-5',
        schoolId,
        name: 'Class Teacher',
        code: 'CLASS_TEACHER',
        description: 'Form master in charge of class register, pastoral care, remarks, and terminal report slips.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 12,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'students.document.view',
          'parents.parent.view', 'academics.subject.manage', 'timetable.schedule.view',
          'assignments.*', 'examinations.score.enter', 'examinations.score.edit',
          'reports.reportcard.view', 'reports.reportcard.edit', 'attendance.record.view',
          'attendance.record.create', 'attendance.record.edit', 'discipline.incident.create',
          'discipline.incident.view', 'exeat.request.view', 'exeat.request.create',
          'communication.message.send', 'communication.message.view',
        ],
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'role-6',
        schoolId,
        name: 'Subject Teacher',
        code: 'SUBJECT_TEACHER',
        description: 'Delivers classroom lessons, Continuous Assessment scoring, homework, and subject attendance.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 24,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'timetable.schedule.view',
          'assignments.*', 'examinations.score.enter', 'examinations.score.edit',
          'attendance.record.view', 'attendance.record.create', 'communication.message.send',
        ],
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'role-7',
        schoolId,
        name: 'Accountant / Bursar',
        code: 'ACCOUNTANT_BURSAR',
        description: 'Manages student fee billing, daily cash collections, bank reconciliation, and staff payroll.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'dashboard.statistics.view', 'students.student.view',
          'parents.parent.view', 'fees.*', 'payments.*', 'accounting.*', 'payroll.*',
          'reports.report.view', 'reports.report.generate', 'reports.report.export',
        ],
        createdAt: new Date('2026-01-10').toISOString(),
        updatedAt: new Date('2026-01-10').toISOString(),
      },
      {
        id: 'role-8',
        schoolId,
        name: 'HR Officer',
        code: 'HR_OFFICER',
        description: 'Administers staff profiles, leave requests, employment contracts, and regulatory filings.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'teachers.teacher.view', 'teachers.teacher.create',
          'teachers.teacher.edit', 'hr.*', 'documents.*', 'communication.message.send',
        ],
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'role-9',
        schoolId,
        name: 'Librarian',
        code: 'LIBRARIAN',
        description: 'Maintains catalogue, barcode checkouts, book reservations, and overdue library fines.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'teachers.teacher.view',
          'library.*', 'communication.message.send',
        ],
        createdAt: new Date('2026-01-15').toISOString(),
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        id: 'role-10',
        schoolId,
        name: 'School Nurse',
        code: 'SCHOOL_NURSE',
        description: 'Strictly manages confidential clinic visits, student medical history, and emergency triage.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'health.*', 'exeat.request.create', 'communication.sms.send',
        ],
        createdAt: new Date('2026-01-18').toISOString(),
        updatedAt: new Date('2026-01-18').toISOString(),
      },
      {
        id: 'role-11',
        schoolId,
        name: 'Transport Officer',
        code: 'TRANSPORT_OFFICER',
        description: 'Oversees school buses, route timing, pickup stages, and daily ridership attendance.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'transport.*', 'communication.sms.send',
        ],
        createdAt: new Date('2026-01-18').toISOString(),
        updatedAt: new Date('2026-01-18').toISOString(),
      },
      {
        id: 'role-12',
        schoolId,
        name: 'Hostel / Boarding Officer',
        code: 'BOARDING_OFFICER',
        description: 'Supervises dormitories, cubicle bed allocations, night checks, and town exeat approvals.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'boarding.*', 'exeat.*', 'health.clinic.manage', 'discipline.incident.create',
          'communication.sms.send',
        ],
        createdAt: new Date('2026-01-18').toISOString(),
        updatedAt: new Date('2026-01-18').toISOString(),
      },
      {
        id: 'role-13',
        schoolId,
        name: 'Receptionist',
        code: 'RECEPTIONIST',
        description: 'Handles walk-in visitor registration, gate passes, telephone enquiries, and student pickups.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'admissions.application.create', 'admissions.application.view',
          'exeat.gatepass.manage', 'communication.message.send',
        ],
        createdAt: new Date('2026-01-20').toISOString(),
        updatedAt: new Date('2026-01-20').toISOString(),
      },
      {
        id: 'role-14',
        schoolId,
        name: 'Front Desk Officer',
        code: 'FRONT_DESK_OFFICER',
        description: 'Coordinates appointment logs, message routing, incoming courier deliveries, and front desk notices.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'exeat.gatepass.manage', 'communication.message.send',
        ],
        createdAt: new Date('2026-01-20').toISOString(),
        updatedAt: new Date('2026-01-20').toISOString(),
      },
      {
        id: 'role-15',
        schoolId,
        name: 'Storekeeper',
        code: 'STOREKEEPER',
        description: 'Manages school inventory, classroom stationery replenishment, uniforms, and asset dispatch.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'inventory.*',
        ],
        createdAt: new Date('2026-01-20').toISOString(),
        updatedAt: new Date('2026-01-20').toISOString(),
      },
      {
        id: 'role-16',
        schoolId,
        name: 'Examination Officer',
        code: 'EXAM_OFFICER',
        description: 'Coordinates exam question bank, hall allocations, broadsheet validations, and report compilation.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 2,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'academics.*', 'timetable.schedule.view',
          'examinations.*', 'reports.reportcard.view', 'reports.reportcard.generate',
          'reports.reportcard.download', 'reports.reportcard.print',
        ],
        createdAt: new Date('2026-01-22').toISOString(),
        updatedAt: new Date('2026-01-22').toISOString(),
      },
      {
        id: 'role-17',
        schoolId,
        name: 'ICT Administrator',
        code: 'ICT_ADMINISTRATOR',
        description: 'Configures school SMS portals, CBT computer tests, SMS integration keys, and biometric terminals.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.*', 'examinations.*', 'roles.role.view', 'settings.settings.view',
          'settings.notification.manage', 'settings.sms.manage', 'settings.integration.manage',
        ],
        createdAt: new Date('2026-01-22').toISOString(),
        updatedAt: new Date('2026-01-22').toISOString(),
      },
      {
        id: 'role-18',
        schoolId,
        name: 'Counsellor',
        code: 'COUNSELLOR',
        description: 'Provides guidance, counselling sessions, student pastoral interventions, and career advice.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 1,
        permissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'discipline.incident.view', 'discipline.action.manage', 'health.record.view',
          'communication.message.send',
        ],
        createdAt: new Date('2026-01-25').toISOString(),
        updatedAt: new Date('2026-01-25').toISOString(),
      },
      {
        id: 'role-19',
        schoolId,
        name: 'Security Officer',
        code: 'SECURITY_OFFICER',
        description: 'Campus perimeter checkpoint verification, visitor vehicle passes, and exeat sign-ins.',
        isSystem: false,
        status: 'ACTIVE',
        userCount: 4,
        permissions: [
          'dashboard.overview.view', 'exeat.gatepass.manage', 'exeat.gatelog.view',
          'transport.vehicle.view',
        ],
        createdAt: new Date('2026-01-25').toISOString(),
        updatedAt: new Date('2026-01-25').toISOString(),
      },
    ];

    this.rolesStore.set(schoolId, defaultRoles);

    // Seed mock user assignments
    const mockUsers: UserRoleAssignment[] = [
      {
        userId: 'school-admin-001',
        schoolId,
        fullName: 'Dr. Jane Addo Mensah',
        email: 'admin@school.com',
        designation: 'Executive Principal',
        primaryRole: 'School Administrator',
        additionalRoles: [],
        directPermissions: [],
        inheritedPermissions: ['*'],
        effectivePermissions: ['*'],
        updatedAt: new Date('2026-01-10').toISOString(),
      },
      {
        userId: 'teacher-001',
        schoolId,
        fullName: 'Mr. Kwame Mensah',
        email: 'teacher@school.com',
        designation: 'Head of Science & Form Master JHS 1',
        primaryRole: 'Class Teacher',
        additionalRoles: ['Examination Officer'],
        directPermissions: ['examinations.score.approve'],
        inheritedPermissions: [
          'dashboard.overview.view', 'students.student.view', 'academics.*', 'timetable.schedule.view',
          'assignments.*', 'examinations.*', 'reports.reportcard.view', 'reports.reportcard.generate',
          'reports.reportcard.download', 'reports.reportcard.print', 'attendance.record.view',
          'attendance.record.create', 'attendance.record.edit', 'discipline.incident.create',
          'discipline.incident.view', 'exeat.request.view', 'exeat.request.create',
          'communication.message.send', 'communication.message.view',
        ],
        effectivePermissions: [
          'dashboard.overview.view', 'students.student.view', 'academics.*', 'timetable.schedule.view',
          'assignments.*', 'examinations.*', 'examinations.score.approve', 'reports.reportcard.view',
          'reports.reportcard.generate', 'reports.reportcard.download', 'reports.reportcard.print',
          'attendance.record.view', 'attendance.record.create', 'attendance.record.edit',
          'discipline.incident.create', 'discipline.incident.view', 'exeat.request.view',
          'exeat.request.create', 'communication.message.send', 'communication.message.view',
        ],
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        userId: 'finance-001',
        schoolId,
        fullName: 'Mrs. Grace Darko',
        email: 'finance@school.com',
        designation: 'Bursar & Chief Accountant',
        primaryRole: 'Accountant / Bursar',
        additionalRoles: [],
        directPermissions: [],
        inheritedPermissions: [
          'dashboard.overview.view', 'dashboard.statistics.view', 'students.student.view',
          'parents.parent.view', 'fees.*', 'payments.*', 'accounting.*', 'payroll.*',
          'reports.report.view', 'reports.report.generate', 'reports.report.export',
        ],
        effectivePermissions: [
          'dashboard.overview.view', 'dashboard.statistics.view', 'students.student.view',
          'parents.parent.view', 'fees.*', 'payments.*', 'accounting.*', 'payroll.*',
          'reports.report.view', 'reports.report.generate', 'reports.report.export',
        ],
        updatedAt: new Date('2026-01-10').toISOString(),
      },
      {
        userId: 'staff-nurse-001',
        schoolId,
        fullName: 'Nurse Evelyn Osei',
        email: 'nurse@school.com',
        designation: 'Senior Nursing Officer',
        primaryRole: 'School Nurse',
        additionalRoles: [],
        directPermissions: [],
        inheritedPermissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'health.*', 'exeat.request.create', 'communication.sms.send',
        ],
        effectivePermissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'health.*', 'exeat.request.create', 'communication.sms.send',
        ],
        updatedAt: new Date('2026-01-18').toISOString(),
      },
      {
        userId: 'staff-lib-001',
        schoolId,
        fullName: 'Mr. Eric Boateng',
        email: 'library@school.com',
        designation: 'Head Librarian',
        primaryRole: 'Librarian',
        additionalRoles: [],
        directPermissions: [],
        inheritedPermissions: [
          'dashboard.overview.view', 'students.student.view', 'teachers.teacher.view',
          'library.*', 'communication.message.send',
        ],
        effectivePermissions: [
          'dashboard.overview.view', 'students.student.view', 'teachers.teacher.view',
          'library.*', 'communication.message.send',
        ],
        updatedAt: new Date('2026-01-15').toISOString(),
      },
      {
        userId: 'staff-trans-001',
        schoolId,
        fullName: 'Kojo Antwi',
        email: 'transport@school.com',
        designation: 'Transport Fleet Supervisor',
        primaryRole: 'Transport Officer',
        additionalRoles: [],
        directPermissions: [],
        inheritedPermissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'transport.*', 'communication.sms.send',
        ],
        effectivePermissions: [
          'dashboard.overview.view', 'students.student.view', 'parents.parent.view',
          'transport.*', 'communication.sms.send',
        ],
        updatedAt: new Date('2026-01-18').toISOString(),
      },
    ];

    this.userAssignmentsStore.set(schoolId, mockUsers);

    // Seed mock audit logs
    const mockAudit: RoleAuditLog[] = [
      {
        id: 'audit-1',
        schoolId,
        actorEmail: 'admin@school.com',
        actorRole: 'School Administrator',
        action: 'DIRECT_PERMISSION_GRANTED',
        targetType: 'USER_ASSIGNMENT',
        targetName: 'Kwame Mensah (teacher@school.com)',
        timestamp: new Date('2026-01-20T10:35:00Z').toISOString(),
        details: 'Granted direct override permission "examinations.score.approve" for Term 2 broadsheets signoff.',
        previousValue: 'Not granted',
        newValue: 'Granted',
      },
      {
        id: 'audit-2',
        schoolId,
        actorEmail: 'admin@school.com',
        actorRole: 'School Administrator',
        action: 'ADDITIONAL_ROLE_ASSIGNED',
        targetType: 'USER_ASSIGNMENT',
        targetName: 'Kwame Mensah (teacher@school.com)',
        timestamp: new Date('2026-01-18T14:15:00Z').toISOString(),
        details: 'Assigned supplementary role "Examination Officer" alongside primary "Class Teacher" role.',
        previousValue: 'None',
        newValue: 'Examination Officer',
      },
      {
        id: 'audit-3',
        schoolId,
        actorEmail: 'admin@school.com',
        actorRole: 'School Administrator',
        action: 'ROLE_CREATED',
        targetType: 'ROLE',
        targetName: 'Security Officer',
        timestamp: new Date('2026-01-25T08:00:00Z').toISOString(),
        details: 'Created role for campus security gates with exeat validation and vehicle pass clearance permissions.',
        previousValue: 'N/A',
        newValue: 'Active with 4 permissions',
      },
    ];

    this.auditLogsStore.set(schoolId, mockAudit);
  }

  getRoles(schoolId: string): Role[] {
    this.seedDefaultRolesForSchool(schoolId);
    return this.rolesStore.get(schoolId) || [];
  }

  getRoleById(schoolId: string, id: string): Role {
    const roles = this.getRoles(schoolId);
    const role = roles.find((r) => r.id === id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  createRole(schoolId: string, dto: CreateRoleDto, actorEmail: string): Role {
    const roles = this.getRoles(schoolId);
    const exists = roles.some((r) => r.name.toLowerCase() === dto.name.toLowerCase());
    if (exists) {
      throw new BadRequestException(`Role with name "${dto.name}" already exists.`);
    }

    const code = (dto.code || dto.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')).slice(0, 32);
    const newRole: Role = {
      id: `role-${Date.now()}`,
      schoolId,
      name: dto.name,
      code,
      description: dto.description || '',
      isSystem: false,
      status: dto.status || 'ACTIVE',
      userCount: 0,
      permissions: dto.permissions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    roles.push(newRole);
    this.rolesStore.set(schoolId, roles);

    this.logAudit(schoolId, {
      actorEmail,
      actorRole: 'School Administrator',
      action: 'ROLE_CREATED',
      targetType: 'ROLE',
      targetName: newRole.name,
      details: `Created new role "${newRole.name}" with ${newRole.permissions.length} granular permissions.`,
      newValue: `Status: ${newRole.status}, Permissions: ${newRole.permissions.join(', ')}`,
    });

    return newRole;
  }

  updateRole(schoolId: string, id: string, dto: UpdateRoleDto, actorEmail: string): Role {
    const roles = this.getRoles(schoolId);
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) throw new NotFoundException('Role not found');

    const role = roles[index];
    const prevPermCount = role.permissions.length;

    if (dto.name !== undefined) role.name = dto.name;
    if (dto.description !== undefined) role.description = dto.description;
    if (dto.status !== undefined) role.status = dto.status;
    if (dto.permissions !== undefined) role.permissions = dto.permissions;
    role.updatedAt = new Date().toISOString();

    roles[index] = role;
    this.rolesStore.set(schoolId, roles);

    this.logAudit(schoolId, {
      actorEmail,
      actorRole: 'School Administrator',
      action: 'ROLE_UPDATED',
      targetType: 'ROLE',
      targetName: role.name,
      details: `Updated role "${role.name}". Permissions changed from ${prevPermCount} to ${role.permissions.length}.`,
      previousValue: `Perms: ${prevPermCount}`,
      newValue: `Perms: ${role.permissions.length}, Status: ${role.status}`,
    });

    return role;
  }

  duplicateRole(schoolId: string, id: string, dto: DuplicateRoleDto, actorEmail: string): Role {
    const sourceRole = this.getRoleById(schoolId, id);
    const targetName = dto.name || `${sourceRole.name} (Copy)`;

    return this.createRole(
      schoolId,
      {
        name: targetName,
        code: `${sourceRole.code}_COPY_${Date.now().toString().slice(-4)}`,
        description: dto.description || `Cloned from ${sourceRole.name}. ${sourceRole.description}`,
        permissions: [...sourceRole.permissions],
        status: 'ACTIVE',
      },
      actorEmail,
    );
  }

  toggleRoleStatus(schoolId: string, id: string, actorEmail: string): Role {
    const role = this.getRoleById(schoolId, id);
    if (role.isSystem && role.status === 'ACTIVE') {
      throw new BadRequestException('Cannot deactivate protected system role.');
    }
    const newStatus = role.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return this.updateRole(schoolId, id, { status: newStatus }, actorEmail);
  }

  deleteRole(schoolId: string, id: string, actorEmail: string): { success: boolean; message: string } {
    const role = this.getRoleById(schoolId, id);
    if (role.isSystem) {
      throw new BadRequestException('System role cannot be deleted.');
    }

    if (role.userCount > 0) {
      throw new BadRequestException(
        `Role is assigned to ${role.userCount} active staff member(s). You must reassign all users before deleting this role.`,
      );
    }

    const roles = this.getRoles(schoolId).filter((r) => r.id !== id);
    this.rolesStore.set(schoolId, roles);

    this.logAudit(schoolId, {
      actorEmail,
      actorRole: 'School Administrator',
      action: 'ROLE_DELETED',
      targetType: 'ROLE',
      targetName: role.name,
      details: `Deleted custom role "${role.name}".`,
      previousValue: `Permissions: ${role.permissions.length}`,
      newValue: 'DELETED',
    });

    return { success: true, message: `Role "${role.name}" deleted successfully.` };
  }

  getUserAssignments(schoolId: string): UserRoleAssignment[] {
    this.seedDefaultRolesForSchool(schoolId);
    return this.userAssignmentsStore.get(schoolId) || [];
  }

  assignUserRoles(schoolId: string, dto: AssignUserRolesDto, actorEmail: string): UserRoleAssignment {
    const assignments = this.getUserAssignments(schoolId);
    const roles = this.getRoles(schoolId);

    let assignment = assignments.find((a) => a.userId === dto.userId);

    // Calculate inherited permissions from primary and additional roles
    const activeRoles = [
      dto.primaryRole,
      ...(dto.additionalRoles || []),
    ].filter(Boolean);

    const inheritedSet = new Set<string>();
    for (const roleName of activeRoles) {
      const match = roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase());
      if (match) {
        match.permissions.forEach((p) => inheritedSet.add(p));
      }
    }

    const inherited = Array.from(inheritedSet);
    const direct = dto.directPermissions || assignment?.directPermissions || [];
    const effective = Array.from(new Set([...inherited, ...direct]));

    if (assignment) {
      const prevRoles = [assignment.primaryRole, ...assignment.additionalRoles].join(', ');
      assignment.primaryRole = dto.primaryRole;
      assignment.additionalRoles = dto.additionalRoles || [];
      assignment.directPermissions = direct;
      assignment.inheritedPermissions = inherited;
      assignment.effectivePermissions = effective;
      assignment.updatedAt = new Date().toISOString();

      this.logAudit(schoolId, {
        actorEmail,
        actorRole: 'School Administrator',
        action: 'USER_ROLES_UPDATED',
        targetType: 'USER_ASSIGNMENT',
        targetName: `${assignment.fullName} (${assignment.email})`,
        details: `Updated roles for ${assignment.fullName}. Primary: ${assignment.primaryRole}, Additional: [${assignment.additionalRoles.join(', ')}].`,
        previousValue: prevRoles,
        newValue: [assignment.primaryRole, ...assignment.additionalRoles].join(', '),
      });
    } else {
      assignment = {
        userId: dto.userId,
        schoolId,
        fullName: 'Staff Member',
        email: 'staff@school.com',
        primaryRole: dto.primaryRole,
        additionalRoles: dto.additionalRoles || [],
        directPermissions: direct,
        inheritedPermissions: inherited,
        effectivePermissions: effective,
        updatedAt: new Date().toISOString(),
      };
      assignments.push(assignment);

      this.logAudit(schoolId, {
        actorEmail,
        actorRole: 'School Administrator',
        action: 'USER_ROLES_ASSIGNED',
        targetType: 'USER_ASSIGNMENT',
        targetName: assignment.email,
        details: `Assigned primary role "${assignment.primaryRole}" to staff user.`,
        newValue: assignment.primaryRole,
      });
    }

    this.userAssignmentsStore.set(schoolId, assignments);
    return assignment;
  }

  getAuditLogs(schoolId: string): RoleAuditLog[] {
    this.seedDefaultRolesForSchool(schoolId);
    return this.auditLogsStore.get(schoolId) || [];
  }

  private logAudit(schoolId: string, log: Omit<RoleAuditLog, 'id' | 'schoolId' | 'timestamp'>) {
    const logs = this.getAuditLogs(schoolId);
    const entry: RoleAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      schoolId,
      timestamp: new Date().toISOString(),
      ...log,
    };
    logs.unshift(entry);
    this.auditLogsStore.set(schoolId, logs);
  }

  getPermissionsCatalog() {
    return ALL_PERMISSIONS;
  }
}


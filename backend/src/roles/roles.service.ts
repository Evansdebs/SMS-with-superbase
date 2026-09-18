import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PERMISSIONS_CATALOG,
  SYSTEM_ROLES,
  DEFAULT_ROLE_PERMISSIONS,
  PermissionDefinition,
  RoleDefinition,
} from './roles.config';

const SETTING_KEY = 'ROLE_PERMISSIONS_MATRIX';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  private readonly memoryMatrixCache = new Map<string, Record<string, string[]>>();

  constructor(private prisma: PrismaService) {}

  getAvailableRoles(): RoleDefinition[] {
    return SYSTEM_ROLES;
  }

  getPermissionsCatalog(): PermissionDefinition[] {
    return PERMISSIONS_CATALOG;
  }

  /**
   * Retrieves the current role-functionality assignments for a school tenant.
   * Merges persisted tenant overrides with standard defaults.
   */
  async getRoleMatrix(schoolId: string): Promise<{
    roles: RoleDefinition[];
    catalog: PermissionDefinition[];
    matrix: Record<string, string[]>;
  }> {
    let savedMatrix: Record<string, string[]> = this.memoryMatrixCache.get(schoolId) || {};

    try {
      const setting = await this.prisma.schoolSetting.findUnique({
        where: {
          schoolId_key: {
            schoolId,
            key: SETTING_KEY,
          },
        },
      });

      if (setting?.value) {
        savedMatrix = JSON.parse(setting.value);
        this.memoryMatrixCache.set(schoolId, savedMatrix);
      }
    } catch (err: any) {
      this.logger.warn(`Database offline; using resilient cache for school ${schoolId}: ${err.message}`);
    }

    // Combine defaults with saved overrides
    const effectiveMatrix: Record<string, string[]> = {};
    for (const role of SYSTEM_ROLES) {
      effectiveMatrix[role.id] = savedMatrix[role.id] || DEFAULT_ROLE_PERMISSIONS[role.id] || [];
    }

    return {
      roles: SYSTEM_ROLES,
      catalog: PERMISSIONS_CATALOG,
      matrix: effectiveMatrix,
    };
  }

  /**
   * Updates functionalities assigned to a specific role in a school tenant.
   */
  async updateRolePermissions(
    schoolId: string,
    roleId: string,
    permissions: string[],
  ): Promise<{ role: string; permissions: string[] }> {
    const validRole = SYSTEM_ROLES.find((r) => r.id === roleId);
    if (!validRole) {
      throw new BadRequestException(`Role "${roleId}" is not a recognized system role.`);
    }

    // Enforce strict security: School administrators may NOT assign wildcard '*' or platform-wide bypasses
    const validPermissionIds = new Set(PERMISSIONS_CATALOG.map((p) => p.id));
    const sanitizedPermissions = permissions.filter((p) => validPermissionIds.has(p));

    const { matrix } = await this.getRoleMatrix(schoolId);
    matrix[roleId] = sanitizedPermissions;

    await this.persistMatrix(schoolId, matrix);

    return {
      role: roleId,
      permissions: sanitizedPermissions,
    };
  }

  /**
   * Bulk updates the entire role permissions matrix for a school tenant.
   */
  async updateRoleMatrix(
    schoolId: string,
    newMatrix: Record<string, string[]>,
  ): Promise<Record<string, string[]>> {
    const { matrix } = await this.getRoleMatrix(schoolId);
    const validPermissionIds = new Set(PERMISSIONS_CATALOG.map((p) => p.id));

    for (const [roleId, perms] of Object.entries(newMatrix)) {
      if (SYSTEM_ROLES.some((r) => r.id === roleId) && Array.isArray(perms)) {
        // Enforce: No wildcard '*' allowed for tenant-level roles
        matrix[roleId] = perms.filter((p) => validPermissionIds.has(p));
      }
    }

    await this.persistMatrix(schoolId, matrix);
    return matrix;
  }

  /**
   * Resets a specific role or all roles to standard default configuration.
   */
  async resetRoleDefaults(
    schoolId: string,
    roleId?: string,
  ): Promise<Record<string, string[]>> {
    const { matrix } = await this.getRoleMatrix(schoolId);

    if (roleId) {
      if (!DEFAULT_ROLE_PERMISSIONS[roleId]) {
        throw new NotFoundException(`No default template defined for role "${roleId}"`);
      }
      matrix[roleId] = [...DEFAULT_ROLE_PERMISSIONS[roleId]];
    } else {
      for (const role of SYSTEM_ROLES) {
        matrix[role.id] = [...(DEFAULT_ROLE_PERMISSIONS[role.id] || [])];
      }
    }

    await this.persistMatrix(schoolId, matrix);
    return matrix;
  }

  /**
   * Resolves the real-time active permissions for a user given their school role
   * and optional custom overrides.
   */
  async getEffectiveUserPermissions(
    schoolId: string,
    profile: string,
    customUserPermissions?: any,
  ): Promise<string[]> {
    // If user has wildcard permissions directly
    if (Array.isArray(customUserPermissions) && customUserPermissions.includes('*')) {
      return PERMISSIONS_CATALOG.map((p) => p.id);
    }

    const { matrix } = await this.getRoleMatrix(schoolId);
    const rolePermissions = matrix[profile] || DEFAULT_ROLE_PERMISSIONS[profile] || [];

    if (rolePermissions.includes('*')) {
      return PERMISSIONS_CATALOG.map((p) => p.id);
    }

    const combined = new Set<string>(rolePermissions);

    // Merge any explicit custom user permission overrides from their membership
    if (Array.isArray(customUserPermissions)) {
      for (const perm of customUserPermissions) {
        if (typeof perm === 'string') {
          combined.add(perm);
        }
      }
    }

    return Array.from(combined);
  }

  private async persistMatrix(schoolId: string, matrix: Record<string, string[]>): Promise<void> {
    // Always persist in resilient memory cache
    this.memoryMatrixCache.set(schoolId, matrix);

    try {
      await this.prisma.schoolSetting.upsert({
        where: {
          schoolId_key: {
            schoolId,
            key: SETTING_KEY,
          },
        },
        create: {
          schoolId,
          key: SETTING_KEY,
          value: JSON.stringify(matrix),
          description: 'Custom role functionality assignments and permissions matrix',
        },
        update: {
          value: JSON.stringify(matrix),
        },
      });
    } catch (err: any) {
      this.logger.warn(
        `Database connection offline; role matrix stored in resilient memory cache for school ${schoolId}: ${err.message}`,
      );
    }
  }
}

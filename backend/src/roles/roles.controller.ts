import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Roles & Permissions')
@ApiBearerAuth('JWT')
@ApiHeader({ name: 'x-school-id', required: true, description: 'School Tenant UUID' })
@ApiHeader({ name: 'x-school-code', required: false, description: 'School Code (e.g. TLS001)' })
@Controller('roles')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  @ApiOperation({ summary: 'List all available system functionalities and permissions catalog' })
  getPermissionsCatalog() {
    return {
      permissions: this.rolesService.getPermissionsCatalog(),
      roles: this.rolesService.getAvailableRoles(),
    };
  }

  @Get('matrix')
  @ApiOperation({ summary: 'Get current role functionality assignment matrix for this school' })
  getRoleMatrix(@CurrentTenant() tenant: TenantContext) {
    return this.rolesService.getRoleMatrix(tenant.schoolId);
  }

  @Get('my-permissions')
  @ApiOperation({ summary: 'Get real-time effective permissions for current logged in user' })
  async getMyPermissions(@Req() req: any, @CurrentTenant() tenant: TenantContext) {
    const user = req.user;
    const permissions = await this.rolesService.getEffectiveUserPermissions(
      tenant.schoolId,
      user.membershipProfile || user.profile || 'USER',
      user.permissions,
    );
    return {
      userId: user.id,
      role: user.membershipProfile || user.profile,
      schoolId: tenant.schoolId,
      permissions,
    };
  }

  @Put(':role/permissions')
  @ApiOperation({ summary: 'Assign functionalities and permissions to a specific school role' })
  updateRolePermissions(
    @CurrentTenant() tenant: TenantContext,
    @Param('role') role: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.rolesService.updateRolePermissions(
      tenant.schoolId,
      role.toUpperCase(),
      permissions || [],
    );
  }

  @Put('matrix')
  @ApiOperation({ summary: 'Bulk update entire role permissions matrix' })
  updateRoleMatrix(
    @CurrentTenant() tenant: TenantContext,
    @Body('matrix') matrix: Record<string, string[]>,
  ) {
    return this.rolesService.updateRoleMatrix(tenant.schoolId, matrix || {});
  }

  @Post('reset/:role')
  @ApiOperation({ summary: 'Reset a specific role to standard recommended default functionalities' })
  resetRoleDefaults(
    @CurrentTenant() tenant: TenantContext,
    @Param('role') role: string,
  ) {
    return this.rolesService.resetRoleDefaults(tenant.schoolId, role.toUpperCase());
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset all roles in this school to standard recommended defaults' })
  resetAllDefaults(@CurrentTenant() tenant: TenantContext) {
    return this.rolesService.resetRoleDefaults(tenant.schoolId);
  }
}

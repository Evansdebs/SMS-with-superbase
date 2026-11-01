import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import {
  CreateRoleDto,
  UpdateRoleDto,
  DuplicateRoleDto,
  AssignUserRolesDto,
} from './dto/roles.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  private getSchoolId(req: any): string {
    return (
      req.user?.schoolId ||
      req.user?.memberships?.[0]?.schoolId ||
      req.user?.school?.id ||
      'demo-school-001'
    );
  }

  private getActorEmail(req: any): string {
    return req.user?.email || 'admin@school.com';
  }

  @Get()
  @RequirePermissions('roles.role.view')
  getRoles(@Request() req: any) {
    const schoolId = this.getSchoolId(req);
    return this.rolesService.getRoles(schoolId);
  }

  @Get('permissions/catalog')
  @RequirePermissions('roles.role.view')
  getPermissionsCatalog() {
    return this.rolesService.getPermissionsCatalog();
  }

  @Get('users')
  @RequirePermissions('roles.role.view')
  getUserAssignments(@Request() req: any) {
    const schoolId = this.getSchoolId(req);
    return this.rolesService.getUserAssignments(schoolId);
  }

  @Get('audit-logs')
  @RequirePermissions('roles.role.view')
  getAuditLogs(@Request() req: any) {
    const schoolId = this.getSchoolId(req);
    return this.rolesService.getAuditLogs(schoolId);
  }

  @Get(':id')
  @RequirePermissions('roles.role.view')
  getRoleById(@Request() req: any, @Param('id') id: string) {
    const schoolId = this.getSchoolId(req);
    return this.rolesService.getRoleById(schoolId, id);
  }

  @Post()
  @RequirePermissions('roles.role.create')
  createRole(@Request() req: any, @Body() dto: CreateRoleDto) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.createRole(schoolId, dto, actorEmail);
  }

  @Put(':id')
  @RequirePermissions('roles.role.edit')
  updateRole(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.updateRole(schoolId, id, dto, actorEmail);
  }

  @Post(':id/duplicate')
  @RequirePermissions('roles.role.create')
  duplicateRole(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DuplicateRoleDto,
  ) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.duplicateRole(schoolId, id, dto, actorEmail);
  }

  @Put(':id/toggle-status')
  @RequirePermissions('roles.role.toggle_status')
  toggleRoleStatus(@Request() req: any, @Param('id') id: string) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.toggleRoleStatus(schoolId, id, actorEmail);
  }

  @Delete(':id')
  @RequirePermissions('roles.role.delete')
  deleteRole(@Request() req: any, @Param('id') id: string) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.deleteRole(schoolId, id, actorEmail);
  }

  @Post('users/assign')
  @RequirePermissions('roles.user.assign')
  assignUserRoles(@Request() req: any, @Body() dto: AssignUserRolesDto) {
    const schoolId = this.getSchoolId(req);
    const actorEmail = this.getActorEmail(req);
    return this.rolesService.assignUserRoles(schoolId, dto, actorEmail);
  }
}


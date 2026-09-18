import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('academics')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class AcademicsController {
  constructor(private academicsService: AcademicsService) {}

  @Get('departments')
  @RequirePermissions('academics.view')
  getDepartments(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getDepartments(tenant.schoolId);
  }

  @Post('departments')
  @RequirePermissions('academics.manage')
  createDepartment(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; description?: string; headOfDepartment?: string },
  ) {
    return this.academicsService.createDepartment(tenant.schoolId, data);
  }

  @Get('classes')
  @RequirePermissions('academics.view')
  getClasses(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getClasses(tenant.schoolId);
  }

  @Post('classes')
  @RequirePermissions('academics.manage')
  createClass(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; stream?: string; level?: string; departmentId?: string },
  ) {
    return this.academicsService.createClass(tenant.schoolId, data);
  }

  @Get('subjects')
  @RequirePermissions('academics.view')
  getSubjects(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getSubjects(tenant.schoolId);
  }

  @Post('subjects')
  @RequirePermissions('academics.manage')
  createSubject(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; code?: string; description?: string },
  ) {
    return this.academicsService.createSubject(tenant.schoolId, data);
  }

  @Get('academic-years')
  @RequirePermissions('academics.view')
  getAcademicYears(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getAcademicYears(tenant.schoolId);
  }

  @Post('academic-years')
  @RequirePermissions('academics.manage')
  createAcademicYear(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; startDate: string; endDate: string; isActive?: boolean },
  ) {
    return this.academicsService.createAcademicYear(tenant.schoolId, data);
  }

  // ===================== ROOMS =====================
  @Get('rooms')
  @RequirePermissions('academics.view')
  getRooms(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getRooms(tenant.schoolId);
  }

  @Post('rooms')
  @RequirePermissions('academics.manage')
  createRoom(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; capacity?: number; roomType?: string; building?: string },
  ) {
    return this.academicsService.createRoom(tenant.schoolId, data);
  }

  @Delete('rooms/:id')
  @RequirePermissions('academics.manage')
  deleteRoom(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.academicsService.deleteRoom(tenant.schoolId, id);
  }

  // ===================== HOUSES =====================
  @Get('houses')
  @RequirePermissions('academics.view')
  getHouses(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getHouses(tenant.schoolId);
  }

  @Post('houses')
  @RequirePermissions('academics.manage')
  createHouse(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; color?: string; masterName?: string; motto?: string },
  ) {
    return this.academicsService.createHouse(tenant.schoolId, data);
  }

  @Delete('houses/:id')
  @RequirePermissions('academics.manage')
  deleteHouse(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.academicsService.deleteHouse(tenant.schoolId, id);
  }

  // ===================== GRADING SYSTEMS =====================
  @Get('grading-systems')
  @RequirePermissions('academics.view')
  getGradingSystems(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getGradingSystems(tenant.schoolId);
  }

  @Post('grading-systems')
  @RequirePermissions('academics.manage')
  createGradingSystem(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: {
      name: string;
      code: string;
      description?: string;
      isDefault?: boolean;
      scales: Array<{
        grade: string;
        minScore: number;
        maxScore: number;
        gradePoint?: number;
        descriptor: string;
        remarks: string;
      }>;
    },
  ) {
    return this.academicsService.createGradingSystem(tenant.schoolId, data);
  }
}

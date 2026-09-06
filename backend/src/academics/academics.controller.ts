import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('academics')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class AcademicsController {
  constructor(private academicsService: AcademicsService) {}

  @Get('departments')
  getDepartments(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getDepartments(tenant.schoolId);
  }

  @Post('departments')
  createDepartment(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; description?: string; headOfDepartment?: string },
  ) {
    return this.academicsService.createDepartment(tenant.schoolId, data);
  }

  @Get('classes')
  getClasses(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getClasses(tenant.schoolId);
  }

  @Post('classes')
  createClass(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; stream?: string; level?: string; departmentId?: string },
  ) {
    return this.academicsService.createClass(tenant.schoolId, data);
  }

  @Get('subjects')
  getSubjects(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getSubjects(tenant.schoolId);
  }

  @Post('subjects')
  createSubject(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; code?: string; description?: string },
  ) {
    return this.academicsService.createSubject(tenant.schoolId, data);
  }

  @Get('academic-years')
  getAcademicYears(@CurrentTenant() tenant: TenantContext) {
    return this.academicsService.getAcademicYears(tenant.schoolId);
  }

  @Post('academic-years')
  createAcademicYear(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { name: string; startDate: string; endDate: string; isActive?: boolean },
  ) {
    return this.academicsService.createAcademicYear(tenant.schoolId, data);
  }
}

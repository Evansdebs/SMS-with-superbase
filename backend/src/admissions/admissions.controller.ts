import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionDto, UpdateAdmissionStatusDto } from './dto/create-admission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Admissions')
@ApiBearerAuth('JWT')
@Controller('admissions')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class AdmissionsController {
  constructor(private service: AdmissionsService) {}

  @Get('stats')
  @RequirePermissions('admissions.view')
  @ApiOperation({ summary: 'Get admission statistics' })
  getStats(@CurrentTenant() tenant: TenantContext) {
    return this.service.getStats(tenant.schoolId);
  }

  @Get()
  @RequirePermissions('admissions.view')
  @ApiOperation({ summary: 'List admission applications' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentTenant() tenant: TenantContext,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll(tenant.schoolId, {
      status, search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @RequirePermissions('admissions.view')
  @ApiOperation({ summary: 'Get a single admission application' })
  findOne(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.service.findOne(tenant.schoolId, id);
  }

  @Post()
  @RequirePermissions('admissions.create')
  @ApiOperation({ summary: 'Create a new admission application' })
  create(@CurrentTenant() tenant: TenantContext, @Body() dto: CreateAdmissionDto) {
    return this.service.create(tenant.schoolId, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('admissions.manage')
  @ApiOperation({ summary: 'Update admission application status' })
  updateStatus(
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateAdmissionStatusDto,
  ) {
    return this.service.updateStatus(tenant.schoolId, id, dto, user.email);
  }

  @Post(':id/convert-to-student')
  @RequirePermissions('admissions.manage')
  @ApiOperation({ summary: 'Convert accepted applicant to enrolled student' })
  convertToStudent(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.service.convertToStudent(tenant.schoolId, id);
  }
}

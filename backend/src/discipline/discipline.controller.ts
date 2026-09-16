import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('discipline')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Get()
  @RequirePermissions('discipline.view')
  getRecords(
    @CurrentTenant() tenant: TenantContext,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ) {
    return this.disciplineService.getRecords(tenant.schoolId, studentId, status);
  }

  @Post()
  @RequirePermissions('discipline.manage')
  createRecord(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      studentId: string;
      title: string;
      infractionType: string;
      description: string;
      sanction: string;
      reportedBy?: string;
      actionTaken?: string;
      parentNotified?: boolean;
    },
  ) {
    return this.disciplineService.createRecord(tenant.schoolId, dto);
  }

  @Put(':id/status')
  @RequirePermissions('discipline.manage')
  updateStatus(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: { status: string; actionTaken?: string },
  ) {
    return this.disciplineService.updateStatus(tenant.schoolId, id, dto.status, dto.actionTaken);
  }
}

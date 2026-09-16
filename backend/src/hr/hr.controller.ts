import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('HR')
@ApiBearerAuth('JWT')
@Controller('hr')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('leaves')
  @RequirePermissions('hr.view')
  @ApiOperation({ summary: 'List staff leave applications' })
  getLeaves(
    @CurrentTenant() tenant: TenantContext,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
  ) {
    return this.hrService.getLeaves(tenant.schoolId, staffId, status);
  }

  @Post('leaves')
  @RequirePermissions('hr.apply')
  @ApiOperation({ summary: 'Apply for staff leave' })
  createLeave(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      staffId: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason: string;
    },
  ) {
    return this.hrService.createLeave(tenant.schoolId, dto);
  }

  @Put('leaves/:id/status')
  @RequirePermissions('hr.manage')
  @ApiOperation({ summary: 'Approve or reject staff leave application' })
  updateLeaveStatus(
    @CurrentTenant() tenant: TenantContext,
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { status: string },
  ) {
    const approvedBy = req.user?.id || req.user?.userId;
    return this.hrService.updateLeaveStatus(tenant.schoolId, id, dto.status, approvedBy);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('operations')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class OperationsController {
  constructor(private operationsService: OperationsService) {}

  // ===================== EXEAT REQUESTS =====================
  @Get('exeats')
  @RequirePermissions('attendance.view')
  getExeatRequests(
    @CurrentTenant() tenant: TenantContext,
    @Query('status') status?: string,
  ) {
    return this.operationsService.getExeatRequests(tenant.schoolId, status);
  }

  @Post('exeats')
  @RequirePermissions('attendance.mark')
  createExeatRequest(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      studentId: string;
      reason: string;
      destination: string;
      departureTime: string;
      expectedReturn: string;
      parentContacted?: boolean;
      remarks?: string;
    },
  ) {
    return this.operationsService.createExeatRequest(tenant.schoolId, dto);
  }

  @Patch('exeats/:id/status')
  @RequirePermissions('attendance.mark')
  updateExeatStatus(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: {
      status: 'APPROVED' | 'REJECTED' | 'RETURNED' | 'OVERDUE';
      remarks?: string;
    },
    @Req() req: any,
  ) {
    return this.operationsService.updateExeatStatus(tenant.schoolId, id, {
      ...dto,
      approvedBy: req.user?.id,
    });
  }

  // ===================== DORMITORIES =====================
  @Get('dormitories')
  @RequirePermissions('school.view')
  getDormitories(@CurrentTenant() tenant: TenantContext) {
    return this.operationsService.getDormitories(tenant.schoolId);
  }

  @Post('dormitories')
  @RequirePermissions('school.manage')
  createDormitory(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { name: string; gender: string; houseMaster?: string; capacity?: number },
  ) {
    return this.operationsService.createDormitory(tenant.schoolId, dto);
  }

  @Post('dormitories/:id/beds')
  @RequirePermissions('school.manage')
  addBeds(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: { count: number; prefix?: string },
  ) {
    return this.operationsService.addBedsToDormitory(tenant.schoolId, id, dto.count, dto.prefix);
  }

  @Post('dormitories/allocate')
  @RequirePermissions('school.manage')
  allocateBed(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { bedId: string; studentId: string },
  ) {
    return this.operationsService.allocateBed(tenant.schoolId, dto);
  }

  @Post('dormitories/vacate/:allocationId')
  @RequirePermissions('school.manage')
  vacateBed(
    @CurrentTenant() tenant: TenantContext,
    @Param('allocationId') allocationId: string,
  ) {
    return this.operationsService.vacateBed(tenant.schoolId, allocationId);
  }

  // ===================== FRONT OFFICE & VISITORS =====================
  @Get('visitors')
  @RequirePermissions('school.view')
  getVisitorLogs(
    @CurrentTenant() tenant: TenantContext,
    @Query('date') date?: string,
  ) {
    return this.operationsService.getVisitorLogs(tenant.schoolId, date);
  }

  @Post('visitors')
  @RequirePermissions('school.manage')
  recordVisitor(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      visitorName: string;
      phoneNumber: string;
      hostPerson: string;
      purpose: string;
      badgeNumber?: string;
      remarks?: string;
    },
    @Req() req: any,
  ) {
    return this.operationsService.recordVisitor(tenant.schoolId, {
      ...dto,
      recordedBy: req.user?.id,
    });
  }

  @Patch('visitors/:id/checkout')
  @RequirePermissions('school.manage')
  checkoutVisitor(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.operationsService.checkoutVisitor(tenant.schoolId, id);
  }
}

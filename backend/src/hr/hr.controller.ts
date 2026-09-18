import {
  Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('HR & Payroll')
@ApiBearerAuth('JWT')
@Controller('hr')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  // ─────────────── LEAVES ───────────────
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
    @Body() dto: { staffId: string; leaveType: string; startDate: string; endDate: string; daysCount: number; reason: string },
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

  // ─────────────── SALARY STRUCTURES ───────────────
  @Get('salary-structures')
  @RequirePermissions('hr.payroll.view')
  @ApiOperation({ summary: 'List all staff salary structures' })
  getSalaryStructures(@CurrentTenant() tenant: TenantContext) {
    return this.hrService.getSalaryStructures(tenant.schoolId);
  }

  @Post('salary-structures')
  @RequirePermissions('hr.payroll.manage')
  @ApiOperation({ summary: 'Create or update a staff salary structure' })
  upsertSalaryStructure(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      staffId: string; basicSalary: number; housingAllowance?: number;
      transportAllowance?: number; otherAllowances?: number;
      ssnitNumber?: string; tinNumber?: string; bankName?: string; accountNumber?: string;
    },
  ) {
    return this.hrService.upsertSalaryStructure(tenant.schoolId, dto);
  }

  // ─────────────── PAYROLL PERIODS ───────────────
  @Get('payroll/periods')
  @RequirePermissions('hr.payroll.view')
  @ApiOperation({ summary: 'List payroll periods' })
  getPayrollPeriods(@CurrentTenant() tenant: TenantContext) {
    return this.hrService.getPayrollPeriods(tenant.schoolId);
  }

  @Post('payroll/periods')
  @RequirePermissions('hr.payroll.manage')
  @ApiOperation({ summary: 'Create a new payroll period' })
  createPayrollPeriod(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { month: number; year: number },
  ) {
    return this.hrService.createPayrollPeriod(tenant.schoolId, dto);
  }

  // ─────────────── PAYROLL RUN ───────────────
  @Post('payroll/periods/:periodId/run')
  @RequirePermissions('hr.payroll.manage')
  @ApiOperation({ summary: 'Compute payroll for a period using Ghana PAYE/SSNIT engine' })
  runPayroll(
    @CurrentTenant() tenant: TenantContext,
    @Request() req: any,
    @Param('periodId') periodId: string,
  ) {
    const processedBy = req.user?.email || req.user?.id;
    return this.hrService.runPayroll(tenant.schoolId, periodId, processedBy);
  }

  @Patch('payroll/periods/:periodId/status')
  @RequirePermissions('hr.payroll.manage')
  @ApiOperation({ summary: 'Update payroll period status (REVIEW → APPROVED → FINALIZED → LOCKED)' })
  updatePayrollStatus(
    @CurrentTenant() tenant: TenantContext,
    @Request() req: any,
    @Param('periodId') periodId: string,
    @Body() dto: { status: string },
  ) {
    const approvedBy = req.user?.email || req.user?.id;
    return this.hrService.updatePayrollStatus(tenant.schoolId, periodId, dto.status, approvedBy);
  }

  // ─────────────── PAYSLIPS ───────────────
  @Post('payroll/periods/:periodId/payslips')
  @RequirePermissions('hr.payroll.manage')
  @ApiOperation({ summary: 'Generate payslips for an approved payroll period' })
  generatePayslips(
    @CurrentTenant() tenant: TenantContext,
    @Param('periodId') periodId: string,
  ) {
    return this.hrService.generatePayslips(tenant.schoolId, periodId);
  }

  @Get('payslips')
  @RequirePermissions('hr.payroll.view')
  @ApiOperation({ summary: 'List payslips' })
  @ApiQuery({ name: 'staffId', required: false })
  @ApiQuery({ name: 'periodId', required: false })
  getPayslips(
    @CurrentTenant() tenant: TenantContext,
    @Query('staffId') staffId?: string,
    @Query('periodId') periodId?: string,
  ) {
    return this.hrService.getPayslips(tenant.schoolId, staffId, periodId);
  }
}

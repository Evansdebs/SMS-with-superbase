import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Fees')
@ApiBearerAuth('JWT')
@Controller('fees')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  /** GET /fees — List all student fee records for the tenant school */
  @Get()
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'List all student fee records' })
  getFeeRecords(
    @CurrentTenant() tenant: TenantContext,
    @Query('term') term?: string,
    @Query('status') status?: string,
  ) {
    return this.feesService.getFeeRecords(tenant.schoolId, term, status);
  }

  /** GET /fees/summary — Aggregate fee collection statistics */
  @Get('summary')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'Get fee collection summary statistics' })
  getFeeSummary(@CurrentTenant() tenant: TenantContext, @Query('term') term?: string) {
    return this.feesService.getFeeSummary(tenant.schoolId, term);
  }

  /** GET /fees/financial-statement — Comprehensive P&L Statement */
  @Get('financial-statement')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'Get full financial statement (P&L)' })
  getFinancialStatement(
    @CurrentTenant() tenant: TenantContext,
    @Query('academicYear') academicYear?: string,
    @Query('term') term?: string,
  ) {
    return this.feesService.getFinancialStatement(tenant.schoolId, academicYear, term);
  }

  /** GET /fees/structures — List fee structures */
  @Get('structures')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'List fee structures' })
  getFeeStructures(@CurrentTenant() tenant: TenantContext) {
    return this.feesService.getFeeStructures(tenant.schoolId);
  }

  /** GET /fees/expenses — List expenses */
  @Get('expenses')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'List school expenses' })
  getExpenses(
    @CurrentTenant() tenant: TenantContext,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.feesService.getExpenses(tenant.schoolId, category, startDate, endDate);
  }

  /** POST /fees/payment — Record a cash/mobile money/bank payment */
  @Post('payment')
  @RequirePermissions('fees.collect')
  @ApiOperation({ summary: 'Record a fee payment and issue receipt' })
  recordPayment(
    @CurrentTenant() tenant: TenantContext,
    @Request() req: any,
    @Body()
    dto: {
      studentFeeId: string;
      amountPaid: number;
      paymentMethod: string;
      notes?: string;
    },
  ) {
    return this.feesService.recordPayment(tenant.schoolId, dto.studentFeeId, dto, req.user?.id);
  }

  /** POST /fees/structures — Create fee structure */
  @Post('structures')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Create a new fee structure' })
  createFeeStructure(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      name: string;
      description?: string;
      amount: number;
      classId?: string;
      academicYear?: string;
      term?: string;
    },
  ) {
    return this.feesService.createFeeStructure(tenant.schoolId, dto);
  }

  /** POST /fees/scholarship — Apply scholarship or discount */
  @Post('scholarship')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Apply scholarship or discount to a student fee' })
  applyScholarship(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      studentFeeId: string;
      scholarshipName: string;
      discountAmount: number;
    },
  ) {
    return this.feesService.applyScholarship(tenant.schoolId, dto.studentFeeId, dto);
  }

  /** POST /fees/expenses — Create an expense */
  @Post('expenses')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Record a school expense' })
  createExpense(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      category: string;
      description: string;
      amount: number;
      expenseDate?: string;
      approvedBy?: string;
      receipt?: string;
    },
  ) {
    return this.feesService.createExpense(tenant.schoolId, dto);
  }

  /** DELETE /fees/expenses/:id — Delete an expense */
  @Delete('expenses/:id')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Delete an expense record' })
  deleteExpense(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.feesService.deleteExpense(tenant.schoolId, id);
  }

  // ─────────────── FEE CATEGORIES ───────────────
  @Get('categories')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'List fee categories' })
  getFeeCategories(@CurrentTenant() tenant: TenantContext) {
    return this.feesService.getFeeCategories(tenant.schoolId);
  }

  @Post('categories')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Create a fee category' })
  createFeeCategory(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { name: string; description?: string; frequency?: string },
  ) {
    return this.feesService.createFeeCategory(tenant.schoolId, dto);
  }

  // ─────────────── STUDENT BILLS ───────────────
  @Get('bills')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'List student bills' })
  getBills(
    @CurrentTenant() tenant: TenantContext,
    @Query('classId') classId?: string,
    @Query('term') term?: string,
    @Query('academicYear') academicYear?: string,
    @Query('status') status?: string,
  ) {
    return this.feesService.getBills(tenant.schoolId, { classId, term, academicYear, status });
  }

  @Post('bills/generate')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Bulk generate student bills for a fee category & term' })
  generateBills(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { feeCategoryId: string; amount: number; dueDate: string; academicYear: string; term: string; classId?: string },
  ) {
    return this.feesService.generateBills(tenant.schoolId, dto);
  }

  // ─────────────── DEBTORS ───────────────
  @Get('debtors')
  @RequirePermissions('fees.view')
  @ApiOperation({ summary: 'Get list of students with outstanding fee balances' })
  getDebtors(
    @CurrentTenant() tenant: TenantContext,
    @Query('term') term?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.feesService.getDebtors(tenant.schoolId, term, academicYear);
  }

  // ─────────────── PAYMENT REVERSAL ───────────────
  @Post('payment/:id/reverse')
  @RequirePermissions('fees.manage')
  @ApiOperation({ summary: 'Reverse a payment (audit-safe)' })
  reversePayment(
    @CurrentTenant() tenant: TenantContext,
    @Request() req: any,
    @Param('id') paymentId: string,
    @Body() dto: { reason: string },
  ) {
    const reversedBy = req.user?.email || req.user?.id;
    return this.feesService.reversePayment(tenant.schoolId, paymentId, dto.reason, reversedBy);
  }
}


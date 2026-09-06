import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('fees')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  /** GET /fees — List all student fee records for the tenant school */
  @Get()
  getFeeRecords(
    @Request() req: any,
    @Query('term') term?: string,
    @Query('status') status?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId;
    return this.feesService.getFeeRecords(schoolId, term, status);
  }

  /** GET /fees/summary — Aggregate fee collection statistics */
  @Get('summary')
  getFeeSummary(@Request() req: any, @Query('term') term?: string) {
    const schoolId = req.tenantContext?.schoolId;
    return this.feesService.getFeeSummary(schoolId, term);
  }

  /** POST /fees/payment — Record a cash/mobile money/bank payment */
  @Post('payment')
  recordPayment(
    @Request() req: any,
    @Body()
    dto: {
      studentFeeId: string;
      amountPaid: number;
      paymentMethod: string;
      notes?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId;
    const userId = req.user?.userId;
    return this.feesService.recordPayment(schoolId, dto.studentFeeId, dto, userId);
  }

  /** GET /fees/expenses — List expenses */
  @Get('expenses')
  getExpenses(
    @Request() req: any,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.getExpenses(schoolId, category, startDate, endDate);
  }

  /** POST /fees/expenses — Create an expense */
  @Post('expenses')
  createExpense(
    @Request() req: any,
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
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.createExpense(schoolId, dto);
  }

  /** DELETE /fees/expenses/:id — Delete an expense */
  @Get('expenses/delete/:id')
  deleteExpense(@Request() req: any, @Query('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.deleteExpense(schoolId, id);
  }

  /** GET /fees/structures — List fee structures */
  @Get('structures')
  getFeeStructures(@Request() req: any) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.getFeeStructures(schoolId);
  }

  /** POST /fees/structures — Create fee structure */
  @Post('structures')
  createFeeStructure(
    @Request() req: any,
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
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.createFeeStructure(schoolId, dto);
  }

  /** POST /fees/scholarship — Apply scholarship or discount */
  @Post('scholarship')
  applyScholarship(
    @Request() req: any,
    @Body()
    dto: {
      studentFeeId: string;
      scholarshipName: string;
      discountAmount: number;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.applyScholarship(schoolId, dto.studentFeeId, dto);
  }

  /** GET /fees/financial-statement — Comprehensive P&L Statement */
  @Get('financial-statement')
  getFinancialStatement(
    @Request() req: any,
    @Query('academicYear') academicYear?: string,
    @Query('term') term?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.feesService.getFinancialStatement(schoolId, academicYear, term);
  }
}



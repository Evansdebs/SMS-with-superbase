import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('accounting')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class AccountingController {
  constructor(private accountingService: AccountingService) {}

  @Get('heads')
  @RequirePermissions('accounting.view')
  getAccountHeads(
    @CurrentTenant() tenant: TenantContext,
    @Query('type') type?: string,
  ) {
    return this.accountingService.getAccountHeads(tenant.schoolId, type);
  }

  @Post('heads')
  @RequirePermissions('accounting.manage')
  createAccountHead(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { name: string; code: string; type: string; description?: string },
  ) {
    return this.accountingService.createAccountHead(tenant.schoolId, dto);
  }

  @Get('income')
  @RequirePermissions('accounting.view')
  getIncomeTransactions(
    @CurrentTenant() tenant: TenantContext,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('accountHead') accountHead?: string,
    @Query('paymentMethod') paymentMethod?: string,
  ) {
    return this.accountingService.getIncomeTransactions(tenant.schoolId, {
      startDate,
      endDate,
      accountHead,
      paymentMethod,
    });
  }

  @Post('income')
  @RequirePermissions('accounting.manage')
  recordIncome(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      accountHead: string;
      amount: number;
      paymentMethod: string;
      payer?: string;
      reference?: string;
      description?: string;
    },
  ) {
    return this.accountingService.recordIncome(tenant.schoolId, dto);
  }

  @Get('bank-accounts')
  @RequirePermissions('accounting.view')
  getBankAccounts(@CurrentTenant() tenant: TenantContext) {
    return this.accountingService.getBankAccounts(tenant.schoolId);
  }

  @Post('bank-accounts')
  @RequirePermissions('accounting.manage')
  createBankAccount(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      accountName: string;
      bankName: string;
      accountNumber: string;
      branch?: string;
      openingBalance?: number;
      currency?: string;
    },
  ) {
    return this.accountingService.createBankAccount(tenant.schoolId, dto);
  }

  @Get('summary')
  @RequirePermissions('accounting.view')
  getFinancialSummary(@CurrentTenant() tenant: TenantContext) {
    return this.accountingService.getFinancialSummary(tenant.schoolId);
  }
}

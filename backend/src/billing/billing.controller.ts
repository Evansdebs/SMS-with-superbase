import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';

@ApiTags('Billing & SaaS Subscriptions')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription tiers and feature matrices' })
  getPlans() {
    return this.billingService.getAvailablePlans();
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get current subscription and usage quotas for a school' })
  getSubscription(@Headers('x-school-id') schoolId?: string, @Query('schoolId') querySchoolId?: string) {
    const targetSchoolId = schoolId || querySchoolId;
    if (!targetSchoolId) {
      // Return default Pro plan tier view if unassigned
      return this.billingService.getAvailablePlans()[1];
    }
    return this.billingService.getSchoolSubscription(targetSchoolId);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade or switch subscription tier for a school' })
  upgradePlan(
    @Headers('x-school-id') schoolId: string,
    @Body() body: { planCode: 'BASIC' | 'PRO' | 'ENTERPRISE'; paymentMethod?: string; schoolId?: string }
  ) {
    const targetSchoolId = schoolId || body.schoolId;
    return this.billingService.upgradePlan(targetSchoolId, body.planCode, body.paymentMethod);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paystack webhook receiver for billing events' })
  handleWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature?: string
  ) {
    return this.billingService.handlePaystackWebhook(payload, signature);
  }

  @Get('superadmin/analytics')
  @ApiOperation({ summary: 'SuperAdmin SaaS metrics: MRR, ARR, tier breakdown, subscriber health' })
  getPlatformSaaSAnalytics() {
    return this.billingService.getPlatformSaaSAnalytics();
  }
}

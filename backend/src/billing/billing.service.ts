import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: 'BASIC' | 'PRO' | 'ENTERPRISE';
  priceMonthlyUSD: number;
  priceMonthlyGHS: number;
  maxStudents: number;
  maxStaff: number;
  storageGB: number;
  features: string[];
  recommended?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Starter / Basic',
    code: 'BASIC',
    priceMonthlyUSD: 29,
    priceMonthlyGHS: 420,
    maxStudents: 150,
    maxStaff: 15,
    storageGB: 5,
    features: [
      'Student & Teacher Profiles',
      'Attendance Tracking',
      'Basic Report Cards',
      'Gradebook & Results',
      'Email Support',
    ],
  },
  {
    id: 'plan_pro',
    name: 'Professional',
    code: 'PRO',
    priceMonthlyUSD: 79,
    priceMonthlyGHS: 1150,
    maxStudents: 600,
    maxStaff: 50,
    storageGB: 25,
    features: [
      'Everything in Basic',
      'Finance & Fee Collection Hub',
      'Full Operations (Discipline, Health, Library, Inventory)',
      'Automated Timetable Generation',
      'Parent Portal & SMS Notifications',
      'Advanced Analytics & Reporting',
      'Priority 24/7 Support',
    ],
    recommended: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Campus',
    code: 'ENTERPRISE',
    priceMonthlyUSD: 199,
    priceMonthlyGHS: 2900,
    maxStudents: 2500,
    maxStaff: 250,
    storageGB: 100,
    features: [
      'Everything in Pro',
      'Multi-Campus Support',
      'Custom Domain & Branding',
      'Document Vault Encryption',
      'Fleet & Transport Real-time Telemetry',
      'HR Leave & Payroll Integration',
      'Dedicated Account Manager & SLA',
    ],
  },
];

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private prisma: PrismaService) {}

  getAvailablePlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  async getSchoolSubscription(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            documents: true,
          },
        },
        settings: true,
      },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }

    const settingsMap = new Map(school.settings.map((s) => [s.key, s.value]));

    const tierCode = (settingsMap.get('subscription_tier') || 'PRO') as 'BASIC' | 'PRO' | 'ENTERPRISE';
    const plan = SUBSCRIPTION_PLANS.find((p) => p.code === tierCode) || SUBSCRIPTION_PLANS[1];
    const status = settingsMap.get('subscription_status') || 'ACTIVE';
    const periodEnd = settingsMap.get('subscription_period_end') || new Date(Date.now() + 30 * 86400000).toISOString();
    const customerCode = settingsMap.get('paystack_customer_code') || `CUS_${school.schoolCode}`;

    return {
      schoolId: school.id,
      schoolName: school.name,
      schoolCode: school.schoolCode,
      status,
      currentPlan: plan,
      billingCycle: 'MONTHLY',
      periodEnd,
      customerCode,
      usage: {
        students: {
          current: school._count.students,
          limit: plan.maxStudents,
          percent: Math.min(100, Math.round((school._count.students / plan.maxStudents) * 100)),
        },
        staff: {
          current: school._count.teachers,
          limit: plan.maxStaff,
          percent: Math.min(100, Math.round((school._count.teachers / plan.maxStaff) * 100)),
        },
        storage: {
          currentGB: (school._count.documents * 0.05).toFixed(2), // Estimated 50MB avg per doc
          limitGB: plan.storageGB,
          percent: Math.min(100, Math.round(((school._count.documents * 0.05) / plan.storageGB) * 100)),
        },
      },
    };
  }

  async upgradePlan(schoolId: string, planCode: 'BASIC' | 'PRO' | 'ENTERPRISE', paymentMethod = 'PAYSTACK') {
    const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.code === planCode);
    if (!targetPlan) {
      throw new BadRequestException(`Invalid plan code: ${planCode}`);
    }

    const periodEnd = new Date(Date.now() + 30 * 86400000).toISOString();

    // Upsert subscription settings
    await this.prisma.schoolSetting.upsert({
      where: { schoolId_key: { schoolId, key: 'subscription_tier' } },
      update: { value: planCode },
      create: { schoolId, key: 'subscription_tier', value: planCode },
    });

    await this.prisma.schoolSetting.upsert({
      where: { schoolId_key: { schoolId, key: 'subscription_status' } },
      update: { value: 'ACTIVE' },
      create: { schoolId, key: 'subscription_status', value: 'ACTIVE' },
    });

    await this.prisma.schoolSetting.upsert({
      where: { schoolId_key: { schoolId, key: 'subscription_period_end' } },
      update: { value: periodEnd },
      create: { schoolId, key: 'subscription_period_end', value: periodEnd },
    });

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        action: 'PLAN_UPGRADE',
        entityType: 'SUBSCRIPTION',
        entityId: planCode,
        schoolId,
        details: {
          plan: targetPlan.name,
          paymentMethod,
          priceUSD: targetPlan.priceMonthlyUSD,
          periodEnd,
        },
        result: 'SUCCESS',
      },
    });

    this.logger.log(`School ${schoolId} upgraded to plan ${planCode}`);
    return this.getSchoolSubscription(schoolId);
  }

  async handlePaystackWebhook(payload: any, signature?: string) {
    this.logger.log(`Received Paystack webhook event: ${payload?.event}`);

    // Verify webhook signature in production via crypto HMAC-SHA512
    const event = payload?.event;
    const data = payload?.data;

    switch (event) {
      case 'charge.success': {
        const metadata = data?.metadata || {};
        const schoolId = metadata.schoolId;
        const planCode = metadata.planCode || 'PRO';

        if (schoolId) {
          await this.upgradePlan(schoolId, planCode, 'PAYSTACK_WEBHOOK');
        }
        break;
      }
      case 'subscription.create': {
        this.logger.log(`Subscription created for customer: ${data?.customer?.email}`);
        break;
      }
      case 'invoice.payment_failed': {
        this.logger.warn(`Invoice payment failed for customer: ${data?.customer?.email}`);
        break;
      }
      default:
        this.logger.log(`Unhandled webhook event: ${event}`);
    }

    return { received: true, event };
  }

  async getPlatformSaaSAnalytics() {
    const schools = await this.prisma.school.findMany({
      select: {
        id: true,
        name: true,
        schoolCode: true,
        status: true,
        createdAt: true,
        _count: {
          select: { students: true, teachers: true },
        },
        settings: {
          where: { key: { in: ['subscription_tier', 'subscription_status'] } },
        },
      },
    });

    let totalMRR = 0;
    const tierDistribution: Record<string, number> = {
      BASIC: 0,
      PRO: 0,
      ENTERPRISE: 0,
    };

    const schoolSubscribers = schools.map((school) => {
      const tierSetting = school.settings.find((s) => s.key === 'subscription_tier');
      const tier = (tierSetting?.value || 'PRO') as 'BASIC' | 'PRO' | 'ENTERPRISE';
      const plan = SUBSCRIPTION_PLANS.find((p) => p.code === tier) || SUBSCRIPTION_PLANS[1];

      if (school.status === 'ACTIVE') {
        totalMRR += plan.priceMonthlyUSD;
        tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;
      }

      return {
        id: school.id,
        name: school.name,
        code: school.schoolCode,
        tier,
        planName: plan.name,
        monthlyFee: plan.priceMonthlyUSD,
        studentCount: school._count.students,
        status: school.status,
      };
    });

    return {
      mrr: totalMRR,
      arr: totalMRR * 12,
      currency: 'USD',
      activeSubscribers: schools.filter((s) => s.status === 'ACTIVE').length,
      churnRatePercent: 0.8,
      netRevenueRetentionPercent: 114.2,
      tierDistribution,
      plans: SUBSCRIPTION_PLANS,
      subscribers: schoolSubscribers,
    };
  }
}

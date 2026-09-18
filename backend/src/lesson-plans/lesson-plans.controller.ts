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
import { LessonPlansService } from './lesson-plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('lesson-plans')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class LessonPlansController {
  constructor(private lessonPlansService: LessonPlansService) {}

  @Get()
  @RequirePermissions('academics.view')
  getLessonPlans(
    @CurrentTenant() tenant: TenantContext,
    @Query('teacherId') teacherId?: string,
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: string,
  ) {
    return this.lessonPlansService.getLessonPlans(tenant.schoolId, {
      teacherId,
      classId,
      subjectId,
      status,
    });
  }

  @Post()
  @RequirePermissions('academics.manage')
  createLessonPlan(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      classId: string;
      subjectId: string;
      weekNumber: number;
      lessonDate: string;
      topic: string;
      objectives: string;
      contentSummary: string;
      activities: string;
      resources?: string;
      assessment?: string;
      evaluation?: string;
      status?: string;
    },
    @Req() req: any,
  ) {
    return this.lessonPlansService.createLessonPlan(
      tenant.schoolId,
      req.user?.id,
      dto,
    );
  }

  @Patch(':id/review')
  @RequirePermissions('academics.manage')
  reviewLessonPlan(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: {
      status: 'APPROVED' | 'REVISE' | 'SUBMITTED';
      reviewComments?: string;
    },
    @Req() req: any,
  ) {
    return this.lessonPlansService.reviewLessonPlan(
      tenant.schoolId,
      id,
      req.user?.id,
      dto,
    );
  }
}

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
import { ResultsService } from './results.service';
import { RecordBatchScoresDto } from './dto/record-scores.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('results')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Post('batch')
  @RequirePermissions('results.record')
  recordBatchScores(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: RecordBatchScoresDto,
  ) {
    return this.resultsService.recordBatchScores(tenant.schoolId, dto);
  }

  @Get('class/:classId')
  @RequirePermissions('results.view')
  getClassResults(
    @CurrentTenant() tenant: TenantContext,
    @Param('classId') classId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.resultsService.getClassResults(tenant.schoolId, classId, subjectId);
  }

  @Get('report-card/:studentId')
  @RequirePermissions('results.view')
  getStudentReportCard(
    @CurrentTenant() tenant: TenantContext,
    @Param('studentId') studentId: string,
  ) {
    return this.resultsService.getStudentReportCard(tenant.schoolId, studentId);
  }

  @Post('publish/:classId')
  @RequirePermissions('results.publish')
  publishClassResults(
    @CurrentTenant() tenant: TenantContext,
    @Param('classId') classId: string,
    @Req() req: any,
  ) {
    return this.resultsService.publishClassResults(tenant.schoolId, classId, req.user?.id);
  }

  // ===================== ASSESSMENTS =====================
  @Get('assessments')
  @RequirePermissions('results.view')
  getAssessments(
    @CurrentTenant() tenant: TenantContext,
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.resultsService.getAssessments(tenant.schoolId, classId, subjectId);
  }

  @Post('assessments')
  @RequirePermissions('results.record')
  createAssessment(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: {
      classId: string;
      subjectId: string;
      academicYear: string;
      term: string;
      name: string;
      type: string;
      weightPercentage?: number;
      maxMarks?: number;
      date?: string;
    },
  ) {
    return this.resultsService.createAssessment(tenant.schoolId, data);
  }

  // ===================== REPORT CARDS =====================
  @Post('report-cards/generate')
  @RequirePermissions('results.publish')
  generateClassReportCards(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { classId: string; academicYear: string; term: string },
  ) {
    return this.resultsService.generateClassReportCards(tenant.schoolId, dto);
  }

  @Get('report-cards')
  @RequirePermissions('results.view')
  getReportCards(
    @CurrentTenant() tenant: TenantContext,
    @Query('classId') classId?: string,
    @Query('academicYear') academicYear?: string,
    @Query('term') term?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.resultsService.getReportCards(tenant.schoolId, { classId, academicYear, term, studentId });
  }

  @Patch('report-cards/:id')
  @RequirePermissions('results.record')
  updateReportCard(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() data: {
      conduct?: string;
      attitude?: string;
      interest?: string;
      classTeacherRemarks?: string;
      headteacherRemarks?: string;
      promotedTo?: string;
      status?: string;
    },
  ) {
    return this.resultsService.updateReportCard(tenant.schoolId, id, data);
  }
}

import {
  Controller,
  Get,
  Post,
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
}

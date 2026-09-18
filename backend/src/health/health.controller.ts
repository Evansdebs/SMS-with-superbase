import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('health')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @RequirePermissions('health.view')
  getRecords(@Request() req: any, @Query('studentId') studentId?: string) {
    const schoolId = req.user?.schoolId;
    return this.healthService.getRecords(schoolId, studentId);
  }

  @Post()
  @RequirePermissions('health.create')
  createRecord(
    @Request() req: any,
    @Body()
    dto: {
      studentId: string;
      symptoms: string;
      diagnosis?: string;
      treatment?: string;
      medicationGiven?: string;
      temperature?: string;
      attendedBy?: string;
      parentContacted?: boolean;
      referredToHospital?: boolean;
      remarks?: string;
    },
  ) {
    const schoolId = req.user?.schoolId;
    return this.healthService.createRecord(schoolId, dto);
  }

}

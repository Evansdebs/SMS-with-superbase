import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { RecordDailyAttendanceDto } from './dto/record-attendance.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('attendance')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('daily')
  recordDailyAttendance(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: RecordDailyAttendanceDto,
  ) {
    return this.attendanceService.recordDailyAttendance(tenant.schoolId, dto);
  }

  @Get('class')
  getClassAttendance(
    @CurrentTenant() tenant: TenantContext,
    @Query('classId') classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getClassAttendance(tenant.schoolId, classId, date);
  }

  @Get('summary')
  getAttendanceSummary(
    @CurrentTenant() tenant: TenantContext,
    @Query('classId') classId?: string,
  ) {
    return this.attendanceService.getAttendanceSummary(tenant.schoolId, classId);
  }
}

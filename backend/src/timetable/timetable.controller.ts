import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('timetable')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('class/:classId')
  getClassTimetable(@Request() req: any, @Param('classId') classId: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.timetableService.getClassTimetable(schoolId, classId);
  }

  @Post('slot')
  upsertSlot(
    @Request() req: any,
    @Body()
    dto: {
      classId: string;
      subjectId: string;
      teacherId: string;
      dayOfWeek: number;
      periodNumber: number;
      roomNumber?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.timetableService.upsertSlot(schoolId, dto);
  }

  @Delete('slot')
  clearSlot(
    @Request() req: any,
    @Query('classId') classId: string,
    @Query('dayOfWeek') dayOfWeek: string,
    @Query('periodNumber') periodNumber: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.timetableService.clearSlot(
      schoolId,
      classId,
      parseInt(dayOfWeek, 10),
      parseInt(periodNumber, 10),
    );
  }

  @Get('teacher/:teacherId')
  getTeacherTimetable(@Request() req: any, @Param('teacherId') teacherId: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.timetableService.getTeacherTimetable(schoolId, teacherId);
  }
}

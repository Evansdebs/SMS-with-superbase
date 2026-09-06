import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DisciplineService } from './discipline.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('discipline')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Get()
  getRecords(
    @Request() req: any,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.disciplineService.getRecords(schoolId, studentId, status);
  }

  @Post()
  createRecord(
    @Request() req: any,
    @Body()
    dto: {
      studentId: string;
      title: string;
      infractionType: string;
      description: string;
      sanction: string;
      reportedBy?: string;
      actionTaken?: string;
      parentNotified?: boolean;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.disciplineService.createRecord(schoolId, dto);
  }

  @Put(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { status: string; actionTaken?: string },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.disciplineService.updateStatus(schoolId, id, dto.status, dto.actionTaken);
  }
}

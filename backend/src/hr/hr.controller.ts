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
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('hr')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('leaves')
  getLeaves(
    @Request() req: any,
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.hrService.getLeaves(schoolId, staffId, status);
  }

  @Post('leaves')
  createLeave(
    @Request() req: any,
    @Body()
    dto: {
      staffId: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.hrService.createLeave(schoolId, dto);
  }

  @Put('leaves/:id/status')
  updateLeaveStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { status: string },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    const approvedBy = req.user?.userId;
    return this.hrService.updateLeaveStatus(schoolId, id, dto.status, approvedBy);
  }
}

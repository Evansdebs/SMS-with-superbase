import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  getEvents(
    @Request() req: any,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.calendarService.getEvents(
      schoolId,
      month ? parseInt(month, 10) : undefined,
      year ? parseInt(year, 10) : undefined,
    );
  }

  @Post('events')
  createEvent(
    @Request() req: any,
    @Body()
    dto: {
      title: string;
      description?: string;
      startDate: string;
      endDate?: string;
      eventType: string;
      location?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.calendarService.createEvent(schoolId, dto);
  }

  @Put('events/:id')
  updateEvent(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      eventType?: string;
      location?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.calendarService.updateEvent(schoolId, id, dto);
  }

  @Delete('events/:id')
  deleteEvent(@Request() req: any, @Param('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.calendarService.deleteEvent(schoolId, id);
  }
}

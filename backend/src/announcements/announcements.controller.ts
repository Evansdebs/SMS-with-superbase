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
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  getAnnouncements(@Request() req: any, @Query('published') published?: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    const isPublished = published !== undefined ? published === 'true' : undefined;
    return this.announcementsService.getAnnouncements(schoolId, isPublished);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.announcementsService.getUnreadCount(schoolId);
  }

  @Post()
  createAnnouncement(
    @Request() req: any,
    @Body()
    dto: {
      title: string;
      content: string;
      targetType: string;
      targetIds?: string[];
      priority?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    const publishedBy = req.user?.userId;
    return this.announcementsService.createAnnouncement(schoolId, dto, publishedBy);
  }

  @Put(':id')
  updateAnnouncement(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { title?: string; content?: string; priority?: string },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.announcementsService.updateAnnouncement(schoolId, id, dto);
  }

  @Delete(':id')
  deleteAnnouncement(@Request() req: any, @Param('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.announcementsService.deleteAnnouncement(schoolId, id);
  }
}

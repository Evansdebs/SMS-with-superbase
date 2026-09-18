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
import { CommunicationService } from './communication.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('communication')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  // ===================== SMS =====================
  @Post('sms/send')
  @RequirePermissions('announcements.create')
  sendSms(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      recipientPhones: string[];
      message: string;
      senderId?: string;
    },
  ) {
    return this.communicationService.sendSms(tenant.schoolId, dto);
  }

  @Get('sms/logs')
  @RequirePermissions('announcements.view')
  getSmsLogs(
    @CurrentTenant() tenant: TenantContext,
    @Query('status') status?: string,
  ) {
    return this.communicationService.getSmsLogs(tenant.schoolId, status);
  }

  @Get('sms/templates')
  @RequirePermissions('announcements.view')
  getSmsTemplates(@CurrentTenant() tenant: TenantContext) {
    return this.communicationService.getSmsTemplates(tenant.schoolId);
  }

  @Post('sms/templates')
  @RequirePermissions('announcements.create')
  upsertSmsTemplate(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { templateKey: string; title: string; content: string },
  ) {
    return this.communicationService.upsertSmsTemplate(tenant.schoolId, dto);
  }

  // ===================== DIRECT MESSAGES =====================
  @Get('messages/inbox')
  getInbox(@CurrentTenant() tenant: TenantContext, @Req() req: any) {
    return this.communicationService.getInbox(tenant.schoolId, req.user?.id);
  }

  @Get('messages/sent')
  getSent(@CurrentTenant() tenant: TenantContext, @Req() req: any) {
    return this.communicationService.getSent(tenant.schoolId, req.user?.id);
  }

  @Post('messages')
  sendMessage(
    @CurrentTenant() tenant: TenantContext,
    @Req() req: any,
    @Body() dto: { recipientUserId: string; subject?: string; content: string },
  ) {
    return this.communicationService.sendMessage(
      tenant.schoolId,
      req.user?.id,
      dto,
    );
  }

  @Patch('messages/:id/read')
  markMessageRead(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.communicationService.markMessageRead(
      tenant.schoolId,
      id,
      req.user?.id,
    );
  }

  // ===================== ID CARD TEMPLATES =====================
  @Get('id-cards/template/:type')
  @RequirePermissions('school.view')
  getIdCardTemplate(
    @CurrentTenant() tenant: TenantContext,
    @Param('type') type: 'STUDENT' | 'STAFF',
  ) {
    return this.communicationService.getIdCardTemplate(tenant.schoolId, type);
  }

  @Post('id-cards/template')
  @RequirePermissions('school.manage')
  saveIdCardTemplate(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: {
      templateType: 'STUDENT' | 'STAFF';
      layout?: string;
      primaryColor?: string;
      showQrCode?: boolean;
      showBloodGroup?: boolean;
      showEmergencyPhone?: boolean;
    },
  ) {
    return this.communicationService.saveIdCardTemplate(tenant.schoolId, dto);
  }
}

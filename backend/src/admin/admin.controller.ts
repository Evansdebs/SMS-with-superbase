import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSchoolWizardDto } from './dto/create-school-wizard.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── Platform Overview & Analytics ──────────────────────────────────────
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getPlatformStats();
  }

  @Get('analytics')
  getAnalytics() {
    return this.adminService.getDetailedAnalytics();
  }

  // ── School / Tenant Management ─────────────────────────────────────────
  @Post('schools/wizard')
  createSchoolWizard(@Body() dto: CreateSchoolWizardDto, @Req() req: any) {
    return this.adminService.createSchoolWizard(dto, req.user?.id);
  }

  @Get('schools')
  getAllSchools(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllSchools(search, status);
  }

  @Get('schools/:id')
  getSchoolDetails(@Param('id') id: string) {
    return this.adminService.getSchoolDetails(id);
  }

  @Patch('schools/:id')
  updateSchoolDetails(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.adminService.updateSchoolDetails(id, body, req.user?.id);
  }

  @Patch('schools/:id/status')
  updateSchoolStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.adminService.updateSchoolStatus(id, status, req.user?.id);
  }

  @Get('schools/:id/config')
  getSchoolConfig(@Param('id') id: string) {
    return this.adminService.getSchoolConfig(id);
  }

  @Patch('schools/:id/config')
  updateSchoolConfig(
    @Param('id') id: string,
    @Body() config: Record<string, boolean>,
    @Req() req: any,
  ) {
    return this.adminService.updateSchoolConfig(id, config, req.user?.id);
  }

  // ── Subscriptions & Billing ────────────────────────────────────────────
  @Get('subscriptions/plans')
  getSubscriptionPlans() {
    return this.adminService.getSubscriptionPlans();
  }

  @Post('subscriptions/plans')
  updateSubscriptionPlan(@Body() plan: any) {
    return this.adminService.saveSubscriptionPlan(plan);
  }

  @Get('subscriptions/schools')
  getSchoolSubscriptions() {
    return this.adminService.getSchoolSubscriptions();
  }

  @Patch('subscriptions/schools/:schoolId')
  updateSchoolSubscription(
    @Param('schoolId') schoolId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.adminService.updateSchoolSubscription(schoolId, body, req.user?.id);
  }

  @Get('subscriptions/billing')
  getBillingOverview() {
    return this.adminService.getBillingOverview();
  }

  // ── Platform-Wide Users ────────────────────────────────────────────────
  @Get('users')
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
      role,
    );
  }

  @Post('users/super-admin')
  createSuperAdmin(@Body() body: any, @Req() req: any) {
    return this.adminService.createSuperAdmin(body, req.user?.id);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.adminService.updateUserStatus(id, status, req.user?.id);
  }

  // ── Audit Logs ─────────────────────────────────────────────────────────
  @Get('audit-logs')
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      action,
    );
  }

  // ── Support Tickets ────────────────────────────────────────────────────
  @Get('support/tickets')
  getSupportTickets(@Query('status') status?: string) {
    return this.adminService.getSupportTickets(status);
  }

  @Post('support/tickets')
  createSupportTicket(@Body() ticket: any, @Req() req: any) {
    return this.adminService.createSupportTicket(ticket, req.user?.id);
  }

  @Patch('support/tickets/:id')
  updateSupportTicket(
    @Param('id') id: string,
    @Body() updates: any,
    @Req() req: any,
  ) {
    return this.adminService.updateSupportTicket(id, updates, req.user?.id);
  }

  // ── System Announcements ───────────────────────────────────────────────
  @Get('announcements')
  getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  @Post('announcements')
  createAnnouncement(@Body() body: any, @Req() req: any) {
    return this.adminService.createAnnouncement(body, req.user?.id);
  }

  @Delete('announcements/:id')
  deleteAnnouncement(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deleteAnnouncement(id, req.user?.id);
  }

  // ── Global Settings & Security ─────────────────────────────────────────
  @Get('settings')
  getGlobalSettings() {
    return this.adminService.getGlobalSettings();
  }

  @Patch('settings')
  updateGlobalSettings(@Body() settings: any, @Req() req: any) {
    return this.adminService.updateGlobalSettings(settings, req.user?.id);
  }

  @Post('settings/integrations/test')
  testIntegration(@Body('type') type: string) {
    return this.adminService.testIntegration(type);
  }

  @Get('settings/api-keys')
  getApiKeys() {
    return this.adminService.getApiKeys();
  }

  @Post('settings/api-keys')
  generateApiKey(@Body('name') name: string, @Req() req: any) {
    return this.adminService.generateApiKey(name, req.user?.id);
  }

  @Delete('settings/api-keys/:id')
  revokeApiKey(@Param('id') id: string, @Req() req: any) {
    return this.adminService.revokeApiKey(id, req.user?.id);
  }

  @Post('settings/backups/trigger')
  triggerBackup(@Req() req: any) {
    return this.adminService.triggerBackup(req.user?.id);
  }

  @Get('settings/security')
  getSecurityMetrics() {
    return this.adminService.getSecurityMetrics();
  }

  // ── Platform Reports ───────────────────────────────────────────────────
  @Get('reports/summary')
  getReportsSummary() {
    return this.adminService.getReportsSummary();
  }

  @Get('reports/tenants')
  getTenantsReport() {
    return this.adminService.getTenantsReport();
  }

  @Get('reports/finance')
  getFinanceReport() {
    return this.adminService.getFinanceReport();
  }
}

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
import { AdminService } from './admin.service';
import { CreateSchoolWizardDto } from './dto/create-school-wizard.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getPlatformStats();
  }

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

  @Patch('schools/:id/status')
  updateSchoolStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.adminService.updateSchoolStatus(id, status, req.user?.id);
  }

  @Get('users')
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.adminService.updateUserStatus(id, status, req.user?.id);
  }

  @Get('audit-logs')
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAuditLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }
}

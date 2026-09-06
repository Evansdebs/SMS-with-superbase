import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getSchoolUsers(
    @CurrentTenant() tenant: TenantContext,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.getSchoolUsers(
      tenant.schoolId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Post('invite')
  inviteSchoolUser(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: { email: string; firstName: string; lastName: string; profile: string; phoneNumber?: string },
  ) {
    return this.usersService.inviteSchoolUser(tenant.schoolId, data);
  }

  @Patch(':id/status')
  updateMembershipStatus(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') userId: string,
    @Body('status') status: string,
  ) {
    return this.usersService.updateMembershipStatus(tenant.schoolId, userId, status);
  }
}

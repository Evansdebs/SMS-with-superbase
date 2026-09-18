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
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/create-teacher.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('teachers')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Post()
  @RequirePermissions('teachers.manage')
  create(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: CreateTeacherDto,
  ) {
    return this.teachersService.create(tenant.schoolId, dto);
  }

  @Get()
  @RequirePermissions('teachers.view')
  findAll(
    @CurrentTenant() tenant: TenantContext,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.teachersService.findAll(
      tenant.schoolId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Get(':id')
  @RequirePermissions('teachers.view')
  findOne(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.teachersService.findOne(tenant.schoolId, id);
  }

  @Put(':id')
  @RequirePermissions('teachers.manage')
  update(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(tenant.schoolId, id, dto);
  }

  @Delete(':id')
  @RequirePermissions('teachers.manage')
  remove(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.teachersService.remove(tenant.schoolId, id);
  }
}

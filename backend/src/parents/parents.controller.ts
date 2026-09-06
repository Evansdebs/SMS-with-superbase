import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParentsService } from './parents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('parents')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class ParentsController {
  constructor(private parentsService: ParentsService) {}

  @Get()
  findAll(
    @CurrentTenant() tenant: TenantContext,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.parentsService.findAll(
      tenant.schoolId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Get(':id')
  findOne(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.parentsService.findOne(tenant.schoolId, id);
  }

  @Post()
  create(
    @CurrentTenant() tenant: TenantContext,
    @Body() data: any,
  ) {
    return this.parentsService.create(tenant.schoolId, data);
  }
}

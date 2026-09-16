import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Transport')
@ApiBearerAuth('JWT')
@Controller('transport')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('routes')
  @RequirePermissions('transport.view')
  @ApiOperation({ summary: 'List transport routes' })
  getRoutes(@CurrentTenant() tenant: TenantContext) {
    return this.transportService.getRoutes(tenant.schoolId);
  }

  @Post('routes')
  @RequirePermissions('transport.manage')
  @ApiOperation({ summary: 'Create transport route' })
  createRoute(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      name: string;
      vehicleNumber: string;
      driverName: string;
      driverPhone: string;
      capacity?: number;
      pickupPoints: string;
      feePerTerm?: number;
    },
  ) {
    return this.transportService.createRoute(tenant.schoolId, dto);
  }

  @Put('routes/:id')
  @RequirePermissions('transport.manage')
  @ApiOperation({ summary: 'Update transport route' })
  updateRoute(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      vehicleNumber?: string;
      driverName?: string;
      driverPhone?: string;
      capacity?: number;
      pickupPoints?: string;
      feePerTerm?: number;
      status?: string;
    },
  ) {
    return this.transportService.updateRoute(tenant.schoolId, id, dto);
  }

  @Delete('routes/:id')
  @RequirePermissions('transport.manage')
  @ApiOperation({ summary: 'Delete transport route' })
  deleteRoute(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.transportService.deleteRoute(tenant.schoolId, id);
  }
}

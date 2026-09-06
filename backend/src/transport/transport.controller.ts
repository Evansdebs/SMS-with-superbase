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
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('transport')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('routes')
  getRoutes(@Request() req: any) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.transportService.getRoutes(schoolId);
  }

  @Post('routes')
  createRoute(
    @Request() req: any,
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
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.transportService.createRoute(schoolId, dto);
  }

  @Put('routes/:id')
  updateRoute(
    @Request() req: any,
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
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.transportService.updateRoute(schoolId, id, dto);
  }

  @Delete('routes/:id')
  deleteRoute(@Request() req: any, @Param('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.transportService.deleteRoute(schoolId, id);
  }
}

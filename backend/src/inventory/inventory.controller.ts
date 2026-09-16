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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @RequirePermissions('inventory.view')
  @ApiOperation({ summary: 'List school assets' })
  getAssets(
    @CurrentTenant() tenant: TenantContext,
    @Query('category') category?: string,
    @Query('condition') condition?: string,
  ) {
    return this.inventoryService.getAssets(tenant.schoolId, category, condition);
  }

  @Post()
  @RequirePermissions('inventory.manage')
  @ApiOperation({ summary: 'Register new asset' })
  createAsset(
    @CurrentTenant() tenant: TenantContext,
    @Body()
    dto: {
      name: string;
      category: string;
      serialNumber?: string;
      location: string;
      condition?: string;
      quantity?: number;
      purchasePrice?: number;
      purchaseDate?: string;
    },
  ) {
    return this.inventoryService.createAsset(tenant.schoolId, dto);
  }

  @Put(':id/condition')
  @RequirePermissions('inventory.manage')
  @ApiOperation({ summary: 'Update asset condition' })
  updateCondition(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: { condition: string; location?: string },
  ) {
    return this.inventoryService.updateAssetCondition(tenant.schoolId, id, dto.condition, dto.location);
  }

  @Delete(':id')
  @RequirePermissions('inventory.manage')
  @ApiOperation({ summary: 'Delete asset' })
  deleteAsset(@CurrentTenant() tenant: TenantContext, @Param('id') id: string) {
    return this.inventoryService.deleteAsset(tenant.schoolId, id);
  }
}

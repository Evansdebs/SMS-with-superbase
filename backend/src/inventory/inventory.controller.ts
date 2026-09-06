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
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getAssets(
    @Request() req: any,
    @Query('category') category?: string,
    @Query('condition') condition?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.inventoryService.getAssets(schoolId, category, condition);
  }

  @Post()
  createAsset(
    @Request() req: any,
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
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.inventoryService.createAsset(schoolId, dto);
  }

  @Put(':id/condition')
  updateCondition(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { condition: string; location?: string },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.inventoryService.updateAssetCondition(schoolId, id, dto.condition, dto.location);
  }

  @Delete(':id')
  deleteAsset(@Request() req: any, @Param('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.inventoryService.deleteAsset(schoolId, id);
  }
}

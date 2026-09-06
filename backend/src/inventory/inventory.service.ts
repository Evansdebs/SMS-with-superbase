import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getAssets(schoolId: string, category?: string, condition?: string) {
    const where: any = { schoolId };
    if (category && category !== 'ALL') where.category = category;
    if (condition && condition !== 'ALL') where.condition = condition;

    return this.prisma.inventoryAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAsset(
    schoolId: string,
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
    return this.prisma.inventoryAsset.create({
      data: {
        schoolId,
        name: dto.name,
        category: dto.category,
        serialNumber: dto.serialNumber,
        location: dto.location,
        condition: dto.condition || 'GOOD',
        quantity: dto.quantity || 1,
        purchasePrice: dto.purchasePrice,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
      },
    });
  }

  async updateAssetCondition(
    schoolId: string,
    id: string,
    condition: string,
    location?: string,
  ) {
    const existing = await this.prisma.inventoryAsset.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Asset record not found');

    return this.prisma.inventoryAsset.update({
      where: { id },
      data: {
        condition,
        location: location ?? existing.location,
        lastMaintenance: new Date(),
      },
    });
  }

  async deleteAsset(schoolId: string, id: string) {
    const existing = await this.prisma.inventoryAsset.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Asset record not found');
    return this.prisma.inventoryAsset.delete({ where: { id } });
  }
}

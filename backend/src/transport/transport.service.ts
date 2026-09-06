import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  async getRoutes(schoolId: string) {
    return this.prisma.transportRoute.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createRoute(
    schoolId: string,
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
    return this.prisma.transportRoute.create({
      data: {
        schoolId,
        name: dto.name,
        vehicleNumber: dto.vehicleNumber,
        driverName: dto.driverName,
        driverPhone: dto.driverPhone,
        capacity: dto.capacity || 30,
        pickupPoints: dto.pickupPoints,
        feePerTerm: dto.feePerTerm || 0,
        status: 'ACTIVE',
      },
    });
  }

  async updateRoute(
    schoolId: string,
    id: string,
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
    const existing = await this.prisma.transportRoute.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Transport route not found');

    return this.prisma.transportRoute.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRoute(schoolId: string, id: string) {
    const existing = await this.prisma.transportRoute.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Transport route not found');
    return this.prisma.transportRoute.delete({ where: { id } });
  }
}

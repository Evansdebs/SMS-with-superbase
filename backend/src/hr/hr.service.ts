import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async getLeaves(schoolId: string, staffId?: string, status?: string) {
    const where: any = { schoolId };
    if (staffId) where.staffId = staffId;
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.staffLeave.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLeave(
    schoolId: string,
    dto: {
      staffId: string;
      leaveType: string;
      startDate: string;
      endDate: string;
      daysCount: number;
      reason: string;
    },
  ) {
    return this.prisma.staffLeave.create({
      data: {
        schoolId,
        staffId: dto.staffId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        daysCount: dto.daysCount,
        reason: dto.reason,
        status: 'PENDING',
      },
      include: {
        staff: {
          select: { firstName: true, lastName: true, employeeId: true },
        },
      },
    });
  }

  async updateLeaveStatus(
    schoolId: string,
    id: string,
    status: string,
    approvedBy?: string,
  ) {
    const existing = await this.prisma.staffLeave.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Leave application not found');

    return this.prisma.staffLeave.update({
      where: { id },
      data: {
        status,
        approvedBy,
      },
    });
  }
}

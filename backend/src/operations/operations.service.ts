import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  // ===================== EXEAT REQUESTS =====================
  async getExeatRequests(schoolId: string, status?: string) {
    const where: any = { schoolId };
    if (status) where.status = status;

    return this.prisma.exeatRequest.findMany({
      where,
      include: {
        student: {
          include: { class: true },
        },
      },
      orderBy: { departureTime: 'desc' },
    });
  }

  async createExeatRequest(schoolId: string, dto: {
    studentId: string;
    reason: string;
    destination: string;
    departureTime: string;
    expectedReturn: string;
    parentContacted?: boolean;
    remarks?: string;
  }) {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId },
    });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.exeatRequest.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        reason: dto.reason,
        destination: dto.destination,
        departureTime: new Date(dto.departureTime),
        expectedReturn: new Date(dto.expectedReturn),
        parentContacted: dto.parentContacted ?? false,
        remarks: dto.remarks,
        status: 'PENDING',
      },
    });
  }

  async updateExeatStatus(schoolId: string, id: string, dto: {
    status: 'APPROVED' | 'REJECTED' | 'RETURNED' | 'OVERDUE';
    remarks?: string;
    approvedBy?: string;
  }) {
    const exeat = await this.prisma.exeatRequest.findFirst({
      where: { id, schoolId },
    });
    if (!exeat) throw new NotFoundException('Exeat request not found');

    const updateData: any = {
      status: dto.status,
    };
    if (dto.remarks) updateData.remarks = dto.remarks;
    if (dto.approvedBy) updateData.approvedBy = dto.approvedBy;
    if (dto.status === 'RETURNED') updateData.actualReturn = new Date();

    return this.prisma.exeatRequest.update({
      where: { id },
      data: updateData,
    });
  }

  // ===================== DORMITORIES & BEDS =====================
  async getDormitories(schoolId: string) {
    return this.prisma.dormitory.findMany({
      where: { schoolId },
      include: {
        beds: {
          include: {
            allocations: {
              where: { status: 'ACTIVE' },
              include: { student: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createDormitory(schoolId: string, dto: {
    name: string;
    gender: string; // MALE, FEMALE
    houseMaster?: string;
    capacity?: number;
  }) {
    const existing = await this.prisma.dormitory.findFirst({
      where: { schoolId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Dormitory "${dto.name}" already exists`);
    }

    return this.prisma.dormitory.create({
      data: {
        schoolId,
        name: dto.name,
        gender: dto.gender,
        houseMaster: dto.houseMaster,
        capacity: dto.capacity ?? 40,
      },
    });
  }

  async addBedsToDormitory(schoolId: string, dormitoryId: string, count: number, prefix = 'BED') {
    const dorm = await this.prisma.dormitory.findFirst({
      where: { id: dormitoryId, schoolId },
    });
    if (!dorm) throw new NotFoundException('Dormitory not found');

    const bedsData = [];
    for (let i = 1; i <= count; i++) {
      const bedNumber = `${prefix}-${i.toString().padStart(2, '0')}`;
      bedsData.push({
        dormitoryId,
        bedNumber,
        isOccupied: false,
      });
    }

    return this.prisma.dormitoryBed.createMany({
      data: bedsData,
      skipDuplicates: true,
    });
  }

  async allocateBed(schoolId: string, dto: { bedId: string; studentId: string }) {
    const bed = await this.prisma.dormitoryBed.findUnique({
      where: { id: dto.bedId },
      include: { dormitory: true },
    });
    if (!bed || bed.dormitory.schoolId !== schoolId) {
      throw new NotFoundException('Bed not found');
    }
    if (bed.isOccupied) {
      throw new BadRequestException('Bed is already occupied');
    }

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId },
    });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.$transaction(async (tx) => {
      // Release any existing active allocation for this student
      await tx.bedAllocation.updateMany({
        where: { studentId: dto.studentId, status: 'ACTIVE' },
        data: { status: 'VACATED', releasedDate: new Date() },
      });

      // Create new allocation
      const allocation = await tx.bedAllocation.create({
        data: {
          bedId: dto.bedId,
          studentId: dto.studentId,
          status: 'ACTIVE',
        },
      });

      // Mark bed as occupied
      await tx.dormitoryBed.update({
        where: { id: dto.bedId },
        data: { isOccupied: true },
      });

      return allocation;
    });
  }

  async vacateBed(schoolId: string, allocationId: string) {
    const allocation = await this.prisma.bedAllocation.findUnique({
      where: { id: allocationId },
      include: { bed: { include: { dormitory: true } } },
    });
    if (!allocation || allocation.bed.dormitory.schoolId !== schoolId) {
      throw new NotFoundException('Allocation not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.bedAllocation.update({
        where: { id: allocationId },
        data: { status: 'VACATED', releasedDate: new Date() },
      });

      await tx.dormitoryBed.update({
        where: { id: allocation.bedId },
        data: { isOccupied: false },
      });

      return updated;
    });
  }

  // ===================== FRONT OFFICE & VISITOR LOGS =====================
  async getVisitorLogs(schoolId: string, date?: string) {
    const where: any = { schoolId };
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      where.timeIn = { gte: dayStart, lte: dayEnd };
    }

    return this.prisma.visitorLog.findMany({
      where,
      orderBy: { timeIn: 'desc' },
    });
  }

  async recordVisitor(schoolId: string, dto: {
    visitorName: string;
    phoneNumber: string;
    hostPerson: string;
    purpose: string;
    badgeNumber?: string;
    remarks?: string;
    recordedBy?: string;
  }) {
    return this.prisma.visitorLog.create({
      data: {
        schoolId,
        visitorName: dto.visitorName,
        phoneNumber: dto.phoneNumber,
        hostPerson: dto.hostPerson,
        purpose: dto.purpose,
        badgeNumber: dto.badgeNumber,
        remarks: dto.remarks,
        recordedBy: dto.recordedBy,
      },
    });
  }

  async checkoutVisitor(schoolId: string, id: string) {
    const log = await this.prisma.visitorLog.findFirst({
      where: { id, schoolId },
    });
    if (!log) throw new NotFoundException('Visitor log not found');

    return this.prisma.visitorLog.update({
      where: { id },
      data: { timeOut: new Date() },
    });
  }
}

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateGhanaPayroll } from './payroll.calculator';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────── LEAVES ────────────────────────
  async getLeaves(schoolId: string, staffId?: string, status?: string) {
    const where: any = { schoolId };
    if (staffId) where.staffId = staffId;
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.staffLeave.findMany({
      where,
      include: {
        staff: {
          select: { id: true, firstName: true, lastName: true, employeeId: true, role: true, department: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLeave(schoolId: string, dto: {
    staffId: string; leaveType: string; startDate: string; endDate: string; daysCount: number; reason: string;
  }) {
    return this.prisma.staffLeave.create({
      data: {
        schoolId, staffId: dto.staffId, leaveType: dto.leaveType,
        startDate: new Date(dto.startDate), endDate: new Date(dto.endDate),
        daysCount: dto.daysCount, reason: dto.reason, status: 'PENDING',
      },
      include: { staff: { select: { firstName: true, lastName: true, employeeId: true } } },
    });
  }

  async updateLeaveStatus(schoolId: string, id: string, status: string, approvedBy?: string) {
    const existing = await this.prisma.staffLeave.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Leave application not found');
    return this.prisma.staffLeave.update({ where: { id }, data: { status, approvedBy } });
  }

  // ──────────────────────── SALARY STRUCTURES ────────────────────────
  async getSalaryStructures(schoolId: string) {
    return this.prisma.salaryStructure.findMany({
      where: { schoolId },
      include: { staff: { select: { id: true, firstName: true, lastName: true, employeeId: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertSalaryStructure(schoolId: string, dto: {
    staffId: string; basicSalary: number; housingAllowance?: number;
    transportAllowance?: number; otherAllowances?: number;
    ssnitNumber?: string; tinNumber?: string; bankName?: string; accountNumber?: string;
  }) {
    const staff = await this.prisma.staff.findFirst({ where: { id: dto.staffId, schoolId } });
    if (!staff) throw new NotFoundException('Staff member not found in this school');
    return this.prisma.salaryStructure.upsert({
      where: { staffId: dto.staffId },
      create: { schoolId, ...dto },
      update: { ...dto },
      include: { staff: { select: { firstName: true, lastName: true } } },
    });
  }

  // ──────────────────────── PAYROLL PERIODS ────────────────────────
  async getPayrollPeriods(schoolId: string) {
    return this.prisma.payrollPeriod.findMany({
      where: { schoolId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: { _count: { select: { payslips: true } } },
    });
  }

  async createPayrollPeriod(schoolId: string, dto: { month: number; year: number }) {
    const existing = await this.prisma.payrollPeriod.findFirst({
      where: { schoolId, month: dto.month, year: dto.year },
    });
    if (existing) throw new ConflictException(`Payroll for ${dto.month}/${dto.year} already exists`);
    return this.prisma.payrollPeriod.create({ data: { schoolId, month: dto.month, year: dto.year, status: 'DRAFT' } });
  }

  // ──────────────────────── PAYROLL RUN ────────────────────────
  async runPayroll(schoolId: string, payrollPeriodId: string, processedBy: string) {
    const period = await this.prisma.payrollPeriod.findFirst({ where: { id: payrollPeriodId, schoolId } });
    if (!period) throw new NotFoundException('Payroll period not found');
    if (['FINALIZED', 'LOCKED'].includes(period.status)) {
      throw new BadRequestException('Cannot re-run a finalized or locked payroll');
    }

    const salaryStructures = await this.prisma.salaryStructure.findMany({
      where: { schoolId }, include: { staff: true },
    });
    if (salaryStructures.length === 0) {
      throw new BadRequestException('No salary structures configured. Please set up staff salaries first.');
    }

    const payrollItems = salaryStructures.map((ss) => {
      const calc = calculateGhanaPayroll({
        basicSalary: ss.basicSalary,
        housingAllowance: ss.housingAllowance ?? 0,
        transportAllowance: ss.transportAllowance ?? 0,
        otherAllowances: ss.otherAllowances ?? 0,
      });
      return { staffId: ss.staffId, calc };
    });

    const run = await this.prisma.$transaction(async (tx) => {
      const totalGross = payrollItems.reduce((s, i) => s + i.calc.grossSalary, 0);
      const totalNet = payrollItems.reduce((s, i) => s + i.calc.netSalary, 0);

      const payrollRun = await tx.payrollRun.create({
        data: {
          payrollPeriodId, schoolId, processedBy,
          totalStaff: payrollItems.length, totalGross, totalNet,
          items: {
            create: payrollItems.map((pi) => ({
              staffId: pi.staffId,
              basicSalary: pi.calc.basicSalary,
              allowances: pi.calc.allowances,
              bonus: pi.calc.bonus,
              grossSalary: pi.calc.grossSalary,
              taxableIncome: pi.calc.taxableIncome,
              paye: pi.calc.paye,
              ssnitTier1: pi.calc.ssnitTier1Employer,
              ssnitTier2: pi.calc.ssnitTier2Employee,
              totalDeductions: pi.calc.totalDeductions,
              netSalary: pi.calc.netSalary,
            })),
          },
        },
        include: { items: { include: { staff: { select: { firstName: true, lastName: true } } } } },
      });

      await tx.payrollPeriod.update({
        where: { id: payrollPeriodId },
        data: {
          status: 'REVIEW', totalGross,
          totalPaye: payrollItems.reduce((s, i) => s + i.calc.paye, 0),
          totalSsnit: payrollItems.reduce((s, i) => s + i.calc.ssnitTier2Employee, 0),
          totalNet,
        },
      });

      return payrollRun;
    });

    return run;
  }

  async updatePayrollStatus(schoolId: string, periodId: string, status: string, approvedBy?: string) {
    const period = await this.prisma.payrollPeriod.findFirst({ where: { id: periodId, schoolId } });
    if (!period) throw new NotFoundException('Payroll period not found');
    if (period.status === 'LOCKED') throw new BadRequestException('Locked payroll cannot be changed');
    const updateData: any = { status };
    if (['FINALIZED', 'LOCKED'].includes(status)) { updateData.finalizedAt = new Date(); updateData.approvedBy = approvedBy; }
    return this.prisma.payrollPeriod.update({ where: { id: periodId }, data: updateData });
  }

  // ──────────────────────── PAYSLIPS ────────────────────────
  async generatePayslips(schoolId: string, payrollPeriodId: string) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: payrollPeriodId, schoolId },
      include: {
        runs: {
          include: { items: { include: { staff: { include: { salaryStructure: true } } } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!period) throw new NotFoundException('Payroll period not found');
    if (!['APPROVED', 'FINALIZED', 'LOCKED'].includes(period.status)) {
      throw new BadRequestException('Payslips can only be generated for APPROVED or FINALIZED payroll');
    }
    const latestRun = period.runs[0];
    if (!latestRun) throw new BadRequestException('No payroll run found for this period');

    const payslips = await Promise.all(
      latestRun.items.map(async (item) => {
        const payslipNumber = `SLIP-${period.year}-${String(period.month).padStart(2, '0')}-${item.staffId.slice(-4).toUpperCase()}`;
        return this.prisma.payslip.upsert({
          where: { payrollPeriodId_staffId: { payrollPeriodId, staffId: item.staffId } },
          create: {
            schoolId, payrollPeriodId, staffId: item.staffId, payslipNumber,
            basicSalary: item.basicSalary, allowances: item.allowances,
            grossSalary: item.grossSalary, paye: item.paye, ssnit: item.ssnitTier2,
            otherDeductions: 0, totalDeductions: item.totalDeductions, netSalary: item.netSalary,
          },
          update: {
            basicSalary: item.basicSalary, allowances: item.allowances,
            grossSalary: item.grossSalary, paye: item.paye, ssnit: item.ssnitTier2,
            totalDeductions: item.totalDeductions, netSalary: item.netSalary,
          },
          include: { staff: { select: { firstName: true, lastName: true, employeeId: true } } },
        });
      }),
    );

    return { generated: payslips.length, payslips };
  }

  async getPayslips(schoolId: string, staffId?: string, periodId?: string) {
    const where: any = { schoolId };
    if (staffId) where.staffId = staffId;
    if (periodId) where.payrollPeriodId = periodId;
    return this.prisma.payslip.findMany({
      where,
      include: {
        staff: { select: { firstName: true, lastName: true, employeeId: true } },
        payrollPeriod: { select: { month: true, year: true, status: true } },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }
}

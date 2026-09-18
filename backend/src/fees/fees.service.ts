import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all student fee records for a school (tenant-scoped).
   */
  async getFeeRecords(schoolId: string, term?: string, status?: string) {
    const where: any = { schoolId };
    if (term) where.term = term;
    if (status && status !== 'ALL') where.status = status;

    const records = await this.prisma.studentFee.findMany({
      where,
      include: { student: { include: { class: true } } },
      orderBy: [{ status: 'asc' }, { student: { lastName: 'asc' } }],
    });

    const totalExpected = records.reduce((a, r) => a + r.amount, 0);
    const totalCollected = records.reduce((a, r) => a + r.paidAmount, 0);
    const totalOutstanding = records.reduce((a, r) => a + r.balance, 0);

    return {
      data: records.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        studentName: `${r.student.firstName} ${r.student.lastName}`,
        admissionNumber: r.student.admissionNumber,
        class: r.student.class ? `${r.student.class.name} (${r.student.class.stream || 'A'})` : 'N/A',
        term: r.term || 'Term 1',
        academicYear: r.academicYear || '2025/2026',
        feeType: r.name || 'School Fees',
        totalAmount: r.amount,
        amountPaid: r.paidAmount,
        balance: r.balance,
        status: r.status === 'PAID' ? 'PAID' : r.status === 'PARTIAL' ? 'PARTIAL' : 'UNPAID',
        dueDate: r.dueDate?.toISOString()?.split('T')[0] || null,
      })),
      meta: {
        total: records.length, totalExpected, totalCollected, totalOutstanding,
        collectionRate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
      },
    };
  }

  /**
   * Record a payment against a StudentFee record.
   */
  async recordPayment(
    schoolId: string,
    studentFeeId: string,
    dto: { amountPaid: number; paymentMethod: string; notes?: string },
    currentUserId?: string,
  ) {
    const studentFee = await this.prisma.studentFee.findFirst({ where: { id: studentFeeId, schoolId } });
    if (!studentFee) throw new NotFoundException('Fee record not found in this school');

    const paymentAmount = Math.min(dto.amountPaid, studentFee.balance);
    const newPaidAmount = studentFee.paidAmount + paymentAmount;
    const newBalance = studentFee.amount - newPaidAmount;
    const newStatus = newBalance <= 0 ? 'PAID' : newPaidAmount > 0 ? 'PARTIAL' : 'PENDING';
    const receiptNumber = `RCP-${Date.now().toString().slice(-8)}`;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.studentFee.update({
        where: { id: studentFeeId },
        data: { paidAmount: newPaidAmount, balance: newBalance < 0 ? 0 : newBalance, status: newStatus },
      });

      const payment = await tx.payment.create({
        data: {
          schoolId,
          studentId: studentFee.studentId,
          studentFeeId,
          amount: paymentAmount,
          paymentMethod: dto.paymentMethod || 'CASH',
          receiptNumber,
          description: dto.notes || `Fee payment — ${studentFee.name}`,
          receivedBy: currentUserId,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: currentUserId,
          action: 'RECORD_FEE_PAYMENT',
          entityType: 'STUDENT_FEE',
          entityId: studentFeeId,
          schoolId,
          details: { amountPaid: paymentAmount, receiptNumber, newStatus, method: dto.paymentMethod },
          result: 'SUCCESS',
        },
      });

      return { success: true, studentFee: updated, payment, receiptNumber, newStatus };
    });
  }

  /**
   * Reverse a payment (audit-safe; marks as reversed, creates counter-entry)
   */
  async reversePayment(schoolId: string, paymentId: string, reason: string, reversedBy: string) {
    const payment = await this.prisma.payment.findFirst({ where: { id: paymentId, schoolId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.isReversed) throw new BadRequestException('Payment is already reversed');
    if (!payment.studentFeeId) throw new BadRequestException('Cannot reverse a payment without a fee record');

    return this.prisma.$transaction(async (tx) => {
      // Mark original payment as reversed
      await tx.payment.update({ where: { id: paymentId }, data: { isReversed: true } });

      // Create reversal record
      const reversalReceipt = `REV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const reversal = await tx.paymentReversal.create({
        data: { paymentId, reason, reversedBy, schoolId, reversalReceipt },
      });

      // Restore student fee balance
      const fee = await tx.studentFee.findFirst({ where: { id: payment.studentFeeId! } });
      if (fee) {
        const restoredBalance = fee.balance + payment.amount;
        const newPaid = Math.max(0, fee.paidAmount - payment.amount);
        const newStatus = restoredBalance >= fee.amount ? 'PENDING' : newPaid > 0 ? 'PARTIAL' : 'PENDING';
        await tx.studentFee.update({
          where: { id: fee.id },
          data: { paidAmount: newPaid, balance: restoredBalance, status: newStatus },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: reversedBy,
          action: 'REVERSE_PAYMENT',
          entityType: 'PAYMENT',
          entityId: paymentId,
          schoolId,
          details: { reason, reversalId: reversal.id, amount: payment.amount, reversalReceipt },
          result: 'SUCCESS',
        },
      });

      return { success: true, reversal };
    });
  }

  /**
   * Fee summary stats for a school term.
   */
  async getFeeSummary(schoolId: string, term?: string) {
    const where: any = { schoolId };
    if (term) where.term = term;

    const [total, paid, partial, pending] = await Promise.all([
      this.prisma.studentFee.count({ where }),
      this.prisma.studentFee.count({ where: { ...where, status: 'PAID' } }),
      this.prisma.studentFee.count({ where: { ...where, status: 'PARTIAL' } }),
      this.prisma.studentFee.count({ where: { ...where, status: 'PENDING' } }),
    ]);

    const aggregate = await this.prisma.studentFee.aggregate({
      where,
      _sum: { amount: true, paidAmount: true, balance: true },
    });

    const totalExpected = aggregate._sum.amount || 0;
    const totalCollected = aggregate._sum.paidAmount || 0;
    const totalOutstanding = aggregate._sum.balance || 0;

    return {
      counts: { total, paid, partial, pending },
      financials: {
        totalExpected, totalCollected, totalOutstanding,
        collectionRate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
      },
    };
  }

  // ─────────────── FEE CATEGORIES ───────────────
  async getFeeCategories(schoolId: string) {
    return this.prisma.feeCategory.findMany({
      where: { schoolId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createFeeCategory(schoolId: string, dto: { name: string; code?: string; description?: string; frequency?: string }) {
    const code = dto.code ?? dto.name.toUpperCase().replace(/[^A-Z0-9]/g, '_').substring(0, 30) + `_${Date.now().toString().slice(-4)}`;
    return this.prisma.feeCategory.create({
      data: { schoolId, name: dto.name, code, description: dto.description, frequency: dto.frequency ?? 'TERMLY' },
    });
  }

  // ─────────────── STUDENT BILLS (Bulk) ───────────────
  async generateBills(schoolId: string, dto: {
    feeCategoryId: string; amount: number; dueDate: string;
    academicYear: string; term: string; classId?: string;
  }) {
    const category = await this.prisma.feeCategory.findFirst({
      where: { id: dto.feeCategoryId, schoolId },
    });
    if (!category) throw new NotFoundException('Fee category not found');

    // Scope to class or all active students
    const studentWhere: any = { schoolId, status: 'ACTIVE' };
    if (dto.classId) studentWhere.classId = dto.classId;
    const students = await this.prisma.student.findMany({ where: studentWhere, select: { id: true } });

    if (students.length === 0) throw new BadRequestException('No active students found matching criteria');

    // Avoid duplicate bills for same period
    const existing = await this.prisma.studentBill.findMany({
      where: {
        schoolId,
        feeCategoryId: dto.feeCategoryId,
        academicYear: dto.academicYear,
        term: dto.term,
      },
      select: { studentId: true },
    });
    const alreadyBilled = new Set(existing.map((b) => b.studentId));
    const newStudents = students.filter((s) => !alreadyBilled.has(s.id));

    if (newStudents.length === 0) {
      throw new BadRequestException('Bills already generated for all students in this category/period');
    }

    const timestamp = Date.now();
    const bills = await this.prisma.studentBill.createMany({
      data: newStudents.map((s, idx) => ({
        schoolId,
        studentId: s.id,
        feeCategoryId: dto.feeCategoryId,
        billNumber: `BILL-${timestamp}-${idx + 1}`,
        totalAmount: dto.amount,
        discountAmount: 0,
        balance: dto.amount,
        paidAmount: 0,
        dueDate: new Date(dto.dueDate),
        academicYear: dto.academicYear,
        term: dto.term,
        status: 'PENDING',
      })),
    });

    return { generated: bills.count, message: `Bills generated for ${bills.count} students` };
  }

  async getBills(schoolId: string, params: { classId?: string; term?: string; academicYear?: string; status?: string }) {
    const where: any = { schoolId };
    if (params.term) where.term = params.term;
    if (params.academicYear) where.academicYear = params.academicYear;
    if (params.status && params.status !== 'ALL') where.status = params.status;

    return this.prisma.studentBill.findMany({
      where,
      include: {
        student: { include: { class: true } },
        feeCategory: true,
      },
      orderBy: [{ status: 'asc' }, { student: { lastName: 'asc' } }],
    });
  }

  // ─────────────── DEBTORS REPORT ───────────────
  async getDebtors(schoolId: string, term?: string, academicYear?: string) {
    const where: any = { schoolId, status: { in: ['PENDING', 'PARTIAL'] }, balance: { gt: 0 } };
    if (term) where.term = term;
    if (academicYear) where.academicYear = academicYear;

    return this.prisma.studentBill.findMany({
      where,
      include: {
        student: {
          include: {
            class: true,
            guardians: { include: { parent: { select: { firstName: true, lastName: true, phoneNumber: true } } }, where: { isPrimary: true }, take: 1 },
          },
        },
        feeCategory: { select: { name: true } },
      },
      orderBy: { balance: 'desc' },
    });
  }

  // ─────────────── EXPENSES ───────────────
  async getExpenses(schoolId: string, category?: string, startDate?: string, endDate?: string) {
    const where: any = { schoolId };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }
    const expenses = await this.prisma.expense.findMany({ where, orderBy: { expenseDate: 'desc' } });
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    return { expenses, totalExpense };
  }

  async createExpense(schoolId: string, dto: {
    category: string; description: string; amount: number; expenseDate?: string; approvedBy?: string; receipt?: string;
  }) {
    return this.prisma.expense.create({
      data: {
        schoolId, category: dto.category, description: dto.description, amount: dto.amount,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        approvedBy: dto.approvedBy, receipt: dto.receipt,
      },
    });
  }

  async deleteExpense(schoolId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Expense record not found');
    return this.prisma.expense.delete({ where: { id } });
  }

  // ─────────────── FEE STRUCTURES ───────────────
  async getFeeStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({ where: { schoolId }, orderBy: { createdAt: 'desc' } });
  }

  async createFeeStructure(schoolId: string, dto: {
    name: string; description?: string; amount: number; classId?: string; academicYear?: string; term?: string;
  }) {
    return this.prisma.feeStructure.create({
      data: { schoolId, name: dto.name, description: dto.description, amount: dto.amount, classId: dto.classId, academicYear: dto.academicYear, term: dto.term },
    });
  }

  async applyScholarship(schoolId: string, studentFeeId: string, dto: { scholarshipName: string; discountAmount: number }) {
    const fee = await this.prisma.studentFee.findFirst({ where: { id: studentFeeId, schoolId } });
    if (!fee) throw new NotFoundException('Student fee record not found');
    const netAmount = Math.max(0, fee.amount - dto.discountAmount);
    const newBalance = Math.max(0, netAmount - fee.paidAmount);
    const newStatus = newBalance === 0 ? 'PAID' : fee.paidAmount > 0 ? 'PARTIAL' : 'PENDING';
    return this.prisma.studentFee.update({
      where: { id: studentFeeId },
      data: { discountAmount: dto.discountAmount, scholarshipName: dto.scholarshipName, balance: newBalance, status: newStatus },
    });
  }

  // ─────────────── FINANCIAL STATEMENT ───────────────
  async getFinancialStatement(schoolId: string, academicYear?: string, term?: string) {
    const feeWhere: any = { schoolId };
    if (academicYear) feeWhere.academicYear = academicYear;
    if (term) feeWhere.term = term;

    const [feeAggregate, expenses] = await Promise.all([
      this.prisma.studentFee.aggregate({
        where: feeWhere,
        _sum: { amount: true, paidAmount: true, balance: true, discountAmount: true },
      }),
      this.prisma.expense.findMany({ where: { schoolId }, orderBy: { expenseDate: 'desc' } }),
    ]);

    const totalInvoiced = feeAggregate._sum.amount || 0;
    const totalCollected = feeAggregate._sum.paidAmount || 0;
    const totalOutstanding = feeAggregate._sum.balance || 0;
    const totalDiscounts = feeAggregate._sum.discountAmount || 0;

    const categoryBreakdown: Record<string, number> = {};
    let totalExpenses = 0;
    for (const exp of expenses) {
      totalExpenses += exp.amount;
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    }

    const netOperatingBalance = totalCollected - totalExpenses;
    const operatingMargin = totalCollected > 0 ? Math.round((netOperatingBalance / totalCollected) * 100) : 0;

    return {
      revenue: { totalInvoiced, totalCollected, totalOutstanding, totalDiscounts, collectionRate: totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0 },
      expenses: { totalExpenses, categoryBreakdown },
      netOperatingBalance,
      operatingMargin,
    };
  }
}

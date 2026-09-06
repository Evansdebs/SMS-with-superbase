import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all student fee records for a school (tenant-scoped).
   * Uses the StudentFee model which maps to student_fees table.
   */
  async getFeeRecords(schoolId: string, term?: string, status?: string) {
    const where: any = { schoolId };
    if (term) where.term = term;
    if (status && status !== 'ALL') where.status = status;

    const records = await this.prisma.studentFee.findMany({
      where,
      include: {
        student: {
          include: { class: true },
        },
      },
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
        class: r.student.class
          ? `${r.student.class.name} (${r.student.class.stream || 'A'})`
          : 'N/A',
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
        total: records.length,
        totalExpected,
        totalCollected,
        totalOutstanding,
        collectionRate:
          totalExpected > 0
            ? Math.round((totalCollected / totalExpected) * 100)
            : 0,
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
    // Verify fee record belongs to this school
    const studentFee = await this.prisma.studentFee.findFirst({
      where: { id: studentFeeId, schoolId },
    });

    if (!studentFee) {
      throw new NotFoundException('Fee record not found in this school');
    }

    const paymentAmount = Math.min(dto.amountPaid, studentFee.balance);
    const newPaidAmount = studentFee.paidAmount + paymentAmount;
    const newBalance = studentFee.amount - newPaidAmount;
    const newStatus =
      newBalance <= 0 ? 'PAID' : newPaidAmount > 0 ? 'PARTIAL' : 'PENDING';

    // Generate unique receipt number
    const receiptNumber = `RCP-${Date.now().toString().slice(-8)}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update the StudentFee record
      const updated = await tx.studentFee.update({
        where: { id: studentFeeId },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance < 0 ? 0 : newBalance,
          status: newStatus,
        },
      });

      // 2. Create a Payment record
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

      // 3. Audit log
      await tx.auditLog.create({
        data: {
          userId: currentUserId,
          action: 'RECORD_FEE_PAYMENT',
          entityType: 'STUDENT_FEE',
          entityId: studentFeeId,
          schoolId,
          details: {
            amountPaid: paymentAmount,
            receiptNumber,
            newStatus,
            method: dto.paymentMethod,
          },
          result: 'SUCCESS',
        },
      });

      return {
        success: true,
        studentFee: updated,
        payment,
        receiptNumber,
        newStatus,
      };
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
        totalExpected,
        totalCollected,
        totalOutstanding,
        collectionRate:
          totalExpected > 0
            ? Math.round((totalCollected / totalExpected) * 100)
            : 0,
      },
    };
  }

  /**
   * Get all expenses for a school
   */
  async getExpenses(
    schoolId: string,
    category?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { schoolId };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
    });

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      expenses,
      totalExpense,
    };
  }

  /**
   * Record a new school expense
   */
  async createExpense(
    schoolId: string,
    dto: {
      category: string;
      description: string;
      amount: number;
      expenseDate?: string;
      approvedBy?: string;
      receipt?: string;
    },
  ) {
    return this.prisma.expense.create({
      data: {
        schoolId,
        category: dto.category,
        description: dto.description,
        amount: dto.amount,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        approvedBy: dto.approvedBy,
        receipt: dto.receipt,
      },
    });
  }

  /**
   * Delete an expense record
   */
  async deleteExpense(schoolId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({
      where: { id, schoolId },
    });
    if (!existing) throw new NotFoundException('Expense record not found');
    return this.prisma.expense.delete({ where: { id } });
  }

  /**
   * Fee structures list
   */
  async getFeeStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a fee structure
   */
  async createFeeStructure(
    schoolId: string,
    dto: {
      name: string;
      description?: string;
      amount: number;
      classId?: string;
      academicYear?: string;
      term?: string;
    },
  ) {
    return this.prisma.feeStructure.create({
      data: {
        schoolId,
        name: dto.name,
        description: dto.description,
        amount: dto.amount,
        classId: dto.classId,
        academicYear: dto.academicYear,
        term: dto.term,
      },
    });
  }

  /**
   * Apply scholarship or discount to student fee
   */
  async applyScholarship(
    schoolId: string,
    studentFeeId: string,
    dto: { scholarshipName: string; discountAmount: number },
  ) {
    const fee = await this.prisma.studentFee.findFirst({
      where: { id: studentFeeId, schoolId },
    });
    if (!fee) throw new NotFoundException('Student fee record not found');

    const netAmount = Math.max(0, fee.amount - dto.discountAmount);
    const newBalance = Math.max(0, netAmount - fee.paidAmount);
    const newStatus = newBalance === 0 ? 'PAID' : fee.paidAmount > 0 ? 'PARTIAL' : 'PENDING';

    return this.prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        discountAmount: dto.discountAmount,
        scholarshipName: dto.scholarshipName,
        balance: newBalance,
        status: newStatus,
      },
    });
  }

  /**
   * Comprehensive Financial Statement (Revenue vs Expenses / P&L)
   */
  async getFinancialStatement(schoolId: string, academicYear?: string, term?: string) {
    const feeWhere: any = { schoolId };
    if (academicYear) feeWhere.academicYear = academicYear;
    if (term) feeWhere.term = term;

    const [feeAggregate, expenses] = await Promise.all([
      this.prisma.studentFee.aggregate({
        where: feeWhere,
        _sum: { amount: true, paidAmount: true, balance: true, discountAmount: true },
      }),
      this.prisma.expense.findMany({
        where: { schoolId },
        orderBy: { expenseDate: 'desc' },
      }),
    ]);

    const totalInvoiced = feeAggregate._sum.amount || 0;
    const totalCollected = feeAggregate._sum.paidAmount || 0;
    const totalOutstanding = feeAggregate._sum.balance || 0;
    const totalDiscounts = feeAggregate._sum.discountAmount || 0;

    // Aggregate expenses by category
    const categoryBreakdown: Record<string, number> = {};
    let totalExpenses = 0;
    for (const exp of expenses) {
      totalExpenses += exp.amount;
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    }

    const netOperatingBalance = totalCollected - totalExpenses;
    const operatingMargin = totalCollected > 0 ? Math.round((netOperatingBalance / totalCollected) * 100) : 0;

    return {
      revenue: {
        totalInvoiced,
        totalCollected,
        totalOutstanding,
        totalDiscounts,
        collectionRate: totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0,
      },
      expenses: {
        totalExpenses,
        categoryBreakdown,
      },
      netOperatingBalance,
      operatingMargin,
    };
  }
}



import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  // ===================== CHART OF ACCOUNTS (ACCOUNT HEADS) =====================
  async getAccountHeads(schoolId: string, type?: string) {
    const where: any = { schoolId, isActive: true };
    if (type) where.type = type;

    let heads = await this.prisma.accountHead.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    if (heads.length === 0 && !type) {
      await this.seedDefaultChartOfAccounts(schoolId);
      heads = await this.prisma.accountHead.findMany({
        where: { schoolId, isActive: true },
        orderBy: { code: 'asc' },
      });
    }

    return heads;
  }

  async createAccountHead(schoolId: string, dto: {
    name: string;
    code: string;
    type: string; // INCOME, EXPENSE, ASSET, LIABILITY
    description?: string;
  }) {
    const existing = await this.prisma.accountHead.findFirst({
      where: { schoolId, code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Account head with code "${dto.code}" already exists`);
    }

    return this.prisma.accountHead.create({
      data: {
        schoolId,
        name: dto.name,
        code: dto.code,
        type: dto.type,
        description: dto.description,
      },
    });
  }

  async seedDefaultChartOfAccounts(schoolId: string) {
    const defaults = [
      { code: 'INC-101', name: 'Tuition Fee Income', type: 'INCOME', description: 'Core academic term fees' },
      { code: 'INC-102', name: 'Feeding & Canteen Revenue', type: 'INCOME', description: 'Student meal and canteen collections' },
      { code: 'INC-103', name: 'Boarding & Hostel Fees', type: 'INCOME', description: 'Boarding student lodging fees' },
      { code: 'INC-104', name: 'PTA Dues & Development Levy', type: 'INCOME', description: 'Parent Teacher Association levies' },
      { code: 'INC-105', name: 'Books & Stationery Sales', type: 'INCOME', description: 'Sale of school books and materials' },
      { code: 'INC-106', name: 'Bus Transportation Fees', type: 'INCOME', description: 'School shuttle and bus fees' },
      { code: 'EXP-201', name: 'Staff Salaries & Wages', type: 'EXPENSE', description: 'Teaching and non-teaching payroll' },
      { code: 'EXP-202', name: 'SSNIT & Pension Contributions', type: 'EXPENSE', description: 'Employer statutory contributions' },
      { code: 'EXP-203', name: 'Utilities (Electricity & Water)', type: 'EXPENSE', description: 'ECG and Ghana Water bills' },
      { code: 'EXP-204', name: 'Fuel & Transportation Maintenance', type: 'EXPENSE', description: 'Diesel and bus maintenance' },
      { code: 'EXP-205', name: 'Teaching & Exam Materials', type: 'EXPENSE', description: 'Exam sheets, lab reagents, textbooks' },
      { code: 'EXP-206', name: 'Facility Repairs & Maintenance', type: 'EXPENSE', description: 'Building and furniture maintenance' },
      { code: 'AST-301', name: 'Main School Operating Account', type: 'ASSET', description: 'Primary bank account' },
      { code: 'AST-302', name: 'MTN Mobile Money Merchant Wallet', type: 'ASSET', description: 'MoMo collection wallet' },
      { code: 'AST-303', name: 'Petty Cash Float', type: 'ASSET', description: 'Front office daily emergency cash' },
    ];

    for (const item of defaults) {
      await this.prisma.accountHead.upsert({
        where: { schoolId_code: { schoolId, code: item.code } },
        update: {},
        create: { schoolId, ...item },
      });
    }
  }

  // ===================== INCOME TRANSACTIONS =====================
  async getIncomeTransactions(schoolId: string, filters: {
    startDate?: string;
    endDate?: string;
    accountHead?: string;
    paymentMethod?: string;
  }) {
    const where: any = { schoolId };
    if (filters.accountHead) where.accountHead = filters.accountHead;
    if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;
    if (filters.startDate || filters.endDate) {
      where.incomeDate = {};
      if (filters.startDate) where.incomeDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.incomeDate.lte = new Date(filters.endDate);
    }

    return this.prisma.incomeTransaction.findMany({
      where,
      orderBy: { incomeDate: 'desc' },
    });
  }

  async recordIncome(schoolId: string, dto: {
    accountHead: string;
    amount: number;
    paymentMethod: string; // CASH, BANK, MOBILE_MONEY
    payer?: string;
    reference?: string;
    description?: string;
    receivedBy?: string;
  }) {
    const receiptNumber = `INC-${Date.now().toString().slice(-6)}`;
    return this.prisma.incomeTransaction.create({
      data: {
        schoolId,
        accountHead: dto.accountHead,
        amount: dto.amount,
        currency: 'GHS',
        paymentMethod: dto.paymentMethod,
        payer: dto.payer,
        reference: dto.reference,
        receiptNumber,
        description: dto.description,
        receivedBy: dto.receivedBy,
      },
    });
  }

  // ===================== BANK ACCOUNTS =====================
  async getBankAccounts(schoolId: string) {
    let accounts = await this.prisma.bankAccount.findMany({
      where: { schoolId, isActive: true },
      orderBy: { bankName: 'asc' },
    });

    if (accounts.length === 0) {
      // Seed default accounts
      await this.prisma.bankAccount.createMany({
        data: [
          {
            schoolId,
            bankName: 'Ghana Commercial Bank (GCB)',
            accountName: 'Main School Operations',
            accountNumber: '1011002345678',
            branch: 'High Street, Accra',
            openingBalance: 25000,
            currentBalance: 25000,
          },
          {
            schoolId,
            bankName: 'MTN Mobile Money Merchant',
            accountName: 'School MoMo Collection',
            accountNumber: '0240000000',
            branch: 'Digital Wallet',
            openingBalance: 5000,
            currentBalance: 5000,
          },
        ],
      });
      accounts = await this.prisma.bankAccount.findMany({
        where: { schoolId, isActive: true },
        orderBy: { bankName: 'asc' },
      });
    }

    return accounts;
  }

  async createBankAccount(schoolId: string, dto: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    branch?: string;
    openingBalance?: number;
    currency?: string;
  }) {
    const existing = await this.prisma.bankAccount.findFirst({
      where: { schoolId, accountNumber: dto.accountNumber },
    });
    if (existing) {
      throw new ConflictException(`Bank account "${dto.accountNumber}" already registered`);
    }

    const opening = dto.openingBalance ?? 0;
    return this.prisma.bankAccount.create({
      data: {
        schoolId,
        accountName: dto.accountName,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        branch: dto.branch,
        openingBalance: opening,
        currentBalance: opening,
        currency: dto.currency ?? 'GHS',
      },
    });
  }

  // ===================== CASH FLOW & FINANCIAL SUMMARY =====================
  async getFinancialSummary(schoolId: string) {
    const [feePayments, incomeTx, expenses] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { schoolId, isReversed: false },
        _sum: { amount: true },
      }),
      this.prisma.incomeTransaction.aggregate({
        where: { schoolId },
        _sum: { amount: true },
      }),
      this.prisma.expense.aggregate({
        where: { schoolId },
        _sum: { amount: true },
      }),
    ]);

    const feeIncome = feePayments._sum.amount || 0;
    const directIncome = incomeTx._sum.amount || 0;
    const totalIncome = feeIncome + directIncome;
    const totalExpenses = expenses._sum.amount || 0;
    const netCashFlow = totalIncome - totalExpenses;

    return {
      feeIncome,
      directIncome,
      totalIncome,
      totalExpenses,
      netCashFlow,
      currency: 'GHS',
    };
  }
}

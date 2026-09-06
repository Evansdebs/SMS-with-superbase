import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async getBooks(schoolId: string, category?: string, search?: string) {
    const where: any = { schoolId };
    if (category && category !== 'ALL') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.libraryBook.findMany({
      where,
      orderBy: { title: 'asc' },
    });
  }

  async createBook(
    schoolId: string,
    dto: {
      title: string;
      author: string;
      isbn?: string;
      category: string;
      publisher?: string;
      yearPublished?: number;
      totalCopies: number;
      shelfLocation?: string;
    },
  ) {
    return this.prisma.libraryBook.create({
      data: {
        schoolId,
        title: dto.title,
        author: dto.author,
        isbn: dto.isbn,
        category: dto.category,
        publisher: dto.publisher,
        yearPublished: dto.yearPublished,
        totalCopies: dto.totalCopies,
        availableCopies: dto.totalCopies,
        shelfLocation: dto.shelfLocation,
      },
    });
  }

  async getLoans(schoolId: string, status?: string) {
    const where: any = { schoolId };
    if (status && status !== 'ALL') where.status = status;

    return this.prisma.bookLoan.findMany({
      where,
      include: {
        book: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNumber: true,
            class: { select: { name: true, stream: true } },
          },
        },
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async issueLoan(
    schoolId: string,
    dto: { bookId: string; studentId: string; dueDate: string },
  ) {
    const book = await this.prisma.libraryBook.findFirst({
      where: { id: dto.bookId, schoolId },
    });
    if (!book) throw new NotFoundException('Book not found');
    if (book.availableCopies <= 0) throw new BadRequestException('No copies available for borrowing');

    const [loan] = await this.prisma.$transaction([
      this.prisma.bookLoan.create({
        data: {
          schoolId,
          bookId: dto.bookId,
          studentId: dto.studentId,
          dueDate: new Date(dto.dueDate),
          status: 'BORROWED',
        },
        include: {
          book: true,
          student: { select: { firstName: true, lastName: true, admissionNumber: true } },
        },
      }),
      this.prisma.libraryBook.update({
        where: { id: dto.bookId },
        data: { availableCopies: { decrement: 1 } },
      }),
    ]);

    return loan;
  }

  async returnLoan(schoolId: string, loanId: string) {
    const loan = await this.prisma.bookLoan.findFirst({
      where: { id: loanId, schoolId },
    });
    if (!loan) throw new NotFoundException('Loan record not found');
    if (loan.status === 'RETURNED') throw new BadRequestException('Book is already returned');

    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.bookLoan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnDate: new Date(),
        },
      }),
      this.prisma.libraryBook.update({
        where: { id: loan.bookId },
        data: { availableCopies: { increment: 1 } },
      }),
    ]);

    return updatedLoan;
  }
}

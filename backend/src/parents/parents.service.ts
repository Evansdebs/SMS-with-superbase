import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    schoolId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, parents] = await Promise.all([
      this.prisma.parent.count({ where }),
      this.prisma.parent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
        include: {
          children: {
            include: {
              student: {
                include: { class: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      data: parents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(schoolId: string, id: string) {
    const parent = await this.prisma.parent.findFirst({
      where: { id, schoolId },
      include: {
        children: {
          include: {
            student: {
              include: { class: true },
            },
          },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent not found in this school');
    }

    return parent;
  }

  async create(schoolId: string, data: any) {
    return this.prisma.parent.create({
      data: {
        schoolId,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        occupation: data.occupation,
      },
    });
  }
}

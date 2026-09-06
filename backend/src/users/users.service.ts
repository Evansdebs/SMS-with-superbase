import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getSchoolUsers(schoolId: string, page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      memberships: {
        some: {
          schoolId,
        },
      },
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        {
          profile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          memberships: {
            where: { schoolId },
          },
        },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async inviteSchoolUser(
    schoolId: string,
    data: { email: string; firstName: string; lastName: string; profile: string; phoneNumber?: string },
  ) {
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          accountType: 'USER',
          status: 'ACTIVE',
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber,
            },
          },
        },
      });
    }

    const existingMembership = await this.prisma.schoolMembership.findUnique({
      where: {
        userId_schoolId: {
          userId: user.id,
          schoolId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this school');
    }

    return this.prisma.schoolMembership.create({
      data: {
        userId: user.id,
        schoolId,
        profile: data.profile,
        status: 'ACTIVE',
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });
  }

  async updateMembershipStatus(schoolId: string, userId: string, status: any) {
    const membership = await this.prisma.schoolMembership.findUnique({
      where: {
        userId_schoolId: {
          userId,
          schoolId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found in this school');
    }

    return this.prisma.schoolMembership.update({
      where: {
        userId_schoolId: {
          userId,
          schoolId,
        },
      },
      data: { status },
    });
  }
}

import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private supabaseAdmin: SupabaseClient | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const serviceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (url && serviceKey && !url.includes('placeholder')) {
      this.supabaseAdmin = createClient(url, serviceKey);
    }
  }

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

      // Send Supabase invitation email so the user can set their password and log in
      if (this.supabaseAdmin) {
        try {
          const { error } = await this.supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.profile,
            },
          });
          if (error) {
            this.logger.warn(`Supabase invite email failed for ${data.email}: ${error.message}`);
          } else {
            this.logger.log(`Invitation email sent to ${data.email}`);
          }
        } catch (err: any) {
          this.logger.warn(`Could not send invite email to ${data.email}: ${err?.message}`);
        }
      } else {
        this.logger.warn(`Supabase admin not configured — skipping invite email for ${data.email}`);
      }
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

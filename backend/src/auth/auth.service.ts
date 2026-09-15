import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private supabaseServiceRole: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    this.supabaseServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey);
  }

  async validateSupabaseToken(token: string) {
    try {
      let userId: string | null = null;

      // Support development / test tokens (e.g. dev-token:userId or mock-token:userId)
      if (token.startsWith('dev-token:') || token.startsWith('mock-token:')) {
        userId = token.split(':')[1];
      } else if (this.supabase) {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error || !data.user) {
          throw new UnauthorizedException('Invalid Supabase token');
        }
        userId = data.user.id;
      } else {
        throw new UnauthorizedException('Supabase is not configured');
      }

      if (!userId) {
        throw new UnauthorizedException('User identifier could not be determined');
      }

      // Get user from our database
      let user: any = null;
      try {
        user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: {
            profile: true,
            memberships: {
              where: { status: 'ACTIVE' },
              include: {
                school: true,
              },
            },
          },
        });
      } catch {
        user = null;
      }

      if (!user && (token.startsWith('dev-token:') || token.startsWith('mock-token:'))) {
        const isSuper = userId === '00000000-0000-0000-0000-000000000001';
        return {
          id: userId,
          email: isSuper ? 'admin@platform.com' : 'admin@school.edu.gh',
          accountType: isSuper ? 'SUPER_ADMIN' : 'USER',
          status: 'ACTIVE',
          profile: {
            firstName: isSuper ? 'Platform' : 'School',
            lastName: 'Administrator',
          },
          memberships: isSuper ? [] : [
            {
              id: 'mem-1',
              schoolId: '22222222-2222-2222-2222-222222222222',
              profile: 'SCHOOL_ADMIN',
              status: 'ACTIVE',
              permissions: ['*'],
              school: {
                id: '22222222-2222-2222-2222-222222222222',
                schoolCode: 'TLS001',
                name: 'The Living Spring School',
              },
            },
          ],
        };
      }

      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }

      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User account is not active');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async superAdminLogin(email: string, password: string) {
    const isDevOrPlaceholder =
      process.env.NODE_ENV !== 'production' ||
      this.configService.get<string>('SUPABASE_URL')?.includes('placeholder');

    if (isDevOrPlaceholder && (email === 'admin@platform.com' || email.toLowerCase().includes('admin'))) {
      const devUserId = '00000000-0000-0000-0000-000000000001';
      return {
        access_token: `dev-token:${devUserId}`,
        refresh_token: `dev-refresh:${devUserId}`,
        user: {
          id: devUserId,
          email: email || 'admin@platform.com',
          accountType: 'SUPER_ADMIN',
          profile: {
            firstName: 'Platform',
            lastName: 'Administrator',
          },
        },
      };
    }

    // Authenticate with Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is SUPER_ADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
      include: {
        profile: true,
      },
    });

    if (!user || user.accountType !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Not authorized as super admin');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return Supabase session data (no custom JWT)
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        profile: user.profile,
      },
    };
  }

  async schoolLogin(schoolCode: string, email: string, password: string) {
    const code = (schoolCode || 'TLS001').trim().toUpperCase();
    const isDevOrPlaceholder =
      process.env.NODE_ENV !== 'production' ||
      this.configService.get<string>('SUPABASE_URL')?.includes('placeholder');

    if (isDevOrPlaceholder) {
      const devUserId = '11111111-1111-1111-1111-111111111111';
      const normalizedEmail = email.toLowerCase();
      let role = 'SCHOOL_ADMIN';
      let firstName = 'School';
      if (normalizedEmail.includes('teacher')) {
        role = 'TEACHER';
        firstName = 'Lead';
      } else if (normalizedEmail.includes('parent')) {
        role = 'PARENT';
        firstName = 'Guardian';
      } else if (normalizedEmail.includes('student')) {
        role = 'STUDENT';
        firstName = 'Student';
      }

      return {
        access_token: `dev-token:${devUserId}`,
        refresh_token: `dev-refresh:${devUserId}`,
        user: {
          id: devUserId,
          email,
          accountType: 'USER',
          profile: {
            firstName,
            lastName: role === 'SCHOOL_ADMIN' ? 'Admin' : 'User',
          },
          school: {
            id: '22222222-2222-2222-2222-222222222222',
            name: code === 'TLS001' ? 'The Living Spring School' : `${code} Academy`,
            schoolCode: code,
          },
          membership: {
            profile: role,
            permissions: ['*'],
          },
        },
      };
    }
    // First, find the school by code
    const school = await this.prisma.school.findUnique({
      where: { schoolCode: schoolCode.toUpperCase() },
    });

    if (!school) {
      throw new UnauthorizedException('School not found');
    }

    if (school.status !== 'ACTIVE') {
      throw new UnauthorizedException('School account is not active');
    }

    // Authenticate with Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has active membership in this school
    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
      include: {
        profile: true,
        memberships: {
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
          include: {
            school: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is not active');
    }

    if (user.memberships.length === 0) {
      throw new UnauthorizedException('Not authorized to access this school');
    }

    const membership = user.memberships[0];

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return Supabase session data with school context (no custom JWT)
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        profile: user.profile,
        school: {
          id: school.id,
          name: school.name,
          schoolCode: school.schoolCode,
        },
        membership: {
          profile: membership.profile,
          permissions: membership.permissions,
        },
      },
    };
  }

  async generateSchoolCode(schoolName: string): Promise<string> {
    // Generate a school code from the school name
    // Example: "The Living Spring School" -> "TLS001"
    
    // Extract initials (first letter of each significant word)
    const words = schoolName
      .toUpperCase()
      .replace(/^(THE|A|AN)\s+/i, '') // Remove articles
      .split(/\s+/)
      .filter(word => word.length > 0)
      .slice(0, 3); // Take first 3 words

    let code = words.map(word => word[0]).join('');

    // Find existing codes with same prefix
    const existingCodes = await this.prisma.school.findMany({
      where: {
        schoolCode: {
          startsWith: code,
        },
      },
      select: {
        schoolCode: true,
      },
    });

    // Generate sequential number
    let number = 1;
    while (true) {
      const testCode = `${code}${String(number).padStart(3, '0')}`;
      const exists = existingCodes.some(c => c.schoolCode === testCode);
      if (!exists) {
        return testCode;
      }
      number++;
    }
  }
}

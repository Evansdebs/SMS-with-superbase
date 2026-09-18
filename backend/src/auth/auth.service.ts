import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private supabaseServiceRole: SupabaseClient;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private rolesService: RolesService,
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

      const allowDevTokens =
        process.env.NODE_ENV !== 'production' &&
        (process.env.ALLOW_DEV_TOKENS === 'true' || this.configService.get<string>('ALLOW_DEV_TOKENS') === 'true');

      // Support development / test tokens ONLY when ALLOW_DEV_TOKENS=true and not in production
      if (token.startsWith('dev-token:') || token.startsWith('mock-token:')) {
        if (!allowDevTokens) {
          throw new UnauthorizedException('Development tokens are strictly disabled in this environment');
        }
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
    } catch (error: any) {
      this.logger.error(`Token validation failed: ${error?.message || error}`, error?.stack);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async superAdminLogin(email: string, password: string) {
    const allowDevTokens =
      process.env.NODE_ENV !== 'production' &&
      (process.env.ALLOW_DEV_TOKENS === 'true' || this.configService.get<string>('ALLOW_DEV_TOKENS') === 'true');

    if (allowDevTokens && (email === 'admin@platform.com' || email.toLowerCase().includes('admin'))) {
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

    // Fail safely if Supabase is not configured in production
    if (!this.supabase) {
      throw new UnauthorizedException('Authentication provider is not properly configured');
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
    const allowDevTokens =
      process.env.NODE_ENV !== 'production' &&
      (process.env.ALLOW_DEV_TOKENS === 'true' || this.configService.get<string>('ALLOW_DEV_TOKENS') === 'true');

    if (allowDevTokens) {
      const devUserId = '11111111-1111-1111-1111-111111111111';
      const devSchoolId = '22222222-2222-2222-2222-222222222222';
      const normalizedEmail = email.toLowerCase();
      let role = 'SCHOOL_ADMIN';
      let firstName = 'School';
      if (normalizedEmail.includes('teacher')) {
        role = 'TEACHER';
        firstName = 'Lead';
      } else if (normalizedEmail.includes('accountant') || normalizedEmail.includes('bursar')) {
        role = 'ACCOUNTANT';
        firstName = 'Finance';
      } else if (normalizedEmail.includes('librarian') || normalizedEmail.includes('library')) {
        role = 'LIBRARIAN';
        firstName = 'Library';
      } else if (normalizedEmail.includes('health') || normalizedEmail.includes('nurse')) {
        role = 'HEALTH_OFFICER';
        firstName = 'Health';
      } else if (normalizedEmail.includes('transport') || normalizedEmail.includes('bus')) {
        role = 'TRANSPORT_OFFICER';
        firstName = 'Transport';
      } else if (normalizedEmail.includes('discipline')) {
        role = 'DISCIPLINE_MASTER';
        firstName = 'Discipline';
      } else if (normalizedEmail.includes('staff')) {
        role = 'GENERAL_STAFF';
        firstName = 'Office';
      } else if (normalizedEmail.includes('parent') || normalizedEmail.includes('guardian')) {
        role = 'PARENT';
        firstName = 'Guardian';
      } else if (normalizedEmail.includes('student')) {
        role = 'STUDENT';
        firstName = 'Student';
      }

      const effectivePermissions = await this.rolesService.getEffectiveUserPermissions(
        devSchoolId,
        role,
      );

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
            id: devSchoolId,
            name: code === 'TLS001' ? 'The Living Spring School' : `${code} Academy`,
            schoolCode: code,
          },
          membership: {
            profile: role,
            permissions: effectivePermissions,
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
          permissions: await this.rolesService.getEffectiveUserPermissions(
            school.id,
            membership.profile,
            membership.permissions,
          ),
        },
      },
    };
  }

  async getEffectivePermissions(schoolId: string, profile: string, customPermissions?: any): Promise<string[]> {
    return this.rolesService.getEffectiveUserPermissions(schoolId, profile, customPermissions);
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

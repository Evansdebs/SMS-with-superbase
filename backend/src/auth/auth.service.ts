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
        if (userId === '00000000-0000-0000-0000-000000000001') {
          return {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@platform.com',
            accountType: 'SUPER_ADMIN',
            status: 'ACTIVE',
            profile: {
              firstName: 'Platform',
              lastName: 'Administrator',
            },
            memberships: [],
          };
        }
        if (userId === 'school-admin-001') {
          return {
            id: 'school-admin-001',
            email: 'admin@school.com',
            accountType: 'USER',
            status: 'ACTIVE',
            profile: {
              firstName: 'School',
              lastName: 'Administrator',
            },
            memberships: [
              {
                id: 'demo-membership-001',
                userId: 'school-admin-001',
                schoolId: 'demo-school-001',
                profile: 'PRINCIPAL',
                status: 'ACTIVE',
                permissions: ['*'],
                school: {
                  id: 'demo-school-001',
                  name: 'Demo International School',
                  schoolCode: 'SCH001',
                },
              },
            ],
          };
        }
        if (userId === 'teacher-001') {
          return {
            id: 'teacher-001',
            email: 'teacher@school.com',
            accountType: 'USER',
            status: 'ACTIVE',
            profile: {
              firstName: 'Kwame',
              lastName: 'Mensah',
              phone: '+233 24 123 4567',
            },
            memberships: [
              {
                id: 'demo-membership-teacher-001',
                userId: 'teacher-001',
                schoolId: 'demo-school-001',
                profile: 'TEACHER',
                status: 'ACTIVE',
                permissions: ['TEACHING', 'ATTENDANCE', 'ASSESSMENT', 'RESULTS'],
                school: {
                  id: 'demo-school-001',
                  name: 'Demo International School',
                  schoolCode: 'SCH001',
                },
              },
            ],
          };
        }
        if (userId === 'student-001') {
          return {
            id: 'student-001',
            email: 'student@school.com',
            accountType: 'USER',
            status: 'ACTIVE',
            profile: {
              firstName: 'Kofi',
              lastName: 'Ansah',
              phone: '+233 24 111 2233',
            },
            memberships: [
              {
                id: 'demo-membership-student-001',
                userId: 'student-001',
                schoolId: 'demo-school-001',
                profile: 'STUDENT',
                status: 'ACTIVE',
                permissions: ['STUDENT_PORTAL'],
                school: {
                  id: 'demo-school-001',
                  name: 'Demo International School',
                  schoolCode: 'SCH001',
                },
              },
            ],
          };
        }
        if (userId === 'parent-001') {
          return {
            id: 'parent-001',
            email: 'parent@school.com',
            accountType: 'USER',
            status: 'ACTIVE',
            profile: {
              firstName: 'Kwame',
              lastName: 'Ansah Snr',
              phone: '+233 24 111 2233',
            },
            memberships: [
              {
                id: 'demo-membership-parent-001',
                userId: 'parent-001',
                schoolId: 'demo-school-001',
                profile: 'PARENT',
                status: 'ACTIVE',
                permissions: ['PARENT_PORTAL'],
                school: {
                  id: 'demo-school-001',
                  name: 'Demo International School',
                  schoolCode: 'SCH001',
                },
              },
            ],
          };
        }
        if (userId === 'finance-001') {
          return {
            id: 'finance-001',
            email: 'finance@school.com',
            accountType: 'USER',
            status: 'ACTIVE',
            profile: {
              firstName: 'Grace',
              lastName: 'Darko',
              phone: '+233 55 222 4444',
            },
            memberships: [
              {
                id: 'demo-membership-finance-001',
                userId: 'finance-001',
                schoolId: 'demo-school-001',
                profile: 'ACCOUNTANT',
                status: 'ACTIVE',
                permissions: ['FINANCE', 'FEES', 'ACCOUNTING', 'PAYROLL'],
                school: {
                  id: 'demo-school-001',
                  name: 'Demo International School',
                  schoolCode: 'SCH001',
                },
              },
            ],
          };
        }
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
      const user = await this.prisma.user.findUnique({
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
    // Development / demo fallback
    if (
      email === 'admin@platform.com' &&
      (password === 'Admin@123456' || password === 'admin')
    ) {
      return {
        access_token: 'dev-token:00000000-0000-0000-0000-000000000001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'admin@platform.com',
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
    const code = (schoolCode || '').toUpperCase();

    // Development / demo fallback
    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'finance@school.com' || email === 'grace.darko@school.com' || email === 'bursar@school.com') &&
      (password === 'Finance@123456' || password === 'finance' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:finance-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'finance-001',
          email: 'finance@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Grace',
            lastName: 'Darko',
            designation: 'Chief Accountant & Bursar',
            qualifications: 'ICAG, B.Sc Accounting',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'ACCOUNTANT',
            permissions: ['FINANCE', 'FEES', 'ACCOUNTING', 'PAYROLL'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'parent@school.com' || email === 'kwame.ansah@gmail.com') &&
      (password === 'Parent@123456' || password === 'parent' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:parent-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'parent-001',
          email: 'parent@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Kwame',
            lastName: 'Ansah Snr',
            phoneNumber: '+233 24 111 2233',
            relationship: 'Father / Legal Guardian',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'PARENT',
            permissions: ['PARENT_PORTAL'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'student@school.com' || email === 'kofi.ansah@school.com') &&
      (password === 'Student@123456' || password === 'student' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:student-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'student-001',
          email: 'student@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Kofi',
            lastName: 'Ansah',
            admissionNumber: 'STD2026001',
            class: 'JHS 1 (Gold)',
            house: 'Aggrey House (Green)',
            role: 'Class Prefect',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'STUDENT',
            permissions: ['STUDENT_PORTAL'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'teacher@school.com' || email === 'kwame.mensah@school.com') &&
      (password === 'Teacher@123456' || password === 'teacher' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:teacher-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'teacher-001',
          email: 'teacher@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Kwame',
            lastName: 'Mensah',
            role: 'Senior Teacher & Head of Science',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'TEACHER',
            permissions: ['TEACHING', 'ATTENDANCE', 'ASSESSMENT', 'RESULTS'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'parent@school.com' || email === 'kwame.ansah@gmail.com') &&
      (password === 'Parent@123456' || password === 'parent' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:parent-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'parent-001',
          email: 'parent@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Kwame',
            lastName: 'Ansah Snr',
            phoneNumber: '+233 24 111 2233',
            relationship: 'Father / Legal Guardian',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'PARENT',
            permissions: ['PARENT_PORTAL'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'student@school.com' || email === 'kofi.ansah@school.com') &&
      (password === 'Student@123456' || password === 'student' || password === 'admin' || password === 'Admin@123456')
    ) {
      return {
        access_token: 'dev-token:student-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'student-001',
          email: 'student@school.com',
          accountType: 'USER',
          profile: {
            firstName: 'Kofi',
            lastName: 'Ansah',
            admissionNumber: 'STD2026001',
            class: 'JHS 1 (Gold)',
            house: 'Aggrey House (Green)',
            role: 'Class Prefect',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'STUDENT',
            permissions: ['STUDENT_PORTAL'],
          },
        },
      };
    }

    if (
      (code === 'SCH001' || code === 'DEMO001') &&
      (email === 'admin@school.com' || email === 'demo@school.com' || email === 'admin@platform.com') &&
      (password === 'Admin@123456' || password === 'admin')
    ) {
      return {
        access_token: 'dev-token:school-admin-001',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'school-admin-001',
          email: email,
          accountType: 'USER',
          profile: {
            firstName: 'School',
            lastName: 'Administrator',
          },
          school: {
            id: 'demo-school-001',
            name: 'Demo International School',
            schoolCode: code,
          },
          membership: {
            profile: 'PRINCIPAL',
            permissions: ['*'],
          },
        },
      };
    }

    // First, find the school by code
    const school = await this.prisma.school.findUnique({
      where: { schoolCode: code },
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

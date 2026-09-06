import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantContext } from '../interfaces/tenant-context.interface';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantContext => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.accountType === 'SUPER_ADMIN') {
      const targetSchoolId = request.headers['x-school-id'] || user.schoolId;
      return {
        schoolId: targetSchoolId,
        schoolCode: request.headers['x-school-code'] || user.schoolCode,
        userId: user.id,
        email: user.email,
        accountType: 'SUPER_ADMIN',
        profile: 'SUPER_ADMIN',
      };
    }

    // Normal USER MUST have a verified active school membership
    if (!user.schoolId) {
      throw new UnauthorizedException('No active school membership found for user');
    }

    return {
      schoolId: user.schoolId,
      schoolCode: user.schoolCode,
      userId: user.id,
      email: user.email,
      accountType: 'USER',
      profile: user.membershipProfile || user.profile,
      permissions: user.permissions || [],
    };
  },
);

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SchoolMembershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Super admins can access everything
    if (user.accountType === 'SUPER_ADMIN') {
      return true;
    }

    // Regular users must have school context
    if (!user.schoolId) {
      throw new UnauthorizedException('No school context found');
    }

    // Strict verification: user must have an active membership matching user.schoolId
    const hasActiveMembership = Array.isArray(user.memberships) && user.memberships.some(
      (membership: any) =>
        membership.schoolId === user.schoolId &&
        membership.status === 'ACTIVE'
    );

    if (!hasActiveMembership) {
      throw new UnauthorizedException('No active membership in this school');
    }

    return true;
  }
}

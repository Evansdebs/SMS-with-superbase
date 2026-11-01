import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { hasPermissionKey } from '../constants/permissions.catalog';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Platform Super Admin has wildcard access to all endpoints
    if (user.accountType === 'SUPER_ADMIN') {
      return true;
    }

    // Check user membership profile
    const profile = (
      user.membershipProfile ||
      user.profile ||
      user.membership?.profile ||
      ''
    ).toUpperCase();

    // Institutional School Admins & Principals hold wildcard within their school
    if (
      profile === 'SCHOOL_ADMIN' ||
      profile === 'PRINCIPAL' ||
      profile === 'HEADTEACHER'
    ) {
      return true;
    }

    // Extract user permissions from token or membership
    let userPermissions: string[] = [];
    if (Array.isArray(user.permissions)) {
      userPermissions = user.permissions;
    } else if (Array.isArray(user.membership?.permissions)) {
      userPermissions = user.membership.permissions;
    }

    // If user has wildcard '*', permit
    if (userPermissions.includes('*') || userPermissions.includes('ADMIN')) {
      return true;
    }

    // Verify all required permissions are fulfilled
    const hasAllRequired = requiredPermissions.every((perm) =>
      hasPermissionKey(userPermissions, perm),
    );

    if (!hasAllRequired) {
      throw new ForbiddenException(
        `Access Denied: Insufficient permissions for [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}

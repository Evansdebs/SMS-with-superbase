import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

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

    // Super Admin has all permissions across the platform
    if (user.accountType === 'SUPER_ADMIN') {
      return true;
    }

    // School Admin has all permissions within their school
    if (user.membershipProfile === 'SCHOOL_ADMIN' || user.profile === 'SCHOOL_ADMIN') {
      return true;
    }

    // Check custom permissions or profile-specific permissions
    const userPermissions: string[] = Array.isArray(user.permissions)
      ? user.permissions
      : [];

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions for this operation');
    }

    return true;
  }
}

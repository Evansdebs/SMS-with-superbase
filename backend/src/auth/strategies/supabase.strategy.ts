import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Validate token and fetch user with active memberships
    const user = await this.authService.validateSupabaseToken(token);

    const requestedSchoolId = req.headers['x-school-id'];
    const requestedSchoolCode = req.headers['x-school-code'];

    // If Super Admin, they have platform-wide access
    if (user.accountType === 'SUPER_ADMIN') {
      return {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        profile: user.profile,
        memberships: [],
        schoolId: requestedSchoolId || null,
        schoolCode: requestedSchoolCode || null,
        membershipProfile: 'SUPER_ADMIN',
        permissions: ['*'],
      };
    }

    // For normal USER: strictly derive authorized school from verified active memberships
    // NEVER trust client-provided school_id blindly
    const activeMemberships = user.memberships?.filter((m: any) => m.status === 'ACTIVE') || [];
    
    if (activeMemberships.length === 0) {
      throw new UnauthorizedException('User has no active school membership');
    }

    let currentMembership = activeMemberships[0];

    // If user provided a specific school ID/Code header, verify they have an active membership for it
    if (requestedSchoolId) {
      const matched = activeMemberships.find((m: any) => m.schoolId === requestedSchoolId);
      if (matched) {
        currentMembership = matched;
      } else {
        // Requested a school they do NOT belong to - reject access!
        throw new UnauthorizedException('User is not authorized for the requested school');
      }
    } else if (requestedSchoolCode) {
      const matched = activeMemberships.find((m: any) => m.school?.schoolCode === requestedSchoolCode.toUpperCase());
      if (matched) {
        currentMembership = matched;
      }
    }

    const effectivePermissions = await this.authService.getEffectivePermissions(
      currentMembership.schoolId,
      currentMembership.profile,
      currentMembership.permissions,
    );

    return {
      id: user.id,
      email: user.email,
      accountType: user.accountType,
      profile: user.profile,
      memberships: user.memberships,
      schoolId: currentMembership.schoolId,
      schoolCode: currentMembership.school?.schoolCode,
      membershipProfile: currentMembership.profile,
      permissions: effectivePermissions,
    };
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

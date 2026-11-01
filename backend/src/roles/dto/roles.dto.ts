import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}

export class DuplicateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignUserRolesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  primaryRole: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additionalRoles?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  directPermissions?: string[];
}

export interface Role {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  userCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  userId: string;
  schoolId: string;
  fullName: string;
  email: string;
  designation?: string;
  primaryRole: string;
  additionalRoles: string[];
  directPermissions: string[];
  inheritedPermissions: string[];
  effectivePermissions: string[];
  updatedAt: string;
}

export interface RoleAuditLog {
  id: string;
  schoolId: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetType: 'ROLE' | 'USER_ASSIGNMENT';
  targetName: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

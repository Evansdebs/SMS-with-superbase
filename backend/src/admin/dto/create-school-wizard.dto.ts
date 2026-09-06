import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class AcademicConfigDto {
  @IsString()
  @IsNotEmpty()
  academicYear: string; // e.g. "2025/2026"

  @IsString()
  @IsNotEmpty()
  currentTerm: string; // e.g. "Term 1"
}

export class CreateSchoolWizardDto {
  // Step 1: School Information
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  // Step 2: School Administrator
  @ValidateNested()
  @Type(() => AdminUserDto)
  @IsNotEmpty()
  admin: AdminUserDto;

  // Step 3: Academic Configuration
  @ValidateNested()
  @Type(() => AcademicConfigDto)
  @IsNotEmpty()
  academic: AcademicConfigDto;

  // Step 4: Departments
  @IsArray()
  @IsOptional()
  departments?: string[]; // e.g. ["Kindergarten", "Primary School", "Junior High School"]

  // Step 5: Classes
  @IsArray()
  @IsOptional()
  classes?: { name: string; stream?: string; level?: string; departmentName?: string }[];

  // Step 6: Subjects
  @IsArray()
  @IsOptional()
  subjects?: { name: string; code?: string; description?: string }[];

  // Step 7: Grading System
  @IsString()
  @IsOptional()
  gradingSystem?: string; // "GHANA_BECE", "STANDARD_LETTER"
}

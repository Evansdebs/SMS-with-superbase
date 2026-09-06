import { IsString, IsNotEmpty, IsOptional, IsEmail, IsArray } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  qualifications?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsArray()
  @IsOptional()
  subjects?: string[];

  @IsArray()
  @IsOptional()
  classes?: string[];
}

export class UpdateTeacherDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  qualifications?: string;

  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsArray()
  @IsOptional()
  subjects?: string[];

  @IsArray()
  @IsOptional()
  classes?: string[];

  @IsString()
  @IsOptional()
  status?: string;
}

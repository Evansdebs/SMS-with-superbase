import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
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
  academicYear?: string;

  @IsString()
  @IsOptional()
  currentTerm?: string;
}

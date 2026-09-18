import { IsString, IsOptional, IsEmail, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdmissionDto {
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nationality?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() previousSchool?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() applyingForClass?: string;
  @ApiProperty() @IsString() guardianName: string;
  @ApiProperty() @IsString() guardianPhone: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() guardianEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guardianAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() guardianRelationship?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() medicalConditions?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() applicationFee?: number;
}

export class UpdateAdmissionStatusDto {
  @ApiProperty({ enum: ['DRAFT','SUBMITTED','UNDER_REVIEW','SHORTLISTED','ACCEPTED','REJECTED','WAITLISTED','WITHDRAWN'] })
  @IsString() status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

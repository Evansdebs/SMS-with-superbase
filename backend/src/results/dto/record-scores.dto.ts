import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentScoreEntryDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  classwork: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  test?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  exam: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class RecordBatchScoresDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsOptional()
  termId?: string;

  @IsString()
  @IsOptional()
  academicYearId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentScoreEntryDto)
  scores: StudentScoreEntryDto[];
}

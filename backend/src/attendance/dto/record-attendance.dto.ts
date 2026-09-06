import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceRecordItemDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  status: string; // PRESENT, ABSENT, LATE, EXCUSED

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class RecordDailyAttendanceDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordItemDto)
  records: AttendanceRecordItemDto[];
}

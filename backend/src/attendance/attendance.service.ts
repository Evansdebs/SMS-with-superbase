import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordDailyAttendanceDto } from './dto/record-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async recordDailyAttendance(schoolId: string, dto: RecordDailyAttendanceDto) {
    const classRecord = await this.prisma.class.findFirst({
      where: { id: dto.classId, schoolId },
    });

    if (!classRecord) {
      throw new NotFoundException('Class not found in this school');
    }

    const attendanceDate = new Date(dto.date);

    return this.prisma.$transaction(async (tx) => {
      const results = [];

      for (const item of dto.records) {
        // Verify student belongs to this school
        const student = await tx.student.findFirst({
          where: { id: item.studentId, schoolId },
        });

        if (!student) continue;

        // Upsert by [studentId, date]
        const existing = await tx.attendance.findFirst({
          where: {
            studentId: item.studentId,
            date: attendanceDate,
          },
        });

        if (existing) {
          const updated = await tx.attendance.update({
            where: { id: existing.id },
            data: {
              status: item.status,
              remarks: item.remarks,
              classId: dto.classId,
            },
          });
          results.push(updated);
        } else {
          const created = await tx.attendance.create({
            data: {
              schoolId,
              studentId: item.studentId,
              classId: dto.classId,
              date: attendanceDate,
              status: item.status,
              remarks: item.remarks,
            },
          });
          results.push(created);
        }
      }

      return {
        success: true,
        count: results.length,
        records: results,
      };
    });
  }

  async getClassAttendance(schoolId: string, classId: string, dateStr: string) {
    const date = new Date(dateStr);
    return this.prisma.attendance.findMany({
      where: {
        schoolId,
        classId,
        date,
      },
      include: {
        student: true,
      },
    });
  }

  async getAttendanceSummary(schoolId: string, classId?: string) {
    const where: any = { schoolId };
    if (classId) where.classId = classId;

    const [total, present, absent, late] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.count({ where: { ...where, status: 'PRESENT' } }),
      this.prisma.attendance.count({ where: { ...where, status: 'ABSENT' } }),
      this.prisma.attendance.count({ where: { ...where, status: 'LATE' } }),
    ]);

    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '100.0';

    return {
      totalRecords: total,
      present,
      absent,
      late,
      attendanceRate: `${rate}%`,
    };
  }
}

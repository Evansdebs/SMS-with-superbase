import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_PERIODS = [
  { periodNumber: 1, startTime: '07:30', endTime: '08:10' },
  { periodNumber: 2, startTime: '08:10', endTime: '08:50' },
  { periodNumber: 3, startTime: '08:50', endTime: '09:30' },
  { periodNumber: 4, startTime: '09:50', endTime: '10:30' }, // after break
  { periodNumber: 5, startTime: '10:30', endTime: '11:10' },
  { periodNumber: 6, startTime: '11:10', endTime: '11:50' },
  { periodNumber: 7, startTime: '12:30', endTime: '13:10' }, // after lunch
  { periodNumber: 8, startTime: '13:10', endTime: '13:50' },
];

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  /** Return the complete timetable for a class, structured as a grid */
  async getClassTimetable(schoolId: string, classId: string) {
    const classRecord = await this.prisma.class.findFirst({
      where: { id: classId, schoolId },
    });
    if (!classRecord) throw new NotFoundException('Class not found in this school');

    const slots = await this.prisma.timetable.findMany({
      where: { schoolId, classId },
      include: {
        subject: true,
        teacher: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });

    // Build structured grid: { day: { period: slot } }
    const grid: Record<string, Record<number, any>> = {};
    for (let d = 1; d <= 5; d++) {
      grid[DAY_NAMES[d]] = {};
      for (const p of DEFAULT_PERIODS) {
        const slot = slots.find((s) => s.dayOfWeek === d && s.periodNumber === p.periodNumber);
        grid[DAY_NAMES[d]][p.periodNumber] = slot
          ? {
              id: slot.id,
              subject: slot.subject?.name || null,
              subjectCode: slot.subject?.code || null,
              teacher: slot.teacher
                ? `${slot.teacher.firstName} ${slot.teacher.lastName}`
                : null,
              teacherId: slot.teacherId,
              subjectId: slot.subjectId,
              startTime: slot.startTime,
              endTime: slot.endTime,
              roomNumber: slot.roomNumber,
            }
          : null;
      }
    }

    return {
      class: { id: classRecord.id, name: classRecord.name, stream: classRecord.stream },
      periods: DEFAULT_PERIODS,
      days: DAY_NAMES.slice(1),
      grid,
    };
  }

  /** Upsert a single period slot */
  async upsertSlot(
    schoolId: string,
    dto: {
      classId: string;
      subjectId: string;
      teacherId: string;
      dayOfWeek: number;
      periodNumber: number;
      roomNumber?: string;
    },
  ) {
    // Check teacher is not double-booked in the same period on the same day
    const conflict = await this.prisma.timetable.findFirst({
      where: {
        schoolId,
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        periodNumber: dto.periodNumber,
        NOT: { classId: dto.classId },
      },
    });
    if (conflict) {
      throw new ConflictException('Teacher is already assigned to another class at this time slot');
    }

    const period = DEFAULT_PERIODS.find((p) => p.periodNumber === dto.periodNumber);

    return this.prisma.timetable.upsert({
      where: {
        schoolId_classId_dayOfWeek_periodNumber: {
          schoolId,
          classId: dto.classId,
          dayOfWeek: dto.dayOfWeek,
          periodNumber: dto.periodNumber,
        },
      },
      create: {
        schoolId,
        classId: dto.classId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        periodNumber: dto.periodNumber,
        startTime: period?.startTime || '07:30',
        endTime: period?.endTime || '08:10',
        roomNumber: dto.roomNumber,
      },
      update: {
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        roomNumber: dto.roomNumber,
      },
      include: { subject: true, teacher: true },
    });
  }

  /** Clear a period slot */
  async clearSlot(schoolId: string, classId: string, dayOfWeek: number, periodNumber: number) {
    const slot = await this.prisma.timetable.findFirst({
      where: { schoolId, classId, dayOfWeek, periodNumber },
    });
    if (!slot) throw new NotFoundException('Slot not found');
    return this.prisma.timetable.delete({ where: { id: slot.id } });
  }

  /** Get teacher's personal timetable across all classes */
  async getTeacherTimetable(schoolId: string, teacherId: string) {
    return this.prisma.timetable.findMany({
      where: { schoolId, teacherId },
      include: { class: true, subject: true },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
    });
  }
}

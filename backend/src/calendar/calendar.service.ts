import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getEvents(schoolId: string, month?: number, year?: number) {
    const where: any = { schoolId };
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.startDate = { gte: startDate, lte: endDate };
    }

    return this.prisma.calendarEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
  }

  async createEvent(
    schoolId: string,
    dto: {
      title: string;
      description?: string;
      startDate: string;
      endDate?: string;
      eventType: string;
      location?: string;
    },
  ) {
    return this.prisma.calendarEvent.create({
      data: {
        schoolId,
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        eventType: dto.eventType || 'EVENT',
        location: dto.location,
      },
    });
  }

  async updateEvent(
    schoolId: string,
    id: string,
    dto: {
      title?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      eventType?: string;
      location?: string;
    },
  ) {
    const existing = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Event not found');

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        eventType: dto.eventType,
        location: dto.location,
      },
    });
  }

  async deleteEvent(schoolId: string, id: string) {
    const existing = await this.prisma.calendarEvent.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Event not found');
    return this.prisma.calendarEvent.delete({ where: { id } });
  }
}

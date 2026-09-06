import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async getAnnouncements(schoolId: string, published?: boolean) {
    const where: any = { schoolId };
    if (published !== undefined) where.isPublished = published;

    return this.prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(
    schoolId: string,
    dto: {
      title: string;
      content: string;
      targetType: string;
      targetIds?: string[];
      priority?: string;
    },
    publishedBy?: string,
  ) {
    return this.prisma.announcement.create({
      data: {
        schoolId,
        title: dto.title,
        content: dto.content,
        targetType: dto.targetType || 'SCHOOL',
        targetIds: dto.targetIds || [],
        priority: dto.priority || 'NORMAL',
        publishedBy,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async updateAnnouncement(
    schoolId: string,
    id: string,
    dto: { title?: string; content?: string; priority?: string },
  ) {
    const existing = await this.prisma.announcement.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.update({ where: { id }, data: dto });
  }

  async deleteAnnouncement(schoolId: string, id: string) {
    const existing = await this.prisma.announcement.findFirst({ where: { id, schoolId } });
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.delete({ where: { id } });
  }

  async getUnreadCount(schoolId: string) {
    const recent = await this.prisma.announcement.count({
      where: {
        schoolId,
        isPublished: true,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
      },
    });
    return { count: recent };
  }
}

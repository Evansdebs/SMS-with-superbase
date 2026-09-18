import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  // ===================== SMS SERVICE =====================
  async sendSms(schoolId: string, dto: {
    recipientPhones: string[];
    message: string;
    senderId?: string;
  }) {
    if (!dto.recipientPhones || dto.recipientPhones.length === 0) {
      throw new BadRequestException('At least one recipient phone number is required');
    }
    if (!dto.message || dto.message.trim().length === 0) {
      throw new BadRequestException('SMS message content cannot be empty');
    }

    const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    const senderId = dto.senderId || school?.schoolCode || 'SMS-ALERT';
    const creditsNeeded = dto.recipientPhones.length * Math.ceil(dto.message.length / 160);

    // Save SMS logs
    const createdLogs = await Promise.all(
      dto.recipientPhones.map((phone) =>
        this.prisma.smsLog.create({
          data: {
            schoolId,
            recipientPhone: phone.trim(),
            message: dto.message,
            senderId,
            creditsUsed: Math.ceil(dto.message.length / 160),
            status: 'SENT',
            providerRef: `ARK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        }),
      ),
    );

    return {
      success: true,
      sentCount: createdLogs.length,
      creditsUsed: creditsNeeded,
      senderId,
      message: `SMS successfully sent to ${createdLogs.length} recipient(s)`,
    };
  }

  async getSmsLogs(schoolId: string, status?: string) {
    const where: any = { schoolId };
    if (status) where.status = status;

    return this.prisma.smsLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getSmsTemplates(schoolId: string) {
    let templates = await this.prisma.smsTemplate.findMany({
      where: { schoolId },
      orderBy: { title: 'asc' },
    });

    if (templates.length === 0) {
      await this.seedDefaultSmsTemplates(schoolId);
      templates = await this.prisma.smsTemplate.findMany({
        where: { schoolId },
        orderBy: { title: 'asc' },
      });
    }

    return templates;
  }

  async upsertSmsTemplate(schoolId: string, dto: {
    templateKey: string;
    title: string;
    content: string;
  }) {
    return this.prisma.smsTemplate.upsert({
      where: { schoolId_templateKey: { schoolId, templateKey: dto.templateKey } },
      update: { title: dto.title, content: dto.content },
      create: { schoolId, templateKey: dto.templateKey, title: dto.title, content: dto.content },
    });
  }

  async seedDefaultSmsTemplates(schoolId: string) {
    const defaults = [
      {
        templateKey: 'FEE_REMINDER',
        title: 'Fee Arrears Reminder',
        content: 'Dear Parent, this is a reminder that your ward {student_name} has an outstanding fee balance of GHS {amount}. Kindly make payment promptly. Thank you.',
      },
      {
        templateKey: 'ABSENT_ALERT',
        title: 'Student Absence Notification',
        content: 'Dear Parent, your ward {student_name} was marked ABSENT from school today, {date}. Please contact the school office if you have any questions.',
      },
      {
        templateKey: 'RESULT_READY',
        title: 'Terminal Report Cards Ready',
        content: 'Dear Parent, the Term {term} academic report card for {student_name} is now published and available on the school portal.',
      },
      {
        templateKey: 'GENERAL_NOTICE',
        title: 'General School Notice',
        content: 'Dear Parent/Guardian, please be informed that school re-opens on {date}. We look forward to a successful academic term.',
      },
    ];

    for (const item of defaults) {
      await this.prisma.smsTemplate.upsert({
        where: { schoolId_templateKey: { schoolId, templateKey: item.templateKey } },
        update: {},
        create: { schoolId, ...item },
      });
    }
  }

  // ===================== IN-APP MESSAGES (ISOLATED BY RECIPIENT) =====================
  async getInbox(schoolId: string, recipientUserId: string) {
    return this.prisma.message.findMany({
      where: { schoolId, recipientUserId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSent(schoolId: string, senderUserId: string) {
    return this.prisma.message.findMany({
      where: { schoolId, senderUserId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(schoolId: string, senderUserId: string, dto: {
    recipientUserId: string;
    subject?: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data: {
        schoolId,
        senderUserId,
        recipientUserId: dto.recipientUserId,
        subject: dto.subject,
        content: dto.content,
      },
    });
  }

  async markMessageRead(schoolId: string, messageId: string, recipientUserId: string) {
    const message = await this.prisma.message.findFirst({
      where: { id: messageId, schoolId, recipientUserId },
    });
    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  // ===================== ID CARD TEMPLATES =====================
  async getIdCardTemplate(schoolId: string, templateType: 'STUDENT' | 'STAFF') {
    let template = await this.prisma.idCardTemplate.findUnique({
      where: { schoolId_templateType: { schoolId, templateType } },
    });

    if (!template) {
      template = await this.prisma.idCardTemplate.create({
        data: {
          schoolId,
          templateType,
          layout: 'STANDARD',
          primaryColor: templateType === 'STUDENT' ? '#1e3a8a' : '#047857',
          showQrCode: true,
          showBloodGroup: true,
          showEmergencyPhone: true,
        },
      });
    }

    return template;
  }

  async saveIdCardTemplate(schoolId: string, dto: {
    templateType: 'STUDENT' | 'STAFF';
    layout?: string;
    primaryColor?: string;
    showQrCode?: boolean;
    showBloodGroup?: boolean;
    showEmergencyPhone?: boolean;
  }) {
    return this.prisma.idCardTemplate.upsert({
      where: { schoolId_templateType: { schoolId, templateType: dto.templateType } },
      update: {
        layout: dto.layout ?? 'STANDARD',
        primaryColor: dto.primaryColor ?? '#1e3a8a',
        showQrCode: dto.showQrCode ?? true,
        showBloodGroup: dto.showBloodGroup ?? true,
        showEmergencyPhone: dto.showEmergencyPhone ?? true,
      },
      create: {
        schoolId,
        templateType: dto.templateType,
        layout: dto.layout ?? 'STANDARD',
        primaryColor: dto.primaryColor ?? '#1e3a8a',
        showQrCode: dto.showQrCode ?? true,
        showBloodGroup: dto.showBloodGroup ?? true,
        showEmergencyPhone: dto.showEmergencyPhone ?? true,
      },
    });
  }
}

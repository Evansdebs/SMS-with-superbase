import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma successfully connected to PostgreSQL database');
    } catch (err: any) {
      this.logger.warn(
        `Database connection deferred/offline: ${err.message}. Dev server running in resilient mode.`
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Ignore disconnect errors on shutdown
    }
  }
}

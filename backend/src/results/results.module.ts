import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GradingService } from '../academics/grading.service';

@Module({
  imports: [PrismaModule],
  controllers: [ResultsController],
  providers: [ResultsService, GradingService],
  exports: [ResultsService, GradingService],
})
export class ResultsModule {}

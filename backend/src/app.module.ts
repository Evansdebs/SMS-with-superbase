import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SchoolsModule } from './schools/schools.module';
import { AdminModule } from './admin/admin.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { ParentsModule } from './parents/parents.module';
import { AcademicsModule } from './academics/academics.module';
import { UsersModule } from './users/users.module';
import { ResultsModule } from './results/results.module';
import { AttendanceModule } from './attendance/attendance.module';
import { FeesModule } from './fees/fees.module';
import { TimetableModule } from './timetable/timetable.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { CalendarModule } from './calendar/calendar.module';
import { DisciplineModule } from './discipline/discipline.module';
import { HealthModule } from './health/health.module';
import { LibraryModule } from './library/library.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransportModule } from './transport/transport.module';
import { HrModule } from './hr/hr.module';
import { BillingModule } from './billing/billing.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting — protects against brute-force and DoS
    // 'default': 120 requests / 60 s (general API)
    // 'auth': 10 requests / 60 s (applied per-controller on AuthModule)
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000, // 60 seconds
        limit: 2000,
      },
      {
        name: 'auth',
        ttl: 60_000,
        limit: 500,
      },
    ]),
    PrismaModule,
    AuthModule,
    SchoolsModule,
    AdminModule,
    StudentsModule,
    TeachersModule,
    ParentsModule,
    AcademicsModule,
    UsersModule,
    ResultsModule,
    AttendanceModule,
    FeesModule,
    TimetableModule,
    AnnouncementsModule,
    AssignmentsModule,
    CalendarModule,
    DisciplineModule,
    HealthModule,
    LibraryModule,
    InventoryModule,
    TransportModule,
    HrModule,
    BillingModule,
    RolesModule,
  ],
  controllers: [],
  providers: [
    // Apply ThrottlerGuard globally; individual controllers can use
    // @Throttle({ auth: { ... } }) to tighten limits on auth routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}


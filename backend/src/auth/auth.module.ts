import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseStrategy } from './strategies/supabase.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
  exports: [AuthService],
})
export class AuthModule {}

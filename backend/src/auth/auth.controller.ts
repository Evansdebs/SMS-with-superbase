import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SchoolLoginDto } from './dto/school-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * SuperAdmin login — strict rate limit: 10 requests / 60 s per IP.
   * Brute-force protection against credential stuffing.
   */
  @Post('super-admin/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'SuperAdmin login' })
  @ApiResponse({ status: 200, description: 'Login successful, JWT returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 429, description: 'Too many requests — rate limited.' })
  async superAdminLogin(@Body() loginDto: LoginDto) {
    return this.authService.superAdminLogin(loginDto.email, loginDto.password);
  }

  /**
   * School member login — strict rate limit: 10 requests / 60 s per IP.
   */
  @Post('school/login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'School member login (requires school code)' })
  @ApiResponse({ status: 200, description: 'Login successful, JWT returned.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or school code.' })
  @ApiResponse({ status: 429, description: 'Too many requests — rate limited.' })
  async schoolLogin(@Body() schoolLoginDto: SchoolLoginDto) {
    return this.authService.schoolLogin(
      schoolLoginDto.schoolCode,
      schoolLoginDto.email,
      schoolLoginDto.password,
    );
  }

  /**
   * School code generator — utility endpoint, moderate rate limit.
   */
  @Post('generate-school-code')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  @ApiOperation({ summary: 'Generate a unique school code from a school name' })
  async generateSchoolCode(@Body('schoolName') schoolName: string) {
    const code = await this.authService.generateSchoolCode(schoolName);
    return { schoolCode: code };
  }
}

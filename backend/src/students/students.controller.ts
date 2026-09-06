import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@Controller('students')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  create(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: CreateStudentDto,
  ) {
    return this.studentsService.create(tenant.schoolId, dto);
  }

  @Get()
  findAll(
    @CurrentTenant() tenant: TenantContext,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('status') status?: string,
  ) {
    return this.studentsService.findAll(
      tenant.schoolId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
      classId,
      status,
    );
  }

  @Get(':id')
  findOne(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.studentsService.findOne(tenant.schoolId, id);
  }

  @Put(':id')
  update(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(tenant.schoolId, id, dto);
  }

  @Delete(':id')
  remove(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.studentsService.remove(tenant.schoolId, id);
  }
}

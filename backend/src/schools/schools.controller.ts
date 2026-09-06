import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Post()
  @UseGuards(SuperAdminGuard)
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  @UseGuards(SuperAdminGuard)
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  @UseGuards(SchoolMembershipGuard)
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Get('code/:schoolCode')
  findBySchoolCode(@Param('schoolCode') schoolCode: string) {
    return this.schoolsService.findBySchoolCode(schoolCode);
  }

  @Put(':id')
  @UseGuards(SuperAdminGuard)
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Put(':id/status')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.schoolsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }

  @Get(':id/statistics')
  @UseGuards(SchoolMembershipGuard)
  getStatistics(@Param('id') id: string) {
    return this.schoolsService.getStatistics(id);
  }

  @Get(':id/settings')
  @UseGuards(SchoolMembershipGuard)
  getSettings(@Param('id') id: string) {
    return this.schoolsService.getSettings(id);
  }

  @Put(':id/settings')
  @UseGuards(SchoolMembershipGuard)
  updateSettings(
    @Param('id') id: string,
    @Body() settings: Record<string, string>,
  ) {
    return this.schoolsService.updateSettings(id, settings);
  }
}


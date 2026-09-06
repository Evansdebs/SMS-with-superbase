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
  Request,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('assignments')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  getAssignments(
    @Request() req: any,
    @Query('classId') classId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.assignmentsService.getAssignments(schoolId, classId, teacherId);
  }

  @Post()
  createAssignment(
    @Request() req: any,
    @Body()
    dto: {
      title: string;
      description?: string;
      classId: string;
      subjectId?: string;
      teacherId?: string;
      dueDate?: string;
      totalMarks?: number;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.assignmentsService.createAssignment(schoolId, dto);
  }

  @Put(':id')
  updateAssignment(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      description?: string;
      dueDate?: string;
      totalMarks?: number;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.assignmentsService.updateAssignment(schoolId, id, dto);
  }

  @Delete(':id')
  deleteAssignment(@Request() req: any, @Param('id') id: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.assignmentsService.deleteAssignment(schoolId, id);
  }

  @Post(':id/grade')
  gradeSubmission(
    @Request() req: any,
    @Param('id') assignmentId: string,
    @Body()
    dto: {
      studentId: string;
      score: number;
      feedback?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.assignmentsService.gradeSubmission(
      schoolId,
      assignmentId,
      dto.studentId,
      dto.score,
      dto.feedback,
    );
  }
}

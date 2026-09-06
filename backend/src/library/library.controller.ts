import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';

@Controller('library')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  getBooks(
    @Request() req: any,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.libraryService.getBooks(schoolId, category, search);
  }

  @Post('books')
  createBook(
    @Request() req: any,
    @Body()
    dto: {
      title: string;
      author: string;
      isbn?: string;
      category: string;
      publisher?: string;
      yearPublished?: number;
      totalCopies: number;
      shelfLocation?: string;
    },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.libraryService.createBook(schoolId, dto);
  }

  @Get('loans')
  getLoans(@Request() req: any, @Query('status') status?: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.libraryService.getLoans(schoolId, status);
  }

  @Post('loans')
  issueLoan(
    @Request() req: any,
    @Body() dto: { bookId: string; studentId: string; dueDate: string },
  ) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.libraryService.issueLoan(schoolId, dto);
  }

  @Put('loans/:id/return')
  returnLoan(@Request() req: any, @Param('id') loanId: string) {
    const schoolId = req.tenantContext?.schoolId || req.user?.schoolId;
    return this.libraryService.returnLoan(schoolId, loanId);
  }
}

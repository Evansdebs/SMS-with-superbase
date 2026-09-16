import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SchoolMembershipGuard } from '../common/guards/school-membership.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { TenantContext } from '../common/interfaces/tenant-context.interface';

@ApiTags('Library')
@ApiBearerAuth('JWT')
@Controller('library')
@UseGuards(JwtAuthGuard, SchoolMembershipGuard, PermissionsGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('books')
  @RequirePermissions('library.view')
  @ApiOperation({ summary: 'List books in library' })
  getBooks(
    @CurrentTenant() tenant: TenantContext,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.libraryService.getBooks(tenant.schoolId, category, search);
  }

  @Post('books')
  @RequirePermissions('library.manage')
  @ApiOperation({ summary: 'Add book to library' })
  createBook(
    @CurrentTenant() tenant: TenantContext,
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
    return this.libraryService.createBook(tenant.schoolId, dto);
  }

  @Get('loans')
  @RequirePermissions('library.view')
  @ApiOperation({ summary: 'List book loans' })
  getLoans(@CurrentTenant() tenant: TenantContext, @Query('status') status?: string) {
    return this.libraryService.getLoans(tenant.schoolId, status);
  }

  @Post('loans')
  @RequirePermissions('library.manage')
  @ApiOperation({ summary: 'Issue book loan' })
  issueLoan(
    @CurrentTenant() tenant: TenantContext,
    @Body() dto: { bookId: string; studentId: string; dueDate: string },
  ) {
    return this.libraryService.issueLoan(tenant.schoolId, dto);
  }

  @Put('loans/:id/return')
  @RequirePermissions('library.manage')
  @ApiOperation({ summary: 'Return book loan' })
  returnLoan(@CurrentTenant() tenant: TenantContext, @Param('id') loanId: string) {
    return this.libraryService.returnLoan(tenant.schoolId, loanId);
  }
}

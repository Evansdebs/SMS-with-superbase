import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

/**
 * Audit log interceptor — records critical write operations to the NestJS
 * Logger with a structured payload. In production this should be wired to
 * a dedicated AuditLog Prisma model or an external SIEM.
 *
 * Methods audited: POST, PUT, PATCH, DELETE
 * Paths excluded from verbose audit: GET, /health, /api/docs
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');

  // Paths that should never be individually audited (noisy read-only)
  private readonly skipPaths = ['/api/docs', '/health', '/metrics'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = req;
    const user = (req as any).user;
    const schoolId = req.headers['x-school-id'] as string | undefined;

    // Only audit mutating HTTP methods
    const shouldAudit = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
      !this.skipPaths.some((p) => url.startsWith(p));

    if (!shouldAudit) return next.handle();

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log({
            event: 'AUDIT',
            actor: user?.sub || 'anonymous',
            actorEmail: user?.email,
            schoolId,
            method,
            path: url,
            ip,
            durationMs: Date.now() - startTime,
            outcome: 'SUCCESS',
            timestamp: new Date().toISOString(),
          });
        },
        error: (err) => {
          this.logger.warn({
            event: 'AUDIT',
            actor: user?.sub || 'anonymous',
            actorEmail: user?.email,
            schoolId,
            method,
            path: url,
            ip,
            durationMs: Date.now() - startTime,
            outcome: 'FAILURE',
            errorMessage: err.message,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }
}

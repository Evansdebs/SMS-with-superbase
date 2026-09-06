import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter — catches all unhandled exceptions and returns
 * a consistent JSON envelope. Also logs structured error info to the
 * NestJS Logger so it can be piped to an external log aggregator later.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred. Please try again later.';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as Record<string, any>;
        message = body.message || message;
        // NestJS ValidationPipe returns errors as an array
        if (Array.isArray(body.message)) {
          errors = body.message;
          message = 'Validation failed. Please check the provided data.';
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const logPayload = {
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      statusCode: status,
      message,
      // Scrub sensitive headers before logging
      userAgent: req.headers['user-agent'],
      schoolId: req.headers['x-school-id'] as string | undefined,
      userId: (req as any).user?.sub,
    };

    if (status >= 500) {
      this.logger.error(logPayload, exception instanceof Error ? exception.stack : undefined);
    } else if (status >= 400) {
      this.logger.warn(logPayload);
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

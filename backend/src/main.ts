import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Structured JSON logging in production; pretty-print locally
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  const appLogger = new Logger('Bootstrap');

  // ── Security headers (Helmet) ──────────────────────────────────────────────
  app.use(
    helmet({
      // Allow Swagger UI inline scripts
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? undefined
          : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
  ).split(',');

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-school-id',
      'x-school-code',
    ],
  });

  // ── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Global validation pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip undeclared properties
      forbidNonWhitelisted: true, // Reject requests with extra properties
      transform: true,            // Auto-transform payloads to DTO classes
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Global exception filter ───────────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Global interceptors ───────────────────────────────────────────────────
  // Order matters: Transform wraps Audit so the audit sees the final shape
  app.useGlobalInterceptors(
    new AuditLogInterceptor(),
    new TransformInterceptor(),
  );

  // ── Swagger / OpenAPI ────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('School Management System API')
      .setDescription(
        'Multi-tenant School Management System — REST API documentation.\n\n' +
        'All school-scoped endpoints require `x-school-id` and `x-school-code` headers ' +
        'in addition to a valid Bearer JWT.',
      )
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-school-id' }, 'SchoolId')
      .addTag('Auth', 'Authentication & session management')
      .addTag('Schools', 'School administration (SuperAdmin only)')
      .addTag('Students', 'Student management')
      .addTag('Teachers', 'Teacher management')
      .addTag('Academics', 'Classes, subjects, grading')
      .addTag('Fees', 'Fee structures, payments, financial statements')
      .addTag('Discipline', 'Infraction & sanction management')
      .addTag('Health', 'Sick bay & medical records')
      .addTag('Library', 'Book catalog & loans')
      .addTag('Inventory', 'Asset registry')
      .addTag('Transport', 'Bus routes & manifests')
      .addTag('HR', 'Staff leave management')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    appLogger.log('Swagger UI available at /api/docs');
  }

  // ── Start server ─────────────────────────────────────────────────────────
  const port = process.env.PORT || 3001;
  await app.listen(port);

  appLogger.log(`🚀 SMS API running on http://localhost:${port}/api/v1`);
  appLogger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();

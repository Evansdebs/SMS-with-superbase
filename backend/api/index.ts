import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { AuditLogInterceptor } from '../src/common/interceptors/audit-log.interceptor';

const server: Express = express();
let isInitialized = false;

async function bootstrapServerless() {
  if (isInitialized) return server;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-school-id',
      'x-school-code',
    ],
  });

  // URL rewrite middleware
  server.use((req: any, res: any, next: () => void) => {
    if (
      !req.url.startsWith('/api/v1') &&
      !req.url.startsWith('/api/docs') &&
      req.url !== '/'
    ) {
      req.url = `/api/v1${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
    }
    next();
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new AuditLogInterceptor(),
    new TransformInterceptor(),
  );

  await app.init();
  isInitialized = true;
  return server;
}

export default async function handler(req: Request, res: Response) {
  await bootstrapServerless();
  server(req, res);
}

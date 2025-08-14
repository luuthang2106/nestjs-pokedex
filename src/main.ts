import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200'], // domain FE
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.setGlobalPrefix('api');
  // 1) Serve assets dưới /static
  const browserDir = join(process.cwd(), 'browser');

  // Serve tất cả file tĩnh ở browser/ tại root (/)
  app.use(express.static(browserDir, { index: false, maxAge: '365d' }));

  // Serve assets ở /static
  app.use('/static', express.static(browserDir, { index: false, maxAge: '365d' }));

  // SPA fallback cho route khác
  app.use((req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/static')) {
      return next();
    }
    res.sendFile(join(browserDir, 'index.html'));
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

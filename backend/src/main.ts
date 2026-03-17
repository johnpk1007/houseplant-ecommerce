import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.enableCors({
    origin: process.env.NODE_ENV === "production" ? process.env.PRODUCTION_FRONTEND_URL : process.env.DEV_FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('--- Request ---');
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);

    const originalSend = res.send.bind(res);
    res.send = ((body: any) => {
      console.log('--- Response ---');
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.getHeaders());
      console.log('Set-Cookie:', res.getHeader('Set-Cookie'));
      console.log('Body:', body);
      return originalSend(body);
    }) as typeof res.send;

    next();
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();

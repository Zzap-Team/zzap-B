import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { error } from 'console';
import { UserInputError } from '@nestjs/apollo';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://zzaplog.shop',
      'http://www.zzaplog.shop',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'access-control-allow-origin',
      'x-requested-with',
      'content-type',
      'accept',
      'authorization',
      'cookie',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use(cookieParser());
  // validation 데코레이터가 붙어있는 프로퍼티에 대한 유효성 검증
  app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory: (errors) => {
      //   console.log('[exceptionFactory] erros', errors);
      //   return new UserInputError('wow');
      // },
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://zzaplog.shop', 'http://www.zzaplog.shop', 'http://localhost:5173', process.env.CLIENT_URL ],
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
  
  app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory: (errors) => {
      //   const result = errors.map((error) => ({
      //     property: error.property,
      //     message: error.constraints[Object.keys(error.constraints)[0]],
      //   }));
      //   return new BadRequestException(result);
      // },
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();

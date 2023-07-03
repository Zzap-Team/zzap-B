import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_DEV],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'access-control-allow-origin',
      'x-requested-with',
      'content-type',
      'accept',
      'authorization',
    ],
    // 쿠키, 인증 헤더 등을 사용할 수 있게 할 것인가?
    credentials: true,
    // CORS 프리플라이트 요청에 대한 응답이 다음 미들웨어로 전달되도록 할 것인가?
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // validation 데코레이터가 붙어있는 프로퍼티에 대한 유효성 검증
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // 1
  await app.listen(3000);
}
bootstrap();

import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // hbs(html, css) 렌더링 미들웨어 세팅
  app.useStaticAssets(join(__dirname, '..', 'public')); // css 서빙
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 템플릿 엔진 위치
  app.setViewEngine('hbs'); // hbs 엔진 사용할 것

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(80);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,//loại bỏ các nhân tố mà không được định dạng trong dto (data injection)
  }));
  await app.listen(3003);
}
bootstrap();
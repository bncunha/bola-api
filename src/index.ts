import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './security/filters/all-exception.filter';
import { QueryExceptionFilter } from './security/filters/query-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter(), new QueryExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

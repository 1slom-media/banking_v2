import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { winstonLogger } from './logger/winston.logger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Banking swagger api documentation')
    .setDescription('The  API description')
    .setVersion('1.0')
    .build();
  const Document = SwaggerModule.createDocument(app, options, {
    include: [],
  });
  SwaggerModule.setup('api', app, Document);
  await app.listen(3001);
}
bootstrap();

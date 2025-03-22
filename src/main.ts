import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Extract the use method and pass it to app.use()
  const loggerMiddleware = new LoggerMiddleware();
  app.use(loggerMiddleware.use.bind(loggerMiddleware));

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('The Task Manager API description')
    .setVersion('1.0')
    .addBearerAuth() // Add bearer auth configuration
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(env.PORT || 3000);
}
bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResultInterceptor } from './common/interceptors/result.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResultInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  
  //swagger
  const swagerConfig = new DocumentBuilder()
  .setTitle('MyGameList API')
  .setDescription('Game tracking and review API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, swagerConfig);
  SwaggerModule.setup('docs', app, document);



  //port handling
  const config = app.get(ConfigService)
  const PORT = config.get<number>("PORT") || 3000
  await app.listen(PORT);
}

bootstrap();
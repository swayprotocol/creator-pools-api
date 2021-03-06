import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const packageJson = require('../package.json');

  const config = new DocumentBuilder()
    .setTitle('Creator pools API')
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'https://creatorpools.live', 
      'https://staging.creatorpools.live',
      'http://localhost:3000'
    ]
  });
  
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

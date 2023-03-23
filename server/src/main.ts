import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserDataModule } from './user-data/user-data.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
  .setTitle('Your record api')
  .setDescription('You could ')
  .setVersion('2.0')
  .addTag('cats')
  .build();
  
const document = SwaggerModule.createDocument(app, config,{include:[UserDataModule]});

SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

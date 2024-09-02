import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse cookies
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT || 5000);
}
bootstrap();

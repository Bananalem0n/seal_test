import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'firebase-admin';
import * as cookieParser from 'cookie-parser';

export const admin = fs.initializeApp({
  credential: fs.credential.cert('serviceAccount.json'),
  storageBucket: process.env.BUCKET_URL ?? '',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

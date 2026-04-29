import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://hub.lvh.me',
        'http://pulse.lvh.me',
        'http://service.lvh.me',
        'http://control.lvh.me',
        'http://lvh.me',
        'http://hub.localhost',
        'http://pulse.localhost',
        'http://service.localhost',
        'http://control.localhost',
        'http://localhost',
        'http://127.0.0.1',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  logger.log(`Control Backend is running on port ${port}`);
}

void bootstrap();

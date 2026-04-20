import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // CORS с credentials требует function-based origin для корректной работы
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        // lvh.me variants for SSO (primary)
        'http://hub.lvh.me',
        'http://pulse.lvh.me',
        'http://lvh.me',
        // localhost variants (legacy, for development)
        'http://hub.localhost',
        'http://pulse.localhost',
        'http://localhost',
        'http://127.0.0.1',
      ];
      // Allow requests without origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Pulse Backend is running on port ${port}`);
}

void bootstrap();

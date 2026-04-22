import { Controller, Get } from '@nestjs/common';
import { HealthResponse } from '@ject-hub/contracts';

/**
 * Контроллер для Pulse Backend.
 * Эндпоинт /health публичный.
 */
@Controller('pulse')
export class AppController {
  /**
   * Публичный health check - доступен по /api/pulse/health
   */
  @Get('health')
  getHealth(): HealthResponse {
    return { status: 'OK', service: 'pulse' };
  }
}

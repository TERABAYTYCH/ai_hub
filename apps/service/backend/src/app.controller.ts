import { Controller, Get } from '@nestjs/common';
import { HealthResponse } from '@ject-hub/contracts';

/**
 * Контроллер для Service Backend.
 * Эндпоинт /health публичный.
 */
@Controller('service')
export class AppController {
  /**
   * Публичный health check - доступен по /api/service/health
   */
  @Get('health')
  getHealth(): HealthResponse {
    return { status: 'OK', service: 'service' };
  }
}

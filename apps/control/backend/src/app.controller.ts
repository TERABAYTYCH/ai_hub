import { Controller, Get } from '@nestjs/common';
import { HealthResponse } from '@ject-hub/contracts';

@Controller('control')
export class AppController {
  @Get('health')
  getHealth(): HealthResponse {
    return { status: 'OK', service: 'control' };
  }
}

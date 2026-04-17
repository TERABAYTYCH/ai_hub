import { Controller, Get } from '@nestjs/common';

@Controller('pulse')
export class AppController {
  @Get('health')
  getHealth() {
    return { status: 'OK', service: 'pulse' };
  }
}

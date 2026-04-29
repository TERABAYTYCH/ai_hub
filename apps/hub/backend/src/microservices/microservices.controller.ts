import { Controller, Get, Post, Body } from '@nestjs/common';

/**
 * Конфигурация доступа к микросервисам.
 * Позже будет храниться в БД (таблица licenses).
 */
export const MICROSERVICES_ACCESS: Record<string, boolean> = {
  pulse: false,
  service: true,
  control: true,
};

@Controller('microservices')
export class MicroservicesController {
  /**
   * Returns current microservices access configuration.
   */
  @Get('access')
  getAccess() {
    return MICROSERVICES_ACCESS;
  }

  /**
   * Updates microservices access configuration.
   * @param body - Object with pulse and/or service boolean values
   */
  @Post('access')
  updateAccess(@Body() body: { pulse?: boolean; service?: boolean; control?: boolean }) {
    if (body.pulse !== undefined) {
      MICROSERVICES_ACCESS.pulse = body.pulse;
    }
    if (body.service !== undefined) {
      MICROSERVICES_ACCESS.service = body.service;
    }
    if (body.control !== undefined) {
      MICROSERVICES_ACCESS.control = body.control;
    }
    return MICROSERVICES_ACCESS;
  }
}

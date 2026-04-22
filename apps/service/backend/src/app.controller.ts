import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HealthResponse, UserResponse } from '@ject-hub/contracts';

/**
 * Контроллер для Service Backend.
 * Эндпоинт /health публичный, /api/service/me защищен JWT.
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

  /**
   * Защищенный эндпоинт - возвращает данные текущего пользователя из JWT.
   * Требует валидный JWT токен.
   * Доступен по /api/service/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Request() req: { user: UserResponse }): UserResponse {
    return req.user;
  }
}

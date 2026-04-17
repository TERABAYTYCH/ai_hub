import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

/**
 * DTO для ответа health check
 */
interface HealthResponse {
  status: string;
  service: string;
}

/**
 * DTO для ответа с данными пользователя
 */
interface UserResponse {
  id: string;
  username: string;
  role: string;
  licenseId: string;
}

/**
 * Контроллер для Pulse Backend.
 * Эндпоинт /health публичный, /api/pulse/me защищен JWT.
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

  /**
   * Защищенный эндпоинт - возвращает данные текущего пользователя из JWT.
   * Требует валидный JWT токен.
   * Доступен по /api/pulse/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Request() req: { user: UserResponse }): UserResponse {
    return req.user;
  }
}

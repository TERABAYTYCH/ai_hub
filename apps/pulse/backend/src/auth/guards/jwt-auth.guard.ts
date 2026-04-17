import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard для защиты маршрутов с помощью JWT аутентификации.
 * Использует стратегию jwt, настроенную на валидацию токенов Hub Backend.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Обработка ошибок аутентификации
   */
  handleRequest<TUser = unknown>(err: Error | null, user: TUser, info: Error): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || 'Unauthorized');
    }
    return user;
  }
}

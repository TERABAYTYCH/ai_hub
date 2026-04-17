import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy для Pulse Backend.
 * Валидирует токены, выпущенные Hub Backend.
 * НЕ обращается к БД - только проверяет валидность токена.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Используем тот же секрет, что и Hub Backend
      secretOrKey: configService.get<string>('JWT_SECRET') || 'hub-jwt-secret-key-change-in-production',
    });
  }

  /**
   * Валидация payload JWT токена.
   * Возвращает пользователя на основе данных из токена.
   */
  async validate(payload: { sub: string; username: string; role: string; licenseId: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Возвращаем объект пользователя на основе данных из токена
    // Не обращаемся к БД, так как Pulse не имеет своей базы пользователей
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      licenseId: payload.licenseId,
    };
  }
}

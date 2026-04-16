/**
 * DTO для запроса аутентификации (вход в систему)
 */
export interface LoginRequestDto {
  username: string;
  password: string;
}

/**
 * DTO для ответа после успешной аутентификации
 */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: IUser;
}

/**
 * Интерфейс публичных данных пользователя (без пароля)
 */
export interface IUser {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  licenseId?: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Payload JWT токена, содержащий информацию о пользователе
 */
export interface UserJwtPayload {
  sub: string;
  username: string;
  role: string;
  licenseId: string;
  iat?: number;
  exp?: number;
}

/**
 * DTO для регистрации нового пользователя
 */
export interface RegisterRequestDto {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * DTO для обновления токена доступа (refresh)
 */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * DTO для ответа с информацией о текущем пользователе
 */
export interface CurrentUserDto {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  licenseId: string;
  createdAt: Date;
  updatedAt: Date;
}

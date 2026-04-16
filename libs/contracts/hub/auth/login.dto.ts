export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserJwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

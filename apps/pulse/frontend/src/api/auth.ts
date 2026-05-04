import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '@ject-hub/contracts/hub/auth';

const API_URL = String(import.meta.env.VITE_API_URL) || '/api';

/**
 * Выполняет вход пользователя через Hub Backend API
 * Refresh токен устанавливается через HttpOnly cookie
 */
export async function login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Required for cross-domain cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({ message: 'Login failed' }))) as {
      message: string;
    };
    throw new Error(errorData.message || 'Login failed');
  }

  return (await response.json()) as LoginResponseDto;
}

/**
 * Выполняет регистрацию пользователя через Hub Backend API
 */
export async function register(userData: RegisterRequestDto): Promise<LoginResponseDto> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Required for cross-domain cookies
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({ message: 'Registration failed' }))) as {
      message: string;
    };
    throw new Error(errorData.message || 'Registration failed');
  }

  return (await response.json()) as LoginResponseDto;
}

/**
 * Получает информацию о текущем пользователе
 * Использует access token из cookie
 */
export async function getCurrentUser(): Promise<unknown> {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include', // Cookie will be sent automatically
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return response.json();
}

/**
 * Обновляет токены с использованием HttpOnly refresh cookie
 */
export async function refreshTokens(): Promise<LoginResponseDto> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // HttpOnly cookie will be sent automatically
  });

  if (!response.ok) {
    throw new Error('Failed to refresh tokens');
  }

  return (await response.json()) as LoginResponseDto;
}

/**
 * Выполняет logout и очищает cookies
 */
export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

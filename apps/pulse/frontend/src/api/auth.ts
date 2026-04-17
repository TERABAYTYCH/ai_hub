import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '@app/contracts/hub/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Выполняет вход пользователя через Hub Backend API
 */
export async function login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
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
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(errorData.message || 'Registration failed');
  }

  return (await response.json()) as LoginResponseDto;
}

/**
 * Получает информацию о текущем пользователе
 */
export async function getCurrentUser(): Promise<unknown> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return response.json();
}

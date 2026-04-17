import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '@app/contracts/hub/auth';
import { setAuthTokens, setUser } from '../utils/auth';

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

  const data = (await response.json()) as LoginResponseDto;

  // Сохраняем токены
  setAuthTokens(data.accessToken, data.refreshToken);
  if (data.user) {
    setUser(data.user);
  }

  return data;
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

  const data = (await response.json()) as LoginResponseDto;

  // Сохраняем токены
  setAuthTokens(data.accessToken, data.refreshToken);
  if (data.user) {
    setUser(data.user);
  }

  return data;
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

/**
 * Выполняет логаут
 */
export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

import type { LoginResponseDto, IUser } from '@app/contracts/hub/auth';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Сохраняет токены аутентификации в localStorage
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Получает access token из localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Получает refresh token из localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Удаляет все токены из localStorage (логаут)
 */
export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Сохраняет данные пользователя в localStorage
 */
export function setUser(user: IUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Получает данные пользователя из localStorage
 */
export function getUser(): IUser | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as IUser;
  } catch {
    return null;
  }
}

/**
 * Проверяет, авторизован ли пользователь
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Получает имя пользователя для отображения
 */
export function getUsername(): string {
  const user = getUser();
  return user?.username || user?.email || 'User';
}

/**
 * authFetch с автоматическим добавлением Authorization заголовка
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Если токен истек (401), пробуем refresh
  if (response.status === 401 && token) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Повторяем запрос с новым токеном
      const newToken = getAccessToken();
      if (newToken) {
        (headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers });
      }
    }
    // Refresh не удался, чистим токены
    clearAuthTokens();
  }

  return response;
}

/**
 * Пытается обновить access token через refresh token
 */
async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    // Обращаемся к Hub backend для refresh
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = (await response.json()) as LoginResponseDto;
      setAuthTokens(data.accessToken, data.refreshToken);
      if (data.user) {
        setUser(data.user);
      }
      return true;
    }
  } catch {
    // Ignore errors
  }

  return false;
}

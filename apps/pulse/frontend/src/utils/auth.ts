import type { LoginResponseDto, IUser } from '@app/contracts/hub/auth';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Decodes JWT token payload without external libraries.
 * Returns null if token is invalid.
 */
function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url decode
    const decoded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = decoded + '='.repeat((4 - (decoded.length % 4)) % 4);
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Checks if token is expired based on exp claim.
 * Returns true if token is expired or invalid.
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const payload = decodeTokenPayload(token);
  if (!payload) return true;
  const exp = payload.exp;
  if (typeof exp !== 'number') return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

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
 * Деавторизация - очищает токены и редиректит на логин
 */
export function logout(): void {
  clearAuthTokens();
  window.location.href = '/login';
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
 * Проверяет, авторизован ли пользователь (есть валидный токен)
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
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
 * и проверкой срока действия токена
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();

  // Check token expiration before making request
  if (token && isTokenExpired(token)) {
    logout();
    throw new Error('Token expired');
  }

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
    logout();
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

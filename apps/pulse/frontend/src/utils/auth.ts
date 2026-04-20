import { getAccessToken, removeAccessToken } from '@app/ui-kit';

const API_URL = String(import.meta.env.VITE_API_URL) || '/api';

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
 * Gets username from access token (decodes JWT).
 * Falls back to 'User' if token is invalid or username not found.
 */
export function getUsername(): string {
  const token = getAccessToken();
  if (!token) return 'User';

  const payload = decodeTokenPayload(token);
  if (!payload) return 'User';

  const username = payload.username as string | undefined;
  const email = payload.email as string | undefined;
  return username || email || 'User';
}

/**
 * Clears authentication cookies and redirects to login.
 */
export function logout(): void {
  removeAccessToken();
  window.location.href = '/login';
}

/**
 * Authenticated fetch using cookies.
 * Refresh token is HttpOnly cookie, sent automatically.
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

  const response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (response.status === 401) {
    // Try to refresh tokens
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry request with new token
      const newToken = getAccessToken();
      if (newToken) {
        (headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers, credentials: 'include' });
      }
    }
    logout();
  }

  return response;
}

/**
 * Attempts to refresh access token using HttpOnly refresh cookie.
 * Access token is read from cookie after refresh.
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
}

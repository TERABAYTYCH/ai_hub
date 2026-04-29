import { getAccessToken, removeAccessToken } from '@app/ui-kit';

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = decoded + '='.repeat((4 - (decoded.length % 4)) % 4);
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const payload = decodeTokenPayload(token);
  if (!payload) return true;
  const exp = payload.exp;
  if (typeof exp !== 'number') return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

export function getUsername(): string {
  const token = getAccessToken();
  if (!token) return 'User';

  const payload = decodeTokenPayload(token);
  if (!payload) return 'User';

  const username = payload.username as string | undefined;
  const email = payload.email as string | undefined;
  return username || email || 'User';
}

export function logout(): void {
  removeAccessToken();
  window.location.href = '/login';
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();

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
    logout();
  }

  return response;
}

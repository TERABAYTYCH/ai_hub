export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function handleUnauthorized(): void {
  logout();
}

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

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('accessToken');

  // Check token expiration before making request
  if (token && isTokenExpired(token)) {
    handleUnauthorized();
    throw new Error('Token expired');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  return response;
}

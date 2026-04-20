/**
 * Cookie utility functions for cross-domain authentication.
 * Access token is stored in a regular cookie for cross-domain SSO.
 * Refresh token is HttpOnly and never accessible to JavaScript.
 */

const ACCESS_TOKEN_COOKIE = 'ject_access_token';

/**
 * Dynamically computes the root domain for cross-domain cookies.
 * 
 * RFC 6265 prohibits setting Domain=localhost (no TLD).
 * 
 * @returns Domain string with leading dot (.example.com) for cross-domain cookies,
 *         or undefined to let browser set host-only cookie
 */
export function getRootDomain(): string | undefined {
  const hostname = window.location.hostname;

  // For localhost and IP addresses - return undefined (no Domain attribute)
  // Browser will set host-only cookie for the exact hostname
  if (hostname === 'localhost' || /^[0-9.]+$/.test(hostname)) {
    return undefined;
  }

  // For *.localhost domains (e.g., hub.localhost, pulse.localhost)
  // Return .localhost so cookie is shared across all subdomains of localhost
  if (hostname.endsWith('.localhost')) {
    return '.localhost';
  }

  // For all other domains (e.g., hub.lvh.me, app.domain.com)
  // Return the root domain with leading dot
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }

  // Fallback - should not reach here for valid hostnames
  return undefined;
}

/**
 * Sets access token cookie with cross-domain support.
 * @param token - JWT access token
 * @param expiresIn - Cookie expiration in seconds (default: 1 hour)
 */
export function setAccessToken(token: string, expiresIn = 3600): void {
  const rootDomain = getRootDomain();
  const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();

  // Build cookie string
  let cookieString = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)};`;
  cookieString += `path=/;`;
  cookieString += `expires=${expires};`;

  // Only set domain if rootDomain is defined (not localhost/IP)
  if (rootDomain !== undefined) {
    cookieString += `domain=${rootDomain};`;
  }

  // SameSite=Lax for cross-site requests
  cookieString += `SameSite=Lax;`;

  document.cookie = cookieString;
}

/**
 * Gets access token from cookie.
 * @returns The access token or null if not found.
 */
export function getAccessToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ACCESS_TOKEN_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Removes access token cookie.
 */
export function removeAccessToken(): void {
  const rootDomain = getRootDomain();

  // Build cookie string with expired date to delete
  let cookieString = `${ACCESS_TOKEN_COOKIE}=;`;
  cookieString += `path=/;`;
  cookieString += `expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

  // Only set domain if rootDomain is defined
  if (rootDomain !== undefined) {
    cookieString += `domain=${rootDomain};`;
  }

  document.cookie = cookieString;
}

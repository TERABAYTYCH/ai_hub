/**
 * Cookie utility functions for cross-domain authentication.
 * Access token is stored in a regular cookie for cross-domain SSO.
 * Refresh token is HttpOnly and never accessible to JavaScript.
 */
/**
 * Dynamically computes the root domain for cross-domain cookies.
 *
 * RFC 6265 prohibits setting Domain=localhost (no TLD).
 *
 * @returns Domain string with leading dot (.example.com) for cross-domain cookies,
 *         or undefined to let browser set host-only cookie
 */
export declare function getRootDomain(): string | undefined;
/**
 * Sets access token cookie with cross-domain support.
 * @param token - JWT access token
 * @param expiresIn - Cookie expiration in seconds (default: 1 hour)
 */
export declare function setAccessToken(token: string, expiresIn?: number): void;
/**
 * Gets access token from cookie.
 * @returns The access token or null if not found.
 */
export declare function getAccessToken(): string | null;
/**
 * Removes access token cookie.
 */
export declare function removeAccessToken(): void;

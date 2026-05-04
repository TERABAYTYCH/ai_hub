/**
 * Checks if token is expired based on exp claim.
 * Returns true if token is expired or invalid.
 */
export declare function isTokenExpired(token: string | null): boolean;
/**
 * Gets username from access token (decodes JWT).
 * Falls back to 'User' if token is invalid or username not found.
 */
export declare function getUsername(): string;
/**
 * Clears authentication cookies and redirects to login.
 */
export declare function logout(): void;
/**
 * Authenticated fetch using cookies.
 * Refresh token is HttpOnly cookie, sent automatically.
 */
export declare function authFetch(url: string, options?: RequestInit): Promise<Response>;

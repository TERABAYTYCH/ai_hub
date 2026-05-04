import axios from 'axios';
import { removeAccessToken } from '@ject-hub/ui-kit';

/**
 * Initializes axios interceptors for global 401 handling.
 * Call this once at app startup.
 *
 * NOTE: Refresh token is stored in HttpOnly cookie and is NEVER accessible to JavaScript.
 * The browser automatically sends it with credentials: 'include' on each request.
 * On 401, we only clear the access token cookie - the refresh token cookie
 * is managed by the backend via Set-Cookie headers.
 */
export function initAxiosInterceptors(): void {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear access token cookie and redirect to login
          // Refresh token is HttpOnly and cannot be accessed by JavaScript
          removeAccessToken();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );
}

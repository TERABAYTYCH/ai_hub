import axios from 'axios';
import { removeAccessToken } from '@ject-hub/ui-kit';

/**
 * Initializes axios interceptors for global 401 handling.
 * Call this once at app startup.
 */
export function initAxiosInterceptors(): void {
  // Response interceptor for handling 401 errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear auth cookies and redirect to login
          removeAccessToken();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );
}

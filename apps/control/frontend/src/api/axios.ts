import axios from 'axios';
import { removeAccessToken } from '@ject-hub/ui-kit';

export function initAxiosInterceptors(): void {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          removeAccessToken();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    },
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@ject-hub/ui-kit';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

interface MicroservicesAccess {
  pulse: boolean;
  service: boolean;
}

/**
 * Hook that returns microservices access from JWT (initial) and syncs with backend.
 * This ensures fresh access data after admin changes settings.
 */
export function useMicroservicesAccess(): Record<string, boolean> {
  const { user } = useAuth();
  const [backendAccess, setBackendAccess] = useState<Record<string, boolean> | null>(null);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/microservices/access`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = (await response.json()) as MicroservicesAccess;
          setBackendAccess(data);
        }
      } catch {
        // Ignore errors, fallback to JWT data
      }
    };

    void fetchAccess();
  }, []);

  // Return backend data if loaded, otherwise fallback to JWT data
  return backendAccess ?? user?.microservices ?? {};
}

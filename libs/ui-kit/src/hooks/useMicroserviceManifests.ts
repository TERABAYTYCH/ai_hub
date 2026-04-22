import { useState, useEffect } from 'react';
import type { MicroserviceManifest } from '@ject-hub/contracts';

/**
 * Список зарегистрированных микросервисов.
 * Hub динамически загружает manifest.json из каждого сервиса.
 */
export const REGISTERED_SERVICES = [
  { serviceId: 'pulse', manifestUrl: 'http://pulse.lvh.me/assets/manifest.json' },
  { serviceId: 'service', manifestUrl: 'http://service.lvh.me/assets/manifest.json' },
] as const;

export interface UseMicroserviceManifestsResult {
  manifests: MicroserviceManifest[];
  loading: boolean;
  error: Error | null;
}

export const useMicroserviceManifests = (): UseMicroserviceManifestsResult => {
  const [manifests, setManifests] = useState<MicroserviceManifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all(
      REGISTERED_SERVICES.map((s) => fetch(s.manifestUrl))
    )
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(setManifests)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  return { manifests, loading, error };
};

import { useState, useEffect } from 'react';
import type { MicroserviceManifest } from '@ject-hub/contracts';

/**
 * Базовый URL для сервиса Pulse.
 * В браузере используется статический fallback, так как process.env недоступен.
 */
const SERVICE_BASE_URL = 'http://pulse.lvh.me';

export const REGISTERED_SERVICES = [
  { serviceId: 'pulse', manifestUrl: `${SERVICE_BASE_URL}/assets/manifest.json` },
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

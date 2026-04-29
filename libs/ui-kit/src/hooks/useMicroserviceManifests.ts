import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Список зарегистрированных микросервисов.
 * Hub динамически загружает manifest.json из каждого сервиса.
 */
export const REGISTERED_SERVICES = [
  { serviceId: 'hub', manifestUrl: 'http://hub.lvh.me/assets/manifest.json', name: 'Ject Hub', baseUrl: 'http://hub.lvh.me' },
  { serviceId: 'pulse', manifestUrl: 'http://pulse.lvh.me/assets/manifest.json', name: 'Pulse Monitoring', baseUrl: 'http://pulse.lvh.me' },
  { serviceId: 'service', manifestUrl: 'http://service.lvh.me/assets/manifest.json', name: 'Service', baseUrl: 'http://service.lvh.me' },
  { serviceId: 'control', manifestUrl: 'http://control.lvh.me/assets/manifest.json', name: 'Control', baseUrl: 'http://control.lvh.me' },
] as const;

/** Результат загрузки манифеста — всегда содержит все сервисы, failed обновляется после fetch */
export interface ManifestResult {
  serviceId: string;
  name: string;
  baseUrl: string;
  navigation: { module: string; path: string; label: string; icon: string }[];
  /** Манифест не загрузился — сервис недоступен */
  failed: boolean;
}

export interface UseMicroserviceManifestsResult {
  manifests: ManifestResult[];
  loading: boolean;
  error: Error | null;
}

/** Интервал refetch в миллисекундах */
const REFETCH_INTERVAL_MS = 5000;

export const useMicroserviceManifests = (): UseMicroserviceManifestsResult => {
  const [manifests, setManifests] = useState<ManifestResult[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchManifest = useCallback(async (service: (typeof REGISTERED_SERVICES)[number]): Promise<boolean> => {
    try {
      const response = await fetch(service.manifestUrl);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      setManifests((prev) =>
        prev.map((m) =>
          m.serviceId === service.serviceId
            ? {
                ...m,
                serviceId: data.serviceId || service.serviceId,
                name: data.name || service.name,
                baseUrl: data.baseUrl || service.baseUrl,
                navigation: (data.navigation || []) as ManifestResult['navigation'],
                failed: false,
              }
            : m,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Сразу заполняем manifests заглушками
    const initialManifests: ManifestResult[] = REGISTERED_SERVICES.map((service) => ({
      serviceId: service.serviceId,
      name: service.name,
      baseUrl: service.baseUrl,
      navigation: [],
      failed: true,
    }));
    setManifests(initialManifests);

    // Первичная параллельная загрузка
    Promise.all(REGISTERED_SERVICES.map((service) => fetchManifest(service)))
      .finally(() => setInitialLoading(false));

    // Запускаем интервал для refetch failed сервисов
    intervalRef.current = setInterval(() => {
      setManifests((current) => {
        const failedServices = current.filter((m) => m.failed);
        if (failedServices.length === 0) {
          // Все загружены — останавливаем интервал
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return current;
        }

        // Refetch только failed сервисы
        failedServices.forEach((m) => {
          const service = REGISTERED_SERVICES.find((s) => s.serviceId === m.serviceId);
          if (service) {
            fetchManifest(service);
          }
        });

        return current;
      });
    }, REFETCH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchManifest]);

  return { manifests, loading: initialLoading, error };
};

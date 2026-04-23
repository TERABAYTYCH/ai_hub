import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { useMicroserviceManifests, REGISTERED_SERVICES } from './useMicroserviceManifests';

describe('useMicroserviceManifests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state with placeholder manifests (loading: true)', () => {
    // Mock fetch to never resolve (keeps loading true forever in test)
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useMicroserviceManifests());

    expect(result.current.loading).toBe(true);
    // Initial manifests should be placeholders with failed: true
    expect(result.current.manifests).toHaveLength(REGISTERED_SERVICES.length);
    expect(result.current.manifests.every((m) => m.failed === true)).toBe(true);
    expect(result.current.manifests.every((m) => m.navigation.length === 0)).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should load manifests successfully', async () => {
    const mockHubManifest = {
      serviceId: 'hub',
      name: 'Ject Hub',
      baseUrl: 'http://hub.lvh.me',
      navigation: [
        { module: './Settings', path: '/hub/settings', label: 'Settings', icon: 'bi bi-gear' },
      ],
    };

    const mockPulseManifest = {
      serviceId: 'pulse',
      name: 'Pulse Monitoring',
      baseUrl: 'http://pulse.lvh.me',
      navigation: [
        { module: './Dashboard', path: '/pulse', label: 'Dashboard', icon: 'bi bi-speedometer2' },
      ],
    };

    const mockServiceManifest = {
      serviceId: 'service',
      name: 'Service',
      baseUrl: 'http://service.lvh.me',
      navigation: [
        { module: './Dashboard', path: '/service', label: 'Dashboard', icon: 'bi bi-wrench' },
      ],
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHubManifest),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPulseManifest),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServiceManifest),
      });

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(REGISTERED_SERVICES.length);
    expect(result.current.manifests[0].serviceId).toBe('hub');
    expect(result.current.manifests.every((m) => m.failed === false)).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle network rejection (fetch throws)', async () => {
    const mockHubManifest = {
      serviceId: 'hub',
      name: 'Ject Hub',
      baseUrl: 'http://hub.lvh.me',
      navigation: [],
    };

    const mockServiceManifest = {
      serviceId: 'service',
      name: 'Service',
      baseUrl: 'http://service.lvh.me',
      navigation: [],
    };

    // First (hub) succeeds, second (pulse) network error, third (service) succeeds
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHubManifest),
      })
      .mockRejectedValueOnce(new Error('Connection refused'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServiceManifest),
      });

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(3);
    expect(result.current.manifests.find((m) => m.serviceId === 'hub')?.failed).toBe(false);
    expect(result.current.manifests.find((m) => m.serviceId === 'pulse')?.failed).toBe(true);
    expect(result.current.manifests.find((m) => m.serviceId === 'service')?.failed).toBe(false);
  });

  it('should handle HTTP error (response.ok === false)', async () => {
    const mockHubManifest = {
      serviceId: 'hub',
      name: 'Ject Hub',
      baseUrl: 'http://hub.lvh.me',
      navigation: [],
    };

    const mockServiceManifest = {
      serviceId: 'service',
      name: 'Service',
      baseUrl: 'http://service.lvh.me',
      navigation: [],
    };

    // First (hub) succeeds, second (pulse) returns 404, third (service) succeeds
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHubManifest),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServiceManifest),
      });

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(3);
    expect(result.current.manifests.find((m) => m.serviceId === 'pulse')?.failed).toBe(true);
    expect(result.current.manifests.find((m) => m.serviceId === 'hub')?.failed).toBe(false);
    expect(result.current.manifests.find((m) => m.serviceId === 'service')?.failed).toBe(false);
  });

  it('should handle complete failure', async () => {
    // All fetch calls fail immediately
    (fetch as jest.Mock).mockRejectedValue(new Error('All services down'));

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(3);
    expect(result.current.manifests.every((m) => m.failed === true)).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should always return all services in manifests array from the start', async () => {
    // Mock fetch to never resolve
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useMicroserviceManifests());

    // Immediately should have all 3 services as placeholders
    expect(result.current.manifests).toHaveLength(REGISTERED_SERVICES.length);
    expect(result.current.manifests.map((m) => m.serviceId)).toEqual(['hub', 'pulse', 'service']);
  });
});

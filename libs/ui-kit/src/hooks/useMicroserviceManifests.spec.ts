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

  it('should return initial state (loading: true)', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useMicroserviceManifests());

    expect(result.current.loading).toBe(true);
    expect(result.current.manifests).toEqual([]);
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

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHubManifest),
    });

    // Mock returns hub manifest for all 3 URLs (simulating successful fetch)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockHubManifest),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPulseManifest),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockServiceManifest),
    });

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(REGISTERED_SERVICES.length);
    expect(result.current.manifests[0].serviceId).toBe('hub');
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });
});

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
    const mockManifest = {
      serviceId: 'pulse',
      name: 'Pulse Monitoring',
      baseUrl: 'http://pulse.lvh.me',
      navigation: [
        { module: './Dashboard', path: '/pulse', label: 'Dashboard', icon: 'bi bi-speedometer2' },
      ],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockManifest),
    });

    const { result } = renderHook(() => useMicroserviceManifests());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.manifests).toHaveLength(1);
    expect(result.current.manifests[0].serviceId).toBe('pulse');
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

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { AuthProvider } from '@ject-hub/ui-kit';
import type { MicroserviceManifest } from '@ject-hub/contracts';

const mockManifests: MicroserviceManifest[] = [
  {
    serviceId: 'pulse',
    name: 'Pulse',
    baseUrl: 'http://pulse.lvh.me',
    navigation: [
      { label: 'Dashboard', path: '/pulse/dashboard', icon: 'bi bi-grid' },
      { label: 'Metrics', path: '/pulse/metrics', icon: 'bi bi-chart' },
    ],
  },
];

const mockUseMicroserviceManifests = jest.fn(() => ({
  manifests: mockManifests,
  loading: false,
  error: null,
}));

jest.mock('@ject-hub/ui-kit', () => ({
  useMicroserviceManifests: () => mockUseMicroserviceManifests(),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Layout', () => {
  it('renders Hub menu items', () => {
    renderWithProviders(
      <AuthProvider>
        <Layout>
          <div>Content</div>
        </Layout>
      </AuthProvider>,
    );

    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders service menu from manifests', () => {
    renderWithProviders(
      <AuthProvider>
        <Layout>
          <div>Content</div>
        </Layout>
      </AuthProvider>,
    );

    expect(screen.getByText('Pulse')).toBeInTheDocument();
  });

  it('renders navigation items for service children', () => {
    renderWithProviders(
      <AuthProvider>
        <Layout>
          <div>Content</div>
        </Layout>
      </AuthProvider>,
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Metrics')).toBeInTheDocument();
  });

  it('passes serviceName to AppLayout', () => {
    renderWithProviders(
      <AuthProvider>
        <Layout>
          <div>Content</div>
        </Layout>
      </AuthProvider>,
    );

    expect(screen.getByText('Ject Hub')).toBeInTheDocument();
  });
});

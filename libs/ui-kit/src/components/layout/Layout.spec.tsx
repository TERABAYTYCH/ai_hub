import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import * as uiKitExports from '@ject-hub/ui-kit';

const uiKit = uiKitExports as jest.Mocked<typeof uiKitExports>;

jest.mock('@app/ui-kit', () => ({
  useAuth: jest.fn(() => ({
    user: { username: 'Test User' },
    logout: jest.fn(),
  })),
  useMicroserviceManifests: jest.fn(),
  AppLayout: jest.fn(
    ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div data-testid="app-layout">
        <div data-testid="menu-items">{JSON.stringify(props.menuItems)}</div>
        {children}
      </div>
    ),
  ),
  MenuItem: jest.fn(),
}));

const defaultManifests = [
  {
    serviceId: 'hub',
    name: 'Ject Hub',
    baseUrl: 'http://hub.lvh.me',
    navigation: [
      { module: './Settings', path: '/hub/settings', label: 'Settings', icon: 'bi bi-gear' },
    ],
    failed: false,
  },
  {
    serviceId: 'pulse',
    name: 'Pulse Monitoring',
    baseUrl: 'http://pulse.lvh.me',
    navigation: [
      { module: './Dashboard', path: '/pulse', label: 'Dashboard', icon: 'bi bi-speedometer2' },
      { module: './Devices', path: '/pulse/devices', label: 'Devices', icon: 'bi bi-device' },
    ],
    failed: false,
  },
  {
    serviceId: 'service',
    name: 'Service',
    baseUrl: 'http://service.lvh.me',
    navigation: [
      { module: './Dashboard', path: '/service', label: 'Dashboard', icon: 'bi bi-wrench' },
      { module: './Tasks', path: '/service/tasks', label: 'Tasks', icon: 'bi bi-list-task' },
    ],
    failed: false,
  },
];

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
      manifests: defaultManifests,
      loading: false,
      error: null,
    });
  });

  describe('manifest.failed', () => {
    it('should mark failed service as disabled with bi-dash-circle icon', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: defaultManifests.map((m) =>
          m.serviceId === 'pulse' ? { ...m, failed: true } : m,
        ),
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      expect(pulseItem.icon).toBe('bi bi-dash-circle');
      expect(pulseItem.disabled).toBe(true);
      expect(pulseItem.path).toBeUndefined();
      expect(pulseItem.locked).toBeUndefined();
    });

    it('should keep normal icon for non-failed services', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: defaultManifests.map((m) =>
          m.serviceId === 'pulse' ? { ...m, failed: true } : m,
        ),
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');
      expect(serviceItem.icon).toBe('bi bi-grid');
      expect(serviceItem.disabled).toBeUndefined();
    });

    it('should show all services even when some failed to load', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: defaultManifests.map((m) =>
          m.serviceId === 'pulse' ? { ...m, failed: true } : m,
        ),
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      // All 3 services should still appear in menu (pulse as failed, others normal)
      expect(menuItems).toHaveLength(3);
      expect(menuItems.find((item: { id: string }) => item.id === 'pulse')).toBeDefined();
      expect(menuItems.find((item: { id: string }) => item.id === 'service')).toBeDefined();
      expect(menuItems.find((item: { id: string }) => item.id === 'hub')).toBeDefined();
    });
  });

  describe('microservicesAccess', () => {
    it('should mark service as locked when microservicesAccess[serviceId] is false', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      expect(pulseItem.locked).toBe(true);
    });

    it('should set path to /{serviceId} for locked service', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      expect(pulseItem.path).toBe('/pulse/lock');
    });

    it('should set icon to bi bi-lock for locked service', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      expect(pulseItem.icon).toBe('bi bi-lock');
    });

    it('should have no children for locked service', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      expect(pulseItem.children).toBeUndefined();
    });

    it('should keep children for accessible service', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');
      expect(serviceItem.children).toHaveLength(2);
    });

    it('should use bi bi-grid icon for accessible service', () => {
      const microservicesAccess = { pulse: false, service: true, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');
      expect(serviceItem.icon).toBe('bi bi-grid');
    });

    it('should show all services accessible when microservicesAccess is not provided', () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      // All services should have children (not locked)
      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');

      expect(pulseItem.children).toHaveLength(2);
      expect(serviceItem.children).toHaveLength(2);
      expect(pulseItem.locked).toBeUndefined();
      expect(serviceItem.locked).toBeUndefined();
    });

    it('should mark multiple services as locked when multiple are false', () => {
      const microservicesAccess = { pulse: false, service: false, hub: true };

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');
      const hubItem = menuItems.find((item: { id: string }) => item.id === 'hub');

      expect(pulseItem.locked).toBe(true);
      expect(serviceItem.locked).toBe(true);
      expect(hubItem.locked).toBeUndefined();
      expect(hubItem.children).toHaveLength(1);
    });

    it('should treat undefined microservicesAccess as all accessible', () => {
      const microservicesAccess: Record<string, boolean> = {};

      render(
        <Layout microservicesAccess={microservicesAccess}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      // All services should have children (not locked)
      const pulseItem = menuItems.find((item: { id: string }) => item.id === 'pulse');
      const serviceItem = menuItems.find((item: { id: string }) => item.id === 'service');

      expect(pulseItem.children).toHaveLength(2);
      expect(serviceItem.children).toHaveLength(2);
      expect(pulseItem.icon).toBe('bi bi-grid');
      expect(serviceItem.icon).toBe('bi bi-grid');
    });
  });

  describe('excludeServices', () => {
    it('should filter out excluded services from manifests', () => {
      render(
        <Layout excludeServices={['pulse']}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems.some((item: { id: string }) => item.id === 'hub')).toBe(true);
      expect(menuItems.some((item: { id: string }) => item.id === 'service')).toBe(true);
      expect(menuItems.some((item: { id: string }) => item.id === 'pulse')).toBe(false);
    });

    it('should exclude multiple services', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: defaultManifests,
        loading: false,
        error: null,
      });

      render(
        <Layout excludeServices={['hub', 'pulse']}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(1);
      expect(menuItems[0].id).toBe('service');
    });

    it('should show all services when excludeServices is empty', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: [
          {
            serviceId: 'hub',
            name: 'Hub',
            baseUrl: 'http://hub.lvh.me',
            navigation: [],
            failed: false,
          },
          {
            serviceId: 'pulse',
            name: 'Pulse',
            baseUrl: 'http://pulse.lvh.me',
            navigation: [],
            failed: false,
          },
        ],
        loading: false,
        error: null,
      });

      render(
        <Layout excludeServices={[]}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(2);
    });
  });

  describe('hubSettingsItem', () => {
    it('should add hubSettingsItem at the end of menu items and auto-exclude hub', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: [
          {
            serviceId: 'hub',
            name: 'Hub',
            baseUrl: 'http://hub.lvh.me',
            navigation: [],
            failed: false,
          },
          {
            serviceId: 'pulse',
            name: 'Pulse',
            baseUrl: 'http://pulse.lvh.me',
            navigation: [],
            failed: false,
          },
        ],
        loading: false,
        error: null,
      });

      const hubSettingsItem = {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };

      render(
        <Layout hubSettingsItem={hubSettingsItem}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      // hub should be auto-excluded when hubSettingsItem is provided
      expect(menuItems.some((item: { id: string }) => item.id === 'hub')).toBe(false);
      // pulse should still be present
      expect(menuItems.some((item: { id: string }) => item.id === 'pulse')).toBe(true);
      // hubSettingsItem should be at the end
      expect(menuItems[menuItems.length - 1].id).toBe('hub-settings');
      expect(menuItems[menuItems.length - 1].label).toBe('Hub Settings');
    });

    it('should not add hubSettingsItem when not provided', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: [
          {
            serviceId: 'hub',
            name: 'Hub',
            baseUrl: 'http://hub.lvh.me',
            navigation: [],
            failed: false,
          },
          {
            serviceId: 'pulse',
            name: 'Pulse',
            baseUrl: 'http://pulse.lvh.me',
            navigation: [],
            failed: false,
          },
        ],
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(2);
      expect(menuItems.some((item: { id: string }) => item.id === 'hub-settings')).toBe(false);
    });

    it('should place hubSettingsItem after staticMenuItems and serviceMenuItems', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: [
          {
            serviceId: 'pulse',
            name: 'Pulse',
            baseUrl: 'http://pulse.lvh.me',
            navigation: [],
            failed: false,
          },
        ],
        loading: false,
        error: null,
      });

      const staticMenuItems = [
        { id: 'static', label: 'Static', icon: 'bi bi-star', path: '/static' },
      ];
      const hubSettingsItem = {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };

      render(
        <Layout staticMenuItems={staticMenuItems} hubSettingsItem={hubSettingsItem}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(3);
      expect(menuItems[0].id).toBe('static'); // staticMenuItems first
      expect(menuItems[1].id).toBe('pulse'); // serviceMenuItems second
      expect(menuItems[2].id).toBe('hub-settings'); // hubSettingsItem last
    });

    it('should auto-exclude hub from manifests when hubSettingsItem is provided', () => {
      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: [
          {
            serviceId: 'hub',
            name: 'Hub',
            baseUrl: 'http://hub.lvh.me',
            navigation: [
              {
                module: './Settings',
                path: '/hub/settings',
                label: 'Settings',
                icon: 'bi bi-gear',
              },
            ],
            failed: false,
          },
          {
            serviceId: 'pulse',
            name: 'Pulse',
            baseUrl: 'http://pulse.lvh.me',
            navigation: [],
            failed: false,
          },
          {
            serviceId: 'service',
            name: 'Service',
            baseUrl: 'http://service.lvh.me',
            navigation: [],
            failed: false,
          },
        ],
        loading: false,
        error: null,
      });

      const hubSettingsItem = {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };

      render(
        <Layout hubSettingsItem={hubSettingsItem}>
          <div>Content</div>
        </Layout>,
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      // Should have pulse, service (hub auto-excluded)
      expect(menuItems).toHaveLength(3); // pulse, service, hub-settings
      expect(menuItems[0].id).toBe('pulse');
      expect(menuItems[1].id).toBe('service');
      expect(menuItems[2].id).toBe('hub-settings');
    });
  });
});

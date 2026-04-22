import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import * as uiKitExports from '@app/ui-kit';

const uiKit = uiKitExports as jest.Mocked<typeof uiKitExports>;

jest.mock('@app/ui-kit', () => ({
  useAuth: jest.fn(() => ({
    user: { username: 'Test User' },
    logout: jest.fn(),
  })),
  useMicroserviceManifests: jest.fn(),
  AppLayout: jest.fn(({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="app-layout">
      <div data-testid="menu-items">{JSON.stringify(props.menuItems)}</div>
      {children}
    </div>
  )),
  MenuItem: jest.fn(),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('excludeServices', () => {
    it('should filter out excluded services from manifests', () => {
      const mockManifests = [
        {
          serviceId: 'hub',
          name: 'Ject Hub',
          baseUrl: 'http://hub.lvh.me',
          navigation: [
            { module: './Settings', path: '/hub/settings', label: 'Settings', icon: 'bi bi-gear' },
          ],
        },
        {
          serviceId: 'pulse',
          name: 'Pulse Monitoring',
          baseUrl: 'http://pulse.lvh.me',
          navigation: [
            { module: './Dashboard', path: '/pulse', label: 'Dashboard', icon: 'bi bi-speedometer2' },
          ],
        },
        {
          serviceId: 'service',
          name: 'Service',
          baseUrl: 'http://service.lvh.me',
          navigation: [
            { module: './Dashboard', path: '/service', label: 'Dashboard', icon: 'bi bi-wrench' },
          ],
        },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
        loading: false,
        error: null,
      });

      render(
        <Layout excludeServices={['pulse']}>
          <div>Content</div>
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems.some((item: { id: string }) => item.id === 'hub')).toBe(true);
      expect(menuItems.some((item: { id: string }) => item.id === 'service')).toBe(true);
      expect(menuItems.some((item: { id: string }) => item.id === 'pulse')).toBe(false);
    });

    it('should exclude multiple services', () => {
      const mockManifests = [
        { serviceId: 'hub', name: 'Hub', baseUrl: 'http://hub.lvh.me', navigation: [] },
        { serviceId: 'pulse', name: 'Pulse', baseUrl: 'http://pulse.lvh.me', navigation: [] },
        { serviceId: 'service', name: 'Service', baseUrl: 'http://service.lvh.me', navigation: [] },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
        loading: false,
        error: null,
      });

      render(
        <Layout excludeServices={['hub', 'pulse']}>
          <div>Content</div>
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(1);
      expect(menuItems[0].id).toBe('service');
    });

    it('should show all services when excludeServices is empty', () => {
      const mockManifests = [
        { serviceId: 'hub', name: 'Hub', baseUrl: 'http://hub.lvh.me', navigation: [] },
        { serviceId: 'pulse', name: 'Pulse', baseUrl: 'http://pulse.lvh.me', navigation: [] },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(2);
    });
  });

  describe('hubSettingsItem', () => {
    it('should add hubSettingsItem at the end of menu items', () => {
      const mockManifests = [
        { serviceId: 'hub', name: 'Hub', baseUrl: 'http://hub.lvh.me', navigation: [] },
        { serviceId: 'pulse', name: 'Pulse', baseUrl: 'http://pulse.lvh.me', navigation: [] },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
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
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(3);
      expect(menuItems[2].id).toBe('hub-settings');
      expect(menuItems[2].label).toBe('Hub Settings');
    });

    it('should not add hubSettingsItem when not provided', () => {
      const mockManifests = [
        { serviceId: 'hub', name: 'Hub', baseUrl: 'http://hub.lvh.me', navigation: [] },
        { serviceId: 'pulse', name: 'Pulse', baseUrl: 'http://pulse.lvh.me', navigation: [] },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
        loading: false,
        error: null,
      });

      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(2);
      expect(menuItems.some((item: { id: string }) => item.id === 'hub-settings')).toBe(false);
    });

    it('should place hubSettingsItem after staticMenuItems and serviceMenuItems', () => {
      const mockManifests = [
        { serviceId: 'pulse', name: 'Pulse', baseUrl: 'http://pulse.lvh.me', navigation: [] },
      ];

      (uiKit.useMicroserviceManifests as jest.Mock).mockReturnValue({
        manifests: mockManifests,
        loading: false,
        error: null,
      });

      const staticMenuItems = [{ id: 'static', label: 'Static', icon: 'bi bi-star', path: '/static' }];
      const hubSettingsItem = { id: 'hub-settings', label: 'Hub Settings', icon: 'bi bi-gear', path: '/hub/settings' };

      render(
        <Layout staticMenuItems={staticMenuItems} hubSettingsItem={hubSettingsItem}>
          <div>Content</div>
        </Layout>
      );

      const menuItemsJson = screen.getByTestId('menu-items').textContent || '';
      const menuItems = JSON.parse(menuItemsJson);

      expect(menuItems).toHaveLength(3);
      expect(menuItems[0].id).toBe('static'); // staticMenuItems first
      expect(menuItems[1].id).toBe('pulse'); // serviceMenuItems second
      expect(menuItems[2].id).toBe('hub-settings'); // hubSettingsItem last
    });
  });
});

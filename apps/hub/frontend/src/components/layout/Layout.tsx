import type { ReactNode } from 'react';
import { AppLayout, MenuItem, useAuth, useMicroserviceManifests } from '@ject-hub/ui-kit';

/**
 * Hub layout component with dynamic microservice navigation.
 * Builds menu items from microservice manifests and combines with static Hub menu.
 */
export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { manifests } = useMicroserviceManifests();
  const username = user?.username || user?.email || 'User';

  /**
   * Static Hub menu items (always visible).
   */
  const hubMenuItems: MenuItem[] = [
    { id: 'hub-devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
    { id: 'hub-settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  ];

  /**
   * Dynamic menu items from microservice manifests.
   * Each service becomes a parent with its navigation items as children.
   * Paths from manifest already include service prefix (e.g., /pulse, /pulse/devices).
   */
  const serviceMenuItems: MenuItem[] = manifests.map((m) => ({
    id: m.serviceId,
    label: m.name,
    icon: 'bi bi-grid',
    children: m.navigation.map((n) => ({
      id: `${m.serviceId}-${n.path}`,
      label: n.label,
      icon: n.icon,
      path: n.path,
    })),
  }));

  const menuItems: MenuItem[] = [...hubMenuItems, ...serviceMenuItems];

  return (
    <AppLayout menuItems={menuItems} serviceName="Ject Hub" username={username} onLogout={logout}>
      {children}
    </AppLayout>
  );
}

import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem, useAuth } from '@ject-hub/ui-kit';

const controlMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
];

const lockedMenuItem: MenuItem[] = [
  {
    id: 'control-locked',
    label: 'Locked',
    icon: 'bi bi-lock',
    locked: true,
    path: '/lock',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const microservicesAccess = user?.microservices || {};
  const isControlLocked = microservicesAccess['control'] === false;

  const menuItems = isControlLocked ? lockedMenuItem : controlMenuItems;
  const hubSettingsItem = isControlLocked
    ? undefined
    : {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };
  const excludeServices = isControlLocked
    ? ['control', 'pulse', 'hub', 'service']
    : ['control', 'hub', 'service'];

  return (
    <UiKitLayout
      serviceName="Control"
      staticMenuItems={menuItems}
      excludeServices={excludeServices}
      hubSettingsItem={hubSettingsItem}
    >
      {children}
    </UiKitLayout>
  );
}

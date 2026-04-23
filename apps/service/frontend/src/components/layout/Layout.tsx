import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem, useAuth } from '@ject-hub/ui-kit';

/**
 * Static Service menu items (shown when Service is not locked).
 */
const serviceMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
];

/**
 * Locked menu item shown when Service is blocked.
 */
const lockedMenuItem: MenuItem[] = [
  {
    id: 'service-locked',
    label: 'Locked',
    icon: 'bi bi-lock',
    locked: true,
    path: '/lock',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const microservicesAccess = user?.microservices || {};
  const isServiceLocked = microservicesAccess['service'] === false;

  // If Service is locked, show only "Locked" menu item and hide everything else
  const menuItems = isServiceLocked ? lockedMenuItem : serviceMenuItems;
  const hubSettingsItem = isServiceLocked
    ? undefined
    : {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };
  // Always exclude service and hub from dynamic services.
  // When locked, also exclude 'pulse' since we can't load its manifest.
  const excludeServices = isServiceLocked ? ['service', 'pulse', 'hub'] : ['service', 'hub'];

  return (
    <UiKitLayout
      serviceName="Service"
      staticMenuItems={menuItems}
      excludeServices={excludeServices}
      hubSettingsItem={hubSettingsItem}
    >
      {children}
    </UiKitLayout>
  );
}

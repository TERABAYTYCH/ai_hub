import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem } from '@ject-hub/ui-kit';

/**
 * Static Service menu items.
 */
const serviceMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <UiKitLayout
      serviceName="Service"
      staticMenuItems={serviceMenuItems}
      excludeServices={['service']}
      hubSettingsItem={{
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      }}
    >
      {children}
    </UiKitLayout>
  );
}

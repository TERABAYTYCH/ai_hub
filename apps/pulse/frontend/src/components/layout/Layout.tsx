import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem } from '@ject-hub/ui-kit';

/**
 * Static Pulse menu items.
 */
const pulseMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'metrics', label: 'Metrics', icon: 'bi bi-graph-up', path: '/metrics' },
  { id: 'alerts', label: 'Alerts', icon: 'bi bi-bell', path: '/alerts' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <UiKitLayout
      serviceName="Pulse"
      staticMenuItems={pulseMenuItems}
      excludeServices={['pulse']}
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

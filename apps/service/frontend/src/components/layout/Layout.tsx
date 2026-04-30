import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem } from '@ject-hub/ui-kit';

/**
 * Service Layout со статическим меню.
 */
const serviceMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  { id: 'hub-settings', label: 'Hub Settings', icon: 'bi bi-gear', path: '/hub/settings' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <UiKitLayout serviceName="Service" staticMenuItems={serviceMenuItems}>
      {children}
    </UiKitLayout>
  );
}

import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem, useAuth } from '@ject-hub/ui-kit';

/**
 * Static Pulse menu items (shown when Pulse is not locked).
 */
const pulseMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'metrics', label: 'Metrics', icon: 'bi bi-graph-up', path: '/metrics' },
  { id: 'alerts', label: 'Alerts', icon: 'bi bi-bell', path: '/alerts' },
];

/**
 * Locked menu item shown when Pulse is blocked.
 */
const lockedMenuItem: MenuItem[] = [
  {
    id: 'pulse-locked',
    label: 'Locked',
    icon: 'bi bi-lock',
    locked: true,
    path: '/lock',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const microservicesAccess = user?.microservices || {};
  const isPulseLocked = microservicesAccess['pulse'] === false;

  // If Pulse is locked, show only "Locked" menu item and hide everything else
  const menuItems = isPulseLocked ? lockedMenuItem : pulseMenuItems;
  const hubSettingsItem = isPulseLocked
    ? undefined
    : {
        id: 'hub-settings',
        label: 'Hub Settings',
        icon: 'bi bi-gear',
        path: '/hub/settings',
      };
  // Exclude service from sidebar when Pulse is locked
  const excludeServices = isPulseLocked ? ['pulse', 'service'] : ['pulse'];

  return (
    <UiKitLayout
      serviceName="Pulse"
      staticMenuItems={menuItems}
      excludeServices={excludeServices}
      hubSettingsItem={hubSettingsItem}
    >
      {children}
    </UiKitLayout>
  );
}

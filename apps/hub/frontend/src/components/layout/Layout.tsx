/**
 * Hub Layout - реэкспорт Layout из ui-kit.
 * Статические меню Hub добавляются к динамической навигации.
 */
import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem, useAuth } from '@ject-hub/ui-kit';

/**
 * Static Hub menu items (always visible).
 */
const hubMenuItems: MenuItem[] = [
  { id: 'hub-devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'hub-settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  {
    id: 'hub-microservices-settings',
    label: 'Microservices',
    icon: 'bi bi-sliders',
    path: '/microservices-settings',
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const microservicesAccess = user?.microservices || {};

  return (
    <UiKitLayout
      serviceName="Ject Hub"
      staticMenuItems={hubMenuItems}
      excludeServices={['hub']}
      microservicesAccess={microservicesAccess}
    >
      {children}
    </UiKitLayout>
  );
}

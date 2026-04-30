import type { ReactNode } from 'react';
import { Layout as UiKitLayout, type MenuItem } from '@ject-hub/ui-kit';

/**
 * Hub Layout со статическим меню.
 * Включает навигацию для всех микросервисов (Pulse, Service, Control).
 */
const hubMenuItems: MenuItem[] = [
  { id: 'hub-devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'hub-settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  {
    id: 'hub-microservices',
    label: 'Microservices',
    icon: 'bi bi-sliders',
    path: '/microservices-settings',
  },
  {
    id: 'pulse-parent',
    label: 'Pulse',
    icon: 'bi bi-heartbeat',
    children: [
      { id: 'pulse-dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/pulse/dashboard' },
      { id: 'pulse-devices', label: 'Devices', icon: 'bi bi-grid', path: '/pulse/devices' },
      { id: 'pulse-metrics', label: 'Metrics', icon: 'bi bi-graph-up', path: '/pulse/metrics' },
      { id: 'pulse-alerts', label: 'Alerts', icon: 'bi bi-bell', path: '/pulse/alerts' },
      { id: 'pulse-settings', label: 'Settings', icon: 'bi bi-gear', path: '/pulse/settings' },
    ],
  },
  {
    id: 'service-parent',
    label: 'Service',
    icon: 'bi bi-wrench',
    children: [
      {
        id: 'service-dashboard',
        label: 'Dashboard',
        icon: 'bi bi-house',
        path: '/service/dashboard',
      },
      { id: 'service-devices', label: 'Devices', icon: 'bi bi-grid', path: '/service/devices' },
      { id: 'service-settings', label: 'Settings', icon: 'bi bi-gear', path: '/service/settings' },
    ],
  },
  {
    id: 'control-parent',
    label: 'Control',
    icon: 'bi bi-gear-wide-connected',
    children: [
      {
        id: 'control-dashboard',
        label: 'Dashboard',
        icon: 'bi bi-house',
        path: '/control/dashboard',
      },
      { id: 'control-devices', label: 'Devices', icon: 'bi bi-grid', path: '/control/devices' },
      { id: 'control-settings', label: 'Settings', icon: 'bi bi-gear', path: '/control/settings' },
    ],
  },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <UiKitLayout serviceName="Ject Hub" staticMenuItems={hubMenuItems}>
      {children}
    </UiKitLayout>
  );
}

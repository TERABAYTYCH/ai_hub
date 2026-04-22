import type { ReactNode } from 'react';
import { AppLayout, type MenuItem, useAuth, useMicroserviceManifests } from '@app/ui-kit';

/**
 * Hub Layout с динамической навигацией между микросервисами.
 * Строит menu items из manifest.json каждого сервиса.
 *
 * @param serviceName - Название сервиса для отображения в header
 * @param staticMenuItems - Статические пункты меню текущего сервиса (опционально)
 * @param excludeServices - Список serviceId для исключения из динамического меню (опционально)
 * @param hubSettingsItem - Пункт меню для Hub Settings (опционально). Если передан, Hub исключается из manifests.
 * @param children - Дочерние элементы
 */
export function Layout({
  children,
  serviceName = 'Ject Hub',
  staticMenuItems = [],
  excludeServices = [],
  hubSettingsItem,
}: {
  children: ReactNode;
  serviceName?: string;
  staticMenuItems?: MenuItem[];
  excludeServices?: string[];
  hubSettingsItem?: MenuItem;
}) {
  const { user, logout } = useAuth();
  const { manifests } = useMicroserviceManifests();
  const username = user?.username || user?.email || 'User';

  /**
   * If hubSettingsItem is provided, auto-exclude 'hub' from manifests to avoid duplication.
   * Hub will appear as hubSettingsItem (standalone) instead of as a service parent.
   */
  const effectiveExcludeServices = hubSettingsItem ? [...excludeServices, 'hub'] : excludeServices;

  /**
   * Filter manifests by excludeServices.
   * Excluded services will not appear in the dynamic menu.
   */
  const filteredManifests = manifests.filter(
    (m) => !effectiveExcludeServices.includes(m.serviceId),
  );

  /**
   * Dynamic menu items from microservice manifests.
   * Each service becomes a parent with its navigation items as children.
   * Paths from manifest already include service prefix (e.g., /pulse, /pulse/devices).
   */
  const serviceMenuItems: MenuItem[] = filteredManifests.map((m) => ({
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

  const menuItems: MenuItem[] = [
    ...staticMenuItems,
    ...serviceMenuItems,
    ...(hubSettingsItem ? [hubSettingsItem] : []),
  ];

  return (
    <AppLayout
      menuItems={menuItems}
      serviceName={serviceName}
      username={username}
      onLogout={logout}
    >
      {children}
    </AppLayout>
  );
}

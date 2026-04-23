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
 * @param microservicesAccess - Карта доступности микросервисов { serviceId: boolean } (опционально).
 *   Если microservicesAccess[serviceId] === false, сервис отображается как заблокированный.
 * @param children - Дочерние элементы
 */
export function Layout({
  children,
  serviceName = 'Ject Hub',
  staticMenuItems = [],
  excludeServices = [],
  hubSettingsItem,
  microservicesAccess,
}: {
  children: ReactNode;
  serviceName?: string;
  staticMenuItems?: MenuItem[];
  excludeServices?: string[];
  hubSettingsItem?: MenuItem;
  microservicesAccess?: Record<string, boolean>;
}) {
  const { user, logout } = useAuth();
  const { manifests } = useMicroserviceManifests();
  const username = user?.username || user?.email || 'User';

  /**
   * If hubSettingsItem is provided, auto-exclude 'hub' from manifests to avoid duplication.
   * Hub will appear as hubSettingsItem (standalone) instead of as a service parent.
   */
  const effectiveExcludeServices = [...excludeServices, 'hub'];

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
   *
   * If microservicesAccess[serviceId] === false, the service is locked:
   * - No children (single menu item)
   * - Icon: bi bi-lock
   * - No chevron
   * - Path: /{serviceId} (leads to lock page)
   */
  const serviceMenuItems: MenuItem[] = filteredManifests.map((m) => {
    const isLocked = (user?.microservices || microservicesAccess)?.[m.serviceId] === false;

    // Заблокированный сервис — без детей, с замком, клик ведёт на /{serviceId}
    if (isLocked) {
      return {
        id: m.serviceId,
        label: m.name,
        icon: 'bi bi-lock',
        locked: true,
        path: `/${m.serviceId}/lock`,
      };
    }

    // Доступный сервис — с детьми и шевоном
    return {
      id: m.serviceId,
      label: m.name,
      icon: 'bi bi-grid',
      children: m.navigation.map((n) => ({
        id: `${m.serviceId}-${n.path}`,
        label: n.label,
        icon: n.icon,
        path: n.path,
      })),
    };
  });

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

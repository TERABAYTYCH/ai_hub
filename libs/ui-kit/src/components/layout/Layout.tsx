import type { ReactNode } from 'react';
import { AppLayout, type MenuItem, useAuth } from '@ject-hub/ui-kit';

/**
 * Layout с полностью статическим меню.
 * Все пункты меню передаются через проп staticMenuItems.
 *
 * @param serviceName - Название сервиса для отображения в header
 * @param staticMenuItems - Статические пункты меню
 * @param children - Дочерние элементы
 */
export function Layout({
  children,
  serviceName = 'App',
  staticMenuItems = [],
}: {
  children: ReactNode;
  serviceName?: string;
  staticMenuItems?: MenuItem[];
}) {
  const { user, logout } = useAuth();
  const username = user?.username || user?.email || 'User';

  return (
    <AppLayout
      menuItems={staticMenuItems}
      serviceName={serviceName}
      username={username}
      onLogout={logout}
    >
      {children}
    </AppLayout>
  );
}

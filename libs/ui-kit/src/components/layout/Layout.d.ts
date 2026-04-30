import type { ReactNode } from 'react';
import { type MenuItem } from '@ject-hub/ui-kit';
/**
 * Layout с полностью статическим меню.
 * Все пункты меню передаются через проп staticMenuItems.
 *
 * @param serviceName - Название сервиса для отображения в header
 * @param staticMenuItems - Статические пункты меню
 * @param children - Дочерние элементы
 */
export declare function Layout({ children, serviceName, staticMenuItems, }: {
    children: ReactNode;
    serviceName?: string;
    staticMenuItems?: MenuItem[];
}): import("react/jsx-runtime").JSX.Element;

import { ReactNode } from 'react';
import { MenuItem } from './Sidebar';
interface AppLayoutProps {
    /** Дочерние элементы (контент страницы) */
    children: ReactNode;
    /** Массив элементов меню для сайдбара */
    menuItems: MenuItem[];
    /** Название сервиса (отображается в header) */
    serviceName?: string;
    /** Имя пользователя (отображается в header) */
    username?: string;
    /** Callback для логаута */
    onLogout?: () => void;
}
/**
 * Компонент-обертка для полноэкранного layout приложения.
 * Объединяет Header, Sidebar и контент в единую структуру.
 * Занимает 100vh и обеспечивает независимый скроллинг контента.
 */
export declare function AppLayout({ children, menuItems, serviceName, username, onLogout, }: AppLayoutProps): import("react/jsx-runtime").JSX.Element;
export {};

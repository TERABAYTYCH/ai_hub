import { ReactNode } from 'react';
import './Header.css';
interface HeaderProps {
    /** Название сервиса для отображения в header */
    serviceName?: string;
    /** Имя пользователя для отображения */
    username?: string;
    /** Callback для кнопки логаута */
    onLogout?: () => void;
    /** Иконка для header (например, bi bi-activity) */
    icon?: string;
    /** Дополнительные элементы справа от username */
    rightContent?: ReactNode;
}
/**
 * Компонент верхней панели (Header) для приложения.
 * Отображает название сервиса, имя пользователя, переключатель темы и кнопку выхода.
 * Поддерживает светлую и темную тему.
 */
export declare function Header({ serviceName, username, onLogout, icon, rightContent }: HeaderProps): import("react/jsx-runtime").JSX.Element;
export {};

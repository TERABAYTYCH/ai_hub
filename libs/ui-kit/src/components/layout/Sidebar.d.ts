/**
 * Элемент меню навигации с поддержкой вложенности и блокировки.
 */
export interface MenuItem {
    /** Уникальный идентификатор элемента */
    id: string;
    /** Текстовая метка пункта меню */
    label: string;
    /** Иконка (опционально, например bi bi-grid) */
    icon?: string;
    /** Путь для навигации (опционально для родительских элементов) */
    path?: string;
    /** Дочерние элементы (для создания вложенного меню) */
    children?: MenuItem[];
    /** Заблокирован ли элемент */
    locked?: boolean;
    /** Отключен ли элемент */
    disabled?: boolean;
}
interface SidebarProps {
    /** Массив элементов меню */
    items: MenuItem[];
    /** Путь по умолчанию для активной ссылки */
    defaultPath?: string;
}
/**
 * Компонент боковой панели (Sidebar) с навигацией и accordion-меню.
 * Поддерживает вложенные элементы с визуальной иерархией.
 * Подсвечивает только активный элемент.
 * Поддерживает светлую и темную тему.
 * Заблокированные элементы выглядят как disabled (opacity: 0.5), но кликабельны.
 */
export declare function Sidebar({ items, defaultPath }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export {};

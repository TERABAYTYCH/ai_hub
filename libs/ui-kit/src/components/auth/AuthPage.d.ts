import { ReactNode } from 'react';
import './AuthPage.css';
export interface AuthPageProps {
    /** Заголовок страницы */
    title: string;
    /** Дочерние элементы (форма) */
    children: ReactNode;
    /** Иконка для заголовка (опционально) */
    icon?: string;
}
/**
 * Универсальная обертка для страниц авторизации.
 * Обеспечивает консистентный внешний вид: фон, карточку, заголовок с кнопкой темы.
 */
export declare function AuthPage({ title, children, icon }: AuthPageProps): import("react/jsx-runtime").JSX.Element;

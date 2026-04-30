import { ReactNode } from 'react';
/**
 * Гостевой маршрут - перенаправляет на / если пользователь уже авторизован
 * Используется для страниц логина и регистрации
 */
export declare function GuestRoute({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;

import { ReactNode } from 'react';
/**
 * Защищенный маршрут - перенаправляет на /login если пользователь не авторизован
 */
export declare function ProtectedRoute({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;

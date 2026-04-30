import { ReactNode } from 'react';
export interface IUser {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    /** Microservices access map, e.g. { pulse: true, service: false } */
    microservices?: Record<string, boolean>;
}
interface AuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    isLoading: boolean;
}
interface AuthContextType extends AuthState {
    login: (accessToken: string, user?: IUser) => void;
    logout: () => void;
}
/**
 * AuthProvider with cross-domain cookie support.
 * Access token is stored in cookie, refresh token is HttpOnly.
 */
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};

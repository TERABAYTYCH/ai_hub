export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export { ThemeToggle } from './theme/ThemeToggle';
export { Header, Sidebar, AppLayout, type MenuItem } from './components/layout';
export { LoginForm, RegisterForm, AuthPage, ProtectedRoute, GuestRoute, type LoginFormProps, type RegisterFormProps, type RegisterData, type AuthPageProps } from './components/auth';
export { AuthProvider, useAuth, type IUser } from './providers/AuthProvider';
export * from './components/devices';
export { useMicroserviceManifests, REGISTERED_SERVICES, type UseMicroserviceManifestsResult } from './hooks/useMicroserviceManifests';

// Cookie utilities for cross-domain auth
export { getRootDomain, setAccessToken, getAccessToken, removeAccessToken } from './utils/cookies';

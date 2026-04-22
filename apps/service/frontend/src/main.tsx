import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, ProtectedRoute, GuestRoute, AppLayout } from '@app/ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './Settings';
import { useAuth } from '@app/ui-kit';
import { initAxiosInterceptors } from './api/axios';

// Initialize axios interceptors for global 401 handling
initAxiosInterceptors();

/** Элементы меню для приложения Service */
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: 'bi bi-wrench' },
  { id: 'devices', label: 'Devices', path: '/devices', icon: 'bi bi-grid' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'bi bi-gear' },
];

/** Компонент с layout для Service */
function ServiceLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const username = user?.username || user?.email || 'User';

  return (
    <AppLayout menuItems={menuItems} serviceName="Service" username={username} onLogout={logout}>
      {children}
    </AppLayout>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Публичные маршруты */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />

              {/* Защищенные маршруты с layout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ServiceLayout>
                      <DashboardPage />
                    </ServiceLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <ProtectedRoute>
                    <ServiceLayout>
                      <DevicesPage />
                    </ServiceLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <ServiceLayout>
                      <SettingsPage />
                    </ServiceLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}

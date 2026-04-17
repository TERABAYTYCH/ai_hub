import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, ProtectedRoute, GuestRoute, AppLayout } from '@ject-hub/ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from '@ject-hub/ui-kit';

/** Элементы меню для приложения Pulse */
const menuItems = [
  { title: 'Dashboard', path: '/', icon: 'bi bi-house' },
  { title: 'Metrics', path: '/metrics', icon: 'bi bi-graph-up' },
  { title: 'Alerts', path: '/alerts', icon: 'bi bi-bell' },
  { title: 'Settings', path: '/settings', icon: 'bi bi-gear' },
];

/** Компонент с layout для Pulse */
function PulseLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const username = user?.username || user?.email || 'User';
  
  return (
    <AppLayout
      menuItems={menuItems}
      serviceName="Pulse"
      username={username}
      onLogout={logout}
    >
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
                    <PulseLayout>
                      <DashboardPage />
                    </PulseLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metrics"
                element={
                  <ProtectedRoute>
                    <PulseLayout>
                      <div className="text-muted">Metrics page (placeholder)</div>
                    </PulseLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <PulseLayout>
                      <div className="text-muted">Alerts page (placeholder)</div>
                    </PulseLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <PulseLayout>
                      <div className="text-muted">Settings page (placeholder)</div>
                    </PulseLayout>
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

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@ject-hub/ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppLayout } from '@ject-hub/ui-kit';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { isAuthenticated, getUsername, clearAuthTokens } from './utils/auth';

/** Элементы меню для приложения Pulse */
const menuItems = [
  { title: 'Dashboard', path: '/', icon: 'bi bi-house' },
  { title: 'Metrics', path: '/metrics', icon: 'bi bi-graph-up' },
  { title: 'Alerts', path: '/alerts', icon: 'bi bi-bell' },
  { title: 'Settings', path: '/settings', icon: 'bi bi-gear' },
];

/** Компонент для защищенных маршрутов */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/** Обработчик логаута */
function handleLogout() {
  clearAuthTokens();
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Защищенные маршруты с layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout
                    menuItems={menuItems}
                    serviceName="Pulse"
                    username={getUsername()}
                    onLogout={handleLogout}
                  >
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/metrics"
              element={
                <ProtectedRoute>
                  <AppLayout
                    menuItems={menuItems}
                    serviceName="Pulse"
                    username={getUsername()}
                    onLogout={handleLogout}
                  >
                    <div className="text-muted">Metrics page (placeholder)</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute>
                  <AppLayout
                    menuItems={menuItems}
                    serviceName="Pulse"
                    username={getUsername()}
                    onLogout={handleLogout}
                  >
                    <div className="text-muted">Alerts page (placeholder)</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout
                    menuItems={menuItems}
                    serviceName="Pulse"
                    username={getUsername()}
                    onLogout={handleLogout}
                  >
                    <div className="text-muted">Settings page (placeholder)</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>,
  );
}

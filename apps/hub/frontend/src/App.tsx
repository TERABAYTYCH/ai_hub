import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import PulsePage from './pages/PulsePage';
import { AppLayout, MenuItem, ProtectedRoute, GuestRoute, useAuth } from '@ject-hub/ui-kit';

/** Элементы меню для приложения Hub */
const menuItems: MenuItem[] = [
  { title: 'Devices', path: '/devices', icon: 'bi bi-grid' },
  { title: 'Settings', path: '/settings', icon: 'bi bi-gear' },
  { title: 'Pulse', path: '/pulse', icon: 'bi bi-activity' },
];

/** Компонент с layout для Hub */
function HubLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const username = user?.username || user?.email || 'User';
  
  return (
    <AppLayout
      menuItems={menuItems}
      serviceName="Ject Hub"
      username={username}
      onLogout={logout}
    >
      {children}
    </AppLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/devices" replace />}
      />
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
      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <HubLayout>
              <DevicesPage />
            </HubLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <HubLayout>
              <SettingsPage />
            </HubLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pulse"
        element={
          <ProtectedRoute>
            <HubLayout>
              <PulsePage />
            </HubLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

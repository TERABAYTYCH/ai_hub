import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import { AppLayout, MenuItem } from '@ject-hub/ui-kit';

/** Элементы меню для приложения Hub */
const menuItems: MenuItem[] = [
  { title: 'Devices', path: '/devices', icon: 'bi bi-grid' },
  { title: 'Settings', path: '/settings', icon: 'bi bi-gear' },
];

/** Получить имя пользователя из localStorage */
function getUsername(): string {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.username || user.email || 'User';
    }
  } catch {
    // ignore
  }
  return 'User';
}

function App() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  /** Обработчик логаута с использованием SPA навигации */
  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/devices" /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/devices"
        element={
          isAuthenticated ? (
            <AppLayout
              menuItems={menuItems}
              serviceName="Ject Hub"
              username={getUsername()}
              onLogout={handleLogout}
            >
              <DevicesPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? (
            <AppLayout
              menuItems={menuItems}
              serviceName="Ject Hub"
              username={getUsername()}
              onLogout={handleLogout}
            >
              <SettingsPage />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;

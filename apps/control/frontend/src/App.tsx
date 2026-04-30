import { Navigate, useRoutes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './Settings';
import { ProtectedRoute, GuestRoute, useAuth } from '@ject-hub/ui-kit';
import { Layout } from './components/layout/Layout';

function LoadingScreen() {
  return <div className="text-center p-4">Loading...</div>;
}

function AppRoutes() {
  const staticRoutes = [
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    {
      path: '/login',
      element: (
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      ),
    },
    {
      path: '/register',
      element: (
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/devices',
      element: (
        <ProtectedRoute>
          <Layout>
            <DevicesPage />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      ),
    },
    { path: '/*', element: <Navigate to="/dashboard" replace /> },
  ];

  const routeElements = useRoutes(staticRoutes);

  return routeElements;
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppRoutes />;
}

export default App;

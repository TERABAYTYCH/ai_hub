import { Navigate, useRoutes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import MetricsPage from './Metrics';
import AlertsPage from './Alerts';
import SettingsPage from './Settings';
import { ProtectedRoute, GuestRoute, useAuth } from '@ject-hub/ui-kit';
import { Layout } from './components/layout/Layout';

/**
 * Loading screen component
 */
function LoadingScreen() {
  return <div className="text-center p-4">Loading...</div>;
}

/**
 * Main app routes component with static routes only.
 * Pulse is a Remote app that exports modules, not loads them.
 */
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
      path: '/metrics',
      element: (
        <ProtectedRoute>
          <Layout>
            <MetricsPage />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/alerts',
      element: (
        <ProtectedRoute>
          <Layout>
            <AlertsPage />
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
    // Catch-all: redirect unknown routes to /dashboard
    { path: '/*', element: <Navigate to="/dashboard" replace /> },
  ];

  return useRoutes(staticRoutes);
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppRoutes />;
}

export default App;

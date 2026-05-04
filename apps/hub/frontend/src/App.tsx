import { Navigate, useRoutes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import MicroservicesSettings from './pages/MicroservicesSettings';
import { ProtectedRoute, GuestRoute } from '@ject-hub/ui-kit';
import { Layout } from './components/layout/Layout';

// Remote modules loaded via Module Federation
const PulseDashboard = lazy(() => import('pulse/Dashboard'));
const PulseDevices = lazy(() => import('pulse/Devices'));
const PulseMetrics = lazy(() => import('pulse/Metrics'));
const PulseAlerts = lazy(() => import('pulse/Alerts'));
const PulseSettings = lazy(() => import('pulse/Settings'));

const ServiceDashboard = lazy(() => import('service/Dashboard'));
const ServiceDevices = lazy(() => import('service/Devices'));
const ServiceSettings = lazy(() => import('service/Settings'));

const ControlDashboard = lazy(() => import('control/Dashboard'));
const ControlDevices = lazy(() => import('control/Devices'));
const ControlSettings = lazy(() => import('control/Settings'));

function App() {
  const staticRoutes = [
    { path: '/', element: <Navigate to="/devices" replace /> },
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
    {
      path: '/microservices-settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <MicroservicesSettings />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Hub's own exposed modules
    {
      path: '/hub/settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Pulse routes
    { path: '/pulse', element: <Navigate to="/pulse/dashboard" /> },
    {
      path: '/pulse/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <PulseDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/pulse/devices',
      element: (
        <ProtectedRoute>
          <Layout>
            <PulseDevices />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/pulse/metrics',
      element: (
        <ProtectedRoute>
          <Layout>
            <PulseMetrics />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/pulse/alerts',
      element: (
        <ProtectedRoute>
          <Layout>
            <PulseAlerts />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/pulse/settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <PulseSettings />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Service routes
    { path: '/service', element: <Navigate to="/service/dashboard" /> },
    {
      path: '/service/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <ServiceDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/service/devices',
      element: (
        <ProtectedRoute>
          <Layout>
            <ServiceDevices />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/service/settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <ServiceSettings />
          </Layout>
        </ProtectedRoute>
      ),
    },

    // Control routes
    { path: '/control', element: <Navigate to="/control/dashboard" /> },
    {
      path: '/control/dashboard',
      element: (
        <ProtectedRoute>
          <Layout>
            <ControlDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/control/devices',
      element: (
        <ProtectedRoute>
          <Layout>
            <ControlDevices />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/control/settings',
      element: (
        <ProtectedRoute>
          <Layout>
            <ControlSettings />
          </Layout>
        </ProtectedRoute>
      ),
    },

    { path: '/*', element: <Navigate to="/" /> },
  ];

  const routeElements = useRoutes(staticRoutes);

  return (
    <Suspense
      fallback={
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      {routeElements}
    </Suspense>
  );
}

export default App;

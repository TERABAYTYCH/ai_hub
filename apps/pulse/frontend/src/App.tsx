import { Navigate, useRoutes } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import MetricsPage from './Metrics';
import AlertsPage from './Alerts';
import SettingsPage from './Settings';
import {
  ProtectedRoute,
  GuestRoute,
  useMicroserviceManifests,
  useAuth,
  LockPage,
} from '@ject-hub/ui-kit';
import { Layout } from './components/layout/Layout';

// Federation v2 API
import {
  __federation_method_setRemote,
  __federation_method_ensure,
  __federation_method_getRemote,
} from 'virtual:__federation__';

interface FederatedModule {
  default?: React.ComponentType;
}

/**
 * Load module dynamically via Federation v2 API
 */
const loadModule = async (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  __federation_method_setRemote(serviceId, {
    url: () => Promise.resolve(`http://${serviceId}.lvh.me/assets/remoteEntry.js`),
    from: 'vite',
    format: 'esm',
  });

  await __federation_method_ensure(serviceId);

  return __federation_method_getRemote(serviceId, modulePath) as FederatedModule;
};

/**
 * Lazy-loaded module component
 */
const LazyModule: React.FC<{ serviceId: string; modulePath: string }> = ({
  serviceId,
  modulePath,
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setComponent(null);
    setError(null);
    setLoading(true);

    loadModule(serviceId, modulePath)
      .then((mod) => {
        const Comp =
          (mod as { default?: React.ComponentType }).default ||
          (mod as unknown as React.ComponentType);
        if (typeof Comp === 'function') {
          setComponent(() => Comp);
        } else {
          setError(new Error('Invalid module: not a component'));
        }
      })
      .catch((err: Error) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [serviceId, modulePath]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-danger p-4">
        Error: {error.message}
        <br />
        <small className="text-muted">
          {serviceId}/{modulePath}
        </small>
      </div>
    );
  }

  if (!Component) {
    return <div className="text-center p-4">No component</div>;
  }

  return <Component />;
};

/**
 * Dynamic routes configuration from microservice manifests.
 * Checks microservices access and blocks locked services.
 */
const useDynamicRoutesConfig = (microservicesAccess: Record<string, boolean>) => {
  const { manifests } = useMicroserviceManifests();

  const routesConfig = useMemo(() => {
    const dynamicRoutes: { path: string; element: React.ReactNode }[] = [];

    for (const manifest of manifests) {
      if (!manifest.navigation || manifest.navigation.length === 0) continue;

      const isLocked = microservicesAccess[manifest.serviceId] === false;
      const serviceRoot = '/' + manifest.serviceId;

      if (isLocked) {
        // Show lock page for /{serviceId}/lock route
        dynamicRoutes.push({
          path: `${serviceRoot}/lock`,
          element: (
            <ProtectedRoute>
              <Layout>
                <LockPage serviceName={manifest.name} />
              </Layout>
            </ProtectedRoute>
          ),
        });
        // Redirect all other child routes to /{serviceId}/lock
        dynamicRoutes.push({
          path: `${serviceRoot}/*`,
          element: <Navigate to={`${serviceRoot}/lock`} replace />,
        });
        continue;
      }

      for (const navItem of manifest.navigation) {
        if (navItem.module && navItem.path) {
          dynamicRoutes.push({
            path: navItem.path,
            element: (
              <ProtectedRoute>
                <Layout>
                  <LazyModule serviceId={manifest.serviceId} modulePath={navItem.module} />
                </Layout>
              </ProtectedRoute>
            ),
          });
        }
      }
    }

    return dynamicRoutes;
  }, [manifests, microservicesAccess]);

  return routesConfig;
};

/**
 * Loading screen component
 */
function LoadingScreen() {
  return <div className="text-center p-4">Loading...</div>;
}

/**
 * Main app routes component - always renders routes, no conditional hooks
 */
function AppRoutes() {
  const { user } = useAuth();
  const microservicesAccess = user?.microservices || {};
  const isPulseLocked = microservicesAccess['pulse'] === false;

  const dynamicRoutesConfig = useDynamicRoutesConfig(microservicesAccess);

  // If Pulse is locked, redirect everything to /lock
  if (isPulseLocked) {
    const lockRoutes = [
      { path: '/*', element: <Navigate to="/lock" replace /> },
      {
        path: '/lock',
        element: (
          <Layout>
            <LockPage serviceName="Pulse" />
          </Layout>
        ),
      },
    ];
    const routeElements = useRoutes(lockRoutes);
    return routeElements;
  }

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

  const allRoutes = [...staticRoutes, ...dynamicRoutesConfig];
  const routeElements = useRoutes(allRoutes);

  return routeElements;
}

function App() {
  const { isLoading } = useAuth();

  // Always call hooks in the same order
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppRoutes />;
}

export default App;

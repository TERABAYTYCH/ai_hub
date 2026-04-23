import { Navigate, useRoutes } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
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

interface LoadedModule {
  default?: unknown;
}

/**
 * Loads module dynamically via Federation v2 API
 */
const loadModule = async (serviceId: string, modulePath: string): Promise<LoadedModule> => {
  __federation_method_setRemote(serviceId, {
    url: () => Promise.resolve(`http://${serviceId}.lvh.me/assets/remoteEntry.js`),
    from: 'vite',
    format: 'esm',
  });

  await __federation_method_ensure(serviceId);

  const module = await __federation_method_getRemote(serviceId, modulePath);
  return module as LoadedModule;
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
 * Waits for auth initialization before rendering dynamic routes.
 */
const useDynamicRoutesConfig = () => {
  const { user, isLoading } = useAuth();
  const { manifests } = useMicroserviceManifests();
  const microservicesAccess = user?.microservices || {};

  const routesConfig = useMemo(() => {
    // Wait for auth to initialize before rendering dynamic routes
    if (isLoading) {
      return [];
    }

    const dynamicRoutes: { path: string; element: React.ReactNode }[] = [];

    for (const manifest of manifests) {
      // Skip if no navigation items
      if (!manifest.navigation || manifest.navigation.length === 0) continue;

      const isLocked = microservicesAccess[manifest.serviceId] === false;
      const serviceRoot = '/' + manifest.serviceId;

      if (isLocked) {
        // Block ALL child routes - redirect to /lock
        dynamicRoutes.push({
          path: `${serviceRoot}/*`,
          element: <Navigate to={`${serviceRoot}/lock`} replace />,
        });
        continue;
      }

      // Add redirect from service root (e.g., /pulse) to first nav item (e.g., /pulse/dashboard)
      const firstNavItem = manifest.navigation[0];

      if (firstNavItem && firstNavItem.path) {
        dynamicRoutes.push({
          path: serviceRoot,
          element: <Navigate to={firstNavItem.path} replace />,
        });
      }

      // Add routes for each navigation item
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
  }, [manifests, microservicesAccess, isLoading]);

  return routesConfig;
};

function App() {
  // Static routes
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
    // Lock pages for blocked microservices (inside Layout)
    {
      path: '/pulse/lock',
      element: (
        <Layout>
          <LockPage serviceName="Pulse" returnUrl="/pulse" />
        </Layout>
      ),
    },
    {
      path: '/service/lock',
      element: (
        <Layout>
          <LockPage serviceName="Service" returnUrl="/service" />
        </Layout>
      ),
    },
  ];

  // Get dynamic routes from manifests
  const dynamicRoutesConfig = useDynamicRoutesConfig();

  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutesConfig];

  // Use useRoutes hook
  const routeElements = useRoutes(allRoutes);

  return routeElements;
}

export default App;

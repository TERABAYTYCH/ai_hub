import { Navigate, useRoutes } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import { ProtectedRoute, GuestRoute, useMicroserviceManifests } from '@ject-hub/ui-kit';
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
 * Загружает модуль динамически через Federation v2 API
 */
const loadModule = async (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  console.log(`[Federation] Loading ${serviceId}/${modulePath}`);
  
  __federation_method_setRemote(serviceId, {
    url: () => Promise.resolve(`http://${serviceId}.lvh.me/assets/remoteEntry.js`),
    from: 'vite',
    format: 'esm',
  });

  await __federation_method_ensure(serviceId);
  
  const module = await __federation_method_getRemote(serviceId, modulePath);
  console.log(`[Federation] Loaded ${serviceId}/${modulePath}:`, module);
  return module as FederatedModule;
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
    // Reset state on module change
    setComponent(null);
    setError(null);
    setLoading(true);

    loadModule(serviceId, modulePath)
      .then((mod) => {
        const Comp = (mod as any).default || mod;
        if (typeof Comp === 'function') {
          setComponent(() => Comp);
        } else {
          setError(new Error('Invalid module: not a component'));
        }
      })
      .catch((err: Error) => {
        console.error('[Federation] Load error:', err);
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
 * Includes redirects from service root to first navigation item.
 */
const useDynamicRoutesConfig = () => {
  const { manifests } = useMicroserviceManifests();

  const routesConfig = useMemo(() => {
    const dynamicRoutes: { path: string; element: React.ReactNode }[] = [];

    for (const manifest of manifests) {
      // Skip if no navigation items
      if (!manifest.navigation || manifest.navigation.length === 0) continue;

      // Add redirect from service root (e.g., /pulse) to first nav item (e.g., /pulse/dashboard)
      const serviceRoot = '/' + manifest.serviceId;
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
  }, [manifests]);

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

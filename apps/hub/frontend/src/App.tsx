import { Navigate, useRoutes } from 'react-router-dom';
import React, { useMemo, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';
import { ProtectedRoute, GuestRoute, useMicroserviceManifests } from '@ject-hub/ui-kit';
import { Layout } from './components/layout/Layout';

// Импорт методов Federation v2
import {
  __federation_method_setRemote,
  __federation_method_ensure,
  __federation_method_getRemote,
} from 'virtual:__federation__';

interface FederatedModule {
  default: React.ComponentType;
}

/**
 * Загружает модуль динамически через Federation v2 API
 */
const loadModule = async (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  console.log(`[Federation] Registering remote: ${serviceId}`);

  __federation_method_setRemote(serviceId, {
    url: () => Promise.resolve(`http://${serviceId}.lvh.me/assets/remoteEntry.js`),
    from: 'vite',
    format: 'esm',
  });

  console.log(`[Federation] Ensuring remote is ready: ${serviceId}`);
  await __federation_method_ensure(serviceId);
  console.log(`[Federation] Remote ready: ${serviceId}`);

  console.log(`[Federation] Getting module: ${serviceId}/${modulePath}`);
  try {
    const module = await __federation_method_getRemote(serviceId, modulePath);
    console.log(`[Federation] Raw module for ${modulePath}:`, module);
    console.log(`[Federation] module type:`, typeof module);
    console.log(`[Federation] module.default:`, (module as any).default);
    return module as FederatedModule;
  } catch (err) {
    console.error(`[Federation] Failed to get module: ${serviceId}/${modulePath}`, err);
    throw err;
  }
};

// Кеш модулей
const moduleCache = new Map<string, Promise<FederatedModule>>();

const getModule = (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  const key = `${serviceId}:${modulePath}`;
  if (!moduleCache.has(key)) {
    moduleCache.set(key, loadModule(serviceId, modulePath));
  }
  return moduleCache.get(key)!;
};

/**
 * Lazy-loaded module component
 */
const LazyModule: React.FC<{ serviceId: string; modulePath: string }> = ({
  serviceId,
  modulePath,
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getModule(serviceId, modulePath)
      .then((mod) => {
        // Обрабатываем оба случая: модуль с default и без
        const ComponentToRender = (mod as any).default || mod;
        console.log(`[Federation] ComponentToRender:`, ComponentToRender);

        if (typeof ComponentToRender === 'function') {
          setComponent(() => ComponentToRender);
        } else {
          console.error(`[Federation] Invalid component:`, ComponentToRender);
          setError(new Error('Module does not export a valid React component'));
        }
      })
      .catch((err: Error) => {
        console.error('Failed to load module:', serviceId, modulePath, err);
        setError(err);
      });
  }, [serviceId, modulePath]);

  if (error) {
    return <div className="text-danger p-4">Error: {error.message}</div>;
  }

  if (!Component) {
    return <div className="text-center p-4">Loading module...</div>;
  }

  return <Component />;
};

/**
 * Dynamic routes configuration from microservice manifests.
 * This is used with useRoutes() hook instead of <Routes> component.
 */
const useDynamicRoutesConfig = () => {
  const { manifests } = useMicroserviceManifests();

  const routesConfig = useMemo(() => {
    const dynamicRoutes: { path: string; element: React.ReactNode }[] = [];

    for (const manifest of manifests) {
      for (const navItem of manifest.navigation) {
        if (navItem.module) {
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

  // Use useRoutes hook instead of <Routes> component
  const routeElements = useRoutes(allRoutes);

  return routeElements;
}

export default App;

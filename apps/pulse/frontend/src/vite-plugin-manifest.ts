import type { ViteDevServer, Plugin } from 'vite';

/**
 * Vite плагин для генерации manifest.json на лету.
 * Читает exposes из Module Federation плагина и формирует манифест.
 */
export default function manifestPlugin(): Plugin {
  return {
    name: 'manifest-plugin',
    configureServer(server: ViteDevServer) {
      // Перехватываем GET /assets/manifest.json
      server.middlewares.use('/assets/manifest.json', (_req, res) => {
        // Маппинг module path -> имя модуля для навигации
        const moduleMapping: Record<string, { label: string; icon: string; path: string }> = {
          './Dashboard': { label: 'Dashboard', icon: 'bi bi-speedometer2', path: '/pulse' },
          './Devices': { label: 'Devices', icon: 'bi bi-device-hdd', path: '/pulse/devices' },
          './Metrics': { label: 'Metrics', icon: 'bi bi-graph-up', path: '/pulse/metrics' },
          './Alerts': { label: 'Alerts', icon: 'bi bi-bell', path: '/pulse/alerts' },
          './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/pulse/settings' },
        };

        // Собираем navigation массив из moduleMapping
        const navigation = Object.keys(moduleMapping).map((modulePath) => ({
          module: modulePath,
          path: moduleMapping[modulePath].path,
          label: moduleMapping[modulePath].label,
          icon: moduleMapping[modulePath].icon,
        }));

        // Use server config to get env variables
        const env = server.config.env || {};
        const baseUrl = env.VITE_SERVICE_BASE_URL || 'http://pulse.lvh.me';

        const manifest = {
          serviceId: 'pulse',
          name: 'Pulse Monitoring',
          baseUrl,
          navigation,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(manifest, null, 2));
      });
    },
  };
}

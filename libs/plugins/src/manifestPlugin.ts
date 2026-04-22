import type { Plugin, ViteDevServer } from 'vite';

/**
 * Конфигурация модуля для manifest
 */
export interface ManifestModuleConfig {
  label: string;
  icon: string;
  path: string;
}

/**
 * Опции для manifestPlugin
 */
export interface ManifestPluginOptions {
  /** ID сервиса (например, 'pulse', 'service') */
  serviceId: string;
  /** Название сервиса (например, 'Pulse Monitoring', 'Service') */
  serviceName: string;
  /** Базовый URL сервиса */
  baseUrl?: string;
  /** Маппинг модулей - ключ это module path (например, './Dashboard'), значение - конфиг */
  moduleMapping: Record<string, ManifestModuleConfig>;
}

/**
 * Manifest plugin - serves manifest.json dynamically
 * Параметризованный плагин для генерации manifest.json
 */
export function manifestPlugin(options: ManifestPluginOptions): Plugin {
  const { serviceId, serviceName, baseUrl, moduleMapping } = options;

  return {
    name: 'manifest-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/assets/manifest.json', (_req, res) => {
        const navigation = Object.keys(moduleMapping).map((modulePath) => ({
          module: modulePath,
          path: moduleMapping[modulePath].path,
          label: moduleMapping[modulePath].label,
          icon: moduleMapping[modulePath].icon,
        }));

        const manifest = {
          serviceId,
          name: serviceName,
          baseUrl: baseUrl || `http://${serviceId}.lvh.me`,
          navigation,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(manifest, null, 2));
      });
    },
  };
}

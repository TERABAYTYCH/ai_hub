import { defineConfig } from 'vite';
import type { Plugin, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import fs from 'fs';

// Exposes configuration - sync with federation plugin exposes
const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Metrics': './src/Metrics',
  './Alerts': './src/Alerts',
  './Settings': './src/Settings',
};

/**
 * Manifest plugin - serves manifest.json dynamically
 * Иконки синхронизированы с main.tsx Pulse
 */
function manifestPlugin(): Plugin {
  return {
    name: 'manifest-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/assets/manifest.json', (_req, res) => {
        console.warn('MANIFEST GENERATOR');
        // Иконки синхронизированы с apps/pulse/frontend/src/main.tsx
        const moduleMapping: Record<string, { label: string; icon: string; path: string }> = {
          './Dashboard': { label: 'Dashboard', icon: 'bi bi-house', path: '/pulse/dashboard' },
          './Devices': { label: 'Devices', icon: 'bi bi-grid', path: '/pulse/devices' },
          './Metrics': { label: 'Metrics', icon: 'bi bi-graph-up', path: '/pulse/metrics' },
          './Alerts': { label: 'Alerts', icon: 'bi bi-bell', path: '/pulse/alerts' },
          './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/pulse/settings' },
        };

        const navigation = Object.keys(moduleMapping).map((modulePath) => ({
          module: modulePath,
          path: moduleMapping[modulePath].path,
          label: moduleMapping[modulePath].label,
          icon: moduleMapping[modulePath].icon,
        }));

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

/**
 * Плагин для отдачи любых файлов из /assets/ (включая remoteEntry.js) напрямую из папки dist/assets/
 */
function serveDistAssetsPlugin(): Plugin {
  // Базовая карта MIME-типов для корректной отдачи статики
  const mimeTypes: Record<string, string> = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  return {
    name: 'serve-dist-assets-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        // Проверяем, что запрос начинается с /assets/
        if (req.url && req.url.startsWith('/assets/')) {
          // Очищаем URL от query-параметров (например, ?v=123)
          const urlPath = req.url.split('?')[0];

          // Формируем абсолютный путь к файлу в папке dist
          // urlPath уже содержит '/assets/...', поэтому мы просто приклеиваем его к dist
          const filePath = path.resolve(__dirname, 'dist', `.${urlPath}`);

          try {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const contentType = mimeTypes[ext] || 'application/octet-stream';

              res.setHeader('Content-Type', contentType);
              res.setHeader('Access-Control-Allow-Origin', '*');

              // Используем стрим для отдачи файла (лучше для производительности)
              const stream = fs.createReadStream(filePath);
              stream.pipe(res);
              return;
            }
          } catch (err) {
            console.error(`[serve-dist-assets] Ошибка при чтении файла ${filePath}:`, err);
          }
        }

        // Передаем управление дальше, если это не /assets/ или файл не найден в dist
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    manifestPlugin(),
    serveDistAssetsPlugin(),
    react(),
    federation({
      name: 'pulse',
      filename: 'remoteEntry.js',
      exposes,
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  resolve: {
    alias: {
      '@app/ui-kit': path.resolve(__dirname, '../../../libs/ui-kit/src'),
      '@app/contracts': path.resolve(__dirname, '../../../libs/contracts/src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['hub.lvh.me', 'pulse.lvh.me', 'lvh.me', 'localhost'],
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

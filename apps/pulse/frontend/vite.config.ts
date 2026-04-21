import { defineConfig } from 'vite';
import type { Plugin, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import fs from 'fs';
// import manifestPlugin from './src/vite-plugin-manifest';

function manifestPlugin(): Plugin {
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

/**
 * Vite plugin for serving remoteEntry.js from dist/assets/
 * In dev mode Vite generates files in memory, but Module Federation
 * requires physical remoteEntry.js file for Host applications
 */
function remoteEntryPlugin() {
  return {
    name: 'remote-entry-plugin',
    configureServer(server: ViteDevServer) {
      // Intercept requests to remoteEntry.js and serve from dist/assets/
      server.middlewares.use('/assets/remoteEntry.js', (_req, res) => {
        const filePath = path.join(__dirname, 'dist/assets/remoteEntry.js');
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(content);
        } else {
          res.statusCode = 404;
          res.end('remoteEntry.js not found. Run "yarn build" first.');
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    remoteEntryPlugin(),
    manifestPlugin(),
    react(),
    federation({
      name: 'pulse',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/Dashboard',
        './Metrics': './src/Metrics',
        './Alerts': './src/Alerts',
        './Settings': './src/Settings',
        './Devices': './src/Devices',
      },
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

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { manifestPlugin, serveDistAssetsPlugin } from '@app/plugins';

// Exposes configuration - sync with federation plugin exposes
const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Metrics': './src/Metrics',
  './Alerts': './src/Alerts',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    manifestPlugin({
      serviceId: 'pulse',
      serviceName: 'Pulse Monitoring',
      moduleMapping: {
        './Dashboard': { label: 'Dashboard', icon: 'bi bi-house', path: '/pulse/dashboard' },
        './Devices': { label: 'Devices', icon: 'bi bi-grid', path: '/pulse/devices' },
        './Metrics': { label: 'Metrics', icon: 'bi bi-graph-up', path: '/pulse/metrics' },
        './Alerts': { label: 'Alerts', icon: 'bi bi-bell', path: '/pulse/alerts' },
        './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/pulse/settings' },
      },
    }),
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

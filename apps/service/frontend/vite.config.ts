import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { manifestPlugin, serveDistAssetsPlugin } from '@app/plugins';

// Exposes configuration - sync with federation plugin exposes
const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    manifestPlugin({
      serviceId: 'service',
      serviceName: 'Service',
      moduleMapping: {
        './Dashboard': { label: 'Dashboard', icon: 'bi bi-wrench', path: '/service/dashboard' },
        './Devices': { label: 'Devices', icon: 'bi bi-grid', path: '/service/devices' },
        './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/service/settings' },
      },
    }),
    serveDistAssetsPlugin(),
    react(),
    federation({
      name: 'service',
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
    port: 5175,
    strictPort: false,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['hub.lvh.me', 'pulse.lvh.me', 'service.lvh.me', 'lvh.me', 'localhost'],
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

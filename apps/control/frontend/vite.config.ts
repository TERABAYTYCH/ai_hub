import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { manifestPlugin, serveDistAssetsPlugin } from '@app/plugins';

const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    manifestPlugin({
      serviceId: 'control',
      serviceName: 'Control',
      moduleMapping: {
        './Dashboard': { label: 'Dashboard', icon: 'bi bi-house', path: '/control/dashboard' },
        './Devices': { label: 'Devices', icon: 'bi bi-grid', path: '/control/devices' },
        './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/control/settings' },
      },
    }),
    serveDistAssetsPlugin(),
    react(),
    federation({
      name: 'control',
      filename: 'remoteEntry.js',
      exposes,
      remotes: {
        'dynamic-remote': 'http://hub.lvh.me/assets/remoteEntry.js',
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
    port: 5176,
    strictPort: false,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['hub.lvh.me', 'pulse.lvh.me', 'service.lvh.me', 'control.lvh.me', 'lvh.me', 'localhost'],
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

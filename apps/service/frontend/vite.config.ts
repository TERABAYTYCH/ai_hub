import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';

const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'service',
      filename: 'remoteEntry.js',
      exposes,
      shared: ['react', 'react-dom', 'react-router-dom'],
      dev: {
        remoteHmr: true,
        disableDynamicRemoteTypeHints: true,
      },
      dts: false,
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

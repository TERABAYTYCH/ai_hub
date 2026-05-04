import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';

const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/Devices',
  './Metrics': './src/Metrics',
  './Alerts': './src/Alerts',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'pulse',
      filename: 'remoteEntry.js',
      exposes,
      shared: {
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
        'react-router-dom': {
          singleton: true,
        },
      },
      remotes: {
        hub: {
          type: 'module',
          name: 'hub',
          entry: 'http://hub.lvh.me:5173/remoteEntry.js',
          entryGlobalName: 'hub',
          shareScope: 'default',
        },
      },
      dts: {
        generateTypes: true,
        extraOptions: {
          typeHints: {
            port: 16323, // для второго контейнера
          },
        },
      },
      // Отключаем хардкодный WebSocket сервер на 16322
      dev: {
        disableDynamicRemoteTypeHints: true,
      },
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
    allowedHosts: ['hub.lvh.me', 'pulse.lvh.me', 'service.lvh.me', 'lvh.me', 'localhost'],
    hmr: {
      port: 5174,
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

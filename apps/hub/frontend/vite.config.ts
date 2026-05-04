import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'hub',
      filename: 'remoteEntry.js',
      exposes: {
        './Settings': './src/pages/SettingsPage',
      },
      remotes: {
        pulse: {
          type: 'module',
          name: 'pulse',
          entry: 'http://pulse.lvh.me/remoteEntry.js',
          entryGlobalName: 'pulse',
          shareScope: 'default',
        },
        service: {
          type: 'module',
          name: 'service',
          entry: 'http://service.lvh.me/remoteEntry.js',
          entryGlobalName: 'service',
          shareScope: 'default',
        },
        control: {
          type: 'module',
          name: 'control',
          entry: 'http://control.lvh.me/remoteEntry.js',
          entryGlobalName: 'control',
          shareScope: 'default',
        },
      },
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
      dts: true,
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
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'hub.lvh.me',
      'pulse.lvh.me',
      'service.lvh.me',
      'control.lvh.me',
      'lvh.me',
      'localhost',
    ],
    hmr: {
      port: 5173,
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

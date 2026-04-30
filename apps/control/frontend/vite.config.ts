import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';

const exposes: Record<string, string> = {
  './Dashboard': './src/Dashboard',
  './Devices': './src/pages/DevicesPage',
  './Settings': './src/Settings',
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'control',
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
    port: 5176,
    strictPort: false,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: [
      'hub.lvh.me',
      'pulse.lvh.me',
      'service.lvh.me',
      'control.lvh.me',
      'lvh.me',
      'localhost',
    ],
    hmr: {
      port: 5176,
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { manifestPlugin, serveDistAssetsPlugin } from '@app/plugins';

const exposes: Record<string, string> = {
  './Settings': './src/pages/SettingsPage',
};

export default defineConfig({
  plugins: [
    manifestPlugin({
      serviceId: 'hub',
      serviceName: 'Ject Hub',
      moduleMapping: {
        './Settings': { label: 'Settings', icon: 'bi bi-gear', path: '/hub/settings' },
      },
    }),
    serveDistAssetsPlugin(),
    react(),
    federation({
      name: 'hub',
      exposes,
      filename: 'remoteEntry.js',
      remotes: {
        // Пустой заполнитель для динамических удаленных модулей
        'dynamic-remote': 'http://pulse.lvh.me/assets/remoteEntry.js',
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
    port: 5173,
    strictPort: false,
    allowedHosts: ['hub.lvh.me', 'pulse.lvh.me', 'service.lvh.me', 'lvh.me', 'localhost'],
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

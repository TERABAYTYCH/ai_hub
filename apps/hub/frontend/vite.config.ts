import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import fs from 'fs';

/**
 * Vite плагин для отдачи remoteEntry.js из папки dist/assets/
 * В dev режиме Vite генерирует файлы в память, но Module Federation
 * требует физический файл remoteEntry.js
 */
function remoteEntryPlugin() {
  return {
    name: 'remote-entry-plugin',
    configureServer(server: ViteDevServer) {
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
    react(),
    federation({
      name: 'hub',
      remotes: {
        pulse: 'http://pulse.localhost/assets/remoteEntry.js',
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
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

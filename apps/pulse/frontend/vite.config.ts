import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'pulse',
      filename: 'remoteEntry.js',
      exposes: {
        './PulseDashboard': './src/PulseDashboard',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
  },
  build: {
    target: 'esnext',
    minify: false,
  },
});

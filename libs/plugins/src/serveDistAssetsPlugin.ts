import type { Plugin, ViteDevServer } from 'vite';
import path from 'path';
import fs from 'fs';

/**
 * Плагин для отдачи статики из dist/assets/
 * process.cwd() указывает на корень приложения (apps/pulse/frontend),
 * откуда запущен Vite.
 */
export function serveDistAssetsPlugin(): Plugin {
  const mimeTypes: Record<string, string> = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  return {
    name: 'serve-dist-assets-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/')) {
          const urlPath = req.url.split('?')[0];
          // process.cwd() = apps/pulse/frontend или apps/service/frontend
          const filePath = path.resolve(process.cwd(), 'dist', `.${urlPath}`);

          try {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const contentType = mimeTypes[ext] || 'application/octet-stream';

              res.setHeader('Content-Type', contentType);
              res.setHeader('Access-Control-Allow-Origin', '*');

              const stream = fs.createReadStream(filePath);
              stream.pipe(res);
              return;
            }
          } catch (err) {
            console.error(`[serve-dist-assets] Error reading file ${filePath}:`, err);
          }
        }

        next();
      });
    },
  };
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveDistAssetsPlugin = serveDistAssetsPlugin;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Плагин для отдачи статики из dist/assets/
 * process.cwd() указывает на корень приложения (apps/pulse/frontend),
 * откуда запущен Vite.
 */
function serveDistAssetsPlugin() {
    const mimeTypes = {
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
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url && req.url.startsWith('/assets/')) {
                    const urlPath = req.url.split('?')[0];
                    // process.cwd() = apps/pulse/frontend или apps/service/frontend
                    const filePath = path_1.default.resolve(process.cwd(), 'dist', `.${urlPath}`);
                    try {
                        if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isFile()) {
                            const ext = path_1.default.extname(filePath).toLowerCase();
                            const contentType = mimeTypes[ext] || 'application/octet-stream';
                            res.setHeader('Content-Type', contentType);
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            const stream = fs_1.default.createReadStream(filePath);
                            stream.pipe(res);
                            return;
                        }
                    }
                    catch (err) {
                        console.error(`[serve-dist-assets] Error reading file ${filePath}:`, err);
                    }
                }
                next();
            });
        },
    };
}

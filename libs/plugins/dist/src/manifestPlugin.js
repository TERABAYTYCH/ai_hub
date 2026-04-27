"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestPlugin = manifestPlugin;
/**
 * Manifest plugin - serves manifest.json dynamically
 * Параметризованный плагин для генерации manifest.json
 */
function manifestPlugin(options) {
    const { serviceId, serviceName, baseUrl, moduleMapping } = options;
    return {
        name: 'manifest-plugin',
        configureServer(server) {
            server.middlewares.use('/assets/manifest.json', (_req, res) => {
                const navigation = Object.keys(moduleMapping).map((modulePath) => ({
                    module: modulePath,
                    path: moduleMapping[modulePath].path,
                    label: moduleMapping[modulePath].label,
                    icon: moduleMapping[modulePath].icon,
                }));
                const manifest = {
                    serviceId,
                    name: serviceName,
                    baseUrl: baseUrl || `http://${serviceId}.lvh.me`,
                    navigation,
                };
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(manifest, null, 2));
            });
        },
    };
}

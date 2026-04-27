import type { Plugin } from 'vite';
/**
 * Плагин для отдачи статики из dist/assets/
 * process.cwd() указывает на корень приложения (apps/pulse/frontend),
 * откуда запущен Vite.
 */
export declare function serveDistAssetsPlugin(): Plugin;

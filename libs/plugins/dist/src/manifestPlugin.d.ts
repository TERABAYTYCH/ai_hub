import type { Plugin } from 'vite';
/**
 * Конфигурация модуля для manifest
 */
export interface ManifestModuleConfig {
    label: string;
    icon: string;
    path: string;
}
/**
 * Опции для manifestPlugin
 */
export interface ManifestPluginOptions {
    /** ID сервиса (например, 'pulse', 'service') */
    serviceId: string;
    /** Название сервиса (например, 'Pulse Monitoring', 'Service') */
    serviceName: string;
    /** Базовый URL сервиса */
    baseUrl?: string;
    /** Маппинг модулей - ключ это module path (например, './Dashboard'), значение - конфиг */
    moduleMapping: Record<string, ManifestModuleConfig>;
}
/**
 * Manifest plugin - serves manifest.json dynamically
 * Параметризованный плагин для генерации manifest.json
 */
export declare function manifestPlugin(options: ManifestPluginOptions): Plugin;

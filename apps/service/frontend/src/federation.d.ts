/**
 * Type declarations for Vite Module Federation v2 virtual module.
 * Provides TypeScript support for dynamic remote loading API.
 */
declare module 'virtual:__federation__' {
  export function __federation_method_setRemote(
    remoteName: string,
    options: {
      url: () => Promise<string>;
      format: 'esm' | 'var' | 'systemjs';
      from: 'vite' | 'webpack';
    },
  ): void;

  export function __federation_method_getRemote<T = unknown>(
    remoteName: string,
    exposedModule: string,
  ): Promise<T>;

  export function __federation_method_ensure(remoteName: string): Promise<void>;
}

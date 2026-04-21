/// <reference types="vite/client" />

/**
 * Type declarations for Federation v2 virtual module.
 */
declare module 'virtual:__federation__' {
  export const __federation_method_setRemote: (
    remoteName: string,
    options: {
      url: () => Promise<string>;
      from: 'vite';
      format: 'esm' | 'cjs';
    },
  ) => void;

  export const __federation_method_getRemote: (
    remoteName: string,
    modulePath: string,
  ) => Promise<unknown>;

  export const __federation_method_import: (
    remoteName: string,
    modulePath: string,
  ) => Promise<unknown>;
}

/**
 * Type declarations for Module Federation remote modules.
 * Allows TypeScript to understand dynamic imports from remotes.
 */
declare module 'pulse/Dashboard' {
  import { ComponentType } from 'react';

  /** Dashboard component from remote Pulse module */
  const Dashboard: ComponentType;
  export default Dashboard;
}

declare module 'pulse/Devices' {
  import { ComponentType } from 'react';

  /** Devices component from remote Pulse module */
  const Devices: ComponentType;
  export default Devices;
}

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

/**
 * Type declarations for federated remote modules.
 * These provide TypeScript support for static import() expressions.
 */
declare module 'pulse/Dashboard' {
  import type { ComponentType } from 'react';
  const Dashboard: ComponentType;
  export default Dashboard;
}

declare module 'pulse/Devices' {
  import type { ComponentType } from 'react';
  const Devices: ComponentType;
  export default Devices;
}

declare module 'pulse/Metrics' {
  import type { ComponentType } from 'react';
  const Metrics: ComponentType;
  export default Metrics;
}

declare module 'pulse/Alerts' {
  import type { ComponentType } from 'react';
  const Alerts: ComponentType;
  export default Alerts;
}

declare module 'pulse/Settings' {
  import type { ComponentType } from 'react';
  const Settings: ComponentType;
  export default Settings;
}

declare module 'service/Dashboard' {
  import type { ComponentType } from 'react';
  const Dashboard: ComponentType;
  export default Dashboard;
}

declare module 'service/Devices' {
  import type { ComponentType } from 'react';
  const Devices: ComponentType;
  export default Devices;
}

declare module 'service/Settings' {
  import type { ComponentType } from 'react';
  const Settings: ComponentType;
  export default Settings;
}

declare module 'control/Dashboard' {
  import type { ComponentType } from 'react';
  const Dashboard: ComponentType;
  export default Dashboard;
}

declare module 'control/Devices' {
  import type { ComponentType } from 'react';
  const Devices: ComponentType;
  export default Devices;
}

declare module 'control/Settings' {
  import type { ComponentType } from 'react';
  const Settings: ComponentType;
  export default Settings;
}

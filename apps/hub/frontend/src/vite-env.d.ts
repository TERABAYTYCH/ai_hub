/// <reference types="vite/client" />

/**
 * Декларации типов для Module Federation remote модулей.
 * Позволяет TypeScript понимать динамические импорты из remote.
 */
declare module 'pulse/PulseDashboard' {
  import { ComponentType } from 'react';

  /** Компонент Dashboard из удалённого модуля Pulse */
  const PulseDashboard: ComponentType;
  export default PulseDashboard;
}

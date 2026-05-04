import React from 'react';
import { DeviceStatus } from '@ject-hub/contracts/hub/devices';
interface StatusBadgeProps {
  /** Статус устройства */
  status: DeviceStatus;
}
/**
 * Компонент бейджа статуса устройства
 * Отображает цветной badge с текстом статуса
 */
export declare const StatusBadge: React.FC<StatusBadgeProps>;
export {};

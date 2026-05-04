import React from 'react';
import { Badge } from 'react-bootstrap';
import { DeviceStatus } from '@ject-hub/contracts/hub/devices';

/**
 * Соответствие статусов устройства цветам бейджа
 */
const statusColors: Record<DeviceStatus, string> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  MAINTENANCE: 'warning',
};

interface StatusBadgeProps {
  /** Статус устройства */
  status: DeviceStatus;
}

/**
 * Компонент бейджа статуса устройства
 * Отображает цветной badge с текстом статуса
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <Badge bg={statusColors[status]}>{status}</Badge>
);

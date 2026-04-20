import React from 'react';
import { IDevice } from '@app/contracts/hub/devices';
import { StatusBadge } from './StatusBadge';

interface DeviceRowProps {
  /** Данные устройства */
  device: IDevice;
  /** Callback для редактирования */
  onEdit: (device: IDevice) => void;
  /** Callback для удаления */
  onDelete: (id: string) => void;
}

/**
 * Строка таблицы устройств
 * Отображает информацию об одном устройстве с кнопками действий
 */
export const DeviceRow: React.FC<DeviceRowProps> = ({ device, onEdit, onDelete }) => (
  <tr>
    <td>{device.name}</td>
    <td>{device.type}</td>
    <td><StatusBadge status={device.status} /></td>
    <td>{device.description || '-'}</td>
    <td>{new Date(device.createdAt).toLocaleDateString()}</td>
    <td>
      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => onEdit(device)}>
        Edit
      </button>
      <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(device.id)}>
        Delete
      </button>
    </td>
  </tr>
);

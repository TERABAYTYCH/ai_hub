import React from 'react';
import { Table } from 'react-bootstrap';
import { IDevice } from '@app/contracts/hub/devices';
import { DeviceRow } from './DeviceRow';

interface DeviceTableProps {
  /** Список устройств */
  devices: IDevice[];
  /** Callback для редактирования */
  onEdit: (device: IDevice) => void;
  /** Callback для удаления */
  onDelete: (id: string) => void;
}

/**
 * Таблица устройств
 * Отображает список всех устройств с возможностью редактирования и удаления
 */
export const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onEdit, onDelete }) => (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Status</th>
        <th>Description</th>
        <th>Created</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {devices.map((device) => (
        <DeviceRow key={device.id} device={device} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </tbody>
  </Table>
);

import React from 'react';
import { IDevice } from '@app/contracts/hub/devices';
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
export declare const DeviceTable: React.FC<DeviceTableProps>;
export {};

import React from 'react';
import { IDevice } from '@app/contracts/hub/devices';
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
export declare const DeviceRow: React.FC<DeviceRowProps>;
export {};

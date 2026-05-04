import { IDevice, UpdateDeviceRequestDto } from '@ject-hub/contracts/hub/devices';
/**
 * Получить список всех устройств
 */
export declare function getDevices(): Promise<IDevice[]>;
/**
 * Обновить устройство
 */
export declare function updateDevice(id: string, data: UpdateDeviceRequestDto): Promise<IDevice>;
/**
 * Удалить устройство
 */
export declare function deleteDevice(id: string): Promise<void>;

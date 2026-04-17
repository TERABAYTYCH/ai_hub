/**
 * Статус устройства в системе
 */
export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

/**
 * Интерфейс устройства (мастер-база)
 */
export interface IDevice {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * DTO для создания нового устройства
 */
export interface CreateDeviceRequestDto {
  name: string;
  type: string;
  description?: string;
}

/**
 * DTO для обновления устройства (частичное обновление)
 */
export interface UpdateDeviceRequestDto {
  name?: string;
  type?: string;
  status?: DeviceStatus;
  description?: string;
}

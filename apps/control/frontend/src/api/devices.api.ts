import { IDevice, UpdateDeviceRequestDto } from '@app/contracts/hub/devices';
import { authFetch } from '../utils/auth';

const API_URL = String(import.meta.env.VITE_API_URL) || '/api';

export async function getDevices(): Promise<IDevice[]> {
  const response = await authFetch(`${API_URL}/devices`);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return (await response.json()) as IDevice[];
}

export async function updateDevice(id: string, data: UpdateDeviceRequestDto): Promise<IDevice> {
  const response = await authFetch(`${API_URL}/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update device');
  }
  return (await response.json()) as IDevice;
}

export async function deleteDevice(id: string): Promise<void> {
  const response = await authFetch(`${API_URL}/devices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete device');
  }
}
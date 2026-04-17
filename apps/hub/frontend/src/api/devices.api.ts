import {
  IDevice,
  CreateDeviceRequestDto,
  UpdateDeviceRequestDto,
} from '@app/contracts/hub/devices';
import { authFetch } from '../utils/auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

export async function getDevices(): Promise<IDevice[]> {
  const response = await authFetch(`${API_BASE_URL}/devices`);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return (await response.json()) as IDevice[];
}

export async function getDevice(id: string): Promise<IDevice> {
  const response = await authFetch(`${API_BASE_URL}/devices/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch device');
  }
  return (await response.json()) as IDevice;
}

export async function createDevice(data: CreateDeviceRequestDto): Promise<IDevice> {
  const response = await authFetch(`${API_BASE_URL}/devices`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create device');
  }
  return (await response.json()) as IDevice;
}

export async function updateDevice(id: string, data: UpdateDeviceRequestDto): Promise<IDevice> {
  const response = await authFetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update device');
  }
  return (await response.json()) as IDevice;
}

export async function deleteDevice(id: string): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete device');
  }
}

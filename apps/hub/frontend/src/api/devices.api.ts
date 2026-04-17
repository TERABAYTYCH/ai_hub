import {
  IDevice,
  CreateDeviceRequestDto,
  UpdateDeviceRequestDto,
} from '@app/contracts/hub/devices';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getDevices(): Promise<IDevice[]> {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return (await response.json()) as IDevice[];
}

export async function getDevice(id: string): Promise<IDevice> {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch device');
  }
  return (await response.json()) as IDevice;
}

export async function createDevice(data: CreateDeviceRequestDto): Promise<IDevice> {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create device');
  }
  return (await response.json()) as IDevice;
}

export async function updateDevice(id: string, data: UpdateDeviceRequestDto): Promise<IDevice> {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update device');
  }
  return (await response.json()) as IDevice;
}

export async function deleteDevice(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete device');
  }
}

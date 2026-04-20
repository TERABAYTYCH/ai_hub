import { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { IDevice } from '@app/contracts/hub/devices';
import { DeviceTable, EmptyState, LoadingState } from '@app/ui-kit';
import { authFetch } from '../utils/auth';

const API_URL = String(import.meta.env.VITE_API_URL) || '/api';

/**
 * Функция для получения списка устройств с Hub API
 * Использует authFetch для автоматической обработки 401
 */
async function fetchDevices(): Promise<IDevice[]> {
  const response = await authFetch(`${API_URL}/devices`);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return (await response.json()) as IDevice[];
}

/**
 * Страница устройств в Pulse
 * Отображает список устройств из Hub для мониторинга
 */
function DevicesPage() {
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadDevices();
  }, []);

  async function loadDevices() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDevices();
      setDevices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <Card.Header>Devices</Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {loading ? (
          <LoadingState />
        ) : devices.length === 0 ? (
          <EmptyState onAdd={() => {}} />
        ) : (
          <DeviceTable devices={devices} onEdit={() => {}} onDelete={() => {}} />
        )}
      </Card.Body>
    </Card>
  );
}

export default DevicesPage;

import { useState, useEffect } from 'react';
import { Card, Alert, Modal, Form, Button } from 'react-bootstrap';
import { IDevice, UpdateDeviceRequestDto, DeviceStatus } from '@ject-hub/contracts/hub/devices';
import { DeviceTable, EmptyState, LoadingState } from '@ject-hub/ui-kit';
import { getDevices, updateDevice, deleteDevice } from '../api/devices.api';

type DeviceFormData = UpdateDeviceRequestDto;

/**
 * Страница устройств в Service
 * Отображает список устройств из Hub
 */
function DevicesPage() {
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IDevice | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({});

  useEffect(() => {
    void loadDevices();
  }, []);

  async function loadDevices() {
    try {
      setLoading(true);
      setError(null);
      const data = await getDevices();
      setDevices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEditModal(device: IDevice) {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      status: device.status,
      description: device.description,
    });
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
    setEditingDevice(null);
    setFormData({});
  }

  function handleSubmitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDevice) return;

    void (async () => {
      try {
        await updateDevice(editingDevice.id, formData);
        handleCloseEditModal();
        await loadDevices();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update device');
      }
    })();
  }

  function handleDelete(id: string) {
    if (!window.confirm('Вы уверены, что хотите удалить это устройство?')) {
      return;
    }

    void (async () => {
      try {
        await deleteDevice(id);
        await loadDevices();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete device');
      }
    })();
  }

  return (
    <Card>
      <Card.Header>Устройства</Card.Header>
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
          <DeviceTable devices={devices} onEdit={handleOpenEditModal} onDelete={handleDelete} />
        )}
      </Card.Body>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать устройство</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={formData.name ?? ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Тип</Form.Label>
              <Form.Control
                type="text"
                value={formData.type ?? ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Статус</Form.Label>
              <Form.Select
                value={(formData.status ?? editingDevice?.status) as DeviceStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DeviceStatus,
                  })
                }
              >
                <option value="ACTIVE">Активно</option>
                <option value="INACTIVE">Неактивно</option>
                <option value="MAINTENANCE">На обслуживании</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Сохранить
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}

export default DevicesPage;

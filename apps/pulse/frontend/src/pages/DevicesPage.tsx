import { useState, useEffect } from 'react';
import { Card, Alert, Modal, Form, Button } from 'react-bootstrap';
import { IDevice, UpdateDeviceRequestDto, DeviceStatus } from '@app/contracts/hub/devices';
import { DeviceTable, EmptyState, LoadingState } from '@app/ui-kit';
import { getDevices, updateDevice, deleteDevice } from '../api/devices.api';

type DeviceFormData = UpdateDeviceRequestDto;

/**
 * Страница устройств в Pulse
 * Отображает список устройств из Hub с возможностью редактирования и удаления
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
    if (!window.confirm('Are you sure you want to delete this device?')) {
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
          <DeviceTable devices={devices} onEdit={handleOpenEditModal} onDelete={handleDelete} />
        )}
      </Card.Body>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Device</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name ?? ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={formData.type ?? ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={(formData.status ?? editingDevice?.status) as DeviceStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DeviceStatus,
                  })
                }
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
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
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}

export default DevicesPage;

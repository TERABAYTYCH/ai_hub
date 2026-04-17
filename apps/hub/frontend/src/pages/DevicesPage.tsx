import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Alert, Card } from 'react-bootstrap';
import {
  IDevice,
  CreateDeviceRequestDto,
  UpdateDeviceRequestDto,
  DeviceStatus,
} from '@app/contracts/hub/devices';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../api/devices.api';

const statusColors: Record<DeviceStatus, string> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  MAINTENANCE: 'warning',
};

type DeviceFormData = CreateDeviceRequestDto & Partial<UpdateDeviceRequestDto>;

function DevicesPage() {
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IDevice | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    type: '',
    description: '',
  });

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

  function handleOpenModal(device?: IDevice) {
    if (device) {
      setEditingDevice(device);
      setFormData({
        name: device.name,
        type: device.type,
        description: device.description || '',
      });
    } else {
      setEditingDevice(null);
      setFormData({ name: '', type: '', description: '' });
    }
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingDevice(null);
    setFormData({ name: '', type: '', description: '' });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void (async () => {
      try {
        if (editingDevice) {
          await updateDevice(editingDevice.id, formData);
        } else {
          await createDevice(formData);
        }
        handleCloseModal();
        await loadDevices();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save device');
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
      <Card.Header>Device Management</Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <div className="mb-3">
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Add Device
          </Button>
        </div>

        {loading ? (
          <Alert variant="info">Loading devices...</Alert>
        ) : devices.length === 0 ? (
          <Alert variant="info">No devices found. Click "Add Device" to create one.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.type}</td>
                  <td>
                    <Badge bg={statusColors[device.status]}>{device.status}</Badge>
                  </td>
                  <td>{device.description || '-'}</td>
                  <td>{new Date(device.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleOpenModal(device)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(device.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDevice ? 'Edit Device' : 'Add Device'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </Form.Group>

            {editingDevice && (
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
            )}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingDevice ? 'Save Changes' : 'Create Device'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}

export default DevicesPage;

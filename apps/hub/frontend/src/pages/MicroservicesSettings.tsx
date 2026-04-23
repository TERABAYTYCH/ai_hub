import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

interface MicroservicesAccess {
  pulse: boolean;
  service: boolean;
}

export default function MicroservicesSettings() {
  const [access, setAccess] = useState<MicroservicesAccess>({ pulse: true, service: true });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/microservices/access`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = (await response.json()) as MicroservicesAccess;
          setAccess(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      }
    };
    void fetchAccess();
  }, []);

  const handleToggle = (service: keyof MicroservicesAccess) => {
    setAccess((prev) => ({ ...prev, [service]: !prev[service] }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/microservices/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(access),
      });
      if (response.ok) {
        setSaved(true);
        setError(null);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Управление доступом к модулям</h2>
      {error && <div className="text-danger mb-3">{error}</div>}
      <Form.Check
        type="switch"
        id="pulse-switch"
        label="Pulse"
        checked={access.pulse}
        onChange={() => handleToggle('pulse')}
      />
      <Form.Check
        type="switch"
        id="service-switch"
        label="Service"
        checked={access.service}
        onChange={() => handleToggle('service')}
      />
      <button className="btn btn-primary mt-3" onClick={() => void handleSave()}>
        Применить
      </button>
      {saved && <span className="ms-3 text-success">Сохранено!</span>}
    </div>
  );
}

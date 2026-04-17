import { Card } from 'react-bootstrap';

/**
 * Pulse Dashboard - компонент мониторинга.
 * Экспортируется через Module Federation.
 */
function PulseDashboard() {
  return (
    <Card>
      <Card.Header>Pulse Dashboard</Card.Header>
      <Card.Body>
        <h5>Monitoring Service</h5>
        <p className="text-muted">
          This dashboard is loaded from the Pulse microservice via Module Federation.
        </p>
        <div className="alert alert-info">
          <strong>Status:</strong> Connected
        </div>
      </Card.Body>
    </Card>
  );
}

export default PulseDashboard;

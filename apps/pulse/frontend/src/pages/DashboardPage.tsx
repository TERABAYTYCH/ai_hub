import { Card, Row, Col } from 'react-bootstrap';
import { getUsername } from '../utils/auth';

/**
 * Dashboard - главная страница Pulse после авторизации.
 * Показывает общую информацию о сервисе мониторинга.
 */
export default function DashboardPage() {
  const username = getUsername();

  return (
    <div>
      <h2 className="mb-4">Welcome, {username}!</h2>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded p-3 me-3">
                  <i className="bi bi-graph-up text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">98.5%</h3>
                  <small className="text-muted">Uptime</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success rounded p-3 me-3">
                  <i className="bi bi-check-circle text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">247</h3>
                  <small className="text-muted">Active Services</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning rounded p-3 me-3">
                  <i className="bi bi-exclamation-triangle text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">12</h3>
                  <small className="text-muted">Alerts</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info rounded p-3 me-3">
                  <i className="bi bi-clock-history text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">1.2ms</h3>
                  <small className="text-muted">Avg Response</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <i className="bi bi-info-circle me-2"></i>
          System Status
        </Card.Header>
        <Card.Body>
          <p className="mb-0">
            All systems are operational. Last checked: {new Date().toLocaleString()}. The monitoring
            service is collecting metrics from all registered services.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

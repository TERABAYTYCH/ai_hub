import { Card, Row, Col } from 'react-bootstrap';
import { getUsername } from './utils/auth';

/**
 * Dashboard - главная страница Service после авторизации.
 * Используется для Module Federation (remote) и реэкспортится в DashboardPage.
 */
function Dashboard() {
  const username = getUsername();

  return (
    <>
      <h2 className="mb-4">Добро пожаловать, {username}!</h2>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded p-3 me-3">
                  <i className="bi bi-tools text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Активных задач</small>
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
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Завершенных</small>
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
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Ожидающих</small>
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
                  <i className="bi bi-clock text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Устройств</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <i className="bi bi-info-circle me-2"></i>
          Состояние системы
        </Card.Header>
        <Card.Body>
          <p className="mb-0">
            Система обслуживания готова к работе. Управляйте задачами и фотоотчетами.
          </p>
        </Card.Body>
      </Card>
    </>
  );
}

export default Dashboard;

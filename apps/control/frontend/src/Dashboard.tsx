import { Card, Row, Col } from 'react-bootstrap';
import { getUsername } from './utils/auth';

function Dashboard() {
  const username = getUsername();

  return (
    <>
      <h2 className="mb-4">Welcome, {username}!</h2>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary rounded p-3 me-3">
                  <i className="bi bi-people text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Teams</small>
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
                  <i className="bi bi-device-ssd text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Devices</small>
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
                  <i className="bi bi Commands text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Active Commands</small>
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
                  <i className="bi bi-check-circle text-white fs-4"></i>
                </div>
                <div>
                  <h3 className="mb-0">0</h3>
                  <small className="text-muted">Completed</small>
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
          <p className="mb-0">Control service is ready. Manage your teams and device commands.</p>
        </Card.Body>
      </Card>
    </>
  );
}

export default Dashboard;

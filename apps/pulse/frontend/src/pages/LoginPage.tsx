import { useState, FormEvent } from 'react';
import { Button, Form, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

/**
 * Страница входа в систему для Pulse приложения.
 * Использует Hub Backend API для аутентификации.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-activity me-2"></i>
            Pulse Login
          </h4>
        </Card.Header>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <small className="text-muted">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

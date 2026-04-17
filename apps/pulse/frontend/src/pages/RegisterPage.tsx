import { useState, FormEvent } from 'react';
import { Button, Form, Card, Alert, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import type { RegisterRequestDto } from '@app/contracts/hub/auth';

/**
 * Страница регистрации для Pulse приложения.
 * Использует Hub Backend API для создания аккаунта.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequestDto>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RegisterRequestDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация паролей
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Card style={{ width: '450px' }} className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-activity me-2"></i>
            Register
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
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name (optional)"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name (optional)"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <small className="text-muted">
            Already have an account? <Link to="/login">Login</Link>
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

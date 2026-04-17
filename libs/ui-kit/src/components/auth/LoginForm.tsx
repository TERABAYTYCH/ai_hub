import { FormEvent, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export interface LoginFormProps {
  /** Callback при отправке формы с данными логина */
  onSubmit: (username: string, password: string) => Promise<void>;
  /** Флаг загрузки */
  isLoading?: boolean;
  /** Сообщение об ошибке */
  error?: string;
  /** Текст заголовка */
  title?: string;
  /** Текст ссылки на регистрацию */
  registerLinkText?: string;
  /** Путь к странице регистрации */
  registerLinkPath?: string;
}

/**
 * Универсальная форма входа.
 * Принимает callback для обработки отправки, не содержит логики API запросов.
 */
export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  title = 'Login',

  registerLinkText = "Don't have an account?",
  registerLinkPath = '/register',
}: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
        {isLoading ? 'Signing in...' : title}
      </Button>

      <div className="mt-3 text-center">
        <small className="text-muted">
          {registerLinkText}{' '}
          <Link to={registerLinkPath}>Register</Link>
        </small>
      </div>
    </Form>
  );
}

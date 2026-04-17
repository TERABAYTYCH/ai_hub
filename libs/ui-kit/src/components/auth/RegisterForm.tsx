import { FormEvent, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Минимальный набор полей для регистрации */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterFormProps {
  /** Callback при отправке формы с данными регистрации */
  onSubmit: (data: RegisterData) => Promise<void>;
  /** Флаг загрузки */
  isLoading?: boolean;
  /** Сообщение об ошибке */
  error?: string;
  /** Дополнительная валидация пароля */
  validatePassword?: (password: string, confirmPassword: string) => string | null;
  /** Текст заголовка */
  title?: string;
  /** Текст ссылки на вход */
  loginLinkText?: string;
  /** Путь к странице входа */
  loginLinkPath?: string;
}

/**
 * Универсальная форма регистрации.
 * Принимает callback для обработки отправки, не содержит логики API запросов.
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  validatePassword,
  title = 'Register',

  loginLinkText = 'Already have an account?',
  loginLinkPath = '/login',
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Клиентская валидация
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (validatePassword) {
      const customError = validatePassword(formData.password, confirmPassword);
      if (customError) {
        setValidationError(customError);
        return;
      }
    }

    await onSubmit(formData);
  };

  const displayError = error || validationError;

  return (
    <Form onSubmit={handleSubmit}>
      {displayError && <Alert variant="danger">{displayError}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name (optional)"
          value={formData.firstName || ''}
          onChange={(e) => handleChange('firstName', e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name (optional)"
          value={formData.lastName || ''}
          onChange={(e) => handleChange('lastName', e.target.value)}
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
        {isLoading ? 'Creating account...' : title}
      </Button>

      <div className="mt-3 text-center">
        <small className="text-muted">
          {loginLinkText}{' '}
          <Link to={loginLinkPath}>Login</Link>
        </small>
      </div>
    </Form>
  );
}

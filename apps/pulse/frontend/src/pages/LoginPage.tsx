import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage, LoginForm } from '@ject-hub/ui-kit';
import { login } from '../api/auth';

/**
 * Страница входа в систему для Pulse приложения.
 * Использует Hub Backend API для аутентификации.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setError(undefined);
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
    <AuthPage title="Вход в систему" icon="bi bi-person-circle">
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        title="Войти"
        registerLinkText="Нет аккаунта?"
        registerLinkPath="/register"
      />
    </AuthPage>
  );
}

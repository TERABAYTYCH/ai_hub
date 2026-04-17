import { useState } from 'react';
import { AuthPage, LoginForm, useAuth } from '@ject-hub/ui-kit';
import { login } from '../api/auth';

/**
 * Страница входа в систему для Pulse приложения.
 * Использует Hub Backend API для аутентификации.
 */
export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const data = await login({ username, password });
      authLogin(data.accessToken, data.refreshToken, data.user);
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

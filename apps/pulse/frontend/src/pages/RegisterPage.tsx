import { useState } from 'react';
import { AuthPage, RegisterForm, RegisterData, useAuth } from '@ject-hub/ui-kit';
import { register } from '../api/auth';
import type { RegisterRequestDto } from '@app/contracts/hub/auth';

/**
 * Страница регистрации для Pulse приложения.
 * Использует Hub Backend API для создания аккаунта.
 */
export default function RegisterPage() {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RegisterData) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await register(data as RegisterRequestDto);
      authLogin(response.accessToken, response.refreshToken, response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPage title="Регистрация" icon="bi bi-person-plus">
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        title="Зарегистрироваться"
        loginLinkText="Уже есть аккаунт?"
        loginLinkPath="/login"
      />
    </AuthPage>
  );
}

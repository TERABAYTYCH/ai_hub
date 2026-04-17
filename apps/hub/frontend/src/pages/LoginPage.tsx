import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage, LoginForm } from '@ject-hub/ui-kit';
import { LoginRequestDto, LoginResponseDto } from '@app/contracts/hub/auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/devices');
    }
  }, [navigate]);

  const handleSubmit = async (username: string, password: string) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password } as LoginRequestDto),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = (await response.json()) as LoginResponseDto;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/devices');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

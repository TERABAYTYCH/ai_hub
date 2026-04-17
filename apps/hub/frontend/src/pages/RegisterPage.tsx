import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthPage, RegisterForm, RegisterData } from '@ject-hub/ui-kit';
import { RegisterRequestDto, LoginResponseDto } from '@app/contracts/hub/auth';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RegisterData) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data as RegisterRequestDto),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || 'Failed to register');
      }

      const responseData = (await response.json()) as LoginResponseDto;
      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      navigate('/devices');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

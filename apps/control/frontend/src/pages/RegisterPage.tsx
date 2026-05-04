import { useState } from 'react';
import { AuthPage, RegisterForm, RegisterData, useAuth } from '@ject-hub/ui-kit';
import { register } from '../api/auth';
import type { RegisterRequestDto } from '@ject-hub/contracts/hub/auth';

export default function RegisterPage() {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RegisterData) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await register(data as RegisterRequestDto);
      authLogin(response.accessToken, response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPage title="Control Registration" icon="bi bi-person-plus">
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        title="Register"
        loginLinkText="Already have account?"
        loginLinkPath="/login"
      />
    </AuthPage>
  );
}

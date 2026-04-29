import { useState } from 'react';
import { AuthPage, LoginForm, useAuth } from '@app/ui-kit';
import { login } from '../api/auth';

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setError(undefined);
    setIsLoading(true);

    try {
      const data = await login({ username, password });
      authLogin(data.accessToken, data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPage title="Control Login" icon="bi bi-person-circle">
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
        title="Login"
        registerLinkText="No account?"
        registerLinkPath="/register"
      />
    </AuthPage>
  );
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export interface IUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (accessToken: string, refreshToken: string, user?: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decodes JWT token payload without external libraries.
 * Returns null if token is invalid.
 */
function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url decode
    const decoded = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = decoded + '='.repeat((4 - (decoded.length % 4)) % 4);
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Checks if token is expired based on exp claim.
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeTokenPayload(token);
  if (!payload) return true;
  const exp = payload.exp;
  if (typeof exp !== 'number') return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check authorization on mount - validate token expiration
  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (accessToken && isTokenExpired(accessToken)) {
      // Token is expired - clear storage and require re-login
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      return;
    }

    setState({
      isAuthenticated: !!accessToken,
      user: userStr ? (JSON.parse(userStr) as IUser) : null,
      isLoading: false,
    });
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, user?: IUser) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    setState({
      isAuthenticated: true,
      user: user || null,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/cookies';

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
  login: (accessToken: string, user?: IUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider with cross-domain cookie support.
 * Access token is stored in cookie, refresh token is HttpOnly.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check authorization on mount - validate token from cookie and auto-refresh if needed
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessToken();

      if (accessToken && isTokenExpired(accessToken)) {
        // Token is expired - try to refresh using relative URL (nginx proxy)
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            const data = (await response.json()) as { accessToken: string };
            setAccessToken(data.accessToken);
            setState({
              isAuthenticated: true,
              user: null,
              isLoading: false,
            });
            return;
          }
        } catch {
          // Refresh failed, continue to unauthenticated state
        }

        // Refresh failed - clear cookie and require re-login
        removeAccessToken();
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return;
      }

      setState({
        isAuthenticated: !!accessToken,
        user: null,
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  /**
   * Performs login - saves access token to cookie and updates state.
   */
  const login = useCallback((accessToken: string, user?: IUser) => {
    setAccessToken(accessToken);
    setState({
      isAuthenticated: true,
      user: user || null,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore logout API errors, still clear local state
    }
    removeAccessToken();
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

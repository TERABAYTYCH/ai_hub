import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, setAccessToken, removeAccessToken } from '../utils/cookies';

const HUB_API_URL = 'http://api.hub.lvh.me';

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

/**
 * Extracts IUser from JWT token payload.
 */
function extractUserFromToken(token: string): IUser | null {
  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  return {
    id: payload.sub as string,
    username: payload.username as string,
    email: payload.email as string | undefined,
    firstName: payload.firstName as string | undefined,
    lastName: payload.lastName as string | undefined,
    microservices: (payload.microservices as Record<string, boolean>) || undefined,
  };
}

export interface IUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  /** Microservices access map, e.g. { pulse: true, service: false } */
  microservices?: Record<string, boolean>;
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

  // Refresh JWT token and update state
  const refreshJwt = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const response = await fetch(`${HUB_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = (await response.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        const user = extractUserFromToken(data.accessToken);
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      }
    } catch {
      // Ignore refresh errors on visibility change
    }
  }, []);

  // Check authorization on mount - always refresh token to get latest MICROSERVICES_ACCESS
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return;
      }

      // Always try to refresh token to get latest MICROSERVICES_ACCESS from backend
      try {
        const response = await fetch(`${HUB_API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = (await response.json()) as { accessToken: string };
          setAccessToken(data.accessToken);
          const user = extractUserFromToken(data.accessToken);
          setState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
          return;
        }
      } catch {
        // Refresh failed, continue with existing token
      }

      // If refresh failed but we have a non-expired token, use it
      if (!isTokenExpired(accessToken)) {
        const user = extractUserFromToken(accessToken);
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
        return;
      }

      // Token expired and refresh failed - clear and require re-login
      removeAccessToken();
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    void initAuth();
  }, []);

  // Refresh JWT on visibility change (when user returns to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshJwt();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshJwt]);

  /**
   * Performs login - saves access token to cookie and updates state.
   * Extracts microservices from JWT token payload.
   */
  const login = useCallback((accessToken: string, user?: IUser) => {
    setAccessToken(accessToken);

    // Extract microservices from JWT token payload
    const tokenPayload = decodeTokenPayload(accessToken);
    const microservices = (tokenPayload?.microservices as Record<string, boolean>) || undefined;

    setState({
      isAuthenticated: true,
      user: user ? { ...user, microservices } : null,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${HUB_API_URL}/auth/logout`, {
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
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

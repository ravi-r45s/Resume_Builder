import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'resumeforge_token';
const USER_KEY = 'resumeforge_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const tokenBeingVerified = token;

    async function verify() {
      if (!tokenBeingVerified) {
        if (!cancelled) setInitializing(false);
        return;
      }

      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${tokenBeingVerified}` },
        });

        // Never overwrite a newer login with the result of an older request.
        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (!cancelled && currentToken === tokenBeingVerified) {
          setUser(res.data.user);
          setInitializing(false);
        }
      } catch {
        // An old verification request must not log out a newly authenticated user.
        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (!cancelled && currentToken === tokenBeingVerified) {
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setInitializing(false);
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      const res = await api.post('/auth/register', { name, email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    },
    [persist]
  );

  const login = useCallback(
    async ({ email, password }) => {
      const res = await api.post('/auth/login', { email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const value = { user, token, initializing, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

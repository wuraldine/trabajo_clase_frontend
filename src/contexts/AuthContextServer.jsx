import React, { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';
import { loadSessionUser, saveSessionUser, clearSessionUser, saveAuthToken, loadAuthToken, clearAuthToken } from '../utils/authStorage';

const AuthContextServer = createContext(null);

export function AuthProviderServer({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSessionUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = loadAuthToken();
    if (!token) return;

    let mounted = true;
    setLoading(true);
    authService
      .me()
      .then((res) => {
        if (!mounted) return;
        // support different shapes: { user } or direct user
        const user = res?.user ?? res;
        if (user) {
          saveSessionUser(user);
          setCurrentUser(user);
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await authService.login({ email, password });
      // support ApiClient response shape {status, data, headers}
      const body = res?.data ?? res;
      const token = body?.token ?? body?.accessToken ?? body?.access_token ?? res?.headers?.authorization ?? res?.headers?.Authorization ?? null;
      const user = body?.user ?? (body && (body.id || body.email) ? body : null);

      if (token) saveAuthToken(token);
      if (user) {
        saveSessionUser(user);
        setCurrentUser(user);
        return { ok: true, user };
      }

      return { ok: false, error: 'Respuesta inesperada del servidor.' };
    } catch (e) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  };

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      const body = res?.data ?? res;
      const token = body?.token ?? body?.accessToken ?? body?.access_token ?? res?.headers?.authorization ?? null;
      const user = body?.user ?? (body && (body.id || body.email) ? body : null);
      if (token) saveAuthToken(token);
      if (user) {
        saveSessionUser(user);
        setCurrentUser(user);
        return { ok: true, user };
      }
      return { ok: false, error: 'Respuesta inesperada del servidor.' };
    } catch (e) {
      return { ok: false, error: e?.message ?? String(e) };
    }
  };

  const logout = () => {
    clearAuthToken();
    clearSessionUser();
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ currentUser, isAuthenticated: Boolean(currentUser), login, logout, register, loading }),
    [currentUser, loading]
  );

  return <AuthContextServer.Provider value={value}>{children}</AuthContextServer.Provider>;
}

export { AuthContextServer };

export default AuthProviderServer;

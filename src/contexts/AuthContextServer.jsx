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
      // server may return { token, user } or { accessToken, user } or user object
      const token = res?.token ?? res?.accessToken ?? res?.access_token ?? null;
      const user = res?.user ?? (res && (res.id || res.email) ? res : null);

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
      const token = res?.token ?? res?.accessToken ?? null;
      const user = res?.user ?? (res && (res.id || res.email) ? res : null);
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

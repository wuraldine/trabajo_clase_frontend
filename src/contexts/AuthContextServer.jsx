import React, { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';
import { loadSessionUser, saveSessionUser, clearSessionUser, saveAuthToken, loadAuthToken, clearAuthToken } from '../utils/authStorage';

const AuthContextServer = createContext(null);

const extractToken = (body, headers) => {
  const raw =
    body?.sessionToken ??
    body?.token ??
    body?.accessToken ??
    body?.access_token ??
    headers?.authorization ??
    headers?.Authorization ??
    null;
  return raw ? String(raw) : null;
};

const extractUser = (body) => {
  if (!body) return null;

  if (body.user && (body.user.id || body.user.userId || body.user.email)) {
    return {
      ...body.user,
      id: body.user.id ?? body.user.userId,
      name: body.user.name ?? body.user.fullName ?? body.user.username ?? body.user.email,
      role: body.user.role,
      isAdmin: body.user.isAdmin ?? (String(body.user.role ?? '').toLowerCase() === 'admin'),
      phone: body.user.phone ?? body.user.phoneNumber ?? '',
      address: body.user.address ?? body.user.addressLine1 ?? '',
      city: body.user.city ?? '',
      postalCode: body.user.postalCode ?? body.user.zipCode ?? '',
    };
  }

  if (body.id || body.userId || body.email) {
    return {
      ...body,
      id: body.id ?? body.userId,
      name: body.name ?? body.fullName ?? body.username ?? body.email,
      role: body.role,
      isAdmin: body.isAdmin ?? (String(body.role ?? '').toLowerCase() === 'admin'),
      phone: body.phone ?? body.phoneNumber ?? '',
      address: body.address ?? body.addressLine1 ?? '',
      city: body.city ?? '',
      postalCode: body.postalCode ?? body.zipCode ?? '',
    };
  }

  return null;
};

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
        const body = res?.data ?? res;
        const user = extractUser(body);
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
      const body = res?.data ?? res;
      const token = extractToken(body, res?.headers);
      let user = extractUser(body);

      if (token) saveAuthToken(token);

      if (!user && token) {
        try {
          const meRes = await authService.me();
          user = extractUser(meRes?.data ?? meRes);
        } catch {
          user = null;
        }
      }

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
      const name = String(data?.name ?? '').trim();
      const [firstName = '', ...rest] = name.split(/\s+/).filter(Boolean);
      const lastName = rest.join(' ') || 'Usuario';
      const payload = {
        ...data,
        fullName: data?.name,
        username: data?.name,
        firstName,
        lastName,
        phone: data?.phone,
        phoneNumber: data?.phone,
        address: data?.address,
        addressLine1: data?.address,
        city: data?.city,
        postalCode: data?.postalCode,
        zipCode: data?.postalCode,
      };
      const res = await authService.register(payload);
      const body = res?.data ?? res;
      const token = extractToken(body, res?.headers);
      let user = extractUser(body);

      if (token) saveAuthToken(token);

      if (!user && token) {
        try {
          const meRes = await authService.me();
          user = extractUser(meRes?.data ?? meRes);
        } catch {
          user = null;
        }
      }

      if (user) {
        const enrichedUser = {
          ...user,
          phone: user.phone || data?.phone || '',
          address: user.address || data?.address || '',
          city: user.city || data?.city || '',
          postalCode: user.postalCode || data?.postalCode || '',
        };
        saveSessionUser(enrichedUser);
        setCurrentUser(enrichedUser);
        return { ok: true, user: enrichedUser };
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

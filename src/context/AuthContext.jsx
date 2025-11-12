// /src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  // loadUser: fetch /auth/me once after mount
  const loadUser = async () => {
    try {
      const { data } = await api.get("/auth/me/");
      setUser(data);
    } catch (err) {
        console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // run loadUser only once (avoid StrictMode double issues)
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });
    // expected: { access, refresh, user } OR tokens only
    if (res.data.access) localStorage.setItem("access", res.data.access);
    if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);

    // if backend returns user:
    if (res.data.user) {
      setUser(res.data.user);
      setLoading(false);
      return res.data.user;
    }
    // otherwise fetch /auth/me
    await loadUser();
    return user;
  };

  const register = async (email, username, password) => {
    const res = await api.post("/auth/register/", { email, username, password });
    // If backend returns tokens immediately on register:
    if (res.data.access) localStorage.setItem("access", res.data.access);
    if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);

    // If backend returns user or tokens, load user
    if (res.data.user) {
      setUser(res.data.user);
      setLoading(false);
      return res.data.user;
    }

    // otherwise, attempt login once (backend might require explicit login)
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    // navigate to login page
    window.location.href = "/login";
  };

  // Expose helper to force-refresh user data
  const refreshUser = async () => {
    setLoading(true);
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};


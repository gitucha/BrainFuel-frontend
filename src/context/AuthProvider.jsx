import React, { useState, useEffect } from "react";
import AuthContext from "./authContextObject";
import api from "../lib/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const loadUser = async () => {
    try {
      const access = localStorage.getItem("access");
      if (!access) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      const { data } = await api.get("/auth/me/");
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoadingUser(true);
    try {
      const res = await api.post("/auth/login/", { email, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      await loadUser();
    } catch (err) {
      setUser(null);
      setLoadingUser(false);
      throw err;
    }
  };

  const register = async (payload) => {
    setLoadingUser(true);
    try {
      const res = await api.post("/auth/register/", payload);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      await loadUser();
    } catch (err) {
      setUser(null);
      setLoadingUser(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        login,
        register,
        logout,
        refreshUser: loadUser,
      }}
    >
      {loadingUser ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

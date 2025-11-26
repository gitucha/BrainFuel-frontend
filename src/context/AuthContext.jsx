import React, { useState, useEffect } from "react";
import api from "../lib/api";
import AuthContext from "./authContextObject";

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
      console.error("Failed to load user:", err);
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
      const { data } = await api.post("/auth/login/", { email, password });

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      await loadUser();
    } catch (err) {
      setLoadingUser(false);
      throw err;
    }
  };

  const register = async (payload) => {
    setLoadingUser(true);
    try {
      const { data } = await api.post("/auth/register/", payload);

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      await loadUser();
    } catch (err) {
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

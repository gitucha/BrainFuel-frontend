// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import AuthContext from "./authContextObject";
import api from "../lib/api";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:.15s]" />
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:.3s]" />
      </div>
    </div>
  );
}

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

  // IMPORTANT: match how Register.jsx calls register(email, username, password)
  const register = async (email, username, password) => {
    setLoadingUser(true);
    try {
      const payload = {
        email,
        username,
        password,
        // DRF RegisterSerializer usually expects password2
        password2: password,
      };

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
      {loadingUser ? <PageLoader /> : children}
    </AuthContext.Provider>
  );
}

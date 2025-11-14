import React, { useState, useEffect } from "react";
import AuthContext from "./authContextObject";
import api from "../lib/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ⬇ Load user from backend
  const loadUser = async () => {
    try {
      const { data } = await api.get("/auth/me/");
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Load user on first mount
  useEffect(() => {
    loadUser();
  }, []);

  // ⬇ Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    await loadUser();
  };

  // ⬇ Register
  const register = async (payload) => {
    const res = await api.post("/auth/register/", payload);

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    await loadUser();
  };

  // ⬇ Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loadingUser,
    login,
    register,
    logout,
    refreshUser: loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingUser ? children : <div className="p-6">Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

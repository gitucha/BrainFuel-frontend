import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useAuth } from "../hooks/useAuth";

// Helper to check token expiry
const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // Prefer context check, fallback to manual JWT check
  const authenticated = user || isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

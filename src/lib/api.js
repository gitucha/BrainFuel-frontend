// /src/lib/api.js
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to read tokens
const getAccess = () => localStorage.getItem("access");
const getRefresh = () => localStorage.getItem("refresh");

// Attach access token
api.interceptors.request.use(
  (config) => {
    const token = getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: try refresh once on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If no response or not 401, just reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (original._retry) {
      // Already tried refresh — give up
      // Clear tokens and redirect to login (or let auth context handle it)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return Promise.reject(error);
    }

    original._retry = true;

    // Try refresh using raw axios (no interceptors)
    try {
      const refresh = getRefresh();
      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(error);
      }

      const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, {
        refresh,
      });

      // store new access
      localStorage.setItem("access", data.access);

      // update header and retry original request
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (refreshErr) {
      // Refresh failed — clear tokens
      console.error("Token refresh failed:", refreshErr?.response?.data || refreshErr);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return Promise.reject(refreshErr);
    }
  }
);

export default api;

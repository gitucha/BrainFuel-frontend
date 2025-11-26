// src/lib/api.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // adjust if needed

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to attempt refresh once per failed request
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If response is 401, try refresh (only once per request)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token — clear tokens and reject
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request until refresh completes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const resp = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken });
        const newAccess = resp.data.access;
        localStorage.setItem("access", newAccess);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        // refresh failed -> clear tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

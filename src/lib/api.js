import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: false,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh tokens
let refreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      // Avoid multiple refresh calls
      if (!refreshing) {
        refreshing = true;

        try {
          const refresh = localStorage.getItem("refresh");
          const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
            refresh,
          });

          localStorage.setItem("access", res.data.access);

          queue.forEach((cb) => cb(res.data.access));
          queue = [];

          refreshing = false;

          original.headers.Authorization = `Bearer ${res.data.access}`;
          return api(original);
        } catch (err) {
          refreshing = false;
          queue = [];
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        queue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(original));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;

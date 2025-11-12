import api from "./api";

export async function login(email, password) {
  const { data } = await api.post("/auth/login/", { email, password });
  // expect data: { access, refresh, user }
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data.user;
}

export async function register(username, email, password) {
  const { data } = await api.post("/auth/register/", { username, email, password });
  // optionally login automatically if backend returns tokens
  if (data.access && data.refresh) {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
  }
  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
}

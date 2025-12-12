import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para inyectar el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
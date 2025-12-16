import axios from "axios";
import { store } from "@/libs/redux/store";

// En desarrollo usa el proxy local (/api/v1 -> localhost:8080/api/v1 via Next.js rewrites)
// En producción usa la URL configurada
const baseURL = process.env.NODE_ENV === 'development'
  ? '/api/v1'  // Proxy local via Next.js rewrites
  : process.env.NEXT_PUBLIC_API_URL || '/api/v1';

console.log('🔧 API Config:', { env: process.env.NODE_ENV, baseURL });

export const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para inyectar el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    // Leer token desde Redux store (memoria) en lugar de localStorage
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token inyectado desde memoria');
    }

    // Debug: Log de la petición
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    // Determinar el tipo de error para mejor debugging
    let errorInfo: Record<string, any> = {};

    if (error.response) {
      // El servidor respondió con un código de error (4xx, 5xx)
      errorInfo = {
        type: 'Server Error',
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      };
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta (network error, backend down, CORS)
      errorInfo = {
        type: 'Network Error',
        message: '¿Backend corriendo? Verifica que el servidor esté activo en localhost:8080',
        url: error.config?.url,
        code: error.code, // e.g., ERR_NETWORK, ECONNREFUSED
      };
    } else {
      // Error al configurar la petición
      errorInfo = {
        type: 'Request Setup Error',
        message: error.message,
      };
    }

    console.error('❌ API Error:', errorInfo);
    return Promise.reject(error);
  }
);


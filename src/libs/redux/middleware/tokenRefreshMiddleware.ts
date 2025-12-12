import type { Middleware } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenAsync } from '../thunks/authThunks';
import { logout } from '../slices/authSlice';
import type { RootState, AppDispatch } from '../store';

// Throttling: evitar chequeos muy frecuentes
const THROTTLE_MS = 30000; // 30 segundos entre chequeos
const REFRESH_THRESHOLD = 300; // 5 minutos antes de expirar
const MIN_TIME_BETWEEN_ATTEMPTS = 60000; // 1 minuto entre intentos de refresh

let lastCheck = 0;

interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

// Middleware mejorado para renovar automáticamente el token
export const tokenRefreshMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  const now = Date.now();
  
  // 🚦 Throttling: Solo chequear cada THROTTLE_MS
  if (now - lastCheck < THROTTLE_MS) {
    return result;
  }
  
  lastCheck = now;
  
  // Verificar si necesitamos renovar el token
  const state = store.getState();
  const { 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    isRefreshing, 
    lastRefreshAttempt 
  } = state.auth;
  
  // 🔒 Evitar múltiples refresh simultáneos
  if (isRefreshing) {
    return result;
  }
  
  // ⏱️ Evitar intentos muy frecuentes
  if (lastRefreshAttempt && (now - lastRefreshAttempt) < MIN_TIME_BETWEEN_ATTEMPTS) {
    return result;
  }
  
  if (isAuthenticated && accessToken && refreshToken) {
    try {
      // 🔧 Usar jwt-decode para robustez cross-platform
      const decoded = jwtDecode<JWTPayload>(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      
      // Si el token expira en menos de REFRESH_THRESHOLD segundos, renovarlo
      if (timeUntilExpiry < REFRESH_THRESHOLD && timeUntilExpiry > 0) {
        console.log(`🔄 Token expira en ${Math.floor(timeUntilExpiry / 60)} minutos, renovando...`);
        
        // 🚀 Dispatch del refresh con manejo de errores
        (store.dispatch as AppDispatch)(refreshTokenAsync(refreshToken))
          .unwrap()
          .then(() => {
            console.log('✅ Token renovado exitosamente');
          })
          .catch((error) => {
            console.error('❌ Error al renovar token:', error);
            console.log('🚪 Cerrando sesión automáticamente');
            (store.dispatch as AppDispatch)(logout());
          });
      }
    } catch (error) {
      console.error('⚠️ Error al decodificar token:', error);
      // Si no podemos decodificar el token, probablemente esté malformado
      console.log('🚪 Token inválido, cerrando sesión');
      (store.dispatch as AppDispatch)(logout());
    }
  }
  
  return result;
};
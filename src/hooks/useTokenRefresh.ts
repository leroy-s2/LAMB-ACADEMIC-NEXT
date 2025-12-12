import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppSelector, useAppDispatch } from '@/libs/redux/hooks';
import { refreshTokenAsync } from '@/libs/redux/thunks/authThunks';
import { logout } from '@/libs/redux/slices/authSlice';

interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

// Configuración
const CHECK_INTERVAL = 60000; // 60 segundos
const REFRESH_THRESHOLD = 300; // 5 minutos antes de expirar
const MIN_TIME_BETWEEN_ATTEMPTS = 60000; // 1 minuto entre intentos

// Hook mejorado para manejar la renovación automática del token
export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const { 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    isRefreshing, 
    lastRefreshAttempt 
  } = useAppSelector(state => state.auth);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isAuthenticated && accessToken && refreshToken) {
      // Función mejorada para verificar y renovar el token
      const checkAndRefreshToken = async () => {
        // 🔒 Evitar múltiples refresh simultáneos
        if (isRefreshing) {
          console.log('🔄 Refresh ya en progreso, saltando...');
          return;
        }

        // ⏱️ Evitar intentos muy frecuentes
        const now = Date.now();
        if (lastRefreshAttempt && (now - lastRefreshAttempt) < MIN_TIME_BETWEEN_ATTEMPTS) {
          console.log('⏱️ Muy pronto para otro intento de refresh, saltando...');
          return;
        }

        try {
          // 🔧 Usar jwt-decode para robustez cross-platform
          const decoded = jwtDecode<JWTPayload>(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = decoded.exp - currentTime;
          
          // Si el token expira en menos de REFRESH_THRESHOLD segundos, renovarlo
          if (timeUntilExpiry < REFRESH_THRESHOLD && timeUntilExpiry > 0) {
            const minutesLeft = Math.floor(timeUntilExpiry / 60);
            console.log(`🔄 Token expira en ${minutesLeft} minutos, renovando...`);
            
            try {
              await dispatch(refreshTokenAsync(refreshToken)).unwrap();
              console.log('✅ Token renovado exitosamente via hook');
            } catch (error) {
              console.error('❌ Error al renovar token via hook:', error);
              console.log('🚪 Cerrando sesión automáticamente');
              dispatch(logout());
            }
          } else if (timeUntilExpiry <= 0) {
            console.log('⚠️ Token ya expirado, cerrando sesión');
            dispatch(logout());
          } else {
            const minutesLeft = Math.floor(timeUntilExpiry / 60);
            console.log(`✅ Token válido por ${minutesLeft} minutos más`);
          }
        } catch (error) {
          console.error('⚠️ Error al decodificar token:', error);
          console.log('🚪 Token inválido, cerrando sesión');
          dispatch(logout());
        }
      };

      // Verificar inmediatamente
      checkAndRefreshToken();

      // Configurar verificación periódica
      intervalRef.current = setInterval(checkAndRefreshToken, CHECK_INTERVAL);
      
      console.log(`🕐 Sistema de refresh token iniciado (cada ${CHECK_INTERVAL/1000}s)`);
    } else {
      console.log('🔓 Sin autenticación, sistema de refresh detenido');
    }

    // Cleanup al cambiar dependencias
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🧹 Intervalo de refresh token limpiado');
      }
    };
  }, [accessToken, refreshToken, isAuthenticated, isRefreshing, lastRefreshAttempt, dispatch]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🧹 Hook useTokenRefresh desmontado');
      }
    };
  }, []);
};

import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppSelector, useAppDispatch } from '@/libs/redux/hooks';
import { refreshTokenAsync } from '@/libs/redux/thunks/authThunks';
import { logout } from '@/libs/redux/slices/authSlice';
import { store } from '@/libs/redux/store';

interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

// Configuración
const REFRESH_THRESHOLD = 300; // 5 minutos antes de expirar
const SAFETY_MARGIN = 30; // 30 segundos de margen adicional

// Hook avanzado con timer dedicado - Alternativa recomendada para producción
export const useTokenRefreshTimer = () => {
  const dispatch = useAppDispatch();
  const { 
    accessToken, 
    refreshToken, 
    isAuthenticated, 
    isRefreshing 
  } = useAppSelector(state => state.auth);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para programar el próximo refresh
  const scheduleNextRefresh = (token: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      const timeUntilRefresh = timeUntilExpiry - REFRESH_THRESHOLD;

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (timeUntilRefresh > 0) {
        const refreshInMs = (timeUntilRefresh - SAFETY_MARGIN) * 1000;
        const refreshInMinutes = Math.floor(refreshInMs / 60000);
        
        console.log(`⏰ Refresh programado en ${refreshInMinutes} minutos`);
        
        timeoutRef.current = setTimeout(async () => {
          if (!isRefreshing && refreshToken) {
            console.log('🔄 Timer: Ejecutando refresh programado...');
            try {
              await dispatch(refreshTokenAsync(refreshToken)).unwrap();
              console.log('✅ Timer: Token renovado exitosamente');
              
              // Programar el siguiente refresh con el nuevo token
              const newState = store.getState();
              if (newState.auth.accessToken) {
                scheduleNextRefresh(newState.auth.accessToken);
              }
            } catch (error) {
              console.error('❌ Timer: Error al renovar token:', error);
              dispatch(logout());
            }
          }
        }, refreshInMs);
      } else {
        // Token ya próximo a expirar, refrescar inmediatamente
        console.log('⚡ Token muy próximo a expirar, refrescando inmediatamente');
        if (!isRefreshing && refreshToken) {
          dispatch(refreshTokenAsync(refreshToken))
            .unwrap()
            .then(() => {
              console.log('✅ Refresh inmediato exitoso');
            })
            .catch((error) => {
              console.error('❌ Error en refresh inmediato:', error);
              dispatch(logout());
            });
        }
      }
    } catch (error) {
      console.error('⚠️ Error al decodificar token para timer:', error);
      dispatch(logout());
    }
  };

  // Verificación de seguridad cada minuto
  const setupSafetyCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (isAuthenticated && accessToken) {
        try {
          const decoded = jwtDecode<JWTPayload>(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = decoded.exp - currentTime;

          if (timeUntilExpiry <= 0) {
            console.log('⚠️ Safety check: Token expirado detectado');
            dispatch(logout());
          } else if (timeUntilExpiry < REFRESH_THRESHOLD && !isRefreshing && refreshToken) {
            console.log('🔄 Safety check: Token próximo a expirar, forzando refresh');
            dispatch(refreshTokenAsync(refreshToken))
              .unwrap()
              .catch((error) => {
                console.error('❌ Safety check: Error al renovar:', error);
                dispatch(logout());
              });
          }
        } catch (error) {
          console.error('⚠️ Safety check: Error al verificar token:', error);
          dispatch(logout());
        }
      }
    }, 60000); // Cada minuto
  };

  useEffect(() => {
    // Limpiar timers anteriores
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isAuthenticated && accessToken && refreshToken) {
      console.log('🎯 Iniciando sistema de timer dedicado para refresh token');
      
      // Programar el primer refresh
      scheduleNextRefresh(accessToken);
      
      // Configurar verificación de seguridad
      setupSafetyCheck();
      
    } else {
      console.log('🔓 Sistema de timer detenido - sin autenticación');
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accessToken, refreshToken, isAuthenticated, dispatch]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log('🧹 Timer de refresh limpiado');
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🧹 Safety check interval limpiado');
      }
    };
  }, []);
};

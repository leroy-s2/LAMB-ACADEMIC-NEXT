'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { setAuthTokens } from './slices/authSlice';
import { setUserFromBackend } from './slices/userSlice';
import { setPermissions } from './slices/permissionsSlice';
import { api } from '@/shared/services/http';
import type { LoginResponse } from '@/shared/types/backend.types';

/**
 * Componente interno que inicializa la sesión usando /auth/refresh
 * 
 * Flujo:
 * 1. Al cargar, verifica si hay refreshToken guardado (_rt)
 * 2. Si existe, llama a POST /auth/refresh para obtener nueva sesión
 * 3. Si funciona, guarda todo en memoria (Redux)
 * 4. Si falla, redirige a login
 */
function SessionInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      // Verificar si hay sesión activa en memoria
      const currentState = store.getState();
      if (currentState.auth.accessToken) {
        console.log('✅ Sesión activa en memoria');
        setIsInitialized(true);
        return;
      }

      // Verificar si hay refreshToken guardado
      const refreshToken = localStorage.getItem('_rt');

      if (!refreshToken) {
        console.log('ℹ️ No hay sesión guardada, usuario debe hacer login');
        setIsInitialized(true);
        return;
      }

      // Intentar recuperar sesión con refresh token
      console.log('🔄 Recuperando sesión con refresh token...');
      setIsRecovering(true);

      try {
        const response = await api.post<{ success: boolean; data: LoginResponse }>('/auth/refresh', {
          refreshToken
        });

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken, user, permissions } = response.data.data;

          console.log('✅ Sesión recuperada:', {
            user: user.nombreCompleto,
            islas: permissions?.islas?.length || 0
          });

          // Guardar todo en MEMORIA (Redux)
          store.dispatch(setAuthTokens({
            accessToken,
            refreshToken: newRefreshToken
          }));
          store.dispatch(setUserFromBackend(user));

          if (permissions) {
            store.dispatch(setPermissions(permissions));
          }

          // Actualizar refreshToken guardado
          localStorage.setItem('_rt', newRefreshToken);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        console.error('❌ No se pudo recuperar la sesión:', error);
        // Limpiar token inválido
        localStorage.removeItem('_rt');
        // El usuario deberá hacer login nuevamente
      } finally {
        setIsRecovering(false);
        setIsInitialized(true);
      }
    };

    initSession();
  }, []);

  // Mostrar loading mientras se recupera la sesión
  if (!isInitialized || isRecovering) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">
            {isRecovering ? 'Recuperando sesión...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SessionInitializer>{children}</SessionInitializer>
    </Provider>
  );
}



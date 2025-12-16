import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/libs/redux/hooks';
import { setUserFromBackend } from '@/libs/redux/slices/userSlice';
import { setAuthTokens, setLoginLoading } from '@/libs/redux/slices/authSlice';
import { setPermissions } from '@/libs/redux/slices/permissionsSlice';
import { loginUser } from '../services/authService';
import type { LoginRequest } from '@/shared/types/backend.types';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (
      credentials: LoginRequest,
      onSuccess?: () => void,
      onError?: (error: string) => void
    ) => {
      setIsLoading(true);
      dispatch(setLoginLoading(true));

      try {
        // Llamar a la API real del backend
        const response = await loginUser(credentials);

        console.log('✅ Login exitoso, guardando en Redux y localStorage:', {
          user: response.user.nombreCompleto,
          islas: response.permissions?.islas?.length || 0
        });

        // Guardar tokens en Redux
        dispatch(setAuthTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));

        // Guardar usuario en Redux con nueva estructura
        dispatch(setUserFromBackend(response.user));

        // Guardar permisos en Redux (islas, sidebarTargets, etc.)
        if (response.permissions) {
          dispatch(setPermissions(response.permissions));
        }

        // 💾 Solo guardar refreshToken para auto-recovery en F5
        // Este es el ÚNICO dato que persiste - TEMPORAL hasta migrar a HttpOnly cookies
        try {
          localStorage.setItem('_rt', response.refreshToken);
          // Limpiar datos antiguos si existen
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('permissions');
        } catch (e) {
          console.warn('⚠️ No se pudo guardar refreshToken:', e);
        }

        setIsLoading(false);
        dispatch(setLoginLoading(false));
        onSuccess?.();
      } catch (error) {
        console.error('❌ Error en login:', error);
        setIsLoading(false);
        dispatch(setLoginLoading(false));
        const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
        onError?.(errorMessage);
      }
    },
    [dispatch]
  );

  return { login, loading: isLoading };
};


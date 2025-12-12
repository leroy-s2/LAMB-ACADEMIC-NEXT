import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { LoginRequest } from '../types';

export const useLogin = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (
      credentials: LoginRequest,
      onSuccess?: () => void,
      onError?: (error: string) => void
    ) => {
      try {
        // TODO: Implementar llamada a API
        // const response = await loginUser(credentials);
        // dispatch(setAuthTokens(response.tokens));
        // dispatch(setUser(response.user));
        
        onSuccess?.();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
        onError?.(errorMessage);
      }
    },
    [dispatch]
  );

  return { login, loading: isLoading };
};

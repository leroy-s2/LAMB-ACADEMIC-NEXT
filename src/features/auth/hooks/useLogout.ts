'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/libs/redux/slices/authSlice';
import { clearUser } from '@/libs/redux/slices/userSlice';
import { logout as logoutService } from '../services';
import { store } from '@/libs/redux/store';

export const useLogout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener el refreshToken del Redux store (memoria)
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      // Llamar a la API de logout si hay refreshToken
      if (refreshToken) {
        try {
          await logoutService(refreshToken);
        } catch (error) {
          console.error('Error al cerrar sesión en el servidor:', error);
          // Continuar con el logout local aunque falle el servidor
        }
      }
    } finally {
      // Limpiar estado de Redux (memoria)
      dispatch(logoutAction());
      dispatch(clearUser());

      setLoading(false);

      // Redirigir al login
      window.location.href = '/log';
    }
  }, [dispatch]);

  return { logout, loading };
};

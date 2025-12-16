'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/libs/redux/slices/authSlice';
import { clearUser } from '@/libs/redux/slices/userSlice';
import { logout as logoutService } from '../services';

export const useLogout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener el refreshToken del localStorage
      const refreshToken = localStorage.getItem('refreshToken');

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
      // Limpiar estado de Redux (esto también limpia localStorage)
      dispatch(logoutAction());
      dispatch(clearUser());

      setLoading(false);

      // Redirigir al login
      window.location.href = '/login';
    }
  }, [dispatch]);

  return { logout, loading };
};

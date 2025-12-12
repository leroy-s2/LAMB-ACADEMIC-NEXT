import { useEffect } from 'react';
import { useAppDispatch } from '@/libs/redux/hooks';
import { initializeAuth } from '@/libs/redux/slices/authSlice';
import { initializeUser } from '@/libs/redux/slices/userSlice';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Inicializar el estado desde localStorage al cargar la app
    dispatch(initializeAuth());
    dispatch(initializeUser());
  }, [dispatch]);
};

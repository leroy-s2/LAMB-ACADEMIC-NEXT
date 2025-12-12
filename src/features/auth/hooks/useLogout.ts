import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    // TODO: Limpiar tokens y estado
    // dispatch(clearAuth());
  }, [dispatch]);

  return { logout };
};

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '@/libs/redux/hooks';
import { logout as logoutAction } from '@/libs/redux/slices/authSlice';
import { clearUser } from '@/libs/redux/slices/userSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsLoggingOut(true);
    
    // Simular tiempo de logout
    setTimeout(() => {
      // Limpiar estado de Redux (memoria)
      dispatch(logoutAction());
      dispatch(clearUser());
      
      // Navegar al login
      router.push('/log');
      setIsLoggingOut(false);
    }, 1000);
  };

  return {
    logout,
    isLoggingOut
  };
};

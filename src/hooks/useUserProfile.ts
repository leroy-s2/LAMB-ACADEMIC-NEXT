import { useState, useEffect } from 'react';
import { userService } from '@/shared/services/userServiceWithAuth';
import { useAppSelector } from '@/libs/redux/hooks';

// Hook de ejemplo que usa servicios con renovación automática de token
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const fetchProfile = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await userService.getProfile();
      setProfile(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar perfil';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};

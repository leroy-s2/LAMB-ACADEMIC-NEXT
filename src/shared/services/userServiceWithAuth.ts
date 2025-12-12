import { api } from './http';
import { store } from '@/libs/redux/store';

export const userService = {
  // Obtener perfil del usuario (requiere autenticación)
  async getProfile() {
    const { accessToken } = store.getState().auth;
    try {
      const response = await api.get('/v1/user/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario
  async updateProfile(profileData: any) {
    const { accessToken } = store.getState().auth;
    try {
      const response = await api.put('/v1/user/profile', profileData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Error al actualizar perfil');
    }
  },

  // Obtener lista de usuarios (ejemplo para admins)
  async getUsers() {
    const { accessToken } = store.getState().auth;
    try {
      const response = await api.get('/v1/admin/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Error al obtener usuarios');
    }
  },
};

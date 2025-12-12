import { api } from './http';
export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: string;
}

export async function registerUser(userData: UserRegistrationData): Promise<any> {
  try {
    const payload = {
      ...userData,
      role: userData.role || 'ADMIN',
      status: 'ACTIVE'
    };
    const response = await api.post('/v1/auth/register', payload);
    return response.data;
  } catch (error: any) {
    const errorText = error?.response?.data || error?.message || String(error);
    throw new Error(`Error al registrar usuario: ${errorText}`);
  }
}

import axios from '@/libs/axios';

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
  codigoPais: string;
}

export const registerUser = async (data: RegisterRequest) => {
  try {
    const response = await axios.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (token: string) => {
  try {
    const response = await axios.post('/auth/refresh', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post('/auth/logout');
  } catch (error) {
    throw error;
  }
};

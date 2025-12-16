import axios from '@/libs/axios';

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

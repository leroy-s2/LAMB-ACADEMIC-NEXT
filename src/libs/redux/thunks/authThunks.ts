import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, refreshToken as refreshTokenService } from '@/features/auth/services/authService';
import type { LoginRequest } from '@/features/auth/types';

// Thunk para login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error durante el login';
      return rejectWithValue(message);
    }
  }
);

// Thunk para refresh token
export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (refreshTokenValue: string, { rejectWithValue }) => {
    try {
      const response = await refreshTokenService(refreshTokenValue);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al renovar token';
      return rejectWithValue(message);
    }
  }
);
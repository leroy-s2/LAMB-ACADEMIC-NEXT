import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginAsync, refreshTokenAsync } from '../thunks/authThunks';

/**
 * Estado de autenticación
 * TODO: Los tokens se mantienen SOLO en memoria (Redux state)
 * En producción, el refreshToken debería venir como HttpOnly cookie
 */
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  lastRefreshAttempt: number | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isRefreshing: false,
  lastRefreshAttempt: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      // ✅ NO localStorage - solo memoria
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      // ✅ NO localStorage - solo memoria
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
      // ✅ NO localStorage - solo memoria
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * @deprecated No se usa localStorage, esta función ya no tiene efecto
     */
    initializeAuth: (_state) => {
      // ✅ NO localStorage - la sesión no persiste al refrescar página
      // En producción, usar HttpOnly cookie + refresh endpoint
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isRefreshing = false;
      state.lastRefreshAttempt = null;
      // ✅ NO localStorage - solo limpiar memoria
    },
  },
  extraReducers: (builder) => {
    builder
      // Login async
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // ✅ NO localStorage - user y permissions se manejan en sus propios slices
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Refresh token async
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isRefreshing = true;
        state.lastRefreshAttempt = Date.now();
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        // ✅ NO localStorage - solo memoria
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.isRefreshing = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        // ✅ NO localStorage - solo limpiar memoria
      });
  },
});

export const {
  setTokens,
  setAccessToken,
  setRefreshToken,
  setLoading,
  initializeAuth,
  logout
} = authSlice.actions;

// Aliases para compatibilidad
export const setAuthTokens = setTokens;
export const setLoginLoading = setLoading;

export default authSlice.reducer;

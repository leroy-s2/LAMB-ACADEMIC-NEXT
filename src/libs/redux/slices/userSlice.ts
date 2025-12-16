import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LoginUser } from '@/shared/types/permissions.types';

/**
 * Usuario del sistema (compatible con estructura del backend)
 */
export interface User {
  // Campos del backend (LoginUser)
  idPersona?: number;
  documentoIdentidad?: string;
  nombre?: string;
  apellidos?: string;
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  fotoUrl?: string | null;
  rolesBase?: string[];
  estadoCuenta?: 'activa' | 'inactiva' | 'suspendida';
  requiereCambioPassword?: boolean;
  ultimaSesion?: string;

  // Campos legacy (para compatibilidad)
  firstName?: string;
  lastName?: string;
  role?: string;

  [key: string]: unknown;
}

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

/**
 * Convierte usuario del backend a formato compatible
 */
function normalizeUser(backendUser: LoginUser): User {
  return {
    // Campos del backend
    idPersona: backendUser.idPersona,
    documentoIdentidad: backendUser.documentoIdentidad,
    nombre: backendUser.nombre,
    apellidos: backendUser.apellidos,
    nombreCompleto: backendUser.nombreCompleto,
    email: backendUser.email,
    telefono: backendUser.telefono,
    fotoUrl: backendUser.fotoUrl,
    rolesBase: backendUser.rolesBase,
    estadoCuenta: backendUser.estadoCuenta,
    requiereCambioPassword: backendUser.requiereCambioPassword,
    ultimaSesion: backendUser.ultimaSesion,

    // Campos legacy para compatibilidad con componentes existentes
    firstName: backendUser.nombre,
    lastName: backendUser.apellidos,
    role: backendUser.rolesBase?.[0] || 'USER',
  };
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.error = null;
      // ✅ NO localStorage - solo memoria
    },

    /**
     * Establece usuario desde respuesta del backend
     */
    setUserFromBackend: (state, action: PayloadAction<LoginUser>) => {
      state.currentUser = normalizeUser(action.payload);
      state.error = null;
      // ✅ NO localStorage - solo memoria
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // ✅ NO localStorage - solo memoria
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * @deprecated No se usa localStorage, esta función ya no tiene efecto
     */
    initializeUser: (_state) => {
      // ✅ NO localStorage - la sesión no persiste al refrescar página
    },

    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
      // ✅ NO localStorage - solo limpiar memoria
    },
  },
});

export const {
  setUser,
  setUserFromBackend,
  updateUser,
  setLoading,
  setError,
  initializeUser,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;

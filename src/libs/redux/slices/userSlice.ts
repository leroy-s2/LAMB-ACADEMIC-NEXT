import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  firstName: string;
  lastName: string;
  role: string;
  [key: string]: any; // Para otros campos que puedan existir
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.error = null;
      
      // Guardar en localStorage
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.currentUser));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    initializeUser: (state) => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          state.currentUser = JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          localStorage.removeItem('user');
        }
      }
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
      localStorage.removeItem('user');
    },
  },
});

export const { 
  setUser, 
  updateUser, 
  setLoading, 
  setError, 
  initializeUser, 
  clearUser 
} = userSlice.actions;

export default userSlice.reducer;
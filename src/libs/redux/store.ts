import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import permissionsReducer from './slices/permissionsSlice';
import themeReducer from './themes/themeSlice';

// Crear el store base sin middleware primero
const rootReducer = {
  auth: authReducer,
  user: userReducer,
  permissions: permissionsReducer,
  theme: themeReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar las acciones que pueden contener funciones no serializables
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {auth: AuthState, user: UserState, permissions: PermissionsState, theme: ThemeState}
export type AppDispatch = typeof store.dispatch;

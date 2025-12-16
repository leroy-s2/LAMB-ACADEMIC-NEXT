import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Isla, Permissions, PermissionsMetadata } from '@/shared/types/permissions.types';

/**
 * Estado de permisos del usuario
 * Todo se mantiene en memoria (Redux), no en localStorage
 */
export interface PermissionsState {
    islas: Isla[];
    islaActiva: Isla | null;
    metadata: PermissionsMetadata | null;
    permisos: Record<string, unknown>;
    permisosIndividuales: unknown[];
}

const initialState: PermissionsState = {
    islas: [],
    islaActiva: null,
    metadata: null,
    permisos: {},
    permisosIndividuales: [],
};

export const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {
        /**
         * Establece todos los permisos desde la respuesta del login
         */
        setPermissions: (state, action: PayloadAction<Permissions>) => {
            state.islas = action.payload.islas;
            state.metadata = action.payload.metadata;
            state.permisos = action.payload.permisos;
            state.permisosIndividuales = action.payload.permisosIndividuales;

            // Auto-seleccionar la isla principal si no hay una activa
            if (!state.islaActiva && action.payload.islas.length > 0) {
                const islaPrincipal = action.payload.islas.find(i => i.esIslaPrincipal);
                state.islaActiva = islaPrincipal || action.payload.islas[0];
            }
        },

        /**
         * Establece la isla activa
         */
        setIslaActiva: (state, action: PayloadAction<Isla | null>) => {
            state.islaActiva = action.payload;
        },

        /**
         * Cambia la isla activa por código
         */
        setIslaActivaByCodigo: (state, action: PayloadAction<string>) => {
            const isla = state.islas.find(i => i.codigo === action.payload);
            if (isla) {
                state.islaActiva = isla;
            }
        },

        /**
         * Limpia todos los permisos (logout)
         */
        clearPermissions: (state) => {
            state.islas = [];
            state.islaActiva = null;
            state.metadata = null;
            state.permisos = {};
            state.permisosIndividuales = [];
        },

        /**
         * Actualiza los permisos de una isla específica
         */
        updateIslaPermissions: (state, action: PayloadAction<{ codigo: string; sidebarTargets: Isla['sidebarTargets'] }>) => {
            const islaIndex = state.islas.findIndex(i => i.codigo === action.payload.codigo);
            if (islaIndex !== -1) {
                state.islas[islaIndex].sidebarTargets = action.payload.sidebarTargets;

                // Si es la isla activa, actualizarla también
                if (state.islaActiva?.codigo === action.payload.codigo) {
                    state.islaActiva.sidebarTargets = action.payload.sidebarTargets;
                }
            }
        },
    },
});

export const {
    setPermissions,
    setIslaActiva,
    setIslaActivaByCodigo,
    clearPermissions,
    updateIslaPermissions
} = permissionsSlice.actions;

export default permissionsSlice.reducer;

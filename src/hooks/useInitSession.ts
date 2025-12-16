'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/libs/redux/hooks';
import { setAuthTokens } from '@/libs/redux/slices/authSlice';
import { setUserFromBackend } from '@/libs/redux/slices/userSlice';
import { setPermissions } from '@/libs/redux/slices/permissionsSlice';
import type { LoginUser, Permissions } from '@/shared/types/permissions.types';

/**
 * Hook para inicializar la sesión desde localStorage al cargar la aplicación.
 * Debe usarse en un componente de alto nivel que envuelva toda la app.
 */
export function useInitSession() {
    const dispatch = useAppDispatch();
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        const initSession = () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                const userStr = localStorage.getItem('user');
                const permissionsStr = localStorage.getItem('permissions');

                if (accessToken && refreshToken) {
                    console.log('🔄 Restaurando sesión desde localStorage...');

                    // Restaurar tokens
                    dispatch(setAuthTokens({ accessToken, refreshToken }));

                    // Restaurar usuario
                    if (userStr) {
                        const user: LoginUser = JSON.parse(userStr);
                        dispatch(setUserFromBackend(user));
                    }

                    // Restaurar permisos
                    if (permissionsStr) {
                        const permissions: Permissions = JSON.parse(permissionsStr);
                        dispatch(setPermissions(permissions));
                    }

                    setHasSession(true);
                    console.log('✅ Sesión restaurada correctamente');
                } else {
                    console.log('ℹ️ No hay sesión guardada');
                    setHasSession(false);
                }
            } catch (error) {
                console.error('❌ Error al restaurar sesión:', error);
                // Limpiar datos corruptos
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                localStorage.removeItem('permissions');
                setHasSession(false);
            } finally {
                setIsInitialized(true);
            }
        };

        initSession();
    }, [dispatch]);

    return { isInitialized, hasSession };
}

/**
 * Función para limpiar completamente la sesión
 */
export function clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
}

export default useInitSession;

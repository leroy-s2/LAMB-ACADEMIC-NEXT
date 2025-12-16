'use client';

import { useAppSelector, useAppDispatch } from '@/libs/redux/hooks';
import { setIslaActiva } from '@/libs/redux/slices/permissionsSlice';
import type { Isla, SidebarTarget, ApiPermission } from '@/shared/types/permissions.types';
import { useCallback, useMemo } from 'react';

/**
 * Hook para acceder y manipular permisos del usuario
 */
export function usePermissions() {
    const dispatch = useAppDispatch();
    const { islas, islaActiva, metadata } = useAppSelector((state) => state.permissions);

    /**
     * Obtiene todas las islas disponibles para el usuario
     */
    const getIslas = useCallback((): Isla[] => {
        return islas;
    }, [islas]);

    /**
     * Obtiene la isla actualmente activa
     */
    const getIslaActiva = useCallback((): Isla | null => {
        return islaActiva;
    }, [islaActiva]);

    /**
     * Cambia la isla activa por código
     */
    const cambiarIslaActiva = useCallback((codigo: string) => {
        const isla = islas.find((i: Isla) => i.codigo === codigo);
        if (isla) {
            dispatch(setIslaActiva(isla));
        }
    }, [islas, dispatch]);

    /**
     * Cambia la isla activa directamente
     */
    const setIsla = useCallback((isla: Isla) => {
        dispatch(setIslaActiva(isla));
    }, [dispatch]);

    /**
     * Obtiene los items del sidebar de la isla activa
     */
    const getSidebarItems = useCallback((): SidebarTarget[] => {
        if (!islaActiva) return [];
        return [...islaActiva.sidebarTargets].sort((a: SidebarTarget, b: SidebarTarget) => a.orden - b.orden);
    }, [islaActiva]);

    /**
     * Verifica si el usuario tiene permiso para una API específica
     */
    const hasApiPermission = useCallback((
        apiBase: string,
        method: 'get' | 'post' | 'put' | 'delete'
    ): boolean => {
        if (!islaActiva) return false;

        for (const target of islaActiva.sidebarTargets) {
            const apiPermission = target.apis.find((api: ApiPermission) =>
                apiBase.includes(api.apiBase) || api.apiBase.includes(apiBase)
            );
            if (apiPermission && apiPermission[method]) {
                return true;
            }
        }
        return false;
    }, [islaActiva]);

    /**
     * Verifica si puede hacer GET en una API
     */
    const canRead = useCallback((apiBase: string): boolean => {
        return hasApiPermission(apiBase, 'get');
    }, [hasApiPermission]);

    /**
     * Verifica si puede hacer POST en una API
     */
    const canCreate = useCallback((apiBase: string): boolean => {
        return hasApiPermission(apiBase, 'post');
    }, [hasApiPermission]);

    /**
     * Verifica si puede hacer PUT en una API
     */
    const canUpdate = useCallback((apiBase: string): boolean => {
        return hasApiPermission(apiBase, 'put');
    }, [hasApiPermission]);

    /**
     * Verifica si puede hacer DELETE en una API
     */
    const canDelete = useCallback((apiBase: string): boolean => {
        return hasApiPermission(apiBase, 'delete');
    }, [hasApiPermission]);

    /**
     * Obtiene los permisos de una API específica
     */
    const getApiPermissions = useCallback((apiBase: string): ApiPermission | null => {
        if (!islaActiva) return null;

        for (const target of islaActiva.sidebarTargets) {
            const apiPermission = target.apis.find((api: ApiPermission) =>
                apiBase.includes(api.apiBase) || api.apiBase.includes(apiBase)
            );
            if (apiPermission) {
                return apiPermission;
            }
        }
        return null;
    }, [islaActiva]);

    /**
     * Obtiene la isla principal (marcada como principal o la primera)
     */
    const getIslaPrincipal = useMemo((): Isla | null => {
        const principal = islas.find((i: Isla) => i.esIslaPrincipal);
        return principal || islas[0] || null;
    }, [islas]);

    return {
        // Data
        islas,
        islaActiva,
        metadata,
        islaPrincipal: getIslaPrincipal,

        // Getters
        getIslas,
        getIslaActiva,
        getSidebarItems,
        getApiPermissions,

        // Setters
        cambiarIslaActiva,
        setIsla,

        // Permission checks
        hasApiPermission,
        canRead,
        canCreate,
        canUpdate,
        canDelete,
    };
}

export default usePermissions;

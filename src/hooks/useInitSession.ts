'use client';

import { useEffect, useState } from 'react';

/**
 * ⚠️ DEPRECATED: Este hook está obsoleto
 * 
 * La sesión ahora se mantiene SOLO en memoria (Redux store), no en localStorage.
 * 
 * Migración:
 * - useAppSelector(state => state.auth.accessToken) - para acceder al token
 * - useAppDispatch() - para limpiar estado
 * 
 * La sesión NO persiste al refrescar la página (por diseño de seguridad).
 */

export function useInitSession() {
    const [isInitialized, setIsInitialized] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        console.warn('⚠️ useInitSession está deprecado. Usa Redux store para la sesión.');
        setIsInitialized(true);
    }, []);

    return { isInitialized, hasSession };
}

/**
 * ⚠️ DEPRECATED: localStorage no se usa ya
 */
export function clearSession() {
    console.warn('⚠️ clearSession está deprecado. La sesión se limpia automáticamente con Redux.');
}

export default useInitSession;

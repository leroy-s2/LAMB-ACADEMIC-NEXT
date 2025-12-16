'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/shared/services/http';

export interface UseFondosSistemaReturn {
    fondoPortal: string;
    fondoLogin: string;
    uploadingPortal: boolean;
    uploadingLogin: boolean;
    portalFileInputRef: React.RefObject<HTMLInputElement | null>;
    loginFileInputRef: React.RefObject<HTMLInputElement | null>;
    handleUploadFondo: (elementoId: 'pantalla_principal' | 'log_url', file: File) => Promise<void>;
    error: string | null;
    successMessage: string | null;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
}

export function useFondosSistema(): UseFondosSistemaReturn {
    const [fondoPortal, setFondoPortal] = useState<string>('');
    const [fondoLogin, setFondoLogin] = useState<string>('');
    const [uploadingPortal, setUploadingPortal] = useState(false);
    const [uploadingLogin, setUploadingLogin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const portalFileInputRef = useRef<HTMLInputElement>(null);
    const loginFileInputRef = useRef<HTMLInputElement>(null);

    // Cargar fondos del sistema desde API pública
    useEffect(() => {
        const loadFondos = async () => {
            try {
                console.log('📡 Cargando fondos desde API: /api/v1/public/universidad/configuracion/imagenes');
                const response = await fetch('/api/v1/public/universidad/configuracion/imagenes');
                const data = await response.json();

                if (data.success && data.data?.elementos && Array.isArray(data.data.elementos)) {
                    console.log('✅ API devolvió datos de fondos, procesando...');
                    data.data.elementos.forEach((elemento: any) => {
                        if (elemento.id === 'pantalla_principal' && elemento.url) {
                            setFondoPortal(elemento.url);
                            console.log('✅ Fondo portal cargado:', elemento.url);
                        }
                        if (elemento.id === 'log_url' && elemento.url) {
                            setFondoLogin(elemento.url);
                            console.log('✅ Fondo login cargado:', elemento.url);
                        }
                    });
                }
            } catch (err: any) {
                console.error('❌ Error al cargar fondos:', err.message);
            }
        };

        loadFondos();
    }, []);

    // Subir imagen de fondo
    const handleUploadFondo = async (elementoId: 'pantalla_principal' | 'log_url', file: File) => {
        const isPortal = elementoId === 'pantalla_principal';
        const setUploading = isPortal ? setUploadingPortal : setUploadingLogin;
        const setFondo = isPortal ? setFondoPortal : setFondoLogin;

        try {
            setUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);
            formData.append('descripcion', isPortal ? 'Fondo del portal' : 'Fondo del login');

            const response = await api.put(
                `/universidades/1/configuracion/${elementoId}/imagen`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.data.success && response.data.data?.url) {
                setFondo(response.data.data.url);
                setSuccessMessage(`✓ Imagen de ${isPortal ? 'portal' : 'login'} actualizada correctamente`);
                setTimeout(() => setSuccessMessage(null), 4000);
            } else {
                throw new Error(response.data.message || 'Error al subir imagen');
            }
        } catch (err: any) {
            console.error('❌ Error al subir imagen de fondo:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
            setError(`Error al subir imagen: ${errorMsg}`);
        } finally {
            setUploading(false);
        }
    };

    return {
        fondoPortal,
        fondoLogin,
        uploadingPortal,
        uploadingLogin,
        portalFileInputRef,
        loginFileInputRef,
        handleUploadFondo,
        error,
        successMessage,
        setError,
        setSuccessMessage,
    };
}
